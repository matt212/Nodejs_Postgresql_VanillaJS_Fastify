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

function registerModuleLifeCycleTests({
    test,
    base,
    mod,
    validationConfig
}) {

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
    '29 - Delete -> Active absence -> Restore -> Deleted absence lifecycle',
    async ({ page }) => {

        test.setTimeout(180000);

        // ============================================================
        // 1. LOAD ACTIVE RECORDS
        // ============================================================

        await loadEmployeesReport(page,base);

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
            `Test 29 - Employee: ${employeeId}`
        );

        console.log(
            `Test 29 - Consolidated search word: "${searchValue}"`
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
            `Test 29 - ${employeeId} absent from Active`
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

        await openFilterBar(page,base);


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
            `Test 29 - ${employeeId} found in Deleted using "${searchValue}"`
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
            `Test 29 - ${employeeId} restored`
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
            `Test 29 - ${employeeId} confirmed ACTIVE using "${searchValue}"`
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
            `Test 29 PASS - ${employeeId}: ACTIVE -> DELETED -> consolidated search -> RESTORE -> NEWEST -> consolidated search -> ACTIVE -> Deleted absence`
        );
    }
);

}
module.exports = {
    registerModuleLifeCycleTests
};