
const { test, expect } = require('@playwright/test');
let mod =  {
  Name: 'employees',
  id: 'employeesid',
  type: 'base'
};
let validationConfig = require('../../app/routes/utils/' + mod.Name + '/validationConfig.js')

const {
    base
} = require('../config/module.config');



const {
    openControlBar,
    applyDateRange,
    loadEmployeesReport,
    openFilterBar,
    getFirstRowData
} = require('../helpers/module.filters');


// ============================================================
// TEST 01
// LOGIN
// ============================================================

test(
    '01 - Login - User can access Employees',
    async ({ page }) => {

        await page.goto('/employees');

        await expect(page)
            .toHaveURL(/employees/);
    }
);


// ============================================================
// TEST 02
// CONTROL BAR
// ============================================================

test(
    '02 - Control Bar - User can open Control Bar',
    async ({ page }) => {

        await page.goto('/employees');

        // Same timing used by your original zero-error test.
        await page.waitForTimeout(3000);

        await openControlBar(page);

        await expect(
            page.locator(base.locators.dateRange)
        ).toBeVisible();
    }
);


// ============================================================
// TEST 03
// DATE RANGE / REPORT LOAD
// ============================================================

test(
    '03 - Date Range - User can change Employees report date',
    async ({ page }) => {

        await page.goto('/employees');

        await page.waitForTimeout(3000);

        await openControlBar(page);

        await applyDateRange(page);

        await expect(
            page.locator(base.locators.reportContent).first()
        ).toBeVisible();
    }
);


// ============================================================
// TEST 04
// base TABLE
// ============================================================

test(
    '04 - Employees - Report table loads successfully',
    async ({ page }) => {

        await loadEmployeesReport(page);

        await expect(
            page.locator(base.locators.table)
        ).toBeVisible();

        await expect(
            page.locator(base.locators.tableRows).first()
        ).toBeVisible();
    }
);


// ============================================================
// TEST 05
// TABLE COLUMN MAPPING
// ============================================================

test(
    '05 - Employees - Table columns are generated correctly',
    async ({ page }) => {

        await loadEmployeesReport(page);

        const {
            fieldKeys
        } = await getFirstRowData(page);

        console.log(
            'Dynamic table fields:',
            fieldKeys
        );

        expect(fieldKeys.length)
            .toBeGreaterThan(0);
    }
);


// ============================================================
// TEST 06
// FIRST ROW DATA
// ============================================================

test(
    '06 - Employees - Table contains employee data',
    async ({ page }) => {

        await loadEmployeesReport(page);

        const {
            firstRowData
        } = await getFirstRowData(page);

        console.log(
            'First Row Data Mapping:',
            firstRowData
        );

        const values =
            Object.values(firstRowData);

        expect(values.length)
            .toBeGreaterThan(0);

        expect(
            values.some(value =>
                value.length > 0
            )
        ).toBe(true);
    }
);


// ============================================================
// TEST 07
// EMPLOYEE COUNT
// ============================================================

test(
    '07 - Employees - Total employee count is displayed',
    async ({ page }) => {

        await loadEmployeesReport(page);

        const value =
            await page.locator(
                base.locators.totalUsers
            ).textContent();

        console.log(
            'Total Employees:',
            value
        );

        await expect(page.locator(base.locators.totalUsers)).toHaveText(/\d+/);
    }
);