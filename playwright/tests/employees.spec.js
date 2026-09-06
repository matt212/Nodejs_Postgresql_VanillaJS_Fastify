


const { test, expect } = require('@playwright/test');





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
        picker.setEndDate('2026-09-06');
    });

    console.log(
        'Date range:',
        await page.locator('#reservation').inputValue()
    );

    await page.locator(
        '.daterangepicker .applyBtn'
    ).click();

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


                for (const fieldKey of new Set(permutation)) {

                    const filterInput =
                        page.locator(
                            `.fieldsfilterbar input[data-multipleselect-autocomplete="${fieldKey}"]`
                        );


                    const searchCharacter =
                        await getFirstCharacterForField(fieldKey);


                    const dropdown =
                        page.locator(
                            `#dv_${fieldKey}`
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


                console.log(
                    `[PASS] Filter permutation: ${firstField} -> ${secondField}`
                );
            }
        }


        await page.waitForTimeout(3000);
    }
);


// ============================================================
// TEST 13
// DYNAMIC COLUMN SORTING
// ============================================================

test(
    '13 - Multi-Column Sort - Dynamic fields sort ascending and descending',
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
// TEST 14
// FILTER BAR SCREENSHOT / FINAL UI STATE
// ============================================================

test(
    '14 - Employees - Filtered report UI is displayed correctly',
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



