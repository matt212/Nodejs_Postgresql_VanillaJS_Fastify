const { test, expect } = require('@playwright/test');

const searchPath = '/employees/api/searchtype/';
const countPath = '/employees/api/searchtypeCount/';
const searchP95Limit = Number(process.env.EMPLOYEES_RESILIENCE_P95_MS || 5000);

async function waitForReport(page) {
    await expect(page.locator('#dvreportcontainer')).toBeVisible();
    await expect(page.locator('#dvreportcontainer')).not.toHaveClass(/loading-report-container/);
    await expect(page.locator('#basetable')).toBeVisible();
}

function assertAuthenticatedReportRequest(request) {
    const headers = request.headers();
    expect(headers['x-access-token']).toBeTruthy();

    const payload = request.postDataJSON();
    expect(payload).toMatchObject({
        searchparam: ['NA'],
        pageSize: 20,
        pageno: 0,
        disableDate: false,
        searchtype: 'NoFilter',
        datecolsearch: 'created_date'
    });
    expect(payload.daterange.startdate).toBe('1982-01-01');
    expect(payload.daterange.enddate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
}

test.describe('Employees resilience', () => {
    test('recovers after a temporary search API failure', async ({ page }) => {
        let failedRequests = 0;

        await page.route(`**${searchPath}`, async route => {
            if (failedRequests === 0) {
                failedRequests += 1;
                await route.fulfill({
                    status: 503,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'temporary test failure' })
                });
                return;
            }

            await route.continue();
        });

        page.on('request', request => {
            if (request.url().includes(searchPath) && request.method() === 'POST') {
                if (failedRequests > 0) {
                    assertAuthenticatedReportRequest(request);
                }
            }
        });

        await page.goto('/employees');
        await page.reload();
        await waitForReport(page);

        expect(failedRequests).toBe(1);
        expect(await page.locator('#basetable tbody tr').count()).toBeGreaterThan(0);
    });

    test('recovers after a temporary API abort', async ({ page }) => {
        let aborted = false;

        await page.route('**/employees/api/**', async route => {
            if (!aborted && route.request().url().includes('/searchtype/')) {
                aborted = true;
                await route.abort('internetdisconnected');
                return;
            }

            if (route.request().method() === 'POST' && route.request().url().includes('/searchtype/')) {
                assertAuthenticatedReportRequest(route.request());
            }

            await route.continue();
        });

        await page.goto('/employees');
        await page.reload();
        await waitForReport(page);

        expect(aborted).toBe(true);
    });

    test('reports employee search latency without page failure', async ({ page }) => {
        const timings = [];
        const requests = [];
        page.on('request', request => {
            if (
                request.url().includes(searchPath) &&
                request.method() === 'POST'
            ) {
                requests.push(request);
                assertAuthenticatedReportRequest(request);
            }
        });
        page.on('response', response => {
            if (response.url().includes(searchPath) && response.status() === 200) {
                const request = response.request();
                const startTime = request.timing().startTime;
                if (startTime >= 0) {
                    timings.push(response.request().timing().responseEnd - startTime);
                }
            }
        });

        await page.goto('/employees');
        await waitForReport(page);

        expect(timings.length).toBeGreaterThan(0);
        expect(requests.length).toBeGreaterThan(0);
        const sorted = [...timings].sort((left, right) => left - right);
        const p95 = sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)];
        console.log(`Employees search p95: ${p95} ms`);
        expect(p95).toBeLessThan(searchP95Limit);
    });
});
