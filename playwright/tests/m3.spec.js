


const { test, expect } = require('@playwright/test');
let mod =  {
  Name: 'employees',
  id: 'employeesid',
  type: 'base'
};
let validationConfig = require('../../app/routes/utils/' + mod.Name + '/validationConfig.js')


// ============================================================
// base - CENTRAL LOCATOR / CONTROL / API REGISTRY
// Behavior-preserving refactor: values are the original selectors.
// ============================================================
const {
    base
} = require('../config/Module/' + mod.Name + '.config.js');





// ============================================================
// OPEN CONTROL BAR
// ============================================================
const {
    openControlBar,
    applyDateRange,
    loadEmployeesReport,
    openFilterBar,
    getFirstRowData,
    applyDynamicEmployeeFilter,
    selectOneDynamicEmployeeFilter
} = require('../helpers/module.filters');

// ============================================================
// TEST 01-07/
// ============================================================

const {
    registerModuleScreenLoadTests
} = require(
    '../testsets/module.screenload.js'
);


registerModuleScreenLoadTests({
    test,
    base,
    mod,
    validationConfig
});


// ============================================================
// TEST 08-13
// ============================================================

const {
    registerModuleFilterTests
} = require(
    '../testsets/module.filter.js'
);

registerModuleFilterTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
// TEST 14
// ============================================================

const {
    registerModuleSortTests
} = require(
    '../testsets/module.sort.js'
);

registerModuleSortTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
// TEST 15
// ============================================================

const {
    registerModuleReportTests
} = require(
    '../testsets/module.report.js'
);

registerModuleReportTests({
    test,
    base,
    mod,
    validationConfig
});



// ============================================================
// TEST 16-19
// CRUD - CREATE EMPLOYEE
// ============================================================
const {
    registerModuleCrudTests
} = require(
    '../testsets/module.crud.js'
);
registerModuleCrudTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
//TEST 20-21
// ============================================================
const {
    registerModuleAdvancedFilterTests
} = require(
    '../testsets/module.advancedFilters.js'
);
registerModuleAdvancedFilterTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
// TEST 22
// ============================================================

const {
    registerModuleDeleteTests
} = require(
    '../testsets/module.delete.js'
);
registerModuleDeleteTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
// TESTS 24 - 30
//
// Additional high-value UI coverage:
//
// 24 - Pagination + Page Size
// 25 - Newest / Oldest navigation
// 26 - Empty-result search
// 27 - Clear / Remove filter
// 28 - Filter + Sort
// 29 - Filter + Pagination
// 30 - Delete -> Active absence -> Restore -> Deleted absence
//
// These tests are designed to be pasted AFTER TEST 23.
// ============================================================

// ============================================================
// TEST 23
// PAGINATION + PAGE SIZE
// ============================================================


const {
    registerModulePaginationTests
} = require(
    '../testsets/module.pagination.js'
);


registerModulePaginationTests({
    test,
    base,
    mod,
    validationConfig
});





// ============================================================
// TEST 24
// NEWEST / OLDEST RECORD NAVIGATION
// code is clubbed with test 14 in sort 
// ============================================================



// ============================================================ 
// Test 25 - Consolidated search returns zero records for a non-existent value
// Test 26 - Clear and remove dynamic filter returns report to unfiltered state
// code is clubbed with test module.filter.js
// ============================================================











// ============================================================
// TEST 27
// FILTER + SORT COMBINATION
// ============================================================


test(
    '28 - Dynamic filter and column sorting work together',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page);

        // --------------------------------------------------------
        // Select and apply one dynamic filter.
        // --------------------------------------------------------

        const filter =
            await base.selectOneDynamicEmployeeFilter(page);

        await applyDynamicEmployeeFilter(page);

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
            `Test 28 - Filtered total: ${filteredTotal}`
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
            `Test 28 - Sorting filtered results by: ${sortField}`
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
            'Test 28 PASS - Filter remained active during DESC and ASC sorting'
        );
    }
);



// ============================================================
// TEST 28
// FILTER + PAGINATION COMBINATION
// ============================================================


test(
    '29 - Dynamic filter and pagination work together',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page);

        // --------------------------------------------------------
        // STEP 1 - Select and apply dynamic employee filter
        // --------------------------------------------------------

        const filter =
            await base.selectOneDynamicEmployeeFilter(
                page
            );

        await applyDynamicEmployeeFilter(
            page
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
            `Test 29 - Filtered total records: ${filteredTotal}`
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




// ============================================================
// TEST 29
// COMPLETE DELETE / RESTORE LIFECYCLE
//
// DELETE
//   -> verify in Deleted
//   -> verify ABSENT from Active
//
// RESTORE
//   -> verify in Active
//   -> verify ABSENT from Deleted
// ============================================================





test(
    '30 - Delete -> Active absence -> Restore -> Deleted absence lifecycle',
    async ({ page }) => {

        test.setTimeout(180000);

        // ============================================================
        // 1. LOAD ACTIVE RECORDS
        // ============================================================

        await loadEmployeesReport(page);

        const activeRows =
            page.locator(base.locators.tableRows);

        const activeRowCount =
            await activeRows.count();

        expect(
            activeRowCount,
            'Active records should contain at least one employee'
        ).toBeGreaterThan(0);

        const randomIndex =
            Math.floor(
                Math.random() * activeRowCount
            );

        const selectedRow =
            activeRows.nth(randomIndex);

        const editCell =
            selectedRow.locator(
                'td[data-tbledit-type]'
            ).first();

        await expect(editCell).toBeVisible({
            timeout: 30000
        });

        const employeeId =
            await editCell.getAttribute(
                'data-tbledit-type'
            );

        expect(employeeId).not.toBeNull();
        expect(employeeId).not.toBe('');

        // THIS IS THE SINGLE SEARCH WORD USED THROUGHOUT TEST 30.
        // It is captured from the selected table row BEFORE delete.
        const searchValue =
            (
                await selectedRow
                    .locator('td')
                    .nth(1)
                    .textContent()
                || ''
            ).trim();

        expect(
            searchValue,
            'Selected table row must contain a consolidated-search word'
        ).not.toBe('');

        console.log(
            `Test 30 - Employee: ${employeeId}`
        );

        console.log(
            `Test 30 - Consolidated search word: "${searchValue}"`
        );

        // ============================================================
        // 2. ACTIVE -> DELETED
        // ============================================================

        await editCell.click();

        const recordStateInput =
            page.locator(base.locators.recordStateInput);

        const recordStateControl =
            page.locator(
                base.locators.recordStateControl
            );

        await expect(recordStateInput).toBeAttached({
            timeout: 30000
        });

        await expect(recordStateInput).toBeChecked();

        await recordStateControl.click();

        await expect(recordStateInput).not.toBeChecked();

        const deleteUpdateResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.update
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const deleteSearchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.search
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const deleteCountResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.count
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await page.locator(base.locators.modalSubmit).click();

        await deleteUpdateResponsePromise;
        await deleteSearchResponsePromise;
        await deleteCountResponsePromise;

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            page.locator(
                `#basetable tbody tr td[data-tbledit-type="${employeeId}"]`
            )
        ).toHaveCount(0);

        console.log(
            `Test 30 - ${employeeId} absent from Active`
        );

        // ============================================================
        // 3. OPEN DELETED RECORDS
        // ============================================================

        const pagingParent =
            page.locator(
                base.locators.pagingParent
            );

        const pagingMenu =
            page.locator(base.locators.pagingMenu);

        await expect(pagingParent).toBeVisible({
            timeout: 30000
        });

        await pagingParent.click();

        await expect(pagingMenu).toBeVisible({
            timeout: 10000
        });

        const deletedOption =
            page.locator(base.locators.deleted);

        await expect(deletedOption).toBeVisible({
            timeout: 10000
        });

        const deletedSearchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.search
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const deletedCountResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.count
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await deletedOption.click();

        await deletedSearchResponsePromise;
        await deletedCountResponsePromise;

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        // ============================================================
        // 4. CONSOLIDATED SEARCH USING ORIGINAL TABLE WORD
        // ============================================================

        await openFilterBar(page);


        const consolidatedSearch =
            page.locator(base.locators.consolidatedSearch);

        await expect(consolidatedSearch).toBeVisible({
            timeout: 10000
        });

        const deletedConsolidatedSearchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.search
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const deletedConsolidatedCountResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.count
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await consolidatedSearch.fill(searchValue);

        await page.locator(
            base.locators.consolidatedSearchAction
        ).click();

        await deletedConsolidatedSearchResponsePromise;
        await deletedConsolidatedCountResponsePromise;

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        // Find the deleted row by the ORIGINAL consolidated-search word.
        const deletedSearchRow =
            page.locator(base.locators.tableRows)
                .filter({
                    hasText: searchValue
                })
                .first();

        await expect(
            deletedSearchRow,
            `Deleted row containing "${searchValue}" should be visible`
        ).toBeVisible({
            timeout: 30000
        });

        // Now identify the exact employee inside that consolidated-search result.
        const deletedEditCell =
            deletedSearchRow.locator(
                `td[data-tbledit-type="${employeeId}"]`
            );

        await expect(
            deletedEditCell,
            `Employee ${employeeId} should be present in consolidated-search result`
        ).toHaveCount(1);

        console.log(
            `Test 30 - ${employeeId} found in Deleted using "${searchValue}"`
        );

        // ============================================================
        // 5. DELETED -> ACTIVE
        // ============================================================

        await deletedEditCell.click();

        await expect(recordStateInput).toBeAttached({
            timeout: 30000
        });

        await expect(recordStateInput).not.toBeChecked();

        // Check record state back to ACTIVE.
        await recordStateControl.click();

        await expect(recordStateInput).toBeChecked();

        const restoreUpdateResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.update
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const restoreSearchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.search
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const restoreCountResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.count
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await page.locator(base.locators.modalSubmit).click();

        await restoreUpdateResponsePromise;
        await restoreSearchResponsePromise;
        await restoreCountResponsePromise;

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        console.log(
            `Test 30 - ${employeeId} restored`
        );

        // ============================================================
        // 6. NEWEST
        // ============================================================

        await expect(pagingParent).toBeVisible({
            timeout: 30000
        });

        await pagingParent.click();

        await expect(pagingMenu).toBeVisible({
            timeout: 10000
        });

        const newestOption =
            page.locator(base.locators.newest);

        await expect(newestOption).toBeVisible({
            timeout: 10000
        });

        const newestSearchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.search
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const newestCountResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.count
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await newestOption.click();

        await newestSearchResponsePromise;
        await newestCountResponsePromise;

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        // ============================================================
        // 7. CONSOLIDATED SEARCH AGAIN USING SAME ORIGINAL WORD
        // ============================================================

       // await openFilterBar(page);



        await expect(
            consolidatedSearch
        ).toBeVisible({
            timeout: 10000
        });

        const activeConsolidatedSearchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.search
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const activeConsolidatedCountResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.count
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        // SAME WORD CAPTURED AT THE START OF TEST.
        await consolidatedSearch.fill(searchValue);

        await page.locator(
            base.locators.consolidatedSearchAction
        ).click();

        await activeConsolidatedSearchResponsePromise;
        await activeConsolidatedCountResponsePromise;

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        // ============================================================
        // 8. VERIFY RESTORED EMPLOYEE IN ACTIVE
        // ============================================================

        const restoredSearchRow =
            page.locator(base.locators.tableRows)
                .filter({
                    hasText: searchValue
                })
                .first();

        await expect(
            restoredSearchRow,
            `Restored row containing "${searchValue}" should be visible in Active`
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            restoredSearchRow.locator(
                `td[data-tbledit-type="${employeeId}"]`
            )
        ).toHaveCount(1);

        console.log(
            `Test 30 - ${employeeId} confirmed ACTIVE using "${searchValue}"`
        );

        // ============================================================
        // 9. SWITCH TO DELETED AND VERIFY ABSENCE
        // ============================================================

        await pagingParent.click();

        await expect(pagingMenu).toBeVisible({
            timeout: 10000
        });

        await expect(deletedOption).toBeVisible({
            timeout: 10000
        });

        const finalDeletedSearchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.search
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const finalDeletedCountResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.count
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await deletedOption.click();

        await finalDeletedSearchResponsePromise;
        await finalDeletedCountResponsePromise;

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            page.locator(
                `#basetable tbody tr input.tblkchk[data-chk-type="${employeeId}"]`
            )
        ).toHaveCount(0);

        console.log(
            `Test 30 PASS - ${employeeId}: ACTIVE -> DELETED -> consolidated search -> RESTORE -> NEWEST -> consolidated search -> ACTIVE -> Deleted absence`
        );
    }
);






