


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
// ============================================================

test(
    '11 - Multi-Column Filter - Dynamic fields return matching results',
    async ({ page }) => {

        await loadEmployeesReport(page);


        // ----------------------------------------------------
        // Get first row characters dynamically
        // ----------------------------------------------------

        const {
            firstCharacters
        } = await getFirstRowData(page);


        // ----------------------------------------------------
        // Open Filter Bar
        // ----------------------------------------------------

        await openFilterBar(page);


        // ----------------------------------------------------
        // Open Multi-Select Filters
        // ----------------------------------------------------

        await page.locator(
            "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
        ).click();


        await expect(
            page.locator('.fieldsfilterbar')
        ).toBeVisible();


        // ----------------------------------------------------
        // DYNAMIC FIELD DISCOVERY
        // ----------------------------------------------------

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
            'Dynamic Filter Input IDs:',
            inputIds
        );


        console.log(
            'Dynamic Filter Placeholders:',
            placeholders
        );


        console.log(
            'Dynamic Filter Fields:',
            autocompleteValues
        );


        // ----------------------------------------------------
        // ORIGINAL DYNAMIC LOOP
        // ----------------------------------------------------

        for (let i = 0; i < inputIds.length; i++) {

            const currentInputId =
                inputIds[i];

            const currentAttrValue =
                autocompleteValues[i];


            console.log(
                `--- Processing Filter Field: ${currentAttrValue} ---`
            );


            // Ignore controls that don't expose
            // a dynamic autocomplete field.
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
                    ? firstCharacters[
                        currentAttrValue
                    ].toLowerCase()
                    : 'a';


            await filterInput.fill(
                firstCharacterToFill
            );


            await Promise.all([

                page.waitForResponse(res =>
                    res.url().includes(
                        '/api/searchtypegroupby'
                    ) &&
                    res.status() === 200
                ),

                expect(
                    page.locator(
                        `#dv_${currentAttrValue}`
                    ).first()
                ).toBeVisible()

            ]);


            const links =
                page.locator(
                    `#dv_${currentAttrValue} div a.highlightselect`
                );


            const totalItems =
                await links.count();


            if (totalItems === 0) {

                console.log(
                    `No dropdown values generated for field: ${currentAttrValue}`
                );

                continue;
            }


            // Preserve your original random selection.
            const randomIndex =
                Math.floor(
                    Math.random() * totalItems
                );


            const rawName =
                await links
                    .nth(randomIndex)
                    .textContent();


            const chosenName =
                rawName.trim();


            console.log(
                `[${currentAttrValue}] Randomly clicking index ${randomIndex}: "${chosenName}"`
            );


            await links
                .nth(randomIndex)
                .click();


            const chipContainer =
                page.locator(
                    `#cltrl_filter_chips_${currentAttrValue}`
                );


            await expect(
                chipContainer
            ).toContainText(chosenName);


            // ------------------------------------------------
            // APPLY FILTER
            // ------------------------------------------------

            await page.locator(
                "//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div"
            ).click();


            await Promise.all([

                page.waitForResponse(res =>
                    res.url().includes(
                        '/api/searchtype/'
                    ) &&
                    res.status() === 200
                ),

                page.waitForResponse(res =>
                    res.url().includes(
                        '/api/searchtypeCount/'
                    ) &&
                    res.status() === 200
                )

            ]);


            // ------------------------------------------------
            // FIND THE SAME COLUMN DYNAMICALLY
            // ------------------------------------------------

            const compareHeader =
                page.locator(
                    `#basetable thead tr th[data-field-header="${currentAttrValue}"]`
                );


            const compareColumnIndex =
                await compareHeader.evaluate(
                    el => el.cellIndex
                );


            const compareColumnCells =
                page.locator(
                    `#basetable tbody tr td:nth-child(${compareColumnIndex})`
                );


            const extractedTableTexts =
                await compareColumnCells
                    .allTextContents();


            const cleanedTableNames =
                extractedTableTexts.map(
                    name => name.trim()
                );


            // ------------------------------------------------
            // DYNAMIC ASSERTION
            // ------------------------------------------------

            const allMatch =
                cleanedTableNames.every(
                    name =>
                        name === chosenName
                );


            expect(allMatch)
                .toBe(true);


            console.log(
                `[PASS] All tabular results for column successfully matched: "${chosenName}"`
            );
            await page.waitForTimeout(2000);
        }
    }

);


// ============================================================
// TEST 12
// DYNAMIC FILTER PERMUTATIONS
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


        expect(fieldKeys.length)
            .toBeGreaterThan(0);


        const expectedPermutations =
            fieldKeys.length * fieldKeys.length;

        let completedPermutations = 0;
        let verifiedColumnAssertions = 0;


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


                const getFirstCharacterForField = async fieldKey => {
                    const header =
                        page.locator(
                            `#basetable thead tr th[data-field-header="${fieldKey}"]`
                        );

                    const columnIndex =
                        await header.evaluate(
                            element => element.cellIndex
                        );

                    const values =
                        await page.locator(
                            `#basetable tbody tr td:nth-child(${columnIndex})`
                        ).allTextContents();

                    const firstValue =
                        values
                            .map(value => value.trim())
                            .find(value => value.length > 0);

                    expect(firstValue)
                        .toBeTruthy();

                    return firstValue.charAt(0).toLowerCase();
                };


                const permutation = [
                    firstField,
                    secondField
                ];

                const selectedValuesByField = {};


                for (const fieldKey of new Set(permutation)) {

                    const filterInput =
                        page.locator(
                            `.fieldsfilterbar input[data-multipleselect-autocomplete="${fieldKey}"]`
                        );


                    const searchCharacter =
                        await getFirstCharacterForField(fieldKey);


                    const dropdown =
                        page.locator(
                            `#dv_${fieldKey}:visible`
                        ).first();


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


                    const option =
                        dropdown.locator(
                            'div a.highlightselect'
                        ).first();


                    await expect(option).toBeVisible();

                    const selectedValue =
                        (await option.textContent()).trim();


                    await option.click();


                    await expect(
                        page.locator(
                            `#cltrl_filter_chips_${fieldKey}`
                        )
                    ).toContainText(selectedValue);

                    selectedValuesByField[fieldKey] = [
                        selectedValue
                    ];
                }


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


                completedPermutations++;


                console.log(
                    `[PASS] Filter permutation: ${firstField} -> ${secondField}`
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
            `Permutation summary: ${completedPermutations}/${expectedPermutations} combinations passed (${passPercentage}%) | ${sameFieldPermutations} same-field cases | ${crossFieldPermutations} cross-field cases | ${verifiedColumnAssertions} table-column assertions`,
            async () => {}
        );


        await page.waitForTimeout(3000);
    }
);


// ============================================================
// TEST 13
// DYNAMIC MULTI-SELECT FILTER PERMUTATIONS
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

                                await expect(
                                    page.locator(
                                        `#cltrl_filter_chips_${fieldKey}`
                                    ).filter({
                                        hasText: selectedValue
                                    }).first()
                                ).toContainText(selectedValue);
                            }
                        );
                    }


                    expect(selectedValues.length)
                        .toBeGreaterThan(0);

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
    // Load the Employees report and wait until the page is ready
    // ------------------------------------------------------------

    await loadEmployeesReport(page);


    // ------------------------------------------------------------
    // Open the Create Employee modal
    // ------------------------------------------------------------

    await page.locator(
        'xpath=/html/body/div[2]/div[2]/section/div[1]/div[2]/div[1]/div[2]/div[1]/div/a'
    ).click();


    // ------------------------------------------------------------
    // Generate test data dynamically from validationmap
    // and fill each configured form control
    // ------------------------------------------------------------

    const createdValues = {};

    for (const field of validationConfig.validationmap) {

        const { inputname } = field;

        const control = page.locator(
            `[data-key-type="${inputname}"]`
        );

        // Ensure the configured control is available in the form
        await expect(control).toBeVisible();

        // Generate a value based on the field's validation configuration
        const value = String(
            generateTestValue(field)
        );

        // Type the generated value into the control
        await control.pressSequentially(value);

        // Store the value so it can be verified after creation
        createdValues[inputname] = value;
    }


    // ------------------------------------------------------------
    // Enable Record State
    // ------------------------------------------------------------

    const recordStateInput =
        page.locator('#cltrlrecordstate');

    // Material UI uses a visible wrapper for the checkbox
    const recordStateControl =
        page.locator(
            'xpath=/html/body/div[3]/div/div/div[2]/div[1]/form/div/div[5]/div/div/label/div'
        );

    await expect(recordStateControl).toBeVisible();

    // Enable Record State only when it is currently unchecked
    if (!(await recordStateInput.isChecked())) {
        await recordStateControl.click();
    }

    await expect(recordStateInput).toBeChecked();

    // Store the value for post-create verification
    createdValues.recordstate = true;


    // ------------------------------------------------------------
    // Submit the Create Employee form
    // ------------------------------------------------------------

    const submitButton =
        page.locator('#btnmodalsub');

    await expect(submitButton).toBeEnabled();


    // ------------------------------------------------------------
    // Wait for both APIs triggered by the Create operation:
    //
    // 1. Create API       → persists the employee
    // 2. SearchType API   → refreshes the Employees table
    //
    // The response listeners are registered before clicking Submit
    // so neither request can be missed.
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
    // Locate the newly created employee
    //
    // first_name is used as the unique row anchor because the
    // generated test value is unique for this test execution.
    // ------------------------------------------------------------

    const createdRow =
        page.locator('#basetable tbody tr')
            .filter({
                hasText: createdValues.first_name
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
        // Get the expected value generated during record creation
        // --------------------------------------------------------

        let expectedValue =
            createdValues[inputname];


        // --------------------------------------------------------
        // Convert DATE input value into the format displayed
        // by the Employees table
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
        // Find the table header corresponding to the field
        // --------------------------------------------------------

        const header =
            page.locator(
                `#basetable thead tr th[data-field-header="${inputname}"]`
            );

        await expect(header).toBeVisible();


        // --------------------------------------------------------
        // Use the header position to locate the corresponding
        // cell in the newly created row.
        //
        // The -1 accounts for the additional leading cell in
        // the table body row.
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
        // Read the actual value displayed in the table
        // --------------------------------------------------------

        const actualValue =
            (await cell.innerText()).trim();


        // --------------------------------------------------------
        // Verify the database-created value against the value
        // displayed in the Employees table
        // --------------------------------------------------------

        expect(actualValue).toBe(expectedValue);
    }
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






