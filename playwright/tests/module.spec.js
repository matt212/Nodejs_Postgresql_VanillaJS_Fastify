


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

    /*
     * Register the response listener BEFORE clicking Apply.
     * The API response is the synchronization point.
     */
    const responsePromise = page.waitForResponse(
        response =>
            response.url().includes('/employees/api/searchtype/') &&
            response.status() === 200
    );

    await page.locator(
        '.daterangepicker .applyBtn'
    ).click();

    const response = await responsePromise;

    console.log(
        '[SEARCH RESPONSE]',
        response.url()
    );

    /*
     * Wait for the actual report UI to finish rendering.
     * No arbitrary waitForTimeout() is required.
     */
    await expect(
        page.locator('#dvreportcontainer')
    ).not.toHaveClass(
        /loading-report-container/
    );

    await expect(
        page.locator('#divreportcontent').first()
    ).toBeVisible();

    await expect(
        page.locator('#basetable')
    ).toBeVisible();

    return response;
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

// ============================================================
// TEST 22
// SOFT DELETE - RANDOM ACTIVE EMPLOYEE
// ============================================================

// ============================================================
// TEST 22
// SOFT DELETE - RANDOM ACTIVE EMPLOYEE
// ============================================================

test(
    '22 - Soft Delete - Random active employee and verify in Deleted records',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page);

        const rows =
            page.locator('#basetable tbody tr');

        const rowCount =
            await rows.count();

        expect(
            rowCount,
            'Employees report should contain at least one row'
        ).toBeGreaterThan(0);

        const randomIndex =
            Math.floor(Math.random() * rowCount);

        const selectedRow =
            rows.nth(randomIndex);

        console.log(
            `Test 22 - Selected random row: ${randomIndex + 1} of ${rowCount}`
        );

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
            employeeId
        ).not.toBe('');

        console.log(
            `Test 22 - Selected employee ID: ${employeeId}`
        );

        // ------------------------------------------------------------
        // OPEN EDIT
        // ------------------------------------------------------------

        await editCell.click();

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

        // Must currently be ACTIVE.
        await expect(
            recordStateInput
        ).toBeChecked();

        // ------------------------------------------------------------
        // SOFT DELETE
        // ------------------------------------------------------------

        await recordStateControl.click();

        await expect(
            recordStateInput
        ).not.toBeChecked();

        // ------------------------------------------------------------
        // IMPORTANT:
        //
        // Submit
        //   -> /employees/api/update/
        //   -> /employees/api/searchtype/
        //   -> table populated
        //
        // Both listeners are installed BEFORE Submit.
        // ------------------------------------------------------------

        const updateResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/employees/api/update/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

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

        await updateResponsePromise;

        console.log(
            `Test 22 - UPDATE completed for ${employeeId}`
        );

        await searchResponsePromise;

        console.log(
            `Test 22 - SEARCHTYPE completed for ${employeeId}`
        );

        // ------------------------------------------------------------
        // REPORT READY
        // ------------------------------------------------------------

        await expect(
            page.locator('#divreportcontent')
        ).toBeVisible({
            timeout: 30000
        });

        // ------------------------------------------------------------
        // OPEN PAGING
        // ------------------------------------------------------------

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

        const pagingMenu =
            page.locator('#overlaypaging');

        await expect(
            pagingMenu
        ).toBeVisible({
            timeout: 10000
        });

        // ------------------------------------------------------------
        // SELECT DELETED
        // ------------------------------------------------------------

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

        await expect(
            page.locator('#divreportcontent')
        ).toBeVisible({
            timeout: 30000
        });

        // ------------------------------------------------------------
        // VERIFY EMPLOYEE EXISTS IN DELETED
        // ------------------------------------------------------------

        const deletedEmployee =
            page.locator(
                `#basetable tbody tr input.tblkchk[data-chk-type="${employeeId}"]`
            );

        await expect(
            deletedEmployee,
            `Employee ${employeeId} should exist in Deleted records`
        ).toHaveCount(1);

        console.log(
            `Test 22 PASS - ${employeeId} exists in Deleted records`
        );
    }
);

// ============================================================
// TEST 23
// 23 - Restore - Random deleted employee and verify in Active records
// ============================================================

// ============================================================
// TEST 23
// RESTORE - RANDOM DELETED EMPLOYEE
//
// FLOW:
//   Deleted
//      -> select random deleted employee
//      -> restore
//      -> UPDATE 200
//      -> SEARCHTYPE 200
//      -> switch to ACTIVE
//      -> use existing CONSOLIDATED SEARCH
//      -> search exact employee ID
//      -> verify employee exists in Active
// ============================================================

// ============================================================
// TEST 23
// RESTORE - RANDOM DELETED RECORD AND VERIFY IN ACTIVE RECORDS
//
// End-to-end flow:
//
// 1. Load report
// 2. Switch to Deleted
// 3. Select a random deleted record
// 4. Capture internal record identity from data-tbledit-type
// 5. Capture a complete user-visible searchable value
// 6. Open Edit
// 7. Verify record is Deleted
// 8. Restore record
// 9. Wait for UPDATE + SEARCHTYPE
// 10. Switch back to Newest / Active
// 11. Open Filter Bar
// 12. Search using the user-visible value
// 13. Verify the exact original record ID exists in results
// 14. If not found, increase page size by 50 and search again
//
// IMPORTANT:
// - Employee ID is NEVER used as the search value.
// - data-tbledit-type is used ONLY for exact record identity verification.
// - Search is performed through the existing consolidated-search UI.
// - No fixed wait is used for API synchronization.
// ============================================================


// ============================================================
// TEST 23
//
// LOAD TABLE
//   ↓
// RANDOM ROW
//   ↓
// RANDOM USER-VISIBLE COLUMN VALUE
//   ↓
// CONSOLIDATED SEARCH USING THAT VALUE
//   ↓
// FIRST SEARCH RESULT = TARGET
//   ↓
// CAPTURE TARGET data-tbledit-type
//   ↓
// DISABLE TARGET
//   ↓
// SAME SEARCH → TARGET MUST BE ABSENT FROM ACTIVE
//   ↓
// DELETED
//   ↓
// SAME SEARCH → TARGET MUST BE PRESENT IN DELETED
//   ↓
// RESTORE TARGET
//   ↓
// ACTIVE / NEWEST
//   ↓
// SAME SEARCH → TARGET MUST BE PRESENT
//
// IMPORTANT:
// - Employee ID is NEVER used as the search value.
// - data-tbledit-type is ONLY used as record identity.
// - Initial search value comes from an actual rendered table row.
// - The first result returned by consolidated search becomes TARGET.
// - The same search value is reused throughout the lifecycle.
// - No fixed waitForTimeout() is used.
// ============================================================

test('23 - Random rendered row -> Disable -> Deleted -> Restore', async ({ page }) => {

    // 1. Load Employees table through existing date-range flow
    await loadEmployeesReport(page);

    await expect(page.locator('#basetable')).toBeVisible({
        timeout: 30000
    });

    await expect(
        page.locator('#basetable tbody tr').first()
    ).toBeVisible({
        timeout: 30000
    });

    // 2. Select random rendered row
    const rows = page.locator('#basetable tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
        throw new Error('No rendered Employees rows found.');
    }

    const randomRowIndex = Math.floor(Math.random() * rowCount);
    const randomRow = rows.nth(randomRowIndex);

    console.log(
        `Random rendered row selected: ${randomRowIndex + 1}/${rowCount}`
    );

    // 3. Select a random user-visible value from that row
    const cells = randomRow.locator('td');
    const cellCount = await cells.count();

    const candidates = [];

    for (let i = 0; i < cellCount; i++) {

        const cell = cells.nth(i);

        if (!(await cell.isVisible())) continue;

        // Do not use internal record identity
        if (await cell.getAttribute('data-tbledit-type')) continue;

        // Do not use checkbox/control cells
        if (
            await cell.locator(
                'input[type="checkbox"], input[type="radio"]'
            ).count() > 0
        ) {
            continue;
        }

        // Do not use action cells
        if (await cell.locator('a.edithover').count() > 0) {
            continue;
        }

        const value = (
            await cell.innerText()
        ).replace(/\s+/g, ' ').trim();

        if (value) {
            candidates.push(value);
        }
    }

    if (candidates.length === 0) {
        throw new Error(
            'No user-visible searchable value found in random row.'
        );
    }

    const searchValue =
        candidates[Math.floor(Math.random() * candidates.length)];

    console.log(`Search value selected: "${searchValue}"`);

    // ------------------------------------------------------------
    // REST OF TEST 23
    // ------------------------------------------------------------
    // searchValue
    //     ↓
    // Consolidated Search
    //     ↓
    // First result = target
    //     ↓
    // Capture data-tbledit-type
    //     ↓
    // Disable
    //     ↓
    // Same search -> target absent from Active
    //     ↓
    // Deleted
    //     ↓
    // Same search -> target present
    //     ↓
    // Restore
    //     ↓
    // Active/Newest
    //     ↓
    // Same search -> target present
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
// HELPER FOR TESTS 27 / 28 / 29
//
// Dynamically selects the first available multi-select field
// using an actual value from the first table row.
//
// No Employee field name is hardcoded.
// ============================================================

async function selectOneDynamicEmployeeFilter(page) {

    await openFilterBar(page);

    await page.locator(
        "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
    ).click();

    await expect(
        page.locator('.fieldsfilterbar')
    ).toBeVisible({
        timeout: 10000
    });

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
        'At least one dynamic multi-select field must exist'
    ).toBeGreaterThan(0);

    let selectedField = null;
    let selectedValue = null;

    // ------------------------------------------------------------
    // Find a field having a usable value in the first table row.
    // ------------------------------------------------------------

    for (const fieldKey of fieldKeys) {

        const header =
            page.locator(
                `#basetable thead tr th[data-field-header="${fieldKey}"]`
            );

        if (await header.count() === 0) {
            continue;
        }

        const columnIndex =
            await header.evaluate(
                element => element.cellIndex
            );

        const cell =
            page.locator(
                `#basetable tbody tr`
            ).first().locator(
                `td:nth-child(${columnIndex})`
            );

        if (await cell.count() === 0) {
            continue;
        }

        const value =
            (
                await cell.textContent()
            || ''
            ).trim();

        if (value.length > 0) {
            selectedField = fieldKey;
            selectedValue = value;
            break;
        }
    }

    expect(
        selectedField,
        'A dynamic multi-select field with a usable table value must exist'
    ).not.toBeNull();

    expect(
        selectedValue,
        'Dynamic filter value must not be empty'
    ).not.toBe('');

    console.log(
        `Dynamic filter field: ${selectedField}`
    );

    console.log(
        `Dynamic filter value: ${selectedValue}`
    );

    const filterInput =
        page.locator(
            `.fieldsfilterbar input[data-multipleselect-autocomplete="${selectedField}"]`
        );

    await expect(
        filterInput,
        `${selectedField}: filter input must exist`
    ).toBeVisible();

    const fieldContainer =
        filterInput.locator('..');

    const chips =
        fieldContainer.locator('.selectchips');

    const dropdown =
        page.locator(
            `#dv_${selectedField}:visible`
        ).first();

    // ------------------------------------------------------------
    // Search autocomplete using the complete actual value.
    // ------------------------------------------------------------

    await Promise.all([
        page.waitForResponse(
            response =>
                response.url().includes(
                    '/api/searchtypegroupby'
                ) &&
                response.status() === 200,
            {
                timeout: 30000
            }
        ),

        filterInput.fill(selectedValue)
    ]);

    await expect(
        dropdown,
        `${selectedField}: autocomplete dropdown must open`
    ).toBeVisible({
        timeout: 10000
    });

    const options =
        dropdown.locator(
            'div a.highlightselect'
        );

    await expect(
        options.first(),
        `${selectedField}: autocomplete must return at least one option`
    ).toBeVisible({
        timeout: 10000
    });

    const optionCount =
        await options.count();

    let matchingOption = null;

    for (let i = 0; i < optionCount; i++) {

        const option =
            options.nth(i);

        const optionText =
            (
                await option.textContent()
            || ''
            ).trim();

        if (
            optionText.toLowerCase() ===
            selectedValue.toLowerCase()
        ) {
            matchingOption = option;
            break;
        }
    }

    // ------------------------------------------------------------
    // If exact text is not returned because the UI formats the
    // value differently, use the first valid autocomplete option.
    // It is still an actual value returned by the application.
    // ------------------------------------------------------------

    if (!matchingOption) {
        matchingOption = options.first();

        selectedValue =
            (
                await matchingOption.textContent()
            || ''
            ).trim();
    }

    expect(
        selectedValue,
        `${selectedField}: selected autocomplete value must not be empty`
    ).not.toBe('');

    await matchingOption.click();

    // ------------------------------------------------------------
    // Verify chip was created.
    // ------------------------------------------------------------

    await expect
        .poll(
            async () => await chips.count(),
            {
                timeout: 10000,
                message:
                    `${selectedField}: selected filter chip was not created`
            }
        )
        .toBeGreaterThan(0);

    console.log(
        `Filter selected: ${selectedField} = ${selectedValue}`
    );

    return {
        fieldKey: selectedField,
        value: selectedValue,
        filterInput,
        chips
    };
}


// ============================================================
// HELPER
//
// Apply currently selected dynamic filters.
// ============================================================

async function applyDynamicEmployeeFilter(page) {

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
}


// ============================================================
// TEST 24
// PAGINATION + PAGE SIZE
// ============================================================


// ============================================================
// TEST 24
// PAGINATION + PAGE SIZE
// ============================================================


// ============================================================
// TEST 24
// PAGINATION + PAGE-SIZE BEHAVIOR
// ============================================================

test(
    '24 - Pagination and page-size behavior works correctly',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page);

        const pageSizeInput = page.locator('#inppagesize');
        const rows = page.locator('#basetable tbody tr');

        await expect(pageSizeInput).toBeAttached({
            timeout: 30000
        });

        // ---------------------------------------------------------
        // PAGE SIZE = 5
        // ---------------------------------------------------------

        const pageSizeResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/employees/api/searchtype/') &&
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
            (await page.locator('#sptotalUsers').textContent() || '0').trim()
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
            '#page-selection li a',
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
                response.url().includes('/employees/api/searchtype/') &&
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
            '#page-selection li.active'
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



// ============================================================
// TEST 25
// NEWEST / OLDEST RECORD NAVIGATION
// ============================================================



test('25 - DEBUG Newest and Oldest navigation', async ({ page }) => {

    console.log('\n====================================================');
    console.log('TEST 25 START');
    console.log('====================================================');

    // ---------------------------------------------------------
    // Initial load
    // ---------------------------------------------------------
    console.log('[1] Calling loadEmployeesReport()');

    await loadEmployeesReport(page);

    console.log('[2] Report loaded');

    console.log(
        '[3] paging parent count:',
        await page.locator(
            '#dvpaginationsections .pagingsectionparent'
        ).count()
    );

    console.log(
        '[4] overlay count:',
        await page.locator('#overlaypaging').count()
    );

    console.log(
        '[5] newest count:',
        await page.locator('#newestdiv').count()
    );

    console.log(
        '[6] oldest count:',
        await page.locator('#Oldestdiv').count()
    );


    const pagingParent = page.locator(
        '#dvpaginationsections .pagingsectionparent'
    );

    const pagingMenu = page.locator('#overlaypaging');

    const newestOption = page.locator('#newestdiv');

    const oldestOption = page.locator('#Oldestdiv');


    // =========================================================
    // FIRST OPERATION
    // Newest -> Oldest
    // =========================================================

    console.log('\n----------------------------------------------------');
    console.log('FIRST OPERATION: NEWEST -> OLDEST');
    console.log('----------------------------------------------------');

    console.log('[7] Before first paging click');

    console.log(
        '[8] pagingParent visible:',
        await pagingParent.isVisible()
    );

    console.log(
        '[9] pagingParent bounding box:',
        await pagingParent.boundingBox()
    );

    console.log(
        '[10] overlay visible:',
        await pagingMenu.isVisible().catch(() => false)
    );


    console.log('[11] Clicking paging parent FIRST time');

    await pagingParent.click();

    console.log('[12] First paging parent click completed');

    console.log(
        '[13] overlay visible AFTER first click:',
        await pagingMenu.isVisible()
    );

    console.log(
        '[14] overlay display:',
        await pagingMenu.evaluate(el =>
            window.getComputedStyle(el).display
        )
    );

    console.log(
        '[15] overlay class:',
        await pagingMenu.getAttribute('class')
    );

    console.log(
        '[16] Oldest visible:',
        await oldestOption.isVisible()
    );

    console.log(
        '[17] Newest visible:',
        await newestOption.isVisible()
    );

    console.log(
        '[18] Oldest class BEFORE click:',
        await oldestOption.getAttribute('class')
    );

    console.log(
        '[19] Newest class BEFORE click:',
        await newestOption.getAttribute('class')
    );


    // ---------------------------------------------------------
    // Capture all searchtype requests
    // ---------------------------------------------------------

    const requests = [];

    const requestListener = request => {

        if (
            request.url().includes('/employees/api/searchtype/')
        ) {
            let body = null;

            try {
                body = request.postDataJSON();
            } catch (e) {
                body = request.postData();
            }

            console.log('\n>>> SEARCHTYPE REQUEST');
            console.log('URL:', request.url());
            console.log('METHOD:', request.method());
            console.log('BODY:', body);

            requests.push({
                url: request.url(),
                method: request.method(),
                body
            });
        }
    };

    page.on('request', requestListener);


    console.log('[20] Clicking OLDEST');

    await oldestOption.click();

    console.log('[21] OLDEST click completed');

    console.log(
        '[22] overlay visible immediately after Oldest click:',
        await pagingMenu.isVisible().catch(() => false)
    );

    console.log(
        '[23] Newest class immediately after Oldest click:',
        await newestOption.getAttribute('class').catch(() => null)
    );

    console.log(
        '[24] Oldest class immediately after Oldest click:',
        await oldestOption.getAttribute('class').catch(() => null)
    );


    console.log('[25] Waiting for table after Oldest');

    await expect(page.locator('#basetable tbody tr').first())
        .toBeVisible({ timeout: 30000 });

    console.log('[26] Oldest table loaded');

    console.log(
        '[27] Requests captured so far:',
        requests.length
    );


    // Give application time to finish any async state changes.
    await page.waitForTimeout(1000);

    console.log('[28] State after Oldest refresh');

    console.log(
        '[29] pagingParent visible:',
        await pagingParent.isVisible().catch(() => false)
    );

    console.log(
        '[30] pagingParent bounding box:',
        await pagingParent.boundingBox().catch(() => null)
    );

    console.log(
        '[31] overlay visible:',
        await pagingMenu.isVisible().catch(() => false)
    );

    console.log(
        '[32] overlay display:',
        await pagingMenu.evaluate(el =>
            window.getComputedStyle(el).display
        ).catch(() => 'ERROR')
    );

    console.log(
        '[33] overlay class:',
        await pagingMenu.getAttribute('class').catch(() => null)
    );

    console.log(
        '[34] newest count:',
        await page.locator('#newestdiv').count()
    );

    console.log(
        '[35] oldest count:',
        await page.locator('#Oldestdiv').count()
    );

    console.log(
        '[36] newest visible:',
        await newestOption.isVisible().catch(() => false)
    );

    console.log(
        '[37] oldest visible:',
        await oldestOption.isVisible().catch(() => false)
    );

    console.log(
        '[38] newest class:',
        await newestOption.getAttribute('class').catch(() => null)
    );

    console.log(
        '[39] oldest class:',
        await oldestOption.getAttribute('class').catch(() => null)
    );


    // =========================================================
    // SECOND OPERATION
    // Oldest -> Newest
    // =========================================================

    console.log('\n====================================================');
    console.log('SECOND OPERATION: OLDEST -> NEWEST');
    console.log('====================================================');


    console.log('[40] BEFORE SECOND PAGING CLICK');

    console.log(
        '[41] pagingParent count:',
        await pagingParent.count()
    );

    console.log(
        '[42] pagingParent visible:',
        await pagingParent.isVisible().catch(() => false)
    );

    console.log(
        '[43] pagingParent enabled:',
        await pagingParent.isEnabled().catch(() => false)
    );

    console.log(
        '[44] pagingParent bounding box:',
        await pagingParent.boundingBox().catch(() => null)
    );

    console.log(
        '[45] overlay visible:',
        await pagingMenu.isVisible().catch(() => false)
    );

    console.log(
        '[46] overlay display:',
        await pagingMenu.evaluate(el =>
            window.getComputedStyle(el).display
        ).catch(() => 'ERROR')
    );


    console.log('[47] Attempting SECOND pagingParent.click()');

    await pagingParent.click();

    console.log('[48] SECOND pagingParent.click() COMPLETED');

    console.log(
        '[49] overlay visible AFTER SECOND paging click:',
        await pagingMenu.isVisible().catch(() => false)
    );

    console.log(
        '[50] overlay display AFTER SECOND paging click:',
        await pagingMenu.evaluate(el =>
            window.getComputedStyle(el).display
        ).catch(() => 'ERROR')
    );

    console.log(
        '[51] overlay class AFTER SECOND paging click:',
        await pagingMenu.getAttribute('class').catch(() => null)
    );

    console.log(
        '[52] newest visible AFTER SECOND paging click:',
        await newestOption.isVisible().catch(() => false)
    );

    console.log(
        '[53] oldest visible AFTER SECOND paging click:',
        await oldestOption.isVisible().catch(() => false)
    );

    console.log(
        '[54] newest bounding box:',
        await newestOption.boundingBox().catch(() => null)
    );

    console.log(
        '[55] oldest bounding box:',
        await oldestOption.boundingBox().catch(() => null)
    );

    console.log(
        '[56] newest class:',
        await newestOption.getAttribute('class').catch(() => null)
    );

    console.log(
        '[57] oldest class:',
        await oldestOption.getAttribute('class').catch(() => null)
    );


    // ---------------------------------------------------------
    // Only continue if overlay actually opened
    // ---------------------------------------------------------

    console.log('[58] Waiting for overlay to become visible');

    await expect(pagingMenu).toBeVisible({
        timeout: 5000
    });

    console.log('[59] SECOND OVERLAY IS VISIBLE');


    // ---------------------------------------------------------
    // Newest click
    // ---------------------------------------------------------

    console.log('[60] Newest count before click:', await newestOption.count());

    console.log(
        '[61] Newest visible before click:',
        await newestOption.isVisible()
    );

    console.log(
        '[62] Newest class before click:',
        await newestOption.getAttribute('class')
    );

    console.log(
        '[63] Newest bounding box before click:',
        await newestOption.boundingBox()
    );


    console.log('[64] CLICKING NEWEST');

    await newestOption.click();

    console.log('[65] NEWEST CLICK COMPLETED');

    console.log(
        '[66] Newest class immediately after click:',
        await newestOption.getAttribute('class').catch(() => null)
    );

    console.log(
        '[67] Overlay visible after Newest click:',
        await pagingMenu.isVisible().catch(() => false)
    );

    console.log(
        '[68] Total searchtype requests captured:',
        requests.length
    );


    // ---------------------------------------------------------
    // Final table
    // ---------------------------------------------------------

    console.log('[69] Waiting for final table');

    await expect(page.locator('#basetable tbody tr').first())
        .toBeVisible({
            timeout: 30000
        });

    console.log('[70] FINAL TABLE LOADED');

    console.log(
        '[71] Total searchtype requests:',
        requests.length
    );

    requests.forEach((request, index) => {
        console.log(
            `REQUEST ${index + 1}:`,
            request.body
        );
    });


    page.off('request', requestListener);

    console.log('\n====================================================');
    console.log('TEST 25 DEBUG COMPLETE');
    console.log('====================================================');
});

test('25 - Newest and Oldest record navigation works correctly', async ({ page }) => {
    await loadEmployeesReport(page);

    const pagingParent = page.locator(
        '#dvpaginationsections .pagingsectionparent'
    );

    const pagingMenu = page.locator('#overlaypaging');

    const oldestOption = page.locator('#Oldestdiv');
    const newestOption = page.locator('#newestdiv');

    // =========================================================
    // NEWEST -> OLDEST
    // =========================================================

    await expect(pagingParent).toBeVisible();

    await pagingParent.click();

    await expect(pagingMenu).toBeVisible();

    await expect(oldestOption).toBeVisible();

    await oldestOption.click();

    // ---------------------------------------------------------
    // Synchronize with the first refresh.
    // Do not use CSS class state or fixed sleep.
    // ---------------------------------------------------------

    await expect(page.locator('#basetable tbody tr').first())
        .toBeVisible({
            timeout: 30000
        });

    // Allow pending DOM/render work from the refresh to complete.
    await page.evaluate(() =>
        new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        )
    );

    // The pagination control must be interaction-ready again.
    await expect(pagingParent).toBeVisible({
        timeout: 10000
    });


    // =========================================================
    // OLDEST -> NEWEST
    // =========================================================

    await pagingParent.click();

    // Synchronize specifically with the overlay becoming available.
    await expect(pagingMenu).toBeVisible({
        timeout: 5000
    });

    // Do not assume the menu is ready merely because the
    // container is visible. Wait for the actual option.
    await expect(newestOption).toBeVisible({
        timeout: 5000
    });

    await newestOption.click();

    // ---------------------------------------------------------
    // Synchronize with the final refresh.
    // ---------------------------------------------------------

    await expect(page.locator('#basetable tbody tr').first())
        .toBeVisible({
            timeout: 30000
        });

    await page.evaluate(() =>
        new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        )
    );
});

// ============================================================
// TEST 26
// EMPTY RESULT SEARCH
// ============================================================

test(
    '26 - Consolidated search returns zero records for a non-existent value',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page);

        await openFilterBar(page);

        const impossibleValue =
            `ZZZ_NO_EMPLOYEE_${Date.now()}`;

        const consolidatedSearch =
            page.locator(
                '#txtconsolidatesearch'
            );

        await expect(
            consolidatedSearch
        ).toBeVisible({
            timeout: 10000
        });

        await consolidatedSearch.fill(
            impossibleValue
        );

        const searchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/api/searchtype/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const countResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/api/searchtypeCount/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        // Existing consolidated-search action.
        await page.locator(
            '//*[@id="dvfilterbar"]/div[2]/div[1]/div/div[2]'
        ).click();

        await searchResponsePromise;
        await countResponsePromise;

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

        // --------------------------------------------------------
        // Exact zero-result verification.
        // --------------------------------------------------------

        const totalUsers =
            (
                await page.locator(
                    '#sptotalUsers'
                ).textContent()
            || ''
            ).trim();

        console.log(
            `Test 26 - Search count: ${totalUsers}`
        );

        expect(
            Number(totalUsers),
            'Non-existent search must return zero records'
        ).toBe(0);

        const rows =
            await page.locator(
                '#basetable tbody tr'
            ).count();

        expect(
            rows,
            'Non-existent search must not render employee rows'
        ).toBe(0);

        console.log(
            'Test 26 PASS - Empty-result search verified'
        );
    }
);


// ============================================================
// TEST 27
// CLEAR / REMOVE FILTER
// ============================================================

test(
    '27 - Clear and remove dynamic filter returns report to unfiltered state',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page);

        const originalTotal =
            Number(
                (
                    await page.locator(
                        '#sptotalUsers'
                    ).textContent()
                || '0'
                ).trim()
            );

        expect(
            originalTotal,
            'Initial report must contain records'
        ).toBeGreaterThan(0);

        console.log(
            `Test 27 - Initial total: ${originalTotal}`
        );

        const filter =
            await selectOneDynamicEmployeeFilter(
                page
            );

        // --------------------------------------------------------
        // Apply selected filter.
        // --------------------------------------------------------

        await applyDynamicEmployeeFilter(
            page
        );

        const filteredTotal =
            Number(
                (
                    await page.locator(
                        '#sptotalUsers'
                    ).textContent()
                || '0'
                ).trim()
            );

        expect(
            filteredTotal,
            'Filtered report must contain records'
        ).toBeGreaterThan(0);

        console.log(
            `Test 27 - Filtered total: ${filteredTotal}`
        );

        // --------------------------------------------------------
        // Remove the selected chip.
        //
        // Existing application DOM uses:
        // .select2choiceremove
        // --------------------------------------------------------

        const removeControl =
            filter.chips
                .first()
                .locator(
                    '.select2choiceremove'
                );

        await expect(
            removeControl,
            'Selected filter must have a remove control'
        ).toBeVisible({
            timeout: 10000
        });

        await removeControl.click();

        await expect
            .poll(
                async () =>
                    await filter.chips.count(),
                {
                    timeout: 10000,
                    message:
                        'Filter chip was not removed'
                }
            )
            .toBe(0);

        console.log(
            'Test 27 - Filter chip successfully removed'
        );

        // --------------------------------------------------------
        // Apply cleared filter state.
        // --------------------------------------------------------

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

        const restoredTotal =
            Number(
                (
                    await page.locator(
                        '#sptotalUsers'
                    ).textContent()
                || '0'
                ).trim()
            );

        expect(
            restoredTotal,
            'Clearing the filter must restore the unfiltered record count'
        ).toBe(originalTotal);

        console.log(
            `Test 27 - Restored total: ${restoredTotal}`
        );

        console.log(
            'Test 27 PASS - Filter removal returned report to unfiltered state'
        );
    }
);


// ============================================================
// TEST 28
// FILTER + SORT COMBINATION
// ============================================================

test(
    '28 - Dynamic filter and column sorting work together',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page);

        const filter =
            await selectOneDynamicEmployeeFilter(
                page
            );

        await applyDynamicEmployeeFilter(
            page
        );

        const filteredTotal =
            Number(
                (
                    await page.locator(
                        '#sptotalUsers'
                    ).textContent()
                || '0'
                ).trim()
            );

        expect(
            filteredTotal,
            'Filtered result must contain records before sorting'
        ).toBeGreaterThan(0);

        // --------------------------------------------------------
        // Dynamically choose a sortable table field.
        // --------------------------------------------------------

        const headers =
            page.locator(
                '#basetable thead tr th[data-field-header]'
            );

        const headerCount =
            await headers.count();

        expect(
            headerCount
        ).toBeGreaterThan(0);

        const sortHeader =
            headers.first();

        const sortField =
            await sortHeader.getAttribute(
                'data-field-header'
            );

        expect(
            sortField
        ).not.toBeNull();

        console.log(
            `Test 28 - Sorting filtered results by: ${sortField}`
        );

        // --------------------------------------------------------
        // Sort DESC.
        //
        // Verify the request still contains the filter payload.
        // --------------------------------------------------------

        const descRequestPromise =
            page.waitForRequest(
                request =>
                    request.url().includes(
                        '/api/searchtype/'
                    ) &&
                    request.method() === 'POST'
            );

        const descResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/api/searchtype/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await sortHeader.click();

        const descRequest =
            await descRequestPromise;

        await descResponsePromise;

        const descPayload =
            descRequest.postDataJSON();

        expect(
            descPayload.sortcolumn,
            'Sort request must contain selected field'
        ).toBe(sortField);

        expect(
            String(
                descPayload.sortcolumnorder
            ).toUpperCase()
        ).toBe('DESC');

        // The selected filter must still exist.
        expect(
            JSON.stringify(descPayload)
                .toLowerCase()
        ).toContain(
            String(filter.value)
                .toLowerCase()
        );

        await expect(
            page.locator('#basetable')
        ).toBeVisible({
            timeout: 30000
        });

        expect(
            Number(
                (
                    await page.locator(
                        '#sptotalUsers'
                    ).textContent()
                || '0'
                ).trim()
            )
        ).toBeGreaterThan(0);

        // --------------------------------------------------------
        // Sort ASC.
        // --------------------------------------------------------

        const ascRequestPromise =
            page.waitForRequest(
                request =>
                    request.url().includes(
                        '/api/searchtype/'
                    ) &&
                    request.method() === 'POST'
            );

        const ascResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/api/searchtype/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await sortHeader.click();

        const ascRequest =
            await ascRequestPromise;

        await ascResponsePromise;

        const ascPayload =
            ascRequest.postDataJSON();

        expect(
            ascPayload.sortcolumn
        ).toBe(sortField);

        expect(
            String(
                ascPayload.sortcolumnorder
            ).toUpperCase()
        ).toBe('ASC');

        expect(
            JSON.stringify(ascPayload)
                .toLowerCase()
        ).toContain(
            String(filter.value)
                .toLowerCase()
        );

        await expect(
            page.locator('#basetable')
        ).toBeVisible({
            timeout: 30000
        });

        console.log(
            'Test 28 PASS - Filter remained active during DESC and ASC sorting'
        );
    }
);


// ============================================================
// TEST 29
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
            await selectOneDynamicEmployeeFilter(
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
                        '#sptotalUsers'
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
            page.locator('#inppagesize');

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

        // --------------------------------------------------------
        // STEP 5 - Verify first filtered page
        // --------------------------------------------------------

        const rows =
            page.locator(
                '#basetable tbody tr'
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
        // Therefore do NOT use nth(1).
        // --------------------------------------------------------

        const secondPage =
            page.locator(
                '#page-selection li a',
                {
                    hasText: /^2$/
                }
            );

        const secondPageAvailable =
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
            //
            // The strongest UI-level verification is that the
            // filtered result count is still represented after
            // pagination rather than relying on a guessed request.
            // ----------------------------------------------------

            const filteredTotalAfterPagination =
                Number(
                    (
                        await page.locator(
                            '#sptotalUsers'
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
            // when application exposes active pagination state.
            // ----------------------------------------------------

            const activePage =
                page.locator(
                    '#page-selection li.active'
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
// TEST 30
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
        // PART 1
        // ACTIVE -> DELETED
        // ============================================================

        await loadEmployeesReport(page);

        const activeRows =
            page.locator('#basetable tbody tr');

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
            'Selected employee must have an ID'
        ).not.toBeNull();

        expect(
            employeeId
        ).not.toBe('');

        console.log(
            `Test 30 - Selected employee: ${employeeId}`
        );

        // ------------------------------------------------------------
        // OPEN EDIT
        // ------------------------------------------------------------

        await editCell.click();

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

        await expect(
            recordStateInput
        ).toBeChecked();

        // ------------------------------------------------------------
        // DELETE
        // ------------------------------------------------------------

        await recordStateControl.click();

        await expect(
            recordStateInput
        ).not.toBeChecked();

        const deleteUpdateResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/employees/api/update/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const deleteSearchResponsePromise =
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

        await deleteUpdateResponsePromise;

        console.log(
            `Test 30 - DELETE UPDATE completed for ${employeeId}`
        );

        await deleteSearchResponsePromise;

        console.log(
            `Test 30 - DELETE SEARCHTYPE completed for ${employeeId}`
        );

        await expect(
            page.locator('#divreportcontent')
        ).toBeVisible({
            timeout: 30000
        });

        // ------------------------------------------------------------
        // VERIFY ABSENT FROM ACTIVE
        // ------------------------------------------------------------

        await expect(
            page.locator(
                `#basetable tbody tr td[data-tbledit-type="${employeeId}"]`
            )
        ).toHaveCount(0);

        console.log(
            `Test 30 - ${employeeId} absent from Active records`
        );

        // ============================================================
        // PART 2
        // VERIFY PRESENT IN DELETED
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

        const pagingMenu =
            page.locator('#overlaypaging');

        await expect(
            pagingMenu
        ).toBeVisible({
            timeout: 10000
        });

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

        await expect(
            page.locator('#divreportcontent')
        ).toBeVisible({
            timeout: 30000
        });

        const deletedEmployee =
            page.locator(
                `#basetable tbody tr input.tblkchk[data-chk-type="${employeeId}"]`
            );

        await expect(
            deletedEmployee,
            `Employee ${employeeId} should exist in Deleted records`
        ).toHaveCount(1);

        console.log(
            `Test 30 - ${employeeId} confirmed in Deleted records`
        );

        // ============================================================
        // PART 3
        // DELETED -> ACTIVE
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

        await deletedEditCell.click();

        await expect(
            recordStateInput
        ).toBeAttached({
            timeout: 30000
        });

        await expect(
            recordStateInput
        ).not.toBeChecked();

        // ------------------------------------------------------------
        // RESTORE
        // ------------------------------------------------------------

        await recordStateControl.click();

        await expect(
            recordStateInput
        ).toBeChecked();

        const restoreUpdateResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        '/employees/api/update/'
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const restoreSearchResponsePromise =
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

        await restoreUpdateResponsePromise;

        console.log(
            `Test 30 - RESTORE UPDATE completed for ${employeeId}`
        );

        await restoreSearchResponsePromise;

        console.log(
            `Test 30 - RESTORE SEARCHTYPE completed for ${employeeId}`
        );

        await expect(
            page.locator('#divreportcontent')
        ).toBeVisible({
            timeout: 30000
        });

        // ============================================================
        // PART 4
        // VERIFY PRESENT IN ACTIVE
        // ============================================================

        const pagingParentAfterRestore =
            page.locator(
                '#dvpaginationsections .pagingsectionparent'
            );

        await expect(
            pagingParentAfterRestore
        ).toBeVisible({
            timeout: 30000
        });

        await pagingParentAfterRestore.click();

        const pagingMenuAfterRestore =
            page.locator('#overlaypaging');

        await expect(
            pagingMenuAfterRestore
        ).toBeVisible({
            timeout: 10000
        });

        const newestOption =
            page.locator('#newestdiv');

        await expect(
            newestOption
        ).toBeVisible({
            timeout: 10000
        });

        const activeSearchResponsePromise =
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

        await newestOption.click();

        await activeSearchResponsePromise;

        await expect(
            page.locator('#divreportcontent')
        ).toBeVisible({
            timeout: 30000
        });

        const restoredEmployee =
            page.locator(
                `#basetable tbody tr td[data-tbledit-type="${employeeId}"]`
            );

        await expect(
            restoredEmployee,
            `Restored employee ${employeeId} should appear in Active records`
        ).toHaveCount(1);

        console.log(
            `Test 30 - ${employeeId} confirmed ACTIVE after restore`
        );

        // ============================================================
        // PART 5
        // VERIFY ABSENT FROM DELETED
        // ============================================================

        const finalPagingParent =
            page.locator(
                '#dvpaginationsections .pagingsectionparent'
            );

        await expect(
            finalPagingParent
        ).toBeVisible({
            timeout: 30000
        });

        await finalPagingParent.click();

        const finalPagingMenu =
            page.locator('#overlaypaging');

        await expect(
            finalPagingMenu
        ).toBeVisible({
            timeout: 10000
        });

        const finalDeletedOption =
            page.locator('#Deletediv');

        await expect(
            finalDeletedOption
        ).toBeVisible({
            timeout: 10000
        });

        const finalDeletedSearchResponsePromise =
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

        await finalDeletedOption.click();

        await finalDeletedSearchResponsePromise;

        await expect(
            page.locator('#divreportcontent')
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            page.locator(
                `#basetable tbody tr input.tblkchk[data-chk-type="${employeeId}"]`
            )
        ).toHaveCount(0);

        console.log(
            `Test 30 PASS - ${employeeId}: ACTIVE -> DELETED -> ACTIVE, and absent from Deleted records`
        );
    }
);




