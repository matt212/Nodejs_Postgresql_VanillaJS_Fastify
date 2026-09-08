import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const baseUrl = (__ENV.BASE_URL || 'http://127.0.0.1:3012').replace(/\/$/, '');
const username = __ENV.LOGIN_USERNAME;
const password = __ENV.LOGIN_PASSWORD;
const cookieHeader = __ENV.COOKIE_HEADER;
const accessToken = __ENV.ACCESS_TOKEN;

const searchDuration = new Trend('employees_search_duration', true);
const countDuration = new Trend('employees_count_duration', true);
const failedRequests = new Rate('employees_failed_requests');
const functionalFailures = new Rate('employees_functional_failures');
const rowsReturned = new Trend('employees_rows_returned');
const matchingRecords = new Trend('employees_matching_records');
const authenticatedUsers = new Counter('employees_authenticated_users');
const smokeMode = __ENV.SMOKE === 'true';

export const options = {
  vus: smokeMode ? 1 : undefined,
  iterations: smokeMode ? 1 : undefined,
  scenarios: smokeMode ? undefined : {
    employees_readers: {
      executor: 'ramping-vus',
      startVUs: Number(__ENV.START_VUS || 1),
      stages: [
        { duration: __ENV.RAMP_DURATION || '30s', target: Number(__ENV.TARGET_VUS || 10) },
        { duration: __ENV.HOLD_DURATION || '2m', target: Number(__ENV.TARGET_VUS || 10) },
        { duration: '30s', target: 0 }
      ],
      gracefulRampDown: '10s'
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    employees_failed_requests: ['rate<0.01'],
    employees_functional_failures: ['rate<0.01'],
    employees_search_duration: [`p(95)<${Number(__ENV.SEARCH_P95_MS || 1000)}`],
    employees_count_duration: [`p(95)<${Number(__ENV.COUNT_P95_MS || 1000)}`]
  }
};

function login() {
  if (accessToken) {
    return { token: accessToken, cookies: null };
  }

  if (!username || !password) {
    throw new Error(
      'Set LOGIN_USERNAME and LOGIN_PASSWORD, or provide COOKIE_HEADER'
    );
  }
sleep(Math.random() * 2)
  const response = http.post(
    `${baseUrl}/login`,
    JSON.stringify({ username, password }),
    { headers: { 'Content-Type': 'application/json' }, redirects: 0 }
  );

  if (response.status !== 200 && response.status !== 302 && response.status !== 303) {
    console.error(JSON.stringify({
      label: 'login',
      url: `${baseUrl}/login`,
      status: response.status,
      responseBody: response.body
    }));
    throw new Error('Employee performance test login failed');
  }

  const cookies = response.cookies;
  const sessionCookie = Object.entries(cookies || {})
    .flatMap(([name, values]) => values.map(value => `${name}=${value.value}`))
    .join('; ');

  const tokenResponse = http.post(
    `${baseUrl}/getToken`,
    null,
    {
      headers: {
        Cookie: sessionCookie
      }
    }
  );

  if (tokenResponse.status !== 200) {
    console.error(JSON.stringify({
      label: 'getToken',
      url: `${baseUrl}/getToken`,
      status: tokenResponse.status,
      responseBody: tokenResponse.body
    }));
    throw new Error('Employee performance test token request failed');
  }

  const token = tokenResponse.json('token');
  if (!token) {
    console.error(JSON.stringify({
      label: 'getToken',
      url: `${baseUrl}/getToken`,
      status: tokenResponse.status,
      responseBody: tokenResponse.body
    }));
    throw new Error('Employee performance test did not receive a token');
  }

  return { token, cookies };
}

function searchPayload() {
  const endDate = new Date().toISOString().slice(0, 10);

  return {
    searchparam: ['NA'],
    pageSize: Number(__ENV.PAGE_SIZE || 20),
    pageno: 0,
    disableDate: false,
    searchtype: 'NoFilter',
    datecolsearch: __ENV.DATE_COLUMN || 'created_date',
    daterange: {
      startdate: __ENV.START_DATE || '1982-01-01',
      enddate: __ENV.END_DATE || endDate
    }
  };
}

function logFailure(label, response, payload) {
  console.error(JSON.stringify({
    label,
    url: response.url,
    status: response.status,
    payload,
    responseBody: response.body
  }));
}

function checkResponse(label, response, payload) {
  const passed = check(response, {
    [`${label} returns 200`]: item => item.status === 200,
    [`${label} returns JSON`]: item =>
      item.headers['Content-Type']?.includes('application/json')
  });

  if (!passed) {
    logFailure(label, response, payload);
  }

  failedRequests.add(!passed);
  return passed;
}

function checkFunctionalResponse(label, response, payload) {
  let body;
  let passed = true;

  try {
    body = response.json();
  } catch (error) {
    passed = false;
  }

  if (label === 'employee search') {
    const hasRows = body && Array.isArray(body.rows);
    passed = passed && hasRows;
    if (hasRows) {
      rowsReturned.add(body.rows.length);
    }
  }

  if (label === 'employee search count') {
    const count = body && body.count;
    const hasCount = count !== undefined && count !== null && !Number.isNaN(Number(count));
    passed = passed && hasCount;
    if (hasCount) {
      matchingRecords.add(Number(count));
    }
  }

  functionalFailures.add(!passed);

  if (!passed) {
    console.error(JSON.stringify({
      label: `${label} functional validation`,
      url: response.url,
      status: response.status,
      payload,
      responseBody: response.body
    }));
  }

  return passed;
}

export default function () {
  const auth = login();
  authenticatedUsers.add(1);
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': auth.token
  };

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  } else {
    headers.Cookie = Object.entries(auth.cookies || {})
      .flatMap(([name, values]) => values.map(value => `${name}=${value.value}`))
      .join('; ');
  }

  const payloadObject = searchPayload();
  const payload = JSON.stringify(payloadObject);
  const searchStarted = Date.now();
  const search = http.post(
    `${baseUrl}/employees/api/searchtype/`,
    payload,
    { headers }
  );
  searchDuration.add(Date.now() - searchStarted);
  checkResponse('employee search', search, payloadObject);
  checkFunctionalResponse('employee search', search, payloadObject);

  const countStarted = Date.now();
  const count = http.post(
    `${baseUrl}/employees/api/searchtypeCount/`,
    payload,
    { headers }
  );
  countDuration.add(Date.now() - countStarted);

  checkResponse('employee search count', count, payloadObject);
  checkFunctionalResponse('employee search count', count, payloadObject);

  if (!smokeMode) {
    sleep(Number(__ENV.THINK_TIME_SECONDS || 1));
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function metricValue(data, name, key, fallback = 0) {
  return data.metrics[name]?.values?.[key] ?? fallback;
}

export function handleSummary(data) {
  const searchP95 = metricValue(data, 'employees_search_duration', 'p(95)');
  const countP95 = metricValue(data, 'employees_count_duration', 'p(95)');
  const searchAverage = metricValue(data, 'employees_search_duration', 'avg');
  const countAverage = metricValue(data, 'employees_count_duration', 'avg');
  const failedRate = metricValue(data, 'employees_failed_requests', 'rate');
  const functionalFailureRate = metricValue(data, 'employees_functional_failures', 'rate');
  const requestFailedRate = metricValue(data, 'http_req_failed', 'rate');
  const requestCount = metricValue(data, 'http_reqs', 'count');
  const vusMax = metricValue(data, 'vus_max', 'max');
  const authenticatedUserCount = metricValue(data, 'employees_authenticated_users', 'count');
  const averageRowsReturned = metricValue(data, 'employees_rows_returned', 'avg');
  const averageMatchingRecords = metricValue(data, 'employees_matching_records', 'avg');
  const searchLimit = Number(__ENV.SEARCH_P95_MS || 1000);
  const countLimit = Number(__ENV.COUNT_P95_MS || 1000);
  const verdict =
    failedRate < 0.01 &&
    functionalFailureRate < 0.01 &&
    requestFailedRate < 0.01 &&
    searchP95 < searchLimit &&
    countP95 < countLimit
      ? 'PASS'
      : 'FAIL';

  const report = {
    verdict,
    generatedAt: new Date().toISOString(),
    baseUrl,
    virtualUsersMax: vusMax,
    requests: requestCount,
    failedRequestRatePercent: Number((requestFailedRate * 100).toFixed(2)),
    failedEmployeeCheckRatePercent: Number((failedRate * 100).toFixed(2)),
    functionalFailureRatePercent: Number((functionalFailureRate * 100).toFixed(2)),
    authenticatedUsers: authenticatedUserCount,
    averageRowsReturned: Number(averageRowsReturned.toFixed(1)),
    averageMatchingRecords: Number(averageMatchingRecords.toFixed(1)),
    searchAverageMs: Math.round(searchAverage),
    searchP95Ms: Math.round(searchP95),
    searchP95LimitMs: searchLimit,
    countAverageMs: Math.round(countAverage),
    countP95Ms: Math.round(countP95),
    countP95LimitMs: countLimit,
    

  };

  const rows = [
    ['Verdict', report.verdict],
    ['Generated at', report.generatedAt],
    ['Maximum virtual users', report.virtualUsersMax],
    ['HTTP requests', report.requests],
    ['HTTP failed rate', `${report.failedRequestRatePercent}%`],
    ['Employee check failure rate', `${report.failedEmployeeCheckRatePercent}%`],
    ['Functional failure rate', `${report.functionalFailureRatePercent}%`],
    ['Authenticated users', report.authenticatedUsers],
    ['Average rows returned', report.averageRowsReturned],
    ['Average matching records', report.averageMatchingRecords],
    ['Search average', `${report.searchAverageMs} ms`],
    ['Search p95', `${report.searchP95Ms} ms (limit ${report.searchP95LimitMs} ms)`],
    ['Count average', `${report.countAverageMs} ms`],
    ['Count p95', `${report.countP95Ms} ms (limit ${report.countP95LimitMs} ms)`]
    

  ];
  const tableRows = rows.map(([label, value]) =>
    `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
  ).join('');
  const statusClass = report.verdict === 'PASS' ? 'pass' : 'fail';
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Employees k6 performance report</title>
  <style>
    body { font: 16px -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; color: #17202a; }
    main { max-width: 760px; margin: auto; }
    h1 { margin-bottom: 8px; }
    .verdict { border-radius: 6px; color: white; display: inline-block; font-weight: 700; padding: 8px 14px; }
    .pass { background: #18794e; }
    .fail { background: #b42318; }
    table { border-collapse: collapse; margin-top: 24px; width: 100%; }
    th, td { border-bottom: 1px solid #d9dee3; padding: 12px; text-align: left; }
    th { width: 50%; }
  </style>
</head>
<body><main>
  <h1>Employees k6 performance report</h1>
  <div class="verdict ${statusClass}">${escapeHtml(report.verdict)}</div>
  <table>${tableRows}</table>
</main></body>
</html>`;

  const reportFile = __ENV.K6_REPORT_FILE || 'performance/employees-k6-report.html';
  const jsonFile = __ENV.K6_JSON_FILE || 'performance/employees-k6-summary.json';

  return {
    stdout: JSON.stringify(report, null, 2),
    [reportFile]: html,
    [jsonFile]: JSON.stringify(report, null, 2)
  };
}
