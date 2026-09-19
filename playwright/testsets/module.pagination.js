

const { test, expect } = require('@playwright/test');




const {
    openControlBar,
    applyDateRange,
    loadEmployeesReport,
    openFilterBar,
    getFirstRowData
} = require('../helpers/module.filters');


// ============================================================
// MODULE SCREEN LOAD TEST SET
// ============================================================

function registerModulePaginationTests({
    test,
    base,
    mod,
    validationConfig
}) {
// ============================================================
// TEST 23
// PAGINATION + PAGE-SIZE BEHAVIOR
// ============================================================

test(
    '23 - Pagination and page-size behavior works correctly',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page);

        const pageSizeInput = page.locator(base.locators.pageSize);
        const rows = page.locator(base.locators.tableRows);

        await expect(pageSizeInput).toBeAttached({
            timeout: 30000
        });

        // ---------------------------------------------------------
        // PAGE SIZE = 5
        // ---------------------------------------------------------

        const pageSizeResponsePromise = page.waitForResponse(
            response =>
                response.url().includes(base.api.search) &&
                response.request().method() === 'POST' &&
                response.status() === 200,
            { timeout: 30000 }
        );

        await pageSizeInput.fill('5');

        await pageSizeInput.evaluate(element => {
            element.dispatchEvent(
                new Event('change', { bubbles: true })
            );
        });

        await expect(pageSizeInput).toHaveValue('5');

        // Wait for the actual search request triggered by page-size change
        await pageSizeResponsePromise;

        // Confirm the rendered table reflects the response
        await expect(rows.first()).toBeVisible({
            timeout: 30000
        });

        const firstPageRows = await rows.count();

        console.log(
            `Test 24 - First page rows: ${firstPageRows}`
        );

        expect(firstPageRows).toBeGreaterThan(0);
        expect(firstPageRows).toBeLessThanOrEqual(5);

        const totalUsers = Number(
            (await page.locator(base.locators.totalUsers).textContent() || '0').trim()
        );

        console.log(
            `Test 24 - Total records: ${totalUsers}`
        );

        expect(totalUsers).toBeGreaterThan(0);

        const firstPageData = await rows.allTextContents();

        // ---------------------------------------------------------
        // PAGE 2
        // ---------------------------------------------------------

        const secondPageLink = page.locator(
            base.locators.pageLinks,
            { hasText: /^2$/ }
        );

        const secondPageAvailable =
            await secondPageLink.count() > 0;

        if (!secondPageAvailable) {
            console.log(
                'Test 24 - Page 2 is not available; navigation check skipped'
            );
            return;
        }

        console.log('Test 24 - Clicking page 2');

        await expect(secondPageLink).toBeVisible({
            timeout: 10000
        });

        // IMPORTANT:
        // Register the response listener BEFORE clicking page 2.
        const page2ResponsePromise = page.waitForResponse(
            response =>
                response.url().includes(base.api.search) &&
                response.request().method() === 'POST' &&
                response.status() === 200,
            { timeout: 30000 }
        );

        await secondPageLink.click();

        // Wait for the actual page-2 search request
        await page2ResponsePromise;

        await expect(rows.first()).toBeVisible({
            timeout: 30000
        });

        const secondPageRows = await rows.count();

        console.log(
            `Test 24 - Second page rows: ${secondPageRows}`
        );

        expect(secondPageRows).toBeGreaterThan(0);
        expect(secondPageRows).toBeLessThanOrEqual(5);

        const secondPageData = await rows.allTextContents();

        if (totalUsers > 5) {
            expect(secondPageData).not.toEqual(firstPageData);
        }

        const activePage = page.locator(
            base.locators.activePage
        );

        if (await activePage.count() > 0) {
            const activePageText =
                (await activePage.textContent() || '').trim();

            console.log(
                `Test 24 - Active pagination page: ${activePageText}`
            );

            expect(activePageText).toBe('2');
        }

        console.log(
            '============================================================'
        );
        console.log(
            'TEST 24 PASS - Page size and pagination behavior verified'
        );
        console.log(
            '============================================================'
        );
    }
);
}


module.exports = {
    registerModulePaginationTests
};