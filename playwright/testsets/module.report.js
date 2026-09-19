const { test, expect } = require('@playwright/test');

const {
    loadEmployeesReport,
    openFilterBar,
} = require('../helpers/module.filters');

function registerModuleReportTests({
    test,
    base,
    mod,
    validationConfig
}) {


// ============================================================
// TEST 15
// FILTER BAR SCREENSHOT / FINAL UI STATE
// ============================================================

test(
    '15 - Employees - Filtered report UI is displayed correctly',
    async ({ page }) => {

        await loadEmployeesReport(page,base);

        await openFilterBar(page,base);


        await page.screenshot({
            path:
                'playwright/screenshots/employees-date-filtered.png',
            fullPage: true
        });


        await expect(
            page.locator('#dvfilterbar').first()
        ).toBeVisible();


        await expect(
            page.locator(base.locators.table)
        ).toBeVisible();
    }
);// Reserved for incremental extraction after baseline validation.\nmodule.exports = {};
}
module.exports = {
    registerModuleReportTests
};