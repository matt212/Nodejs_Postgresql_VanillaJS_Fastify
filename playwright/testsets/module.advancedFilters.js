const { test, expect } = require('@playwright/test');




const {
    openControlBar,
    applyDateRange,
    loadEmployeesReport,
    openFilterBar,
    getFirstRowData
} = require('../helpers/module.filters');

function registerModuleAdvancedFilterTests({
    test,
    base,
    mod,
    validationConfig
}) {


// Reserved for incremental extraction after baseline validation.\nmodule.exports = {};
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

                await loadEmployeesReport(page,base);

                await openFilterBar(page,base);

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

        await loadEmployeesReport(page,base);
        await openFilterBar(page,base);

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

                await loadEmployeesReport(page,base);
                await openFilterBar(page,base);

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
)}
module.exports = {
    registerModuleAdvancedFilterTests
};
