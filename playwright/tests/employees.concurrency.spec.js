const { test, expect } = require('@playwright/test');

const authFile = 'playwright/.auth/user.json';
const userCount = Number(process.env.EMPLOYEES_CONCURRENCY_USERS || 5);
const p95Limit = Number(process.env.EMPLOYEES_CONCURRENCY_P95_MS || 5000);
const concurrencyTimeoutMs = Number(
    process.env.EMPLOYEES_CONCURRENCY_TIMEOUT_MS || 300000
);

function percentile(values, percentileValue) {
    if (values.length === 0) {
        return 0;
    }

    const index = Math.min(
        values.length - 1,
        Math.ceil(values.length * percentileValue) - 1
    );

    return values[index];
}

async function runUser(browser, userNumber) {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    const started = Date.now();

    try {
        const reportRequests = [];
        let dateRangeSubmitted = false;
        page.on('request', request => {
            const isReportRequest =
                request.method() === 'POST' &&
                (
                    request.url().includes('/employees/api/searchtype/') ||
                    request.url().includes('/employees/api/searchtypeCount/')
                );

            if (isReportRequest && dateRangeSubmitted) {
                reportRequests.push({
                    url: request.url(),
                    headers: request.headers(),
                    payload: request.postDataJSON()
                });
            }
        });

        await page.goto('/employees');
        await page.locator(
            "//h3[normalize-space()='Control Bar']/following-sibling::div[contains(@class,'box-tools')]//button[@data-widget='collapse']"
        ).click();
        await expect(page.locator('#reservation')).toBeVisible();

        const searchResponse = page.waitForResponse(response =>
            response.url().includes('/employees/api/searchtype/') &&
            response.request().method() === 'POST' &&
            response.status() === 200
        );
        const countResponse = page.waitForResponse(response =>
            response.url().includes('/employees/api/searchtypeCount/') &&
            response.request().method() === 'POST' &&
            response.status() === 200
        );

        await page.locator('#reservation').click();
        await page.evaluate(() => {
            const input = window.jQuery('#reservation');
            const picker = input.data('daterangepicker');

            if (!picker) {
                throw new Error('daterangepicker instance not found on #reservation');
            }

            picker.setStartDate('1982-01-01');
            picker.setEndDate(new Date());
        });
        dateRangeSubmitted = true;
        const reportStarted = Date.now();
        await page.locator('.daterangepicker .applyBtn').click();

        const response = await searchResponse;
        const count = await countResponse;

        expect(response.status(), `user ${userNumber} search status`).toBe(200);
        expect(count.status(), `user ${userNumber} count status`).toBe(200);

        const submittedSearch = reportRequests.find(request =>
            request.url.includes('/employees/api/searchtype/') &&
            !request.url.includes('searchtypeCount')
        );
        const submittedCount = reportRequests.find(request =>
            request.url.includes('/employees/api/searchtypeCount/')
        );

        if (!submittedSearch || !submittedCount) {
            console.error(`User ${userNumber} report requests:`, reportRequests);
        }

        expect(submittedSearch, `user ${userNumber} search request`).toBeTruthy();
        expect(submittedCount, `user ${userNumber} count request`).toBeTruthy();

        for (const reportRequest of [submittedSearch, submittedCount]) {
            expect(
                reportRequest.headers['x-access-token'],
                `user ${userNumber} token`
            ).toBeTruthy();

            if (
                reportRequest.payload.disableDate !== false ||
                reportRequest.payload.daterange?.startdate !== '1982-01-01'
            ) {
                console.error(
                    `User ${userNumber} unexpected report payload:`,
                    JSON.stringify(reportRequest.payload)
                );
            }

            
            expect(
                reportRequest.payload.daterange.startdate,
                `user ${userNumber} start date payload`
            ).toBe('1982-01-01');
        }
        await expect(page.locator('#basetable')).toBeVisible();
        await expect(page.locator('#basetable tbody tr').first()).toBeVisible();

        return {
            userNumber,
            totalDuration: Date.now() - started,
            reportDuration: Date.now() - reportStarted,
            rows: await page.locator('#basetable tbody tr').count()
        };
    } finally {
        await context.close();
    }
}

test.describe('Employees concurrent readers', () => {
    test('isolated users can load the report concurrently', async ({ browser }, testInfo) => {
        test.setTimeout(concurrencyTimeoutMs);

        const userRuns = await Promise.allSettled(
            Array.from({ length: userCount }, (_, index) =>
                runUser(browser, index + 1)
            )
        );

        const results = userRuns
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
        const failureCount = userRuns.filter(
            result => result.status === 'rejected'
        ).length;
        const failures = userRuns
            .filter(result => result.status === 'rejected')
            .map((result, index) => ({
                userNumber: index + 1,
                message: result.reason?.message || String(result.reason)
            }));

        expect(userRuns).toHaveLength(userCount);
        expect(results.every(result => result.rows > 0)).toBe(true);

        const durations = results
            .map(result => result.reportDuration)
            .sort((left, right) => left - right);
        const totalDurations = results
            .map(result => result.totalDuration)
            .sort((left, right) => left - right);
        const averageReport = durations.reduce((sum, value) => sum + value, 0) / durations.length;
        const averageTotal = results.reduce(
            (sum, result) => sum + result.totalDuration,
            0
        ) / results.length;
        const averageRows = results.reduce(
            (sum, result) => sum + result.rows,
            0
        ) / results.length;
        const wallClockDuration = totalDurations.at(-1) || 0;
        const throughput = wallClockDuration > 0
            ? results.length / (wallClockDuration / 1000)
            : 0;
        const p95 = percentile(durations, 0.95);
        const totalP95 = percentile(totalDurations, 0.95);
        const verdict = failureCount === 0 && p95 < p95Limit
            ? 'PASS'
            : 'FAIL';

        const metrics = {
            users: userCount,
            successfulUsers: results.length,
            failureCount,
            failureRatePercent: Number((failureCount / userCount * 100).toFixed(2)),
            successRatePercent: Number((results.length / userCount * 100).toFixed(2)),
            failedUsers: failures,
            reportMinMs: durations[0] || 0,
            reportAverageMs: Math.round(averageReport),
            reportP50Ms: percentile(durations, 0.5),
            reportP95Ms: p95,
            reportMaxMs: durations.at(-1) || 0,
            totalAverageMs: Math.round(averageTotal),
            totalP95Ms: totalP95,
            averageRowsPerUser: Number(averageRows.toFixed(1)),
            throughputUsersPerSecond: Number(throughput.toFixed(2)),
            wallClockDurationMs: wallClockDuration,
            p95LimitMs: p95Limit,
            verdict
        };

        console.log(
            `Employees concurrency: ${JSON.stringify(metrics)}`
        );

        await testInfo.attach('employees-concurrency-metrics.json', {
            body: JSON.stringify(metrics, null, 2),
            contentType: 'application/json'
        });

        expect(failureCount).toBe(0);
        expect(p95).toBeLessThan(p95Limit);
    });
});
