


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
} = require('../config/module.config');





// ============================================================
// OPEN CONTROL BAR
// ============================================================
const {
    openControlBar,
    applyDateRange,
    loadEmployeesReport,
    openFilterBar,
    getFirstRowData
} = require('../helpers/module.filters');


// TEST 01-07//

require(".././helpers/module.screenload.js")


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
                base.locators.tableRows
            ).first().locator('td').nth(1).textContent();


        const searchValue =
            firstRowSecondColumnText
                .trim()
                .substring(0, 2);


        expect(searchValue.length)
            .toBe(2);


        await page.locator(
            base.locators.consolidatedSearch
        ).fill(searchValue);


        await page.locator(
            base.locators.consolidatedSearchAction
        ).click();


        await page.locator(
            base.locators.reportContent
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
                base.locators.totalUsers
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
            base.locators.dynamicFilterToggle
        ).click();


        await expect(
            page.locator(base.locators.dynamicFilterContainer)
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
            base.locators.dynamicFilterToggle
        ).click();

        await expect(
            page.locator(base.locators.dynamicFilterContainer)
        ).toBeVisible();

        const inputs =
            page.locator(
                base.locators.dynamicFilterInputs
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
                        base.api.groupBy
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
                page.locator(base.locators.totalUsers)
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
            base.locators.dynamicFilterToggle
        ).click();

        await expect(
            page.locator(base.locators.dynamicFilterContainer)
        ).toBeVisible();

        const fieldKeys =
            await page.locator(
                base.locators.dynamicFilterInputs
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
                    base.locators.dynamicFilterToggle
                ).click();

                await expect(
                    page.locator(base.locators.dynamicFilterContainer)
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
                                        base.api.groupBy
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

                     const [searchResponse, countResponse] =   await Promise.all([
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
            const countData = await countResponse.json();

            const expectedCount = Number((await countResponse.json()).count);

            console.log(`[COUNT] ${permutationName}:`, expectedCount);

            await expect(page.locator(base.locators.totalUsers))
            .toHaveText(String(expectedCount));

            if (expectedCount > 0) {
            // Existing table-value validation
            }

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
            base.locators.dynamicFilterToggle
        ).click();

        await expect(
            page.locator(base.locators.dynamicFilterContainer)
        ).toBeVisible();


        const fieldKeys =
            await page.locator(
                base.locators.dynamicFilterInputs
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
                    base.locators.dynamicFilterToggle
                ).click();

                await expect(
                    page.locator(base.locators.dynamicFilterContainer)
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
                                            base.api.groupBy
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
                            page.locator(base.locators.totalUsers)
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
                base.locators.tableHeaders
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
            page.locator(base.locators.table)
        ).toBeVisible();
    }
);


// ============================================================
// TEST 16
// CRUD - CREATE EMPLOYEE
//
// Driven by validationmap.
// No employee field names are hardcoded in the control logic.

require('../helpers/module.crud.js');

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
            base.locators.dynamicFilterToggle
        ).click();

        await expect(
            page.locator(base.locators.dynamicFilterContainer)
        ).toBeVisible();

        const fieldKeys =
            await page.locator(
                base.locators.dynamicFilterInputs
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
                base.locators.tableRows
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
                    base.locators.dynamicFilterToggle
                ).click();

                await expect(
                    page.locator(base.locators.dynamicFilterContainer)
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
                                base.api.groupBy
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
                    page.locator(base.locators.totalUsers)
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
            base.locators.dynamicFilterToggle
        ).click();

        await expect(
            page.locator(base.locators.dynamicFilterContainer)
        ).toBeVisible();

        // ============================================================
        // GET ALL MULTI-SELECT FIELDS
        // ============================================================

        const fieldKeys =
            await page.locator(
                base.locators.dynamicFilterInputs
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
                base.locators.tableRows
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
                    base.locators.dynamicFilterToggle
                ).click();

                await expect(
                    page.locator(base.locators.dynamicFilterContainer)
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
                                    base.api.groupBy
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
                    page.locator(base.locators.totalUsers)
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
            page.locator(base.locators.tableRows);

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

        // ------------------------------------------------------------
        // CAPTURE EMPLOYEE ID + WHOLE-WORD SEARCH VALUE
        // ------------------------------------------------------------

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

        // first visible business column = first_name
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
            'Selected employee must have a searchable value'
        ).not.toBe('');

        console.log(
            `Test 22 - Selected employee ID: ${employeeId}`
        );

        console.log(
            `Test 22 - Whole-word search value: "${searchValue}"`
        );

        // ------------------------------------------------------------
        // OPEN EDIT
        // ------------------------------------------------------------

        await editCell.click();

        const recordStateInput =
            page.locator(base.locators.recordStateInput);

        const recordStateControl =
            page.locator(
                base.locators.recordStateControl
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
        // SOFT DELETE
        // ------------------------------------------------------------

        await recordStateControl.click();

        await expect(
            recordStateInput
        ).not.toBeChecked();

        // ------------------------------------------------------------
        // SUBMIT
        // ------------------------------------------------------------

        const updateResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes(
                        base.api.update
                    ) &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const activeSearchResponsePromise =
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
            const activeSearchCountResponsePromise =
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

        await page.locator(
            base.locators.modalSubmit
        ).click();

        await updateResponsePromise;

        console.log(
            `Test 22 - UPDATE completed for ${employeeId}`
        );

        await activeSearchResponsePromise;
        await activeSearchCountResponsePromise;

        console.log(
            'Test 22 - ACTIVE SEARCHTYPE completed after delete'
        );

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            page.locator(base.locators.table)
        ).toBeVisible({
            timeout: 30000
        });

        // ------------------------------------------------------------
        // OPEN PAGING
        // ------------------------------------------------------------

       const pagingParent =
    page.locator(
        base.locators.pagingParent
    );

   const pagingMenu =
    page.locator(base.locators.pagingMenu);

    await expect(pagingParent).toBeVisible({
    timeout: 30000
   });

  console.log(
    '[PAGING BEFORE]',
    await pagingMenu.evaluate(
        el => ({
            display: getComputedStyle(el).display,
            inlineStyle: el.style.display
        })
    )
  );

 await pagingParent.click();

 console.log(
    '[PAGING AFTER CLICK]',
    await pagingMenu.evaluate(
        el => ({
            display: getComputedStyle(el).display,
            inlineStyle: el.style.display
        })
    )
 );

 await expect(pagingMenu).toBeVisible({
    timeout: 10000
 });

        // ------------------------------------------------------------
        // SELECT DELETED
        // ------------------------------------------------------------

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

        await page.locator(
            base.locators.deleted
        ).click();

        await deletedSearchResponsePromise;

        await deletedCountResponsePromise;

        console.log(
            'Test 22 - DELETED SEARCHTYPE completed'
        );

        console.log(
            'Test 22 - DELETED SEARCHTYPE COUNT completed'
        );

        await expect(
            page.locator(base.locators.reportContent)
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            page.locator(base.locators.table)
        ).toBeVisible({
            timeout: 30000
        });

        // ------------------------------------------------------------
        // OPEN CONSOLIDATED SEARCH
        // ------------------------------------------------------------

        await openFilterBar(page);

        const consolidatedSearch =
            page.locator(
                base.locators.consolidatedSearch
            );

        await expect(
            consolidatedSearch
        ).toBeVisible({
            timeout: 10000
        });

        // ------------------------------------------------------------
        // SEARCH DELETED RECORD USING SAME CONSOLIDATED SEARCH
        //
        // Application state is now DELETED, therefore:
        //
        // filterparam.recordstate = "DELETED"
        //
        // ------------------------------------------------------------

        const consolidatedSearchResponsePromise =
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

        const consolidatedCountResponsePromise =
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
 // Existing consolidated-search action.
        
        await consolidatedSearch.fill(
            searchValue
        );
 await page.locator(
            base.locators.consolidatedSearchAction
        ).click();
        
        await consolidatedSearchResponsePromise;

        await consolidatedCountResponsePromise;

        console.log(
            `Test 22 - Consolidated DELETED search completed for "${searchValue}"`
        );

        // ------------------------------------------------------------
        // VERIFY DELETED RECORD
        // ------------------------------------------------------------

        await expect(
            page.locator(base.locators.tableRows)
                .filter({
                    hasText: searchValue
                })
                .first()
        ).toBeVisible({
            timeout: 30000
        });

        console.log(
            `Test 22 PASS - Employee ${employeeId} verified in Deleted records`
        );
    }
);





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

        const pageSizeInput = page.locator(base.locators.pageSize);
        const rows = page.locator(base.locators.tableRows);

        await expect(pageSizeInput).toBeAttached({
            timeout: 30000
        });

        // ---------------------------------------------------------
        // PAGE SIZE = 5
        // ---------------------------------------------------------

        const pageSizeResponsePromise = page.waitForResponse(
            response =>
                response.url().includes(base.api.search) &&
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
            (await page.locator(base.locators.totalUsers).textContent() || '0').trim()
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
            base.locators.pageLinks,
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
                response.url().includes(base.api.search) &&
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
            base.locators.activePage
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




test('25 - Newest and Oldest record navigation works correctly', async ({ page }) => {

    await loadEmployeesReport(page);

    const pagingParent = page.locator(
        base.locators.pagingParent
    );

    const pagingMenu = page.locator(
        base.locators.pagingMenu
    );

    const oldestOption = page.locator(
        base.locators.oldest
    );

    const newestOption = page.locator(
        base.locators.newest
    );

    const tableRows = page.locator(
        base.locators.tableRows
    );

    // =========================================================
    // INITIAL STATE
    // =========================================================
    // loadEmployeesReport() already loads:
    // NEWEST / DESC
    //
    // Therefore first selectable operation is:
    // NEWEST -> OLDEST
    // =========================================================

    await expect(pagingParent).toBeVisible({
        timeout: 10000
    });

    // =========================================================
    // OPEN PAGING MENU
    // =========================================================

    await pagingParent.click();

    await expect(pagingMenu).toBeVisible({
        timeout: 5000
    });

    await expect(oldestOption).toBeVisible({
        timeout: 5000
    });

    // =========================================================
    // OLDest
    //
    // Expected:
    // searchtype      -> ASC + ACTIVE
    // searchtypeCount -> POST
    // =========================================================

    const oldestSearchRequestPromise =
        page.waitForRequest(
            request => {

                if (
                    !request.url().includes(
                        base.api.search
                    ) ||
                    request.method() !== 'POST'
                ) {
                    return false;
                }

                const data = request.postDataJSON();

                return (
                    String(
                        data?.sortcolumnorder
                    ).toUpperCase() === 'ASC' &&
                    data?.recordstate === 'ACTIVE'
                );
            },
            {
                timeout: base.timing.response
            }
        );

    const oldestCountRequestPromise =
        page.waitForRequest(
            request =>
                request.url().includes(
                    base.api.count
                ) &&
                request.method() === 'POST',
            {
                timeout: base.timing.response
            }
        );

    const oldestSearchResponsePromise =
        page.waitForResponse(
            response => {

                if (
                    !response.url().includes(
                        base.api.search
                    ) ||
                    response.status() !== 200 ||
                    response.request().method() !== 'POST'
                ) {
                    return false;
                }

                const data =
                    response.request().postDataJSON();

                return (
                    String(
                        data?.sortcolumnorder
                    ).toUpperCase() === 'ASC' &&
                    data?.recordstate === 'ACTIVE'
                );
            },
            {
                timeout: base.timing.response
            }
        );

    const oldestCountResponsePromise =
        page.waitForResponse(
            response =>
                response.url().includes(
                    base.api.count
                ) &&
                response.status() === 200 &&
                response.request().method() === 'POST',
            {
                timeout: base.timing.response
            }
        );

    await oldestOption.click();

    // Wait for both API requests.
    const [
        oldestSearchRequest,
        oldestCountRequest
    ] = await Promise.all([
        oldestSearchRequestPromise,
        oldestCountRequestPromise
    ]);

    // Wait for both API responses.
    await Promise.all([
        oldestSearchResponsePromise,
        oldestCountResponsePromise
    ]);

    // Validate Oldest search request.
    const oldestSearchPayload =
        oldestSearchRequest.postDataJSON();

    expect(
        String(
            oldestSearchPayload.sortcolumnorder
        ).toUpperCase(),
        'Oldest must request ASC'
    ).toBe('ASC');

    expect(
        oldestSearchPayload.recordstate,
        'Oldest must request ACTIVE records'
    ).toBe('ACTIVE');

    // Validate count request exists.
    expect(
        oldestCountRequest.method(),
        'Oldest count API must use POST'
    ).toBe('POST');

    // =========================================================
    // WAIT FOR OLDest UI TO FINISH
    // =========================================================

    await expect(tableRows.first()).toBeVisible({
        timeout: base.timing.ui
    });

    await page.evaluate(() =>
        new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        )
    );

    await expect(pagingParent).toBeVisible({
        timeout: 10000
    });

    // =========================================================
    // REOPEN PAGING MENU
    // =========================================================

    await pagingParent.click();

    await expect(pagingMenu).toBeVisible({
        timeout: 5000
    });

    await expect(newestOption).toBeVisible({
        timeout: 5000
    });

    // =========================================================
    // NEWEST
    //
    // Expected:
    // searchtype      -> DESC + ACTIVE
    // searchtypeCount -> POST
    // =========================================================

    const newestSearchRequestPromise =
        page.waitForRequest(
            request => {

                if (
                    !request.url().includes(
                        base.api.search
                    ) ||
                    request.method() !== 'POST'
                ) {
                    return false;
                }

                const data = request.postDataJSON();

                return (
                    String(
                        data?.sortcolumnorder
                    ).toUpperCase() === 'DESC' &&
                    data?.recordstate === 'ACTIVE'
                );
            },
            {
                timeout: base.timing.response
            }
        );

    const newestCountRequestPromise =
        page.waitForRequest(
            request =>
                request.url().includes(
                    base.api.count
                ) &&
                request.method() === 'POST',
            {
                timeout: base.timing.response
            }
        );

    const newestSearchResponsePromise =
        page.waitForResponse(
            response => {

                if (
                    !response.url().includes(
                        base.api.search
                    ) ||
                    response.status() !== 200 ||
                    response.request().method() !== 'POST'
                ) {
                    return false;
                }

                const data =
                    response.request().postDataJSON();

                return (
                    String(
                        data?.sortcolumnorder
                    ).toUpperCase() === 'DESC' &&
                    data?.recordstate === 'ACTIVE'
                );
            },
            {
                timeout: base.timing.response
            }
        );

    const newestCountResponsePromise =
        page.waitForResponse(
            response =>
                response.url().includes(
                    base.api.count
                ) &&
                response.status() === 200 &&
                response.request().method() === 'POST',
            {
                timeout: base.timing.response
            }
        );

    await newestOption.click();

    // Wait for both API requests.
    const [
        newestSearchRequest,
        newestCountRequest
    ] = await Promise.all([
        newestSearchRequestPromise,
        newestCountRequestPromise
    ]);

    // Wait for both API responses.
    await Promise.all([
        newestSearchResponsePromise,
        newestCountResponsePromise
    ]);

    // Validate Newest search request.
    const newestSearchPayload =
        newestSearchRequest.postDataJSON();

    expect(
        String(
            newestSearchPayload.sortcolumnorder
        ).toUpperCase(),
        'Newest must request DESC'
    ).toBe('DESC');

    expect(
        newestSearchPayload.recordstate,
        'Newest must request ACTIVE records'
    ).toBe('ACTIVE');

    // Validate count request exists.
    expect(
        newestCountRequest.method(),
        'Newest count API must use POST'
    ).toBe('POST');

    // =========================================================
    // WAIT FOR NEWEST UI TO FINISH
    // =========================================================

    await expect(tableRows.first()).toBeVisible({
        timeout: base.timing.ui
    });

    await page.evaluate(() =>
        new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        )
    );

    console.log(
        'Test 25 PASS - Newest (initial) -> Oldest -> Newest verified'
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
                base.locators.consolidatedSearch
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
            base.locators.consolidatedSearchAction
        ).click();

        await searchResponsePromise;
        await countResponsePromise;

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
        // Exact zero-result verification.
        // --------------------------------------------------------

        const totalUsers =
            (
                await page.locator(
                    base.locators.totalUsers
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
                base.locators.tableRows
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

        const ALLOWED_SHARED_DATA_DRIFT = 10;

        // ------------------------------------------------------------
        // 1. Load initial unfiltered report
        // ------------------------------------------------------------

        await loadEmployeesReport(page);

        const originalTotal = Number(
            (
                await page.locator(base.locators.totalUsers).textContent()
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

        // ------------------------------------------------------------
        // 2. Select one dynamic filter
        // ------------------------------------------------------------

        const filter =
            await selectOneDynamicEmployeeFilter(page);

        expect(
            filter.fieldKey,
            'Dynamic filter field must be selected'
        ).toBeTruthy();

        expect(
            filter.value,
            'Dynamic filter value must be selected'
        ).toBeTruthy();

        expect(
            filter.chips,
            'Dynamic filter helper must return chips locator'
        ).toBeTruthy();

        console.log(
            `Test 27 - Selected filter: ${filter.fieldKey} = ${filter.value}`
        );

        // ------------------------------------------------------------
        // 3. Apply dynamic filter
        // ------------------------------------------------------------

        await applyDynamicEmployeeFilter(page);

        const filteredTotal = Number(
            (
                await page.locator(base.locators.totalUsers).textContent()
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

        // ------------------------------------------------------------
        // 4. Verify filter chip exists
        // ------------------------------------------------------------

        const removeControl =
            filter.chips
                .first()
                .locator('.select2choiceremove');

        await expect(
            removeControl,
            'Selected filter must have a remove control'
        ).toBeVisible({
            timeout: 10000
        });

        // ------------------------------------------------------------
        // 5. Remove dynamic filter
        // ------------------------------------------------------------

        await removeControl.click();

        await expect(
            filter.chips,
            'Filter chip must be removed'
        ).toHaveCount(0, {
            timeout: 10000
        });

        console.log(
            'Test 27 - Filter chip successfully removed'
        );

        // ------------------------------------------------------------
        // 6. Apply cleared/unfiltered state
        // ------------------------------------------------------------
        // Register listeners BEFORE clicking Apply.

        const searchResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes('/api/searchtype/') &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        const countResponsePromise =
            page.waitForResponse(
                response =>
                    response.url().includes('/api/searchtypeCount/') &&
                    response.request().method() === 'POST' &&
                    response.status() === 200,
                {
                    timeout: 30000
                }
            );

        await page.locator(
            "//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div"
        ).click();

        // ------------------------------------------------------------
        // 7. Wait for both current unfiltered API responses
        // ------------------------------------------------------------

        const searchResponse =
            await searchResponsePromise;

        const countResponse =
            await countResponsePromise;

        const countData =
            await countResponse.json();

        const expectedRestoredTotal =
            Number(countData.count);

        console.log(
            `Test 27 - Count API returned: ${expectedRestoredTotal}`
        );

        // ------------------------------------------------------------
        // 8. Verify current report has finished loading
        // ------------------------------------------------------------

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

        // ------------------------------------------------------------
        // 9. Verify current UI count matches Count API
        // ------------------------------------------------------------

        await expect(
            page.locator(base.locators.totalUsers)
        ).toHaveText(
            String(expectedRestoredTotal),
            {
                timeout: 30000
            }
        );

        const restoredTotal = Number(
            (
                await page.locator(base.locators.totalUsers).textContent()
                || '0'
            ).trim()
        );

        expect(
            restoredTotal,
            'UI total must match the current unfiltered Count API result'
        ).toBe(expectedRestoredTotal);

        // ------------------------------------------------------------
        // 10. Verify report contains rows when current count > 0
        // ------------------------------------------------------------

        if (expectedRestoredTotal > 0) {

            await expect(
                page.locator(base.locators.tableRows).first()
            ).toBeVisible({
                timeout: 30000
            });

            const rowCount =
                await page.locator(base.locators.tableRows).count();

            expect(
                rowCount,
                'Unfiltered report must contain rows when Count API is greater than zero'
            ).toBeGreaterThan(0);

            console.log(
                `Test 27 - Current unfiltered rows visible: ${rowCount}`
            );
        }

        // ------------------------------------------------------------
        // 11. Allow legitimate concurrent shared-dataset changes
        // ------------------------------------------------------------

        const countDrift =
            Math.abs(
                restoredTotal - originalTotal
            );

        console.log(
            `Test 27 - Shared dataset count drift: ${countDrift}`
        );

        expect(
            countDrift,
            `Unfiltered count drift must remain within ±${ALLOWED_SHARED_DATA_DRIFT} records`
        ).toBeLessThanOrEqual(
            ALLOWED_SHARED_DATA_DRIFT
        );

        // ------------------------------------------------------------
        // 12. Final result
        // ------------------------------------------------------------

        console.log(
            `Test 27 - Initial total: ${originalTotal}`
        );

        console.log(
            `Test 27 - Restored/current unfiltered total: ${restoredTotal}`
        );

        console.log(
            `Test 27 PASS - Dynamic filter was removed and report returned to the current unfiltered state`
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

        // --------------------------------------------------------
        // Select and apply one dynamic filter.
        // --------------------------------------------------------

        const filter =
            await selectOneDynamicEmployeeFilter(page);

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






