


const { test, expect } = require('@playwright/test');
let mod =  {
  Name: 'employees',
  id: 'employeesid',
  type: 'base'
};
let validationConfig = require('../../app/routes/utils/' + mod.Name + '/validationConfig.js')



// ============================================================
// OPEN CONTROL BAR
// ============================================================

async function openControlBar(page) {

    await page.locator(
        "//h3[normalize-space()='Control Bar']/following-sibling::div[contains(@class,'box-tools')]//button[@data-widget='collapse']"
    ).click();

    await expect(
        page.locator('#reservation')
    ).toBeVisible();
}


// ============================================================
// APPLY DATE RANGE
// ============================================================

async function applyDateRange(page) {

    await page.locator('#reservation').click();

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
    await page.locator('#reservation').inputValue()
);
page.on('request', request => {
    if (request.url().includes('/employees/api/searchtype/')) {
        console.log('========== PLAYWRIGHT REQUEST ==========');
        console.log('URL:', request.url());
        console.log('METHOD:', request.method());
        console.log('POST DATA:', request.postData());
        console.log('HEADERS:', request.headers());
    }
});
const responsePromise = page.waitForResponse(response =>
    response.url().includes('/employees/api/searchtype/') &&
    response.status() === 200
);

await page.locator(
    '.daterangepicker .applyBtn'
).click();

const response = await responsePromise;

//console.log('[SEARCH URL]', response.url());
//console.log('[SEARCH DATA]', await response.text());

await expect(
    page.locator('#dvreportcontainer')
).not.toHaveClass(/loading-report-container/);

await expect(
    page.locator('#divreportcontent').first()
).toBeVisible();
    

    await page.waitForTimeout(2000);
}


// ============================================================
// LOAD EMPLOYEES REPORT
//
// This intentionally follows your original working sequence.
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
        "//*[@id=\"dvparentfilterbar\"]/div[1]/div/button"
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
            page.locator('#reservation')
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
            page.locator('#divreportcontent').first()
        ).toBeVisible();
    }
);


// ============================================================
// TEST 04
// EMPLOYEES TABLE
// ============================================================

test(
    '04 - Employees - Report table loads successfully',
    async ({ page }) => {

        await loadEmployeesReport(page);

        await expect(
            page.locator('#basetable')
        ).toBeVisible();

        await expect(
            page.locator('#basetable tbody tr').first()
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
                '#sptotalUsers'
            ).textContent();

        console.log(
            'Total Employees:',
            value
        );

        expect(
            value.trim()
        ).not.toBe('');
    }
);


// ============================================================
// TEST 08
// FILTER BAR
// ============================================================

test(
    '08 - Filter Bar - User can open Filter Bar',
    async ({ page }) => {

        await loadEmployeesReport(page);

        await openFilterBar(page);

        await expect(
            page.locator('#dvfilterbar').first()
        ).toBeVisible();
    }
);


// ============================================================
// TEST 09
// CONSOLIDATED SEARCH
// ============================================================

test(
    '09 - Consolidated Search - Search returns matching Employees',
    async ({ page }) => {

        await loadEmployeesReport(page);

        await openFilterBar(page);


        const firstRowSecondColumnText =
            await page.locator(
                '#basetable tbody tr'
            ).first().locator('td').nth(1).textContent();


        const searchValue =
            firstRowSecondColumnText
                .trim()
                .substring(0, 2);


        expect(searchValue.length)
            .toBe(2);


        await page.locator(
            '#txtconsolidatesearch'
        ).fill(searchValue);


        await page.locator(
            '//*[@id="dvfilterbar"]/div[2]/div[1]/div/div[2]'
        ).click();


        await page.locator(
            '#divreportcontent'
        ).waitFor({
            state: 'visible'
        });


        await page.waitForResponse(response =>
            response.url().includes(
                '/api/searchtypeCount/'
            ) &&
            response.status() === 200
        );


        const value =
            await page.locator(
                '#sptotalUsers'
            ).textContent();

        console.log(
            'Search result count:',
            value
        );


        const highlightedSpan =
            page.locator(
                '#basetable tbody tr td span.highlightedsearch'
            ).filter({
                hasText: new RegExp(searchValue, 'i')
            });


        await expect(
            highlightedSpan.first()
        ).toBeVisible();


        const cells =
            page.locator(
                '#basetable tbody tr td:has(span.highlightedsearch)'
            );


        const allTexts =
            await cells.allTextContents();


        const wordsContainingAb =
            allTexts
                .map(text => text.trim())
                .filter(
                    text =>
                        text.length > 0
                );


        console.log(
            'Consolidated search results:',
            wordsContainingAb,
            'Search value:',
            searchValue
        );


        expect(
            wordsContainingAb.length
        ).toBeGreaterThan(0);


        await page.waitForTimeout(3000);

    }
);


// ============================================================
// TEST 10
// MULTI-SELECT FILTER CONTROLS
//
// Everything here remains dynamically discovered.
// No field names are hardcoded.
// *** Controls exist and are dynamically discoverable
// ============================================================

test(
    '10 - Multi-Select - Dynamic filter controls are available',
    async ({ page }) => {

        await loadEmployeesReport(page);

        await openFilterBar(page);


        await page.locator(
            "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
        ).click();


        await expect(
            page.locator('.fieldsfilterbar')
        ).toBeVisible();


        const inputs =
            page.locator(
                '.fieldsfilterbar input[type="text"]'
            );


        const placeholders =
            await inputs.evaluateAll(elements =>
                elements.map(
                    el => el.placeholder
                )
            );


        const inputIds =
            await inputs.evaluateAll(elements =>
                elements.map(
                    el => el.id
                )
            );


        const autocompleteValues =
            await inputs.evaluateAll(elements =>
                elements.map(
                    el =>
                        el.getAttribute(
                            'data-multipleselect-autocomplete'
                        )
                )
            );


        console.log(
            'Filter Input IDs:',
            inputIds
        );


        console.log(
            'Filter Placeholders:',
            placeholders
        );


        console.log(
            'Dynamic Filter Fields:',
            autocompleteValues
        );


        expect(inputIds.length)
            .toBeGreaterThan(0);


        expect(autocompleteValues.length)
            .toBe(inputIds.length);
            await page.waitForTimeout(3000);
    }
);


// ============================================================
// TEST 11
// DYNAMIC MULTI-COLUMN FILTER
//
// THIS IS YOUR ORIGINAL LOOP.
// NOTHING IS HARD-CODED.
// *** Each individual field can filter correctly
// ============================================================


test(
    '11 - Multi-Column Filter - Dynamic fields return matching results',
    async ({ page }) => {

        test.setTimeout(600000);

        await loadEmployeesReport(page);

        const {
            firstCharacters
        } = await getFirstRowData(page);

        await openFilterBar(page);

        await page.locator(
            "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
        ).click();

        await expect(
            page.locator('.fieldsfilterbar')
        ).toBeVisible();

        const inputs =
            page.locator(
                '.fieldsfilterbar input[data-multipleselect-autocomplete]'
            );

        const inputIds =
            await inputs.evaluateAll(elements =>
                elements.map(
                    element => element.id
                )
            );

        const autocompleteValues =
            await inputs.evaluateAll(elements =>
                elements.map(
                    element =>
                        element.getAttribute(
                            'data-multipleselect-autocomplete'
                        )
                )
            );

        console.log(
            'Dynamic Filter Input IDs:',
            inputIds
        );

        console.log(
            'Dynamic Filter Fields:',
            autocompleteValues
        );

        expect(
            autocompleteValues.length
        ).toBeGreaterThan(0);

        const normalizeValue = value => {

            const cleaned =
                (value || '')
                    .replace(/^×/, '')
                    .trim();

            return cleaned.length
                ? cleaned.charAt(0).toUpperCase() +
                    cleaned.slice(1).toLowerCase()
                : cleaned;
        };

        for (
            let i = 0;
            i < autocompleteValues.length;
            i++
        ) {

            const currentInputId =
                inputIds[i];

            const currentAttrValue =
                autocompleteValues[i];

            console.log(
                `--- Processing Filter Field: ${currentAttrValue} ---`
            );

            if (!currentAttrValue) {
                console.log(
                    'Skipping filter without data-multipleselect-autocomplete'
                );
                continue;
            }

            const filterInput =
                page.locator(
                    `#${currentInputId}`
                );

            const firstCharacterToFill =
                firstCharacters[currentAttrValue]
                    ? firstCharacters[currentAttrValue].toLowerCase()
                    : 'a';

            const dropdown =
                page.locator(
                    `#dv_${currentAttrValue}:visible`
                ).first();

            await Promise.all([

                page.waitForResponse(response =>
                    response.url().includes(
                        '/api/searchtypegroupby'
                    ) &&
                    response.status() === 200
                ),

                filterInput.fill(
                    firstCharacterToFill
                )

            ]);

            await expect(
                dropdown
            ).toBeVisible();

            const availableOptions =
                dropdown.locator(
                    'div a.highlightselect'
                );

            const optionCount =
                await availableOptions.count();

            if (optionCount === 0) {

                console.log(
                    `[SKIP FIELD] ${currentAttrValue}: no autocomplete values generated`
                );

                continue;
            }

            const randomIndex =
                Math.floor(
                    Math.random() * optionCount
                );

            const option =
                availableOptions.nth(
                    randomIndex
                );

            const selectedValue =
                (
                    await option.textContent()
                ).trim();

            if (!selectedValue) {

                console.log(
                    `[SKIP FIELD] ${currentAttrValue}: autocomplete option has no value`
                );

                continue;
            }

            console.log(
                `[${currentAttrValue}] Randomly clicking index ${randomIndex}: "${selectedValue}"`
            );

            await option.click();

            // Verify selected chip using the same
            // proven pattern as Test 12.
            const chip =
                page.locator(
                    `#cltrl_filter_chips_${currentAttrValue}`
                ).filter({
                    hasText: selectedValue
                }).first();

            const actualChipValue =
                await chip.textContent();

            expect(
                normalizeValue(actualChipValue)
            ).toBe(
                normalizeValue(selectedValue)
            );

            await Promise.all([

                page.waitForResponse(response =>
                    response.url().includes(
                        '/api/searchtype/'
                    ) &&
                    response.status() === 200
                ),

                page.waitForResponse(response =>
                    response.url().includes(
                        '/api/searchtypeCount/'
                    ) &&
                    response.status() === 200
                ),

                page.locator(
                    "//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div"
                ).click()

            ]);

            await expect(
                page.locator('#sptotalUsers')
            ).not.toHaveText('0');

            const compareHeader =
                page.locator(
                    `#basetable thead tr th[data-field-header="${currentAttrValue}"]`
                );

            const compareColumnIndex =
                await compareHeader.evaluate(
                    element =>
                        element.cellIndex
                );

            const compareColumnCells =
                page.locator(
                    `#basetable tbody tr td:nth-child(${compareColumnIndex})`
                );

            const extractedTableTexts =
                await compareColumnCells.allTextContents();

            const cleanedTableNames =
                extractedTableTexts
                    .map(value => value.trim())
                    .filter(Boolean);

            const expectedValue =
                normalizeValue(
                    selectedValue
                );

            const unmatchedValues =
                cleanedTableNames.filter(
                    value =>
                        normalizeValue(value) !==
                        expectedValue
                );

            expect(
                unmatchedValues
            ).toEqual([]);

            console.log(
                `[PASS] All tabular results for "${currentAttrValue}" matched: "${selectedValue}"`
            );

            await page.waitForTimeout(2000);
        }
    }
);




// ============================================================
// TEST 12
// DYNAMIC FILTER PERMUTATIONS
// *** Combinations of fields work
// ============================================================


// ============================================================

test(
    '12 - Multi-Column Filter - Dynamic field permutations return results',
    async ({ page }) => {

        test.setTimeout(600000);

        await loadEmployeesReport(page);
        await openFilterBar(page);

        await page.locator(
            "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
        ).click();

        await expect(
            page.locator('.fieldsfilterbar')
        ).toBeVisible();

        const fieldKeys =
            await page.locator(
                '.fieldsfilterbar input[data-multipleselect-autocomplete]'
            ).evaluateAll(elements =>
                elements
                    .map(element =>
                        element.getAttribute(
                            'data-multipleselect-autocomplete'
                        )
                    )
                    .filter(Boolean)
            );

        expect(fieldKeys.length).toBeGreaterThan(0);

        const expectedPermutations =
            fieldKeys.length * fieldKeys.length;

        let completedPermutations = 0;
        let skippedPermutations = 0;
        let verifiedColumnAssertions = 0;
        let selectedValueCount = 0;

        const normalizeValue = value => {
            const cleaned = (value || '')
                .replace(/^×/, '')
                .trim();

            return cleaned.length
                ? cleaned.charAt(0).toUpperCase() +
                    cleaned.slice(1).toLowerCase()
                : cleaned;
        };

        await test.step(
            `Permutation summary: ${fieldKeys.length} fields | ${expectedPermutations} combinations planned | Fields: ${fieldKeys.join(', ')}`,
            async () => {}
        );

        for (const firstField of fieldKeys) {

            for (const secondField of fieldKeys) {

                await loadEmployeesReport(page);
                await openFilterBar(page);

                await page.locator(
                    "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
                ).click();

                await expect(
                    page.locator('.fieldsfilterbar')
                ).toBeVisible();

                const selectedFields = new Set([
                    firstField,
                    secondField
                ]);

                const selectedValuesByField = {};

                const permutationName =
                    `${firstField} and ${secondField}`;

                await test.step(
                    `Test filter combination: ${permutationName}`,
                    async () => {}
                );

                for (const fieldKey of selectedFields) {

                    const header =
                        page.locator(
                            `#basetable thead tr th[data-field-header="${fieldKey}"]`
                        );

                    const columnIndex =
                        await header.evaluate(
                            element => element.cellIndex
                        );

                    const columnValues =
                        await page.locator(
                            `#basetable tbody tr td:nth-child(${columnIndex})`
                        ).allTextContents();

                    const firstValue =
                        columnValues
                            .map(value => value.trim())
                            .find(value => value.length > 0);

                    expect(firstValue).toBeTruthy();

                    const searchCharacter =
                        firstValue.charAt(0).toLowerCase();

                    const filterInput =
                        page.locator(
                            `.fieldsfilterbar input[data-multipleselect-autocomplete="${fieldKey}"]`
                        );

                    const dropdown =
                        page.locator(
                            `#dv_${fieldKey}:visible`
                        ).first();

                    await test.step(
                        `${fieldKey}: find a value starting with "${searchCharacter}"`,
                        async () => {

                            await Promise.all([
                                page.waitForResponse(response =>
                                    response.url().includes(
                                        '/api/searchtypegroupby'
                                    ) &&
                                    response.status() === 200
                                ),
                                filterInput.fill(searchCharacter)
                            ]);

                            await expect(dropdown).toBeVisible();
                        }
                    );

                    const availableOptions =
                        dropdown.locator(
                            'div a.highlightselect'
                        );

                    const optionCount =
                        await availableOptions.count();

                    /*
                     * No autocomplete option is a valid condition.
                     * It means there is no matching data for this field.
                     */
                    if (optionCount === 0) {

                        console.log(
                            `[SKIP FIELD] ${fieldKey}: no matching autocomplete value for "${searchCharacter}"`
                        );

                        continue;
                    }

                    const option =
                        availableOptions.first();

                    const selectedValue =
                        (
                            await option.textContent()
                        ).trim();

                    if (!selectedValue) {
                        console.log(
                            `[SKIP FIELD] ${fieldKey}: autocomplete option has no value`
                        );

                        continue;
                    }

                    await test.step(
                        `${fieldKey}: select "${selectedValue}"`,
                        async () => {

                            await option.click();

                            const chip =
                                page.locator(
                                    `#cltrl_filter_chips_${fieldKey}`
                                ).filter({
                                    hasText: selectedValue
                                }).first();

                            const actualChipValue =
                                await chip.textContent();

                            expect(
                                normalizeValue(actualChipValue)
                            ).toBe(
                                normalizeValue(selectedValue)
                            );
                        }
                    );

                    selectedValuesByField[fieldKey] = [
                        selectedValue
                    ];

                    selectedValueCount++;
                }

                /*
                 * If neither field produced an autocomplete value,
                 * there is nothing to filter. This permutation is valid
                 * but skipped.
                 */
                if (
                    Object.keys(selectedValuesByField).length === 0
                ) {

                    skippedPermutations++;

                    console.log(
                        `[SKIP] Filter permutation: ${firstField} -> ${secondField} | no autocomplete data`
                    );

                    continue;
                }

                await test.step(
                    `Apply ${permutationName} filters and verify matching employees`,
                    async () => {

                        await Promise.all([
                            page.waitForResponse(response =>
                                response.url().includes(
                                    '/api/searchtype/'
                                ) &&
                                response.status() === 200
                            ),

                            page.waitForResponse(response =>
                                response.url().includes(
                                    '/api/searchtypeCount/'
                                ) &&
                                response.status() === 200
                            ),

                            page.locator(
                                "//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div"
                            ).click()
                        ]);

                        await expect(
                            page.locator('#sptotalUsers')
                        ).not.toHaveText('0');

                        for (
                            const [
                                fieldKey,
                                selectedValues
                            ]
                            of Object.entries(
                                selectedValuesByField
                            )
                        ) {

                            const header =
                                page.locator(
                                    `#basetable thead tr th[data-field-header="${fieldKey}"]`
                                );

                            const columnIndex =
                                await header.evaluate(
                                    element => element.cellIndex
                                );

                            const tableValues =
                                await page.locator(
                                    `#basetable tbody tr td:nth-child(${columnIndex})`
                                ).allTextContents();

                            const allowedValues =
                                selectedValues.map(
                                    value =>
                                        normalizeValue(value)
                                );

                            const unmatchedValues =
                                tableValues
                                    .map(value => value.trim())
                                    .filter(Boolean)
                                    .filter(value =>
                                        !allowedValues.includes(
                                            normalizeValue(value)
                                        )
                                    );

                            expect(unmatchedValues).toEqual([]);

                            verifiedColumnAssertions++;
                        }
                    }
                );

                completedPermutations++;

                console.log(
                    `[PASS] Multi-select permutation: ${firstField} -> ${secondField}`
                );
            }
        }

        const sameFieldPermutations =
            fieldKeys.length;

        const crossFieldPermutations =
            expectedPermutations -
            sameFieldPermutations;

        const evaluatedPermutations =
            completedPermutations +
            skippedPermutations;

        const passPercentage =
            expectedPermutations > 0
                ? Math.round(
                    evaluatedPermutations /
                    expectedPermutations *
                    100
                )
                : 0;

        await test.step(
            `Permutation summary: ${completedPermutations}/${expectedPermutations} combinations passed | ${skippedPermutations} skipped | ${passPercentage}% evaluated | ${sameFieldPermutations} same-field cases | ${crossFieldPermutations} cross-field cases | ${verifiedColumnAssertions} table-column assertions | ${selectedValueCount} autocomplete values selected`,
            async () => {}
        );

        await page.waitForTimeout(3000);
    }
);




// ============================================================
// TEST 13
// DYNAMIC MULTI-SELECT FILTER PERMUTATIONS
// ** Combinations of fields + multiple selected values work
// ============================================================

test(
    '13 - Multi-Column Filter - Dynamic multi-select permutations return results',
    async ({ page }) => {

        test.setTimeout(600000);

        await loadEmployeesReport(page);

        await openFilterBar(page);

        await page.locator(
            "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
        ).click();

        await expect(
            page.locator('.fieldsfilterbar')
        ).toBeVisible();


        const fieldKeys =
            await page.locator(
                '.fieldsfilterbar input[data-multipleselect-autocomplete]'
            ).evaluateAll(elements =>
                elements
                    .map(element =>
                        element.getAttribute(
                            'data-multipleselect-autocomplete'
                        )
                    )
                    .filter(Boolean)
            );


        expect(fieldKeys.length)
            .toBeGreaterThan(0);


        const expectedPermutations =
            fieldKeys.length * fieldKeys.length;

        let completedPermutations = 0;
        let selectedValueCount = 0;
        let verifiedColumnAssertions = 0;


        await test.step(
            `Permutation leaderboard: ${fieldKeys.length} fields | ${expectedPermutations} combinations planned | Fields: ${fieldKeys.join(', ')}`,
            async () => {}
        );


        for (const firstField of fieldKeys) {
            for (const secondField of fieldKeys) {

                await loadEmployeesReport(page);

                await openFilterBar(page);

                await page.locator(
                    "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
                ).click();

                await expect(
                    page.locator('.fieldsfilterbar')
                ).toBeVisible();


                const selectedFields = new Set([
                    firstField,
                    secondField
                ]);

                const selectedValuesByField = {};


                const permutationName =
                    `${firstField} and ${secondField}`;


                await test.step(
                    `Test filter combination: ${permutationName}`,
                    async () => {}
                );


                for (const fieldKey of selectedFields) {

                    const header =
                        page.locator(
                            `#basetable thead tr th[data-field-header="${fieldKey}"]`
                        );

                    const columnIndex =
                        await header.evaluate(
                            element => element.cellIndex
                        );

                    const columnValues =
                        await page.locator(
                            `#basetable tbody tr td:nth-child(${columnIndex})`
                        ).allTextContents();

                    const searchCharacter =
                        columnValues
                            .map(value => value.trim())
                            .find(value => value.length > 0)
                            .charAt(0)
                            .toLowerCase();

                    const filterInput =
                        page.locator(
                            `.fieldsfilterbar input[data-multipleselect-autocomplete="${fieldKey}"]`
                        );

                    const dropdown =
                        page.locator(
                            `#dv_${fieldKey}:visible`
                        ).first();

                    const selectedValues = [];


                    for (let selectionIndex = 0; selectionIndex < 2; selectionIndex++) {

                        await test.step(
                            `${fieldKey}: find a value starting with "${searchCharacter}"`,
                            async () => {
                                await Promise.all([
                                    page.waitForResponse(response =>
                                        response.url().includes(
                                            '/api/searchtypegroupby'
                                        ) &&
                                        response.status() === 200
                                    ),
                                    filterInput.fill(searchCharacter)
                                ]);

                                await expect(dropdown).toBeVisible();
                            }
                        );


                        const availableOptions =
                            dropdown.locator(
                                'div a.highlightselect'
                            );


                        const optionCount =
                            await availableOptions.count();


                        if (optionCount === 0) {
                            break;
                        }


                        let selectedValue = '';

                        for (let optionIndex = 0; optionIndex < optionCount; optionIndex++) {
                            const candidateValue =
                                (await availableOptions
                                    .nth(optionIndex)
                                    .textContent()).trim();

                            if (
                                candidateValue &&
                                !selectedValues.includes(candidateValue)
                            ) {
                                selectedValue = candidateValue;
                                break;
                            }
                        }


                        if (!selectedValue) {
                            break;
                        }


                        const option =
                            availableOptions.filter({
                                hasText: selectedValue
                            }).first();


                        await test.step(
                            `${fieldKey}: select "${selectedValue}"`,
                            async () => {
                                await option.click();

                                selectedValues.push(selectedValue);

                                const normalizeValue = value => {
                                const cleaned = value
                                .replace(/^×/, '')
                                .trim();

                                return cleaned.length
                                ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
                                : cleaned;
                                };

                                const expectedValue = normalizeValue(selectedValue);

                                const actualValue = await page.locator(
                                `#cltrl_filter_chips_${fieldKey}`
                                ).filter({
                                hasText: selectedValue
                                }).first().textContent();

                                expect(normalizeValue(actualValue)).toBe(expectedValue);
                                                    }
                                                );
                                }

                        console.log('FIELD:', fieldKey);
                        console.log('SELECTED VALUES:', selectedValues);

                        if (selectedValues.length === 0) {
                        console.log(
                        `[SKIP] ${fieldKey}: no matching autocomplete values exist`
                        );
                        continue;
                        }

                        selectedValueCount += selectedValues.length;
                        selectedValuesByField[fieldKey] = selectedValues;
                }


                await test.step(
                    `Apply ${permutationName} filters and verify matching employees`,
                    async () => {
                        await Promise.all([
                            page.waitForResponse(response =>
                                response.url().includes('/api/searchtype/') &&
                                response.status() === 200
                            ),
                            page.waitForResponse(response =>
                                response.url().includes('/api/searchtypeCount/') &&
                                response.status() === 200
                            ),
                            page.locator(
                                "//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div"
                            ).click()
                        ]);


                        await expect(
                            page.locator('#sptotalUsers')
                        ).not.toHaveText('0');


                        for (const [fieldKey, selectedValues] of Object.entries(
                            selectedValuesByField
                        )) {
                            const header =
                                page.locator(
                                    `#basetable thead tr th[data-field-header="${fieldKey}"]`
                                );

                            const columnIndex =
                                await header.evaluate(
                                    element => element.cellIndex
                                );

                            const tableValues =
                                await page.locator(
                                    `#basetable tbody tr td:nth-child(${columnIndex})`
                                ).allTextContents();

                            const allowedValues =
                                selectedValues.map(value =>
                                    value.trim().toLowerCase()
                                );

                            const unmatchedValues =
                                tableValues
                                    .map(value => value.trim())
                                    .filter(Boolean)
                                    .filter(value =>
                                        !allowedValues.includes(
                                            value.toLowerCase()
                                        )
                                    );

                            expect(unmatchedValues).toEqual([]);

                            verifiedColumnAssertions++;
                        }
                    }
                );


                completedPermutations++;


                console.log(
                    `[PASS] Multi-select permutation: ${firstField} -> ${secondField}`
                );
            }
        }


        const sameFieldPermutations =
            fieldKeys.length;

        const crossFieldPermutations =
            expectedPermutations - sameFieldPermutations;

        const passPercentage =
            Math.round(
                completedPermutations / expectedPermutations * 100
            );


        await test.step(
            `Permutation leaderboard: ${completedPermutations}/${expectedPermutations} combinations passed (${passPercentage}%) | ${sameFieldPermutations} same-field cases | ${crossFieldPermutations} cross-field cases | ${verifiedColumnAssertions} table-column assertions | ${selectedValueCount} autocomplete values selected`,
            async () => {}
        );


        await page.waitForTimeout(3000);
    }
);


// ============================================================
// TEST 14
// DYNAMIC COLUMN SORTING
// ============================================================

test(
    '14 - Multi-Column Sort - Dynamic fields sort ascending and descending',
    async ({ page }) => {

        await loadEmployeesReport(page);


        const headers =
            page.locator(
                '#basetable thead tr th[data-field-header]'
            );


        const fieldKeys =
            await headers.evaluateAll(elements =>
                elements.map(
                    element =>
                        element.getAttribute('data-field-header')
                )
            );


        expect(fieldKeys.length)
            .toBeGreaterThan(0);


        for (const fieldKey of fieldKeys) {

            const header =
                page.locator(
                    `#basetable thead tr th[data-field-header="${fieldKey}"]`
                );


            const assertSortRequest = async (expectedOrder) => {
                const [request] = await Promise.all([
                    page.waitForRequest(request =>
                        request.url().includes('/api/searchtype/') &&
                        request.method() === 'POST'
                    ),
                    page.waitForResponse(response =>
                        response.url().includes('/api/searchtype/') &&
                        response.status() === 200
                    ),
                    header.click()
                ]);

                const payload = request.postDataJSON();

                expect(payload.sortcolumn)
                    .toBe(fieldKey);

                expect(payload.sortcolumnorder.toUpperCase())
                    .toBe(expectedOrder);
            };


            await assertSortRequest('DESC');


            await assertSortRequest('ASC');

            console.log(
                `[PASS] Dynamic column sorted ascending and descending: ${fieldKey}`
            );
        }


        await page.waitForTimeout(3000);
    }
);


// ============================================================
// TEST 15
// FILTER BAR SCREENSHOT / FINAL UI STATE
// ============================================================

test(
    '15 - Employees - Filtered report UI is displayed correctly',
    async ({ page }) => {

        await loadEmployeesReport(page);

        await openFilterBar(page);


        await page.screenshot({
            path:
                'playwright/screenshots/employees-date-filtered.png',
            fullPage: true
        });


        await expect(
            page.locator('#dvfilterbar').first()
        ).toBeVisible();


        await expect(
            page.locator('#basetable')
        ).toBeVisible();
    }
);


// ============================================================
// TEST 16
// CRUD - CREATE EMPLOYEE
//
// Driven by validationmap.
// No employee field names are hardcoded in the control logic.
function generateRandomAlphabetic(maxLength) {

    const alphabet =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const length = Math.min(
        maxLength,
        Math.floor(Math.random() * 6) + 5
    );

    let value = '';

    for (let i = 0; i < length; i++) {
        value += alphabet.charAt(
            Math.floor(Math.random() * alphabet.length)
        );
    }

    return value;
}

// ============================================================
function generateTestValue(field) {

    const {
        fieldvalidatename,
        fieldmaxlength
    } = field;

    const maxLength =
        Number(fieldmaxlength) || 45;

    switch (fieldvalidatename.toLowerCase()) {

        case 'string':

           return generateRandomAlphabetic(maxLength);

        case 'alphanumeric':

            return 'A1'.repeat(
                Math.ceil(
                    Math.min(maxLength, 10) / 2
                )
            ).substring(
                0,
                maxLength
            );

        case 'number':

            return '123';

        case 'integer':

            return '123';

        case 'decimal':

            return '123.45';

        case 'date':

            return '01-11-1990';

        case 'boolean':

            return true;

        default:

            throw new Error(
                `Unsupported field validation type: ${fieldvalidatename}`
            );
    }
}


test('16 - CRUD - Create Employee using validationmap', async ({ page }) => {

    // ------------------------------------------------------------
    // Load the Employees report
    // ------------------------------------------------------------

    await loadEmployeesReport(page);


    // ------------------------------------------------------------
    // Open the Create Employee modal
    // ------------------------------------------------------------

    await page.locator(
        'xpath=/html/body/div[2]/div[2]/section/div[1]/div[2]/div[1]/div[2]/div[1]/div/a'
    ).click();


    // ------------------------------------------------------------
    // Generate and fill all fields dynamically from validationmap
    // ------------------------------------------------------------

    const createdValues = {};

    for (const field of validationConfig.validationmap) {

        const { inputname } = field;

        const control = page.locator(
            `[data-key-type="${inputname}"]`
        );

        await expect(control).toBeVisible();

        const value = String(
            generateTestValue(field)
        );

        await control.pressSequentially(value);

        createdValues[inputname] = value;
    }


    // ------------------------------------------------------------
    // Enable Record State
    // ------------------------------------------------------------

    const recordStateInput =
        page.locator('#cltrlrecordstate');

    const recordStateControl =
        page.locator(
            'xpath=/html/body/div[3]/div/div/div[2]/div[1]/form/div/div[5]/div/div/label/div'
        );

    await expect(recordStateControl).toBeVisible();

    if (!(await recordStateInput.isChecked())) {
        await recordStateControl.click();
    }

    await expect(recordStateInput).toBeChecked();

    createdValues.recordstate = true;


    // ------------------------------------------------------------
    // Submit the Create Employee form
    // ------------------------------------------------------------

    const submitButton =
        page.locator('#btnmodalsub');

    await expect(submitButton).toBeEnabled();


    // ------------------------------------------------------------
    // Wait for Create and SearchType APIs
    // ------------------------------------------------------------

    const [
        createResponse,
        searchTypeResponse
    ] = await Promise.all([

        page.waitForResponse(
            r =>
                r.url().includes('/employees/api/create/') &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        page.waitForResponse(
            r =>
                r.url().includes('/employees/api/searchtype/') &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        submitButton.click()
    ]);


    // ------------------------------------------------------------
    // Wait for the refreshed Employees table
    // ------------------------------------------------------------

    await expect(
        page.locator('#basetable')
    ).toBeVisible();


    // ------------------------------------------------------------
    // Dynamically identify the newly created row
    //
    // Use the first configured validationmap field as the
    // unique anchor. No business field name is hardcoded.
    // ------------------------------------------------------------

    const anchorField =
        validationConfig.validationmap[0];

    const anchorFieldName =
        anchorField.inputname;

    const anchorValue =
        createdValues[anchorFieldName];

    const createdRow =
        page.locator('#basetable tbody tr')
            .filter({
                hasText: anchorValue
            })
            .first();

    await expect(createdRow).toBeVisible();


    // ------------------------------------------------------------
    // Verify every field configured in validationmap
    // ------------------------------------------------------------

    for (const field of validationConfig.validationmap) {

        const {
            inputname,
            fieldtypename
        } = field;


        // --------------------------------------------------------
        // Get expected value
        // --------------------------------------------------------

        let expectedValue =
            createdValues[inputname];


        // --------------------------------------------------------
        // Convert DATE input into the table's display format
        // --------------------------------------------------------

        if (
            fieldtypename === 'DATE' &&
            expectedValue
        ) {

            const [
                day,
                month,
                year
            ] = expectedValue.split('-');

            expectedValue =
                new Date(
                    year,
                    month - 1,
                    day
                ).toLocaleDateString(
                    'en-GB',
                    {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }
                );
        }


        // --------------------------------------------------------
        // Find the matching table column dynamically
        // --------------------------------------------------------

        const header =
            page.locator(
                `#basetable thead tr th[data-field-header="${inputname}"]`
            );

        await expect(header).toBeVisible();


        // --------------------------------------------------------
        // Map the header column to the corresponding row cell
        // --------------------------------------------------------
        
        const headerIndex =
            await header.evaluate(
                el => el.cellIndex
            );

        const cell =
            createdRow
                .locator('td')
                .nth(headerIndex - 1);


        // --------------------------------------------------------
        // Read actual table value
        // --------------------------------------------------------

        const actualValue =
            (await cell.innerText()).trim();


        // --------------------------------------------------------
        // Verify expected vs actual
        // --------------------------------------------------------

        console.log(
            `[CRUD VERIFY] ${inputname} | Expected: "${expectedValue}" | Actual: "${actualValue}"`
        );

        expect(actualValue).toBe(expectedValue);
    }


    console.log(
        '[PASS] CRUD Create - Employee created and verified successfully'
    );
});

test(
    '17 - data Form - dynamic field cartesian product validation using validationmap',
    async ({ page }) => {

        await loadEmployeesReport(page);


        // ------------------------------------------------------------
        // Open the Create Employee modal
        // ------------------------------------------------------------

        await page.locator(
            'xpath=/html/body/div[2]/div[2]/section/div[1]/div[2]/div[1]/div[2]/div[1]/div/a'
        ).click();


        // ------------------------------------------------------------
        // Get fields dynamically from validationmap
        // ------------------------------------------------------------

        const fields =
            validationConfig.validationmap;


        // ------------------------------------------------------------
        // Generate Cartesian product dynamically
        //
        // N validation fields = N × N combinations
        // ------------------------------------------------------------

        const combinations =
            fields.flatMap(field =>
                fields.map(otherField => [
                    field,
                    otherField
                ])
            );


        console.log(
            `[VALIDATION] Fields: ${fields.length}`
        );

        console.log(
            `[VALIDATION] Combinations: ${combinations.length}`
        );


        // ------------------------------------------------------------
        // Execute every validation combination
        // ------------------------------------------------------------

        for (const combination of combinations) {

            console.log(
                `[VALIDATION] Combination: ${combination
                    .map(field => field.inputname)
                    .join(' + ')}`
            );


            // --------------------------------------------------------
            // Fill every field participating in this combination
            // --------------------------------------------------------

            for (const field of combination) {

                const control =
                    page.locator(
                        `[data-key-type="${field.inputname}"]`
                    );

                await expect(control).toBeVisible();

                const value =
                    String(
                        generateTestValue(field)
                    );

                await control.pressSequentially(value);
            }


            // --------------------------------------------------------
            // Clear every field participating in this combination
            //
            // Use Set so the same field is cleared only once when
            // the Cartesian product contains the same field twice.
            // --------------------------------------------------------

            const fieldsToValidate =
                [...new Map(
                    combination.map(field => [
                        field.inputname,
                        field
                    ])
                ).values()];


            for (const field of fieldsToValidate) {

                const control =
                    page.locator(
                        `[data-key-type="${field.inputname}"]`
                    );

                await control.press('Meta+A');
                await control.press('Backspace');


                // ----------------------------------------------------
                // Verify validation message for this field
                // ----------------------------------------------------

                await expect(
                    page.locator(
                        `#lblmsg${field.inputname}`
                    )
                ).toBeVisible();
            }


            // --------------------------------------------------------
            // Submit must remain disabled while validation errors
            // exist for the current combination
            // --------------------------------------------------------

            await expect(
                page.locator('#btnmodalsub')
            ).toBeDisabled();


            // --------------------------------------------------------
            // Reset all fields participating in this combination
            // before starting the next combination
            // --------------------------------------------------------

            for (const field of fieldsToValidate) {

                const control =
                    page.locator(
                        `[data-key-type="${field.inputname}"]`
                    );

                await control.fill('');
            }
        }
    }
);

test('18 - CRUD - Create and Update Employee using validationmap', async ({ page }) => {

    // ------------------------------------------------------------
    // Load the Employees report
    // ------------------------------------------------------------

    await loadEmployeesReport(page);


    // ------------------------------------------------------------
    // Open the Create Employee modal
    // ------------------------------------------------------------

    await page.locator(
        'xpath=/html/body/div[2]/div[2]/section/div[1]/div[2]/div[1]/div[2]/div[1]/div/a'
    ).click();


    // ------------------------------------------------------------
    // CREATE
    // Generate and fill all fields dynamically
    // ------------------------------------------------------------

    const createdValues = {};

    for (const field of validationConfig.validationmap) {

        const { inputname } = field;

        const control = page.locator(
            `[data-key-type="${inputname}"]`
        );

        await expect(control).toBeVisible();

        const value = String(
            generateTestValue(field)
        );

        await control.pressSequentially(value);

        createdValues[inputname] = value;
    }


    // ------------------------------------------------------------
    // Enable Record State
    // ------------------------------------------------------------

    const recordStateInput =
        page.locator('#cltrlrecordstate');

    const recordStateControl =
        page.locator(
            'xpath=/html/body/div[3]/div/div/div[2]/div[1]/form/div/div[5]/div/div/label/div'
        );

    await expect(recordStateControl).toBeVisible();

    if (!(await recordStateInput.isChecked())) {
        await recordStateControl.click();
    }

    await expect(recordStateInput).toBeChecked();

    createdValues.recordstate = true;


    // ------------------------------------------------------------
    // Submit CREATE
    // ------------------------------------------------------------

    const submitButton =
        page.locator('#btnmodalsub');

    await expect(submitButton).toBeEnabled();


    const [
        createResponse,
        searchTypeResponse
    ] = await Promise.all([

        page.waitForResponse(
            r =>
                r.url().includes('/employees/api/create/') &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        page.waitForResponse(
            r =>
                r.url().includes('/employees/api/searchtype/') &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        submitButton.click()
    ]);


    // ------------------------------------------------------------
    // Wait for refreshed table
    // ------------------------------------------------------------

    await expect(
        page.locator('#basetable')
    ).toBeVisible();


    // ------------------------------------------------------------
    // Dynamically identify created row
    // ------------------------------------------------------------

    const anchorField =
        validationConfig.validationmap[0];

    const anchorFieldName =
        anchorField.inputname;

    const anchorValue =
        createdValues[anchorFieldName];

    let employeeRow =
        page.locator('#basetable tbody tr')
            .filter({
                hasText: anchorValue
            })
            .first();

    await expect(employeeRow).toBeVisible();


    // ------------------------------------------------------------
    // VERIFY CREATE
    // ------------------------------------------------------------

    for (const field of validationConfig.validationmap) {

        const {
            inputname,
            fieldtypename
        } = field;

        let expectedValue =
            createdValues[inputname];

        if (
            fieldtypename === 'DATE' &&
            expectedValue
        ) {

            const [
                day,
                month,
                year
            ] = expectedValue.split('-');

            expectedValue =
                new Date(
                    year,
                    month - 1,
                    day
                ).toLocaleDateString(
                    'en-GB',
                    {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }
                );
        }

        const header =
            page.locator(
                `#basetable thead tr th[data-field-header="${inputname}"]`
            );

        await expect(header).toBeVisible();

        const headerIndex =
            await header.evaluate(
                el => el.cellIndex
            );

        const cell =
            employeeRow
                .locator('td')
                .nth(headerIndex - 1);

        const actualValue =
            (await cell.innerText()).trim();

        console.log(
            `[CREATE VERIFY] ${inputname} | Expected: "${expectedValue}" | Actual: "${actualValue}"`
        );

        expect(actualValue).toBe(expectedValue);
    }


    // ============================================================
    // UPDATE
    // ============================================================

    console.log(
        '[CRUD] Created record verified. Starting UPDATE...'
    );


    // ------------------------------------------------------------
    // Click EDIT for the created row
    //
    // Replace this selector ONLY if your application's edit
    // control uses a different attribute.
    // ------------------------------------------------------------

    const editButton =
        employeeRow.locator(
            'td[data-tbledit-type] a'
        ).first();

    await expect(editButton).toBeVisible();

    await editButton.click();


    // ------------------------------------------------------------
    // Verify edit modal is visible
    // ------------------------------------------------------------

    for (const field of validationConfig.validationmap) {

        const control =
            page.locator(
                `[data-key-type="${field.inputname}"]`
            );

        await expect(control).toBeVisible();
    }


    // ------------------------------------------------------------
    // Generate NEW values dynamically
    // ------------------------------------------------------------

    const updatedValues = {};

    for (const field of validationConfig.validationmap) {

        const { inputname } = field;

        const control =
            page.locator(
                `[data-key-type="${inputname}"]`
            );

        const value =
            String(
                generateTestValue(field)
            );

        await control.press('Meta+A');
        await control.press('Backspace');

        await control.pressSequentially(value);

        updatedValues[inputname] = value;
    }


    // ------------------------------------------------------------
    // Keep Record State enabled
    // ------------------------------------------------------------

    if (!(await recordStateInput.isChecked())) {
        await recordStateControl.click();
    }

    await expect(recordStateInput).toBeChecked();

    updatedValues.recordstate = true;


    // ------------------------------------------------------------
    // Submit UPDATE
    // ------------------------------------------------------------

    await expect(submitButton).toBeEnabled();


    const [
        updateResponse,
        updateSearchTypeResponse
    ] = await Promise.all([

        page.waitForResponse(
            r =>
                r.url().includes('/employees/api/update/') &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        page.waitForResponse(
            r =>
                r.url().includes('/employees/api/searchtype/') &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        submitButton.click()
    ]);


    // ------------------------------------------------------------
    // Wait for refreshed table
    // ------------------------------------------------------------

    await expect(
        page.locator('#basetable')
    ).toBeVisible();


    // ------------------------------------------------------------
    // Locate UPDATED row dynamically
    // Uses first validationmap field as anchor
    // ------------------------------------------------------------

    const updatedAnchorField =
        validationConfig.validationmap[0];

    const updatedAnchorValue =
        updatedValues[
            updatedAnchorField.inputname
        ];
 await page.waitForSelector('#basetable tbody tr');
    employeeRow =
        page.locator('#basetable tbody tr')
            .filter({
                hasText: updatedAnchorValue
            })
            .first();

    await expect(employeeRow).toBeVisible();


    // ------------------------------------------------------------
    // VERIFY UPDATE
    // Verify every validationmap field dynamically
    // ------------------------------------------------------------

    for (const field of validationConfig.validationmap) {

        const {
            inputname,
            fieldtypename
        } = field;

        let expectedValue =
            updatedValues[inputname];


        // --------------------------------------------------------
        // Convert DATE to table display format
        // --------------------------------------------------------

        if (
            fieldtypename === 'DATE' &&
            expectedValue
        ) {

            const [
                day,
                month,
                year
            ] = expectedValue.split('-');

            expectedValue =
                new Date(
                    year,
                    month - 1,
                    day
                ).toLocaleDateString(
                    'en-GB',
                    {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }
                );
        }


        // --------------------------------------------------------
        // Find table column dynamically
        // --------------------------------------------------------

        const header =
            page.locator(
                `#basetable thead tr th[data-field-header="${inputname}"]`
            );

        await expect(header).toBeVisible();


        const headerIndex =
            await header.evaluate(
                el => el.cellIndex
            );


        const cell =
            employeeRow
                .locator('td')
                .nth(headerIndex - 1);


        const actualValue =
            (await cell.innerText()).trim();


        console.log(
            `[UPDATE VERIFY] ${inputname} | Expected: "${expectedValue}" | Actual: "${actualValue}"`
        );


        expect(actualValue).toBe(expectedValue);
    }


    console.log(
        '[PASS] CRUD Create + Update - Employee created, edited and verified successfully'
    );
});

test('19 - CRUD - Update each field individually using validationmap', async ({ page }) => {

    // ------------------------------------------------------------
    // Load Employees report
    // ------------------------------------------------------------

    await loadEmployeesReport(page);


    // ------------------------------------------------------------
    // CREATE baseline record
    // ------------------------------------------------------------

    await page.locator(
        'xpath=/html/body/div[2]/div[2]/section/div[1]/div[2]/div[1]/div[2]/div[1]/div/a'
    ).click();


    const originalValues = {};

    for (const field of validationConfig.validationmap) {

        const { inputname } = field;

        const control =
            page.locator(
                `[data-key-type="${inputname}"]`
            );

        await expect(control).toBeVisible();

        const value =
            String(generateTestValue(field));

        await control.pressSequentially(value);

        originalValues[inputname] = value;
    }


    // ------------------------------------------------------------
    // Record State
    // ------------------------------------------------------------

    const recordStateInput =
        page.locator('#cltrlrecordstate');

    const recordStateControl =
        page.locator(
            'xpath=/html/body/div[3]/div/div/div[2]/div[1]/form/div/div[5]/div/div/label/div'
        );

    if (!(await recordStateInput.isChecked())) {
        await recordStateControl.click();
    }

    await expect(recordStateInput).toBeChecked();


    // ------------------------------------------------------------
    // CREATE
    // ------------------------------------------------------------

    const submitButton =
        page.locator('#btnmodalsub');

    await Promise.all([

        page.waitForResponse(
            r =>
                r.url().includes('/employees/api/create/') &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        page.waitForResponse(
            r =>
                r.url().includes('/employees/api/searchtype/') &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        submitButton.click()
    ]);


    // ------------------------------------------------------------
    // Locate created row
    // ------------------------------------------------------------

    await expect(page.locator('#basetable')).toBeVisible();

    const anchorField =
        validationConfig.validationmap[0];

    const anchorFieldName =
        anchorField.inputname;

    let anchorValue =
        originalValues[anchorFieldName];


    // ------------------------------------------------------------
    // Format DATE exactly as displayed in table
    // ------------------------------------------------------------

    if (
        anchorField.fieldtypename === 'DATE' &&
        anchorValue
    ) {

        const [
            day,
            month,
            year
        ] = anchorValue.split('-');

        anchorValue =
            new Date(
                year,
                month - 1,
                day
            ).toLocaleDateString(
                'en-GB',
                {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }
            );
    }


    let employeeRow =
        page.locator('#basetable tbody tr')
            .filter({
                hasText: anchorValue
            })
            .first();

    await expect(employeeRow).toBeVisible();


    // ============================================================
    // UPDATE EACH FIELD INDIVIDUALLY
    // ============================================================

    for (const field of validationConfig.validationmap) {

        const {
            inputname
        } = field;


        console.log(
            `[PARTIAL UPDATE] Updating only: ${inputname}`
        );


        // --------------------------------------------------------
        // Open Edit
        // --------------------------------------------------------

        const editButton =
            employeeRow.locator(
                'td[data-tbledit-type] a'
            ).first();

        await expect(editButton).toBeVisible();

        await editButton.click();


        // --------------------------------------------------------
        // Verify edit form
        // --------------------------------------------------------

        for (const configuredField of validationConfig.validationmap) {

            await expect(
                page.locator(
                    `[data-key-type="${configuredField.inputname}"]`
                )
            ).toBeVisible();
        }


        // --------------------------------------------------------
        // Generate new value ONLY for current field
        // --------------------------------------------------------

        const control =
            page.locator(
                `[data-key-type="${inputname}"]`
            );

        const newValue =
            String(generateTestValue(field));


        await control.press('Meta+A');
        await control.press('Backspace');
        await control.pressSequentially(newValue);


        // --------------------------------------------------------
        // UPDATE
        // --------------------------------------------------------

        await expect(submitButton).toBeEnabled();

        await Promise.all([

            page.waitForResponse(
                r =>
                    r.url().includes('/employees/api/update/') &&
                    r.status() >= 200 &&
                    r.status() < 300
            ),

            page.waitForResponse(
                r =>
                    r.url().includes('/employees/api/searchtype/') &&
                    r.status() >= 200 &&
                    r.status() < 300
            ),

            submitButton.click()
        ]);


        // --------------------------------------------------------
        // Update expected state
        // --------------------------------------------------------

        const expectedValues = {
            ...originalValues,
            [inputname]: newValue
        };


        // --------------------------------------------------------
        // Locate updated row
        // --------------------------------------------------------

        let updatedAnchorValue =
            expectedValues[anchorFieldName];


        // --------------------------------------------------------
        // Format anchor DATE exactly as displayed in table
        // --------------------------------------------------------

        if (
            anchorField.fieldtypename === 'DATE' &&
            updatedAnchorValue
        ) {

            const [
                day,
                month,
                year
            ] = updatedAnchorValue.split('-');

            updatedAnchorValue =
                new Date(
                    year,
                    month - 1,
                    day
                ).toLocaleDateString(
                    'en-GB',
                    {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }
                );
        }


        employeeRow =
            page.locator('#basetable tbody tr')
                .filter({
                    hasText: updatedAnchorValue
                })
                .first();

        await expect(employeeRow).toBeVisible();


        // --------------------------------------------------------
        // VERIFY EVERY FIELD
        //
        // Current field = NEW value
        // Other fields  = ORIGINAL value
        // --------------------------------------------------------

        for (const verifyField of validationConfig.validationmap) {

            const verifyName =
                verifyField.inputname;

            let expectedValue =
                expectedValues[verifyName];


            // ----------------------------------------------------
            // Convert DATE for table display
            // ----------------------------------------------------

            if (
                verifyField.fieldtypename === 'DATE' &&
                expectedValue
            ) {

                const [
                    day,
                    month,
                    year
                ] = expectedValue.split('-');

                expectedValue =
                    new Date(
                        year,
                        month - 1,
                        day
                    ).toLocaleDateString(
                        'en-GB',
                        {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }
                    );
            }


            // ----------------------------------------------------
            // Find table column dynamically
            // ----------------------------------------------------

            const header =
                page.locator(
                    `#basetable thead tr th[data-field-header="${verifyName}"]`
                );

            await expect(header).toBeVisible();

            const headerIndex =
                await header.evaluate(
                    el => el.cellIndex
                );


            const actualValue =
                (
                    await employeeRow
                        .locator('td')
                        .nth(headerIndex - 1)
                        .innerText()
                ).trim();


            console.log(
                `[PARTIAL UPDATE VERIFY] ${verifyName} | Expected: "${expectedValue}" | Actual: "${actualValue}"`
            );


            expect(actualValue).toBe(expectedValue);
        }


        // --------------------------------------------------------
        // Persist new value for next iteration
        // --------------------------------------------------------

        originalValues[inputname] = newValue;
    }


    console.log(
        '[PASS] Test 19 - Every field updated individually and all untouched fields preserved'
    );
});
// ============================================================
// TEST 20
// FULL-WORD RANDOM-ROW FIELD PERMUTATIONS
//
// DIFFERENTIATOR:
// Tests 12 uses first-character search.
// Test 20 uses COMPLETE values taken from ONE RANDOM TABLE ROW.
//
// Example random row:
// first_name = Christopher
// last_name  = Smith
// gender     = M
//
// The complete values from that SAME row are used across the
// N x N field permutations.
// ============================================================

test(
    '20 - Multi-Column Filter - Full-word random-row field permutations',
    async ({ page }) => {

        test.setTimeout(600000);

        await loadEmployeesReport(page);

        await openFilterBar(page);

        await page.locator(
            "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
        ).click();

        await expect(
            page.locator('.fieldsfilterbar')
        ).toBeVisible();

        const fieldKeys =
            await page.locator(
                '.fieldsfilterbar input[data-multipleselect-autocomplete]'
            ).evaluateAll(elements =>
                elements
                    .map(element =>
                        element.getAttribute(
                            'data-multipleselect-autocomplete'
                        )
                    )
                    .filter(Boolean)
            );

        expect(fieldKeys.length).toBeGreaterThan(0);

        const normalizeValue = value => {

            const cleaned =
                (value || '')
                    .replace(/^×/, '')
                    .trim();

            return cleaned.length
                ? cleaned.charAt(0).toUpperCase() +
                    cleaned.slice(1).toLowerCase()
                : cleaned;
        };

        // ----------------------------------------------------
        // GET ALL TABLE ROWS
        // ----------------------------------------------------

        const tableRows =
            page.locator(
                '#basetable tbody tr'
            );

        const rowCount =
            await tableRows.count();

        expect(rowCount).toBeGreaterThan(0);

        // ----------------------------------------------------
        // PICK RANDOM ROW
        // ----------------------------------------------------

        const randomRowIndex =
            Math.floor(
                Math.random() * rowCount
            );

        const randomRow =
            tableRows.nth(
                randomRowIndex
            );

        console.log(
            `[RANDOM ROW] Selected table row index: ${randomRowIndex} of ${rowCount}`
        );

        // ----------------------------------------------------
        // EXTRACT COMPLETE VALUES FROM RANDOM ROW
        // ----------------------------------------------------

        const rowData = {};

        for (const fieldKey of fieldKeys) {

            const header =
                page.locator(
                    `#basetable thead tr th[data-field-header="${fieldKey}"]`
                );

            const columnIndex =
                await header.evaluate(
                    element =>
                        element.cellIndex
                );

            const value =
                (
                    await randomRow
                        .locator(
                            `td:nth-child(${columnIndex})`
                        )
                        .textContent()
                ).trim();

            if (value) {
                rowData[fieldKey] = value;
            }
        }

        console.log(
            '[RANDOM ROW DATA]',
            rowData
        );

        expect(
            Object.keys(rowData).length
        ).toBeGreaterThan(0);

        // ----------------------------------------------------
        // N x N FIELD PERMUTATIONS
        // ----------------------------------------------------

        const expectedPermutations =
            fieldKeys.length *
            fieldKeys.length;

        let completedPermutations = 0;
        let skippedPermutations = 0;

        for (const firstField of fieldKeys) {

            for (const secondField of fieldKeys) {

                if (
                    !rowData[firstField] ||
                    !rowData[secondField]
                ) {
                    skippedPermutations++;
                    continue;
                }

                await loadEmployeesReport(page);

                await openFilterBar(page);

                await page.locator(
                    "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
                ).click();

                await expect(
                    page.locator('.fieldsfilterbar')
                ).toBeVisible();

                const selectedFields =
                    [...new Set([
                        firstField,
                        secondField
                    ])];

                const selectedValuesByField = {};

                for (const fieldKey of selectedFields) {

                    const fullValue =
                        rowData[fieldKey];

                    const filterInput =
                        page.locator(
                            `.fieldsfilterbar input[data-multipleselect-autocomplete="${fieldKey}"]`
                        );

                    const dropdown =
                        page.locator(
                            `#dv_${fieldKey}:visible`
                        ).first();

                    // ------------------------------------------------
                    // FULL WORD SEARCH
                    // ------------------------------------------------

                    await Promise.all([

                        page.waitForResponse(response =>
                            response.url().includes(
                                '/api/searchtypegroupby'
                            ) &&
                            response.status() === 200
                        ),

                        filterInput.fill(fullValue)

                    ]);

                    await expect(
                        dropdown
                    ).toBeVisible();

                    const availableOptions =
                        dropdown.locator(
                            'div a.highlightselect'
                        );

                    const optionCount =
                        await availableOptions.count();

                    expect(
                        optionCount,
                        `${fieldKey}: no autocomplete values for "${fullValue}"`
                    ).toBeGreaterThan(0);

                    const matchingOption =
                        availableOptions
                            .filter({
                                hasText: fullValue
                            })
                            .first();

                    await expect(
                        matchingOption
                    ).toBeVisible();

                    const selectedValue =
                        (
                            await matchingOption.textContent()
                        ).trim();

                    await matchingOption.click();

                    const chip =
                        page.locator(
                            `#cltrl_filter_chips_${fieldKey}`
                        ).filter({
                            hasText: selectedValue
                        }).first();

                    const actualChipValue =
                        await chip.textContent();

                    expect(
                        normalizeValue(actualChipValue)
                    ).toBe(
                        normalizeValue(selectedValue)
                    );

                    selectedValuesByField[fieldKey] = [
                        selectedValue
                    ];
                }

                // ------------------------------------------------
                // APPLY
                // ------------------------------------------------

                await Promise.all([

                    page.waitForResponse(response =>
                        response.url().includes(
                            '/api/searchtype/'
                        ) &&
                        response.status() === 200
                    ),

                    page.waitForResponse(response =>
                        response.url().includes(
                            '/api/searchtypeCount/'
                        ) &&
                        response.status() === 200
                    ),

                    page.locator(
                        "//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div"
                    ).click()

                ]);

                await expect(
                    page.locator('#sptotalUsers')
                ).not.toHaveText('0');

                // ------------------------------------------------
                // VERIFY ALL SELECTED COLUMNS
                // ------------------------------------------------

                for (
                    const [
                        fieldKey,
                        selectedValues
                    ]
                    of Object.entries(
                        selectedValuesByField
                    )
                ) {

                    const header =
                        page.locator(
                            `#basetable thead tr th[data-field-header="${fieldKey}"]`
                        );

                    const columnIndex =
                        await header.evaluate(
                            element =>
                                element.cellIndex
                        );

                    const tableValues =
                        await page.locator(
                            `#basetable tbody tr td:nth-child(${columnIndex})`
                        ).allTextContents();

                    const expectedValue =
                        normalizeValue(
                            selectedValues[0]
                        );

                    const unmatchedValues =
                        tableValues
                            .map(value => value.trim())
                            .filter(Boolean)
                            .filter(value =>
                                normalizeValue(value) !==
                                expectedValue
                            );

                    expect(
                        unmatchedValues
                    ).toEqual([]);
                }

                completedPermutations++;

                console.log(
                    `[PASS] Random-row full-word permutation: ${firstField} + ${secondField}`
                );
            }
        }

        console.log(
            `[SUMMARY] Test 20: ${completedPermutations}/${expectedPermutations} permutations passed | ${skippedPermutations} skipped`
        );

        await page.waitForTimeout(3000);
    }
);


// ============================================================
// TEST 21
// FULL-WORD RANDOM-ROW MULTI-SELECT PERMUTATIONS
//
// DIFFERENTIATOR:
// Tests 13 uses first-character searches.
// Test 21 uses COMPLETE values.
//
// One RANDOM ROW supplies the primary value for every field.
// A second DISTINCT complete value is selected where available.
//
// Example:
//
// first_name = Christopher OR Michael
// gender     = M OR F
//
// Then all N x N field combinations are exercised.
// ============================================================
// ============================================================
// TEST 21
// FULL-WORD MULTI-SELECT N×N PERMUTATIONS
// Uses complete values from actual random table-row data.
// Existing Test 13 remains unchanged.
// ============================================================

// ============================================================
// TEST 21 - FULL-WORD MULTI-SELECT N×N PERMUTATIONS
// Uses complete values from a random table row.
// Existing Test 12 and Test 13 remain unchanged.
// ============================================================

// ============================================================
// TEST 21 - FULL-WORD MULTI-SELECT N×N PERMUTATIONS
// Uses complete values from a random table row.
// Existing Test 12 and Test 13 remain unchanged.
// ============================================================


test(
    '21 - Multi-Column Filter - Full-word random-row multi-select permutations',
    async ({ page }) => {

        test.setTimeout(600000);

        // ============================================================
        // HELPERS
        // ============================================================

        const normalizeValue = value =>
            (value || '')
                .trim()
                .toLowerCase();

        // ============================================================
        // INITIAL PAGE / FILTER SETUP
        // ============================================================

        await loadEmployeesReport(page);
        await openFilterBar(page);

        await page.locator(
            "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
        ).click();

        await expect(
            page.locator('.fieldsfilterbar')
        ).toBeVisible();

        // ============================================================
        // GET ALL MULTI-SELECT FIELDS
        // ============================================================

        const fieldKeys =
            await page.locator(
                '.fieldsfilterbar input[data-multipleselect-autocomplete]'
            ).evaluateAll(elements =>
                elements
                    .map(element =>
                        element.getAttribute(
                            'data-multipleselect-autocomplete'
                        )
                    )
                    .filter(Boolean)
            );

        expect(
            fieldKeys.length,
            'No multi-select fields found'
        ).toBeGreaterThan(0);

        console.log(
            `Multi-select fields: ${fieldKeys.join(', ')}`
        );

        // ============================================================
        // GET TABLE ROWS
        // ============================================================

        const tableRows =
            page.locator(
                '#basetable tbody tr'
            );

        const rowCount =
            await tableRows.count();

        expect(
            rowCount,
            'Employee table contains no rows'
        ).toBeGreaterThan(0);

        // ============================================================
        // SELECT ONE RANDOM TABLE ROW
        // ============================================================

        const randomRowIndex =
            Math.floor(
                Math.random() * rowCount
            );

        console.log(
            `Random table row: ${randomRowIndex + 1}/${rowCount}`
        );

        // ============================================================
        // CAPTURE RANDOM ROW DATA
        // AND ALL ACTUAL COLUMN VALUES
        // ============================================================

        const randomRowData = {};
        const allColumnValues = {};

        for (const fieldKey of fieldKeys) {

            const header =
                page.locator(
                    `#basetable thead tr th[data-field-header="${fieldKey}"]`
                );

            await expect(
                header,
                `${fieldKey}: table header not found`
            ).toBeVisible();

            const columnIndex =
                await header.evaluate(
                    element => element.cellIndex
                );

            const randomRowValue =
                (
                    await tableRows
                        .nth(randomRowIndex)
                        .locator(
                            `td:nth-child(${columnIndex})`
                        )
                        .textContent()
                ).trim();

            randomRowData[fieldKey] =
                randomRowValue;

            const columnValues =
                await page.locator(
                    `#basetable tbody tr td:nth-child(${columnIndex})`
                ).allTextContents();

            allColumnValues[fieldKey] =
                columnValues
                    .map(value => value.trim())
                    .filter(Boolean);

            console.log(
                `[RANDOM ROW] ${fieldKey}: "${randomRowValue}"`
            );
        }

        // ============================================================
        // PERMUTATIONS
        // ============================================================

        const expectedPermutations =
            fieldKeys.length *
            fieldKeys.length;

        let completedPermutations = 0;
        let skippedPermutations = 0;
        let verifiedColumnAssertions = 0;
        let selectedValueCount = 0;

        // ============================================================
        // TEST EVERY FIELD PERMUTATION
        // ============================================================

        for (const firstField of fieldKeys) {

            for (const secondField of fieldKeys) {

                // ----------------------------------------------------
                // LOAD CLEAN REPORT FOR EVERY PERMUTATION
                // ----------------------------------------------------

                await loadEmployeesReport(page);
                await openFilterBar(page);

                await page.locator(
                    "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
                ).click();

                await expect(
                    page.locator('.fieldsfilterbar')
                ).toBeVisible();

                // ----------------------------------------------------
                // SAME FIELD:
                //
                // first_name + first_name
                // => one field
                //
                // CROSS FIELD:
                //
                // first_name + last_name
                // => two fields
                // ----------------------------------------------------

                const selectedFields =
                    new Set([
                        firstField,
                        secondField
                    ]);

                const selectedValuesByField = {};

                console.log(
                    '------------------------------------------------------------'
                );

                console.log(
                    `Testing permutation: ${firstField} + ${secondField}`
                );

                // ====================================================
                // SELECT VALUES FOR EACH FIELD
                // ====================================================

                for (const fieldKey of selectedFields) {

                    const randomRowValue =
                        randomRowData[fieldKey];

                    if (!randomRowValue) {

                        console.log(
                            `[SKIP] ${fieldKey}: random row value is empty`
                        );

                        continue;
                    }

                    const actualValues =
                        allColumnValues[fieldKey] || [];

                    // ------------------------------------------------
                    // Find a second DISTINCT actual value.
                    //
                    // Case-insensitive comparison.
                    // ------------------------------------------------

                    const secondValue =
                        actualValues.find(
                            value =>
                                normalizeValue(value) !==
                                normalizeValue(randomRowValue)
                        );

                    if (!secondValue) {

                        console.log(
                            `[SKIP] ${fieldKey}: no second distinct actual value`
                        );

                        continue;
                    }

                    const valuesToSelect = [
                        randomRowValue,
                        secondValue
                    ];

                    const filterInput =
                        page.locator(
                            `.fieldsfilterbar input[data-multipleselect-autocomplete="${fieldKey}"]`
                        );

                    await expect(
                        filterInput,
                        `${fieldKey}: multi-select input not found`
                    ).toBeVisible();

                    // ------------------------------------------------
                    // IMPORTANT:
                    //
                    // Actual DOM:
                    //
                    // <div style="display:inline-block;">
                    //     <input ...>
                    //     <div id="cltrl_filter_chips_first_name">
                    //         <div class="selectchips">
                    //             ...
                    //         </div>
                    //     </div>
                    // </div>
                    //
                    // Therefore locate chips through the input's
                    // parent container rather than relying on the
                    // dynamic chip-container ID.
                    // ------------------------------------------------

                    const fieldContainer =
                        filterInput.locator('..');

                    const chips =
                        fieldContainer.locator(
                            '.selectchips'
                        );

                    const dropdown =
                        page.locator(
                            `#dv_${fieldKey}:visible`
                        ).first();

                    const selectedValues = [];

                    // =================================================
                    // SELECT TWO COMPLETE VALUES
                    // =================================================

                    for (const actualValue of valuesToSelect) {

                        console.log(
                            `[${fieldKey}] Searching autocomplete for: "${actualValue}"`
                        );

                        // ------------------------------------------------
                        // SEARCH USING COMPLETE VALUE
                        // ------------------------------------------------

                        await Promise.all([
                            page.waitForResponse(response =>
                                response.url().includes(
                                    '/api/searchtypegroupby'
                                ) &&
                                response.status() === 200
                            ),

                            filterInput.fill(
                                actualValue
                            )
                        ]);

                        await expect(
                            dropdown,
                            `${fieldKey}: autocomplete dropdown did not open for "${actualValue}"`
                        ).toBeVisible();

                        const availableOptions =
                            dropdown.locator(
                                'div a.highlightselect'
                            );

                        await expect(
                            availableOptions.first(),
                            `${fieldKey}: autocomplete returned no options for "${actualValue}"`
                        ).toBeVisible();

                        // ------------------------------------------------
                        // FIND AUTOCOMPLETE OPTION
                        //
                        // Case-insensitive exact logical comparison.
                        //
                        // Example:
                        //
                        // Expected: eRsJwGyn
                        // Actual:   Ersjwgyn
                        //
                        // These are treated as equal.
                        // ------------------------------------------------

                        const optionCount =
                            await availableOptions.count();

                        let matchingOption = null;
                        let matchingOptionText = '';

                        for (
                            let i = 0;
                            i < optionCount;
                            i++
                        ) {

                            const candidate =
                                availableOptions.nth(i);

                            const candidateText =
                                (
                                    await candidate.textContent()
                                ).trim();

                            console.log(
                                `[AUTOCOMPLETE CHECK] Expected: "${actualValue}" | Actual: "${candidateText}"`
                            );

                            if (
                                normalizeValue(candidateText) ===
                                normalizeValue(actualValue)
                            ) {

                                matchingOption =
                                    candidate;

                                matchingOptionText =
                                    candidateText;

                                break;
                            }
                        }

                        expect(
                            matchingOption,
                            `${fieldKey}: actual value "${actualValue}" not available in autocomplete`
                        ).not.toBeNull();

                        await expect(
                            matchingOption
                        ).toBeVisible();

                        // ------------------------------------------------
                        // VERIFY AUTOCOMPLETE VALUE
                        // ------------------------------------------------

                        expect(
                            normalizeValue(
                                matchingOptionText
                            ),
                            `${fieldKey}: autocomplete value "${matchingOptionText}" does not match "${actualValue}"`
                        ).toBe(
                            normalizeValue(actualValue)
                        );

                        // ------------------------------------------------
                        // SELECT AUTOCOMPLETE OPTION
                        // ------------------------------------------------

                        await matchingOption.click();

                        // =================================================
                        // VERIFY SELECTED CHIP
                        // =================================================
                        //
                        // DO NOT use:
                        //
                        // #cltrl_filter_chips_${fieldKey}
                        //
                        // because the application dynamically creates
                        // these IDs and they have previously produced
                        // duplicate-ID behavior.
                        //
                        // Instead:
                        //
                        // filter input
                        //      ↓
                        // parent container
                        //      ↓
                        // .selectchips
                        // =================================================

                        await expect
                            .poll(
                                async () => {

                                    const chipCount =
                                        await chips.count();

                                    for (
                                        let i = 0;
                                        i < chipCount;
                                        i++
                                    ) {

                                        const candidate =
                                            chips.nth(i);

                                        const candidateText =
                                            await candidate.evaluate(
                                                element => {

                                                    const clone =
                                                        element.cloneNode(
                                                            true
                                                        );

                                                    const removeSpan =
                                                        clone.querySelector(
                                                            '.select2choiceremove'
                                                        );

                                                    if (
                                                        removeSpan
                                                    ) {
                                                        removeSpan.remove();
                                                    }

                                                    return clone
                                                        .textContent
                                                        .trim();
                                                }
                                            );

                                        console.log(
                                            `[CHIP CHECK] Expected: "${actualValue}" | Actual: "${candidateText}"`
                                        );

                                        if (
                                            normalizeValue(
                                                candidateText
                                            ) ===
                                            normalizeValue(
                                                actualValue
                                            )
                                        ) {
                                            return true;
                                        }
                                    }

                                    return false;
                                },
                                {
                                    timeout: 5000,
                                    message:
                                        `${fieldKey}: selected chip not found for "${actualValue}"`
                                }
                            )
                            .toBe(true);

                        // ------------------------------------------------
                        // Now retrieve the matching chip again so we can
                        // perform the explicit visibility/value checks.
                        // ------------------------------------------------

                        const chipCount =
                            await chips.count();

                        let matchingChip = null;
                        let actualChipValue = '';

                        for (
                            let i = 0;
                            i < chipCount;
                            i++
                        ) {

                            const candidate =
                                chips.nth(i);

                            const candidateText =
                                await candidate.evaluate(
                                    element => {

                                        const clone =
                                            element.cloneNode(
                                                true
                                            );

                                        const removeSpan =
                                            clone.querySelector(
                                                '.select2choiceremove'
                                            );

                                        if (
                                            removeSpan
                                        ) {
                                            removeSpan.remove();
                                        }

                                        return clone
                                            .textContent
                                            .trim();
                                    }
                                );

                            if (
                                normalizeValue(
                                    candidateText
                                ) ===
                                normalizeValue(
                                    actualValue
                                )
                            ) {

                                matchingChip =
                                    candidate;

                                actualChipValue =
                                    candidateText;

                                break;
                            }
                        }

                        expect(
                            matchingChip,
                            `${fieldKey}: selected chip not found for "${actualValue}"`
                        ).not.toBeNull();

                        await expect(
                            matchingChip
                        ).toBeVisible();

                        expect(
                            normalizeValue(
                                actualChipValue
                            ),
                            `${fieldKey}: chip "${actualChipValue}" does not match "${actualValue}"`
                        ).toBe(
                            normalizeValue(actualValue)
                        );

                        selectedValues.push(
                            actualValue
                        );

                        selectedValueCount++;

                        console.log(
                            `[${fieldKey}] Selected: "${actualValue}" | Chip: "${actualChipValue}"`
                        );
                    }

                    // ----------------------------------------------------
                    // Store selected values.
                    // ----------------------------------------------------

                    if (
                        selectedValues.length > 0
                    ) {

                        selectedValuesByField[fieldKey] =
                            selectedValues;
                    }
                }

                // ========================================================
                // SKIP ONLY IF NO FIELD WAS SELECTED
                // ========================================================

                if (
                    Object.keys(
                        selectedValuesByField
                    ).length === 0
                ) {

                    skippedPermutations++;

                    console.log(
                        `[SKIP] ${firstField} + ${secondField}`
                    );

                    continue;
                }

                // ========================================================
                // APPLY FILTERS
                // ========================================================

                await Promise.all([

                    page.waitForResponse(response =>
                        response.url().includes(
                            '/api/searchtype/'
                        ) &&
                        response.status() === 200
                    ),

                    page.waitForResponse(response =>
                        response.url().includes(
                            '/api/searchtypeCount/'
                        ) &&
                        response.status() === 200
                    ),

                    page.locator(
                        "//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div"
                    ).click()

                ]);

                // ========================================================
                // VERIFY NON-ZERO RESULT
                // ========================================================

                await expect(
                    page.locator('#sptotalUsers')
                ).not.toHaveText('0');

                // ========================================================
                // VERIFY RETURNED TABLE VALUES
                // ========================================================

                for (
                    const [
                        fieldKey,
                        selectedValues
                    ] of Object.entries(
                        selectedValuesByField
                    )
                ) {

                    const header =
                        page.locator(
                            `#basetable thead tr th[data-field-header="${fieldKey}"]`
                        );

                    await expect(
                        header,
                        `${fieldKey}: table header not found after filtering`
                    ).toBeVisible();

                    const columnIndex =
                        await header.evaluate(
                            element =>
                                element.cellIndex
                        );

                    const tableValues =
                        await page.locator(
                            `#basetable tbody tr td:nth-child(${columnIndex})`
                        ).allTextContents();

                    const allowedValues =
                        selectedValues.map(
                            value =>
                                normalizeValue(value)
                        );

                    const unmatchedValues =
                        tableValues
                            .map(
                                value =>
                                    value.trim()
                            )
                            .filter(Boolean)
                            .filter(
                                value =>
                                    !allowedValues.includes(
                                        normalizeValue(
                                            value
                                        )
                                    )
                            );

                    expect(
                        unmatchedValues,
                        `${fieldKey}: returned rows contain values outside selected values ${JSON.stringify(selectedValues)}`
                    ).toEqual([]);

                    verifiedColumnAssertions++;

                    console.log(
                        `[PASS] ${fieldKey}: all returned rows matched ${JSON.stringify(selectedValues)}`
                    );
                }

                completedPermutations++;

                console.log(
                    `[PASS] ${firstField} + ${secondField}`
                );
            }
        }

        // ============================================================
        // FINAL SUMMARY
        // ============================================================

        const sameFieldPermutations =
            fieldKeys.length;

        const crossFieldPermutations =
            expectedPermutations -
            sameFieldPermutations;

        const evaluatedPermutations =
            completedPermutations +
            skippedPermutations;

        const evaluationPercentage =
            expectedPermutations > 0
                ? Math.round(
                    evaluatedPermutations /
                    expectedPermutations *
                    100
                )
                : 0;

        console.log(
            '============================================================'
        );

        console.log(
            'TEST 21 FULL-WORD MULTI-SELECT SUMMARY'
        );

        console.log(
            `Fields: ${fieldKeys.length}`
        );

        console.log(
            `Expected permutations: ${expectedPermutations}`
        );

        console.log(
            `Completed permutations: ${completedPermutations}`
        );

        console.log(
            `Skipped permutations: ${skippedPermutations}`
        );

        console.log(
            `Evaluation: ${evaluationPercentage}%`
        );

        console.log(
            `Same-field permutations: ${sameFieldPermutations}`
        );

        console.log(
            `Cross-field permutations: ${crossFieldPermutations}`
        );

        console.log(
            `Column assertions: ${verifiedColumnAssertions}`
        );

        console.log(
            `Complete values selected: ${selectedValueCount}`
        );

        console.log(
            `Random row: ${randomRowIndex + 1}`
        );

        console.log(
            '============================================================'
        );

        await page.waitForTimeout(3000);
    }
);

// ============================================================
// TEST 22 - Soft Delete - Random active row and verify in Deleted records
// Uses complete values from a random table row.

// ============================================================

// ============================================================
// TEST 22
// SOFT DELETE - RANDOM ACTIVE EMPLOYEE
// ============================================================

test(
    '22 - Soft Delete - Random active employee and verify in Deleted records',
    async ({ page }) => {

        test.setTimeout(120000);

        // ============================================================
        // 1. LOAD EMPLOYEES REPORT
        // ============================================================

        await loadEmployeesReport(page);


        // ============================================================
        // 2. GET ALL CURRENT ACTIVE ROWS
        // ============================================================

        const rows =
            page.locator('#basetable tbody tr');

        const rowCount =
            await rows.count();

        expect(
            rowCount,
            'Employees report should contain at least one row'
        ).toBeGreaterThan(0);


        // ============================================================
        // 3. SELECT RANDOM ROW
        // ============================================================

        const randomIndex =
            Math.floor(Math.random() * rowCount);

        const selectedRow =
            rows.nth(randomIndex);

        console.log(
            `Test 22 - Selected random row: ${randomIndex + 1} of ${rowCount}`
        );


        // ============================================================
        // 4. CAPTURE STABLE EMPLOYEE ID
        //
        // Example:
        // <td data-tbledit-type="20669165">
        // ============================================================

        const editCell =
            selectedRow
                .locator('td[data-tbledit-type]')
                .first();

        await expect(
            editCell
        ).toBeVisible({
            timeout: 30000
        });


        const employeeId =
            await editCell.getAttribute(
                'data-tbledit-type'
            );


        expect(
            employeeId,
            'Selected employee must have a data-tbledit-type ID'
        ).not.toBeNull();


        expect(
            employeeId,
            'Selected employee ID must not be empty'
        ).not.toBe('');


        console.log(
            `Test 22 - Selected employee ID: ${employeeId}`
        );


        // ============================================================
        // 5. OPEN EDIT
        // ============================================================

        await editCell.click();


        // ============================================================
        // 6. LOCATE RECORD STATE CHECKBOX
        // ============================================================

        const recordStateInput =
            page.locator('#cltrlrecordstate');

        const recordStateControl =
            page.locator(
                'xpath=/html/body/div[3]/div/div/div[2]/div[1]/form/div/div[5]/div/div/label/div'
            );


        await expect(
            recordStateInput
        ).toBeAttached({
            timeout: 30000
        });


        // ============================================================
        // 7. VERIFY EMPLOYEE IS CURRENTLY ACTIVE
        // ============================================================

        await expect(
            recordStateInput
        ).toBeChecked();


        console.log(
            `Test 22 - Employee ${employeeId} is currently ACTIVE`
        );


        // ============================================================
        // 8. UNCHECK RECORD STATE = SOFT DELETE
        // ============================================================

        await recordStateControl.click();


        await expect(
            recordStateInput
        ).not.toBeChecked();


        console.log(
            `Test 22 - Employee ${employeeId} record state unchecked`
        );


        // ============================================================
        // 9. SUBMIT SOFT DELETE
        // ============================================================

        const searchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/employees/api/searchtype/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );


        await page.locator(
            '#btnmodalsub'
        ).click();


        await searchResponsePromise;


        console.log(
            `Test 22 - Soft delete submitted for employee ${employeeId}`
        );


        // ============================================================
        // 10. WAIT FOR REPORT REFRESH
        // ============================================================

        await expect(
            page.locator('#dvreportcontainer')
        ).not.toHaveClass(
            /loading-report-container/,
            {
                timeout: 30000
            }
        );


        await expect(
            page.locator('#basetable')
        ).toBeVisible({
            timeout: 30000
        });


        // ============================================================
        // 11. OPEN PAGING MENU
        //
        // IMPORTANT:
        // #overlaypaging itself is display:none initially.
        // The clickable element is .pagingsectionparent.
        // ============================================================

        const pagingParent =
            page.locator(
                '#dvpaginationsections .pagingsectionparent'
            );


        await expect(
            pagingParent
        ).toBeVisible({
            timeout: 30000
        });


        await pagingParent.click();


        // ============================================================
        // 12. VERIFY PAGING MENU IS OPEN
        // ============================================================

        const pagingMenu =
            page.locator('#overlaypaging');


        await expect(
            pagingMenu
        ).toBeVisible({
            timeout: 10000
        });


        // ============================================================
        // 13. SELECT DELETED
        // ============================================================

        const deletedOption =
            page.locator('#Deletediv');


        await expect(
            deletedOption
        ).toBeVisible({
            timeout: 10000
        });


        const deletedSearchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/employees/api/searchtype/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );


        await deletedOption.click();


        await deletedSearchResponsePromise;


        // ============================================================
        // 14. WAIT FOR DELETED REPORT
        // ============================================================

        await expect(
            page.locator('#dvreportcontainer')
        ).not.toHaveClass(
            /loading-report-container/,
            {
                timeout: 30000
            }
        );


        await expect(
            page.locator('#basetable')
        ).toBeVisible({
            timeout: 30000
        });


        // ============================================================
        // 15. VERIFY DELETED EMPLOYEE EXISTS
        //
        // The same employee ID appears as:
        //
        // ACTIVE TABLE:
        // td[data-tbledit-type="20669165"]
        //
        // DELETED TABLE:
        // input[data-chk-type="20669165"]
        // ============================================================

        const deletedEmployee =
            page.locator(
                `#basetable tbody tr input.tblkchk[data-chk-type="${employeeId}"]`
            );


        await expect(
            deletedEmployee,
            `Soft-deleted employee ${employeeId} should appear in Deleted records`
        ).toHaveCount(1);


        // ============================================================
        // 16. VERIFY THE DELETED ROW ITSELF
        // ============================================================

        const deletedRow =
            deletedEmployee.locator(
                'xpath=ancestor::tr'
            );


        await expect(
            deletedRow
        ).toHaveCount(1);


        const deletedEditCell =
            deletedRow.locator(
                `td[data-tbledit-type="${employeeId}"]`
            );


        await expect(
            deletedEditCell
        ).toHaveCount(1);


        console.log(
            `Test 22 PASS - Employee ${employeeId} successfully soft-deleted and verified in Deleted records`
        );
    }
);






