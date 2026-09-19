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

async function selectOneDynamicEmployeeFilter(page,base) {

    await openFilterBar(page);

    await page.locator(
        base.locators.dynamicFilterToggle
    ).click();

    await expect(page.locator(base.locators.dynamicFilterContainer))
        .toBeVisible({ timeout: 10000 });

    const fieldKeys = await page.locator(
        base.locators.dynamicFilterInputs
    ).evaluateAll(elements =>
        elements
            .map(e =>
                e.getAttribute('data-multipleselect-autocomplete')
            )
            .filter(Boolean)
    );

    console.log('[FIELDS]', fieldKeys);

    expect(fieldKeys.length).toBeGreaterThan(0);

    const row = page.locator(
        base.locators.tableRows
    ).first();

    await expect(row).toBeVisible({
        timeout: 10000
    });

    const cells = row.locator('td');

    for (const fieldKey of fieldKeys) {

        console.log('');
        console.log('================================================');
        console.log(`[FIELD] ${fieldKey}`);

        // --------------------------------------------------------
        // THEAD is the source of truth.
        // Find the field header and determine its VISIBLE position.
        // --------------------------------------------------------

        const header = page.locator(
            `#basetable thead th[data-field-header="${fieldKey}"]`
        ).first();

        if (await header.count() === 0) {
            console.log(
                `[SKIP] ${fieldKey}: THEAD header not found`
            );
            continue;
        }

        const columnIndex = await header.evaluate(th => {

            const headers = Array.from(
                th.parentElement.children
            ).filter(el => {

                const style = window.getComputedStyle(el);

                return (
                    style.display !== 'none' &&
                    style.visibility !== 'hidden'
                );
            });

            return headers.indexOf(th);
        });

        console.log(
            `[THEAD] ${fieldKey} -> visible column ${columnIndex}`
        );

        // --------------------------------------------------------
        // Corresponding TBODY cell.
        // --------------------------------------------------------

        const cellCount = await cells.count();

        if (columnIndex < 0 || columnIndex >= cellCount) {
            console.log(
                `[SKIP] ${fieldKey}: invalid tbody column ${columnIndex}`
            );
            continue;
        }

        const tableValue = (
            await cells.nth(columnIndex).textContent() || ''
        ).trim();

        console.log(
            `[TABLE VALUE] ${fieldKey} = "${tableValue}"`
        );

        if (!tableValue) {
            console.log(
                `[SKIP] ${fieldKey}: empty table value`
            );
            continue;
        }

        // --------------------------------------------------------
        // Filter controls.
        // --------------------------------------------------------

        const filterInput = page.locator(
            `.fieldsfilterbar input[data-multipleselect-autocomplete="${fieldKey}"]`
        );

        await expect(filterInput).toBeVisible({
            timeout: 10000
        });

        const chips = filterInput
            .locator('..')
            .locator('.selectchips');

        const dropdown = page.locator(
            `#dv_${fieldKey}:visible`
        ).first();

        // --------------------------------------------------------
        // GROUPBY API - listeners MUST be before fill().
        // --------------------------------------------------------

        const groupByRequestPromise =
            page.waitForRequest(
                request =>
                    request.url().includes(
                        base.api.groupBy
                    ) &&
                    request.method() === 'POST',
                {
                    timeout: 30000
                }
            );

        const groupByResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.groupBy
                    ) &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        console.log(
            `[GROUPBY SEARCH] ${fieldKey} = "${tableValue}"`
        );

        await filterInput.fill(tableValue);

        // --------------------------------------------------------
        // GROUPBY REQUEST
        // --------------------------------------------------------

        const groupByRequest =
            await groupByRequestPromise;

        console.log(
            `[GROUPBY REQUEST] ${fieldKey}`
        );

        console.log(
            groupByRequest.postData()
        );

        // --------------------------------------------------------
        // GROUPBY RESPONSE
        // --------------------------------------------------------

        const groupByResponse =
            await groupByResponsePromise;

        const groupByBody =
            await groupByResponse.json();

        console.log(
            `[GROUPBY RESPONSE] ${fieldKey}`
        );

        console.log(
            JSON.stringify(groupByBody)
        );

        // --------------------------------------------------------
        // Dropdown must now be populated from API result.
        // --------------------------------------------------------

        await expect(dropdown).toBeVisible({
            timeout: 10000
        });

        const options = dropdown.locator(
            'div a.highlightselect'
        );

        const optionCount = await options.count();

        console.log(
            `[DROPDOWN] ${fieldKey}: ${optionCount} options`
        );

        let matchingOption = null;
        let selectedValue = null;

        for (let i = 0; i < optionCount; i++) {

            const option = options.nth(i);

            const optionText = (
                await option.textContent() || ''
            ).trim();

            console.log(
                `[OPTION ${i}] "${optionText}"`
            );

            if (
                optionText.toLowerCase() ===
                tableValue.toLowerCase()
            ) {
                matchingOption = option;
                selectedValue = optionText;
                break;
            }
        }

        if (!matchingOption) {

            console.log(
                `[SKIP] ${fieldKey}: "${tableValue}" not found in dropdown`
            );

            await filterInput.fill('');

            continue;
        }

        console.log(
            `[MATCH] ${fieldKey} = "${selectedValue}"`
        );

        await matchingOption.click();

        await expect.poll(
            async () => await chips.count(),
            {
                timeout: 10000,
                message:
                    `${fieldKey}: selected filter chip was not created`
            }
        ).toBeGreaterThan(0);

        console.log(
            `[PASS] ${fieldKey} = ${selectedValue}`
        );

        return {
            fieldKey,
            value: selectedValue,
            filterInput,
            chips
        };
    }

    throw new Error(
        'No dynamic multi-select field returned an exact autocomplete value'
    );
}






// ============================================================
// HELPER
//
// Apply currently selected dynamic filters.
// ============================================================

async function applyDynamicEmployeeFilter(page,base
) {

    await Promise.all([
        page.waitForResponse(
            response =>
                response.url().includes(
                    '/api/searchtype/'
                ) &&
                response.status() === 200,
            {
                timeout: 30000
            }
        ),

        page.waitForResponse(
            response =>
                response.url().includes(
                    '/api/searchtypeCount/'
                ) &&
                response.status() === 200,
            {
                timeout: 30000
            }
        ),

        page.locator(
            "//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div"
        ).click()
    ]);

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
}



// ============================================================
// EXPORT
// ============================================================

module.exports = {
    openControlBar,
    applyDateRange,
    loadEmployeesReport,
    openFilterBar,
    getFirstRowData,
    applyDynamicEmployeeFilter,
    selectOneDynamicEmployeeFilter
};