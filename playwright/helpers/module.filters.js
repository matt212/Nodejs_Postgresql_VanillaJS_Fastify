const { test, expect } = require('@playwright/test');
const {
    base
} = require('../config/module.config');

// ============================================================
// OPEN CONTROL BAR
// ============================================================

async function openControlBar(page) {

    await page.locator(
        base.locators.controlBarCollapse
    ).click();

    await expect(
        page.locator(
            base.locators.dateRange
        )
    ).toBeVisible();
}


// ============================================================
// APPLY DATE RANGE
// ============================================================

async function applyDateRange(page) {

    await page.locator(
        base.locators.dateRange
    ).click();

    await page.evaluate((selector) => {

        const input = window.jQuery(selector);

        const picker =
            input.data('daterangepicker');

        if (!picker) {
            throw new Error(
                'daterangepicker instance not found on ' +
                selector
            );
        }

        picker.setStartDate('1982-08-07');

        const today = new Date();

        const formattedToday =
            `${today.getFullYear()}-${String(
                today.getMonth() + 1
            ).padStart(2, '0')}-${String(
                today.getDate()
            ).padStart(2, '0')}`;

        picker.setEndDate(formattedToday);

    }, base.locators.dateRange);


    console.log(
        'Date range:',
        await page
            .locator(base.locators.dateRange)
            .inputValue()
    );


    const responsePromise =
        page.waitForResponse(
            response =>
                response.url().includes(
                    base.api.search
                ) &&
                response.request().method() === 'POST' &&
                response.status() === 200,
            {
                timeout: base.timing.response
            }
        );


    const countResponsePromise =
        page.waitForResponse(
            response =>
                response.url().includes(
                    base.api.count
                ) &&
                response.request().method() === 'POST' &&
                response.status() === 200,
            {
                timeout: base.timing.response
            }
        );


    await page.locator(
        '.daterangepicker .applyBtn'
    ).click();


    const [
        response,
        countResponse
    ] = await Promise.all([
        responsePromise,
        countResponsePromise
    ]);


    console.log(
        '[SEARCH RESPONSE]',
        response.url()
    );

    console.log(
        '[COUNT RESPONSE]',
        countResponse.url()
    );


    await expect(
        page.locator(
            base.locators.reportContainer
        )
    ).not.toHaveClass(
        /loading-report-container/,
        {
            timeout: base.timing.ui
        }
    );


    await expect(
        page.locator(
            base.locators.reportContent
        ).first()
    ).toBeVisible({
        timeout: base.timing.ui
    });


    await expect(
        page.locator(
            base.locators.table
        )
    ).toBeVisible({
        timeout: base.timing.ui
    });


    return {
        searchResponse: response,
        countResponse
    };
}


// ============================================================
// LOAD base REPORT
// ============================================================

async function loadEmployeesReport(page) {

    await page.goto('/employees');

    await page.waitForTimeout(3000);

    await openControlBar(page);

    await applyDateRange(page);
}

// ============================================================
// OPEN FILTER BAR
// ============================================================

async function openFilterBar(page) {

            await page.locator(
                base.locators.filterBarParentToggle
            ).click();

            await expect(
                page.locator('#dvfilterbar').first()
            ).toBeVisible();
}


// ============================================================
// GET FIRST ROW DATA
//
// Kept dynamically from your original test.
// ============================================================

async function getFirstRowData(page) {

            const headers = page.locator(
                base.locators.tableHeaders
            );

            const fieldKeys = await headers.evaluateAll(elements =>
                elements.map(el =>
                    el.getAttribute('data-field-header')
                )
            );

            const firstRowCells = page.locator(
                base.locators.tableRows
            ).first().locator('td');

            const firstRowData = {};
            const firstCharacters = {};

            for (let i = 0; i < fieldKeys.length; i++) {

                const key = fieldKeys[i];

                const cellText =
                    await firstRowCells.nth(i + 1).textContent();

                const cleanValue =
                    cellText.trim();

                firstRowData[key] = cleanValue;

                firstCharacters[key] =
                    cleanValue.charAt(0);
            }

            console.log(
                'First Row Data Mapping:',
                firstRowData
            );

            console.log(
                'First Characters For Your Filter Bar Loop:',
                firstCharacters
            );

            return {
                fieldKeys,
                firstRowData,
                firstCharacters
            };
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    openControlBar,
    applyDateRange,
    loadEmployeesReport,
    openFilterBar,
    getFirstRowData
};