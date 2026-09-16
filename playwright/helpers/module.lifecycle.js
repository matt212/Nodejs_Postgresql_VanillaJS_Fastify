const { expect } = require('@playwright/test');
const selectors = require('../selectors/module.selectors');
const moduleConfig = require('../config/module.config');

async function openControlBar(page) {

    await page.locator(selectors.controlBarCollapse).click();

    await expect(
        page.locator(selectors.dateRange)
    ).toBeVisible();
}

async function applyDateRange(page) {

    await page.locator(selectors.dateRange).click();

    await page.evaluate(() => {

        const input = window.jQuery('#reservation');

        const picker = input.data('daterangepicker');

        if (!picker) {
            throw new Error(
                'daterangepicker instance not found on #reservation'
            );
        }

        picker.setStartDate('1982-08-07');
        const today = new Date();

const formattedToday =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        picker.setEndDate(formattedToday);
    });
console.log(
    'Date range:',
    await page.locator(selectors.dateRange).inputValue()
);
page.on('request', request => {
    if (request.url().includes(`${moduleConfig.apiPrefix}/api/searchtype/`)) {
        console.log('========== PLAYWRIGHT REQUEST ==========');
        console.log('URL:', request.url());
        console.log('METHOD:', request.method());
        console.log('POST DATA:', request.postData());
        console.log('HEADERS:', request.headers());
    }
});
const responsePromise = page.waitForResponse(response =>
    response.url().includes(`${moduleConfig.apiPrefix}/api/searchtype/`) &&
    response.status() === 200
);

await page.locator(
    '.daterangepicker .applyBtn'
).click();

const response = await responsePromise;

//console.log('[SEARCH URL]', response.url());
//console.log('[SEARCH DATA]', await response.text());

await expect(
    page.locator(selectors.reportContainer)
).not.toHaveClass(/loading-report-container/);

await expect(
    page.locator(selectors.reportContent).first()
).toBeVisible();
    

    await page.waitForTimeout(2000);
}

async function loadEmployeesReport(page) {

    await page.goto(moduleConfig.route);

    await page.waitForTimeout(3000);

    await openControlBar(page);

    await applyDateRange(page);

}

async function openFilterBar(page) {

    await page.locator(selectors.filterBarToggle).click();

    await expect(
        page.locator(selectors.filterBar).first()
    ).toBeVisible();
}

async function getFirstRowData(page) {

    const headers = page.locator(
        '#basetable thead tr th[data-field-header]'
    );

    const fieldKeys = await headers.evaluateAll(elements =>
        elements.map(el =>
            el.getAttribute('data-field-header')
        )
    );

    const firstRowCells = page.locator(
        '#basetable tbody tr'
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

module.exports = { openControlBar, applyDateRange, loadEmployeesReport, openFilterBar, getFirstRowData };
