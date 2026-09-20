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

function registerModuleFilterTests({
    test,
    base,
    mod,
    validationConfig
}) {

// Reserved for incremental extraction after baseline validation.\nmodule.exports = {};
// ============================================================
// TEST 08
// FILTER BAR
// ============================================================

test(
    '08 - Filter Bar - User can open Filter Bar',
    async ({ page }) => {

        await loadEmployeesReport(page,base);

        await openFilterBar(page,base);

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

        await loadEmployeesReport(page,base);

        await openFilterBar(page,base);


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

        await loadEmployeesReport(page,base);

        await openFilterBar(page,base);


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

        await loadEmployeesReport(page,base);

        const {
            firstCharacters
        } = await getFirstRowData(page,base);

        await openFilterBar(page,base);

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
                    base.locators.dynamicFilterApply
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

        await loadEmployeesReport(page,base);
        await openFilterBar(page,base);

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

                await loadEmployeesReport(page,base);
                await openFilterBar(page,base);

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
                                base.locators.dynamicFilterApply
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

        await loadEmployeesReport(page,base);

        await openFilterBar(page,base);

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

                await loadEmployeesReport(page,base);

                await openFilterBar(page,base);

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
                               base.locators.dynamicFilterApply
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
)


// ============================================================
// TEST 25
// EMPTY RESULT SEARCH
// ============================================================

test(
    '25 - Consolidated search returns zero records for a non-existent value',
    async ({ page }) => {

        test.setTimeout(120000);

        await loadEmployeesReport(page,base);

        await openFilterBar(page,base);

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
            `Test 25 - Search count: ${totalUsers}`
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
            'Test 25 PASS - Empty-result search verified'
        );
    }
);


// ============================================================
// TEST 26
// CLEAR / REMOVE FILTER
// ============================================================



test(
    '26 - Clear and remove dynamic filter returns report to unfiltered state',
    async ({ page }) => {

        test.setTimeout(120000);

        const ALLOWED_SHARED_DATA_DRIFT = 10;

        // ------------------------------------------------------------
        // 1. Load initial unfiltered report
        // ------------------------------------------------------------

        await loadEmployeesReport(page,base);

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
            `Test 26 - Initial total: ${originalTotal}`
        );

        // ------------------------------------------------------------
        // 2. Select one dynamic filter
        // ------------------------------------------------------------

        const filter =
            await selectOneDynamicEmployeeFilter(page,base);

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
            `Test 26 - Selected filter: ${filter.fieldKey} = ${filter.value}`
        );

        // ------------------------------------------------------------
        // 3. Apply dynamic filter
        // ------------------------------------------------------------

        await applyDynamicEmployeeFilter(page,base);

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
            `Test 26 - Filtered total: ${filteredTotal}`
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
            'Test 26 - Filter chip successfully removed'
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
            base.locators.dynamicFilterApply
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
            `Test 26 - Count API returned: ${expectedRestoredTotal}`
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
                `Test 26 - Current unfiltered rows visible: ${rowCount}`
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
            `Test 26 - Shared dataset count drift: ${countDrift}`
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
            `Test 26 - Initial total: ${originalTotal}`
        );

        console.log(
            `Test 26 - Restored/current unfiltered total: ${restoredTotal}`
        );

        console.log(
            `Test 26 PASS - Dynamic filter was removed and report returned to the current unfiltered state`
        );
    }
);
}

module.exports = {
    registerModuleFilterTests
};