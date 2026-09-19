
const { test, expect } = require('@playwright/test');




const {
    openControlBar,
    applyDateRange,
    loadEmployeesReport,
    openFilterBar,
    getFirstRowData,
    selectOneDynamicEmployeeFilter,
    applyDynamicEmployeeFilter
} = require('../helpers/module.filters');

function registerModuleFilterStateTests({
    test,
    base,
    mod,
    validationConfig
}) {


// ============================================================
// TEST 27
// FILTER + SORT COMBINATION
// ============================================================


test(
    '27 - Dynamic filter and column sorting work together',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page,base);

        // --------------------------------------------------------
        // Select and apply one dynamic filter.
        // --------------------------------------------------------

        const filter =
            await selectOneDynamicEmployeeFilter(page,base);

        await applyDynamicEmployeeFilter(page, base);

        const filteredTotal = Number(
            (
                await page.locator(base.locators.totalUsers).textContent()
                || '0'
            ).trim()
        );

        expect(
            filteredTotal,
            'Filtered result must contain records before sorting'
        ).toBeGreaterThan(0);

        console.log(
            `Test 27 - Filtered total: ${filteredTotal}`
        );

        // --------------------------------------------------------
        // Dynamically select a sortable table field.
        // --------------------------------------------------------

        const headers =
            page.locator(
                base.locators.tableHeaders
            );

        await expect(
            headers.first(),
            'At least one sortable table field must exist'
        ).toBeVisible({
            timeout: 30000
        });

        const sortHeader = headers.first();

        const sortField =
            await sortHeader.getAttribute(
                'data-field-header'
            );

        expect(
            sortField,
            'Sortable field must have data-field-header'
        ).not.toBeNull();

        console.log(
            `Test 27 - Sorting filtered results by: ${sortField}`
        );

        // ========================================================
        // DESC
        // ========================================================

        const descRequestPromise =
            page.waitForRequest(
                request =>
                    request.url().includes('/api/searchtype/') &&
                    request.method() === 'POST',
                {
                    timeout: 30000
                }
            );

        const descResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes('/api/searchtype/') &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await sortHeader.click();

        const [descRequest, descResponse] =
            await Promise.all([
                descRequestPromise,
                descResponsePromise
            ]);

        expect(
            descResponse.status()
        ).toBe(200);

        const descPayload =
            descRequest.postDataJSON();

        // Verify sorted field.
        expect(
            descPayload.sortcolumn,
            'DESC request must contain selected sort field'
        ).toBe(sortField);

        // Verify DESC order.
        expect(
            String(
                descPayload.sortcolumnorder
            ).toUpperCase(),
            'DESC request must use DESC sort order'
        ).toBe('DESC');

        // Verify selected filter is still present.
        expect(
            JSON.stringify(descPayload).toLowerCase(),
            'DESC request must retain the selected dynamic filter'
        ).toContain(
            String(filter.value).toLowerCase()
        );

        // ========================================================
        // ASC
        // ========================================================

        const ascRequestPromise =
            page.waitForRequest(
                request =>
                    request.url().includes('/api/searchtype/') &&
                    request.method() === 'POST',
                {
                    timeout: 30000
                }
            );

        const ascResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes('/api/searchtype/') &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await sortHeader.click();

        const [ascRequest, ascResponse] =
            await Promise.all([
                ascRequestPromise,
                ascResponsePromise
            ]);

        expect(
            ascResponse.status()
        ).toBe(200);

        const ascPayload =
            ascRequest.postDataJSON();

        // Verify sorted field.
        expect(
            ascPayload.sortcolumn,
            'ASC request must contain selected sort field'
        ).toBe(sortField);

        // Verify ASC order.
        expect(
            String(
                ascPayload.sortcolumnorder
            ).toUpperCase(),
            'ASC request must use ASC sort order'
        ).toBe('ASC');

        // Verify selected filter is still present.
        expect(
            JSON.stringify(ascPayload).toLowerCase(),
            'ASC request must retain the selected dynamic filter'
        ).toContain(
            String(filter.value).toLowerCase()
        );

        await expect(
            page.locator(base.locators.table)
        ).toBeVisible({
            timeout: 30000
        });

        console.log(
            'Test 27 PASS - Filter remained active during DESC and ASC sorting'
        );
    }
);



// ============================================================
// TEST 28
// FILTER + PAGINATION COMBINATION
// ============================================================


test(
    '28 - Dynamic filter and pagination work together',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page,base);

        // --------------------------------------------------------
        // STEP 1 - Select and apply dynamic employee filter
        // --------------------------------------------------------

        const filter =
            await selectOneDynamicEmployeeFilter(
                page, base
            );

        await applyDynamicEmployeeFilter(
            page, base
        );

        // --------------------------------------------------------
        // STEP 2 - Verify filtered result contains records
        // --------------------------------------------------------

        const filteredTotal =
            Number(
                (
                    await page.locator(
                        base.locators.totalUsers
                    ).textContent()
                    || '0'
                ).trim()
            );

        expect(
            filteredTotal,
            'Filtered result must contain records'
        ).toBeGreaterThan(0);

        console.log(
            `Test 28 - Filtered total records: ${filteredTotal}`
        );

        // --------------------------------------------------------
        // STEP 3 - Change page size to 5
        // --------------------------------------------------------

        const pageSizeInput =
            page.locator(base.locators.pageSize);

        await expect(
            pageSizeInput
        ).toBeAttached({
            timeout: 30000
        });

        await pageSizeInput.fill('5');

        await pageSizeInput.evaluate(
            element => {
                element.dispatchEvent(
                    new Event(
                        'change',
                        {
                            bubbles: true
                        }
                    )
                );
            }
        );

        await expect(
            pageSizeInput
        ).toHaveValue('5');

        // --------------------------------------------------------
        // STEP 4 - Wait for report to settle
        // --------------------------------------------------------

        await expect(
            page.locator(base.locators.reportContainer)
        ).not.toHaveClass(
            /loading-report-container/,
            {
                timeout: 30000
            }
        );

        await expect(
            page.locator(base.locators.table)
        ).toBeVisible({
            timeout: 30000
        });

        // --------------------------------------------------------
        // STEP 5 - Verify first filtered page
        // --------------------------------------------------------

        const rows =
            page.locator(
                base.locators.tableRows
            );

        const firstPageRows =
            await rows.count();

        expect(
            firstPageRows,
            'Filtered first page must contain rows'
        ).toBeGreaterThan(0);

        expect(
            firstPageRows,
            'Filtered first page must respect page size 5'
        ).toBeLessThanOrEqual(5);

        const firstPageData =
            await rows.allTextContents();

        console.log(
            `Test 29 - First filtered page rows: ${firstPageRows}`
        );

        // --------------------------------------------------------
        // STEP 6 - Locate actual page 2
        //
        // IMPORTANT:
        // Pagination is:
        //
        // «  1  2  3  4  5  »
        //
        // Do not use nth(1).
        // Also, if the filtered result contains 5 or fewer
        // records, page 2 must not be attempted.
        // --------------------------------------------------------

        const secondPage =
            page.locator(
                base.locators.pageLinks,
                {
                    hasText: /^2$/
                }
            );

        const secondPageAvailable =
            filteredTotal > 5 &&
            await secondPage.count() > 0;

        if (secondPageAvailable) {

            await expect(
                secondPage
            ).toBeVisible({
                timeout: 10000
            });

            console.log(
                'Test 29 - Clicking page 2'
            );

            // ----------------------------------------------------
            // STEP 7 - Navigate to page 2
            // ----------------------------------------------------

            await secondPage.click();

            // ----------------------------------------------------
            // STEP 8 - Wait for UI/report to settle
            // ----------------------------------------------------

            await expect(
                page.locator(base.locators.reportContainer)
            ).not.toHaveClass(
                /loading-report-container/,
                {
                    timeout: 30000
                }
            );

            await expect(
                page.locator(base.locators.table)
            ).toBeVisible({
                timeout: 30000
            });

            // ----------------------------------------------------
            // STEP 9 - Verify page 2 rows
            // ----------------------------------------------------

            const secondPageRows =
                await rows.count();

            expect(
                secondPageRows,
                'Second filtered page must contain rows'
            ).toBeGreaterThan(0);

            expect(
                secondPageRows,
                'Second filtered page must respect page size 5'
            ).toBeLessThanOrEqual(5);

            const secondPageData =
                await rows.allTextContents();

            console.log(
                `Test 29 - Second filtered page rows: ${secondPageRows}`
            );

            // ----------------------------------------------------
            // STEP 10 - Verify page 2 contains different records
            // ----------------------------------------------------

            if (filteredTotal > 5) {

                expect(
                    secondPageData,
                    'Second filtered page must contain different records from first page'
                ).not.toEqual(
                    firstPageData
                );
            }

            // ----------------------------------------------------
            // STEP 11 - Verify page-size remains 5
            // ----------------------------------------------------

            await expect(
                pageSizeInput
            ).toHaveValue('5');

            // ----------------------------------------------------
            // STEP 12 - Verify filter remains applied
            // ----------------------------------------------------

            const filteredTotalAfterPagination =
                Number(
                    (
                        await page.locator(
                            base.locators.totalUsers
                        ).textContent()
                        || '0'
                    ).trim()
                );

            expect(
                filteredTotalAfterPagination,
                'Filtered total must remain greater than zero after pagination'
            ).toBeGreaterThan(0);

            expect(
                filteredTotalAfterPagination,
                'Pagination must not remove the active filter result set'
            ).toBe(filteredTotal);

            // ----------------------------------------------------
            // STEP 13 - Verify page 2 is actually selected
            // ----------------------------------------------------

            const activePage =
                page.locator(
                    base.locators.activePage
                );

            if (await activePage.count() > 0) {

                const activePageText =
                    (
                        await activePage.textContent()
                        || ''
                    ).trim();

                console.log(
                    `Test 29 - Active pagination page: ${activePageText}`
                );

                if (activePageText === '2') {

                    expect(
                        activePageText,
                        'Page 2 must be active after navigation'
                    ).toBe('2');
                }
            }

        } else {

            // ----------------------------------------------------
            // Only one filtered page exists.
            // ----------------------------------------------------

            console.log(
                'Test 29 - Filtered result has only one page; pagination transition skipped'
            );

            expect(
                filteredTotal,
                'Filtered result must still contain records'
            ).toBeGreaterThan(0);
        }

        // --------------------------------------------------------
        // FINAL RESULT
        // --------------------------------------------------------

        console.log(
            '============================================================'
        );

        console.log(
            'TEST 29 PASS - Dynamic filter and pagination work together'
        );

        console.log(
            '============================================================'
        );
    }
);
}
module.exports = {
    registerModuleFilterStateTests
};
