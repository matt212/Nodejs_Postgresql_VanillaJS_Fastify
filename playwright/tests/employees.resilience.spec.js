const { test, expect } = require('@playwright/test');

const searchPath = '/employees/api/searchtype/';
const searchP95Limit = Number(
    process.env.EMPLOYEES_RESILIENCE_P95_MS || 5000
);


// ============================================================
// OPEN CONTROL BAR
// ============================================================

async function openControlBar(page) {
    await page.locator(
        "//h3[normalize-space()='Control Bar']/following-sibling::div[contains(@class,'box-tools')]//button[@data-widget='collapse']"
    ).click();

    await expect(
        page.locator('#reservation')
    ).toBeVisible();
}


// ============================================================
// SET DATE RANGE
// ============================================================

async function setDateRange(page) {
    await page.locator('#reservation').click();

    await page.evaluate(() => {
        const input = window.jQuery('#reservation');
        const picker = input.data('daterangepicker');

        if (!picker) {
            throw new Error(
                'daterangepicker instance not found on #reservation'
            );
        }

        picker.setStartDate('1982-01-01');

        const today = new Date();

        const formattedToday =
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        picker.setEndDate(formattedToday);
    });
}


// ============================================================
// APPLY DATE RANGE
// IMPORTANT:
// Do NOT wait for a specific 200 response here.
// The resilience tests intentionally generate failed requests.
// ============================================================

async function applyDateRange(page) {

    await setDateRange(page);

    await page.locator(
        '.daterangepicker .applyBtn'
    ).click();

    await expect(
        page.locator('#dvreportcontainer')
    ).not.toHaveClass(
        /loading-report-container/,
        {
            timeout: 30000
        }
    );

    await expect(
        page.locator('#divreportcontent').first()
    ).toBeVisible({
        timeout: 30000
    });

    await expect(
        page.locator('#basetable')
    ).toBeVisible({
        timeout: 30000
    });

    await page.waitForTimeout(1000);
}


// ============================================================
// LOAD EMPLOYEES REPORT
// ============================================================

async function loadEmployeesReport(page) {

    await page.goto('/employees');

    await page.waitForTimeout(3000);

    await openControlBar(page);

    await applyDateRange(page);
}


// ============================================================
// WAIT FOR REPORT
// ============================================================

async function waitForReport(page) {

    await expect(
        page.locator('#dvreportcontainer')
    ).not.toHaveClass(
        /loading-report-container/,
        {
            timeout: 30000
        }
    );

    await expect(
        page.locator('#divreportcontent').first()
    ).toBeVisible({
        timeout: 30000
    });

    await expect(
        page.locator('#basetable')
    ).toBeVisible({
        timeout: 30000
    });
}


// ============================================================
// VALIDATE EMPLOYEES SEARCH REQUEST
// ============================================================

function assertAuthenticatedReportRequest(request) {

    expect(
        request.method()
    ).toBe('POST');

    const headers =
        request.headers();

    expect(
        headers['x-access-token']
    ).toBeTruthy();

    const payload =
        request.postDataJSON();

    expect(payload).toMatchObject({
        searchparam: ['NA'],
        pageSize: 20,
        pageno: 0,
        searchtype: 'NoFilter',
        datecolsearch: 'created_date'
    });

    expect(
        payload.daterange
    ).toBeDefined();

    expect(
        payload.daterange.startdate
    ).toBe('1982-01-01');

    expect(
        payload.daterange.enddate
    ).toMatch(
        /^\d{4}-\d{2}-\d{2}$/
    );
}


// ============================================================
// RESILIENCE TESTS
// ============================================================

test.describe(
    'Employees resilience',
    () => {

        test.setTimeout(120000);


        // ====================================================
        // TEST 1
        // Temporary 503 -> recovery
        // ====================================================

        test(
            'recovers after a temporary search API failure',
            async ({ page }) => {

                let failedRequests = 0;
                let successfulRequests = 0;


                await page.route(
                    `**${searchPath}`,
                    async route => {

                        if (
                            failedRequests === 0
                        ) {

                            failedRequests++;

                            await route.fulfill({
                                status: 503,
                                contentType:
                                    'application/json',
                                body:
                                    JSON.stringify({
                                        error:
                                            'temporary test failure'
                                    })
                            });

                            return;
                        }


                        successfulRequests++;

                        await route.continue();
                    }
                );


                page.on(
                    'request',
                    request => {

                        if (
                            request.url().includes(searchPath) &&
                            request.method() === 'POST' &&
                            failedRequests > 0
                        ) {

                            assertAuthenticatedReportRequest(
                                request
                            );
                        }
                    }
                );


                // ------------------------------------------------
                // First attempt intentionally fails with 503.
                // ------------------------------------------------

                await page.goto('/employees');

                await page.waitForTimeout(3000);

                await openControlBar(page);

                await setDateRange(page);


                const failedResponse =
                    page.waitForResponse(
                        response =>
                            response.url().includes(searchPath) &&
                            response.status() === 503,
                        {
                            timeout: 30000
                        }
                    );


                await page.locator(
                    '.daterangepicker .applyBtn'
                ).click();


                await failedResponse;


                expect(
                    failedRequests
                ).toBe(1);


                // ------------------------------------------------
                // Recovery attempt.
                // ------------------------------------------------

                await loadEmployeesReport(page);


                expect(
                    successfulRequests
                ).toBeGreaterThan(0);


                await waitForReport(page);


                expect(
                    await page.locator(
                        '#basetable tbody tr'
                    ).count()
                ).toBeGreaterThan(0);
            }
        );


        // ====================================================
        // TEST 2
        // Temporary network abort -> recovery
        // ====================================================

        test(
            'recovers after a temporary API abort',
            async ({ page }) => {

                let aborted = false;
                let successfulRequests = 0;


                await page.route(
                    '**/employees/api/**',
                    async route => {

                        const request =
                            route.request();


                        if (
                            !aborted &&
                            request.url().includes(searchPath)
                        ) {

                            aborted = true;

                            await route.abort(
                                'internetdisconnected'
                            );

                            return;
                        }


                        if (
                            request.method() === 'POST' &&
                            request.url().includes(searchPath)
                        ) {

                            successfulRequests++;

                            assertAuthenticatedReportRequest(
                                request
                            );
                        }


                        await route.continue();
                    }
                );


                // ------------------------------------------------
                // First attempt intentionally aborts.
                // ------------------------------------------------

                await page.goto('/employees');

                await page.waitForTimeout(3000);

                await openControlBar(page);

                await setDateRange(page);


                await page.locator(
                    '.daterangepicker .applyBtn'
                ).click();


                await page.waitForTimeout(3000);


                expect(
                    aborted
                ).toBe(true);


                // ------------------------------------------------
                // Recovery attempt.
                // ------------------------------------------------

                await loadEmployeesReport(page);


                expect(
                    successfulRequests
                ).toBeGreaterThan(0);


                await waitForReport(page);


                expect(
                    await page.locator(
                        '#basetable tbody tr'
                    ).count()
                ).toBeGreaterThan(0);
            }
        );


        // ====================================================
        // TEST 3
        // Search latency / P95
        // ====================================================

        test(
            'reports employee search latency without page failure',
            async ({ page }) => {

                const timings = [];

                const requestStartTimes =
                    new Map();


                // ------------------------------------------------
                // Capture request start using Date.now().
                // ------------------------------------------------

                page.on(
                    'request',
                    request => {

                        if (
                            request.url().includes(searchPath) &&
                            request.method() === 'POST'
                        ) {

                            assertAuthenticatedReportRequest(
                                request
                            );

                            requestStartTimes.set(
                                request,
                                Date.now()
                            );
                        }
                    }
                );


                // ------------------------------------------------
                // Capture actual response duration.
                // ------------------------------------------------

                page.on(
                    'response',
                    response => {

                        if (
                            response.url().includes(searchPath) &&
                            response.status() === 200
                        ) {

                            const request =
                                response.request();

                            const startTime =
                                requestStartTimes.get(
                                    request
                                );


                            if (
                                startTime !== undefined
                            ) {

                                const duration =
                                    Date.now() -
                                    startTime;


                                if (
                                    Number.isFinite(duration) &&
                                    duration >= 0
                                ) {

                                    timings.push(
                                        duration
                                    );
                                }


                                requestStartTimes.delete(
                                    request
                                );
                            }
                        }
                    }
                );


                await loadEmployeesReport(page);


                await waitForReport(page);


                expect(
                    timings.length
                ).toBeGreaterThan(0);


                const sorted =
                    [...timings].sort(
                        (left, right) =>
                            left - right
                    );


                const p95Index =
                    Math.min(
                        sorted.length - 1,
                        Math.ceil(
                            sorted.length * 0.95
                        ) - 1
                    );


                const p95 =
                    sorted[p95Index];


                console.log(
                    `Employees search timings: ${timings.join(', ')} ms`
                );

                console.log(
                    `Employees search p95: ${p95} ms`
                );


                expect(
                    p95
                ).toBeLessThan(
                    searchP95Limit
                );
            }
        );
    }
);