const { expect } = require('@playwright/test');

const {
    loadEmployeesReport
} = require('../helpers/module.filters');

const {
    generateTestValue,
    formatExpectedTableValue
} = require('../helpers/module.values');


// ============================================================
// GET TABLE HEADER INDEX
// ============================================================

async function getTableColumnIndex(
    page,
    base,
    inputname
) {

    const header =
        page.locator(
            `${base.locators.tableHeaders}[data-field-header="${inputname}"]`
        );

    await expect(header).toBeVisible();

    return await header.evaluate(
        el => el.cellIndex
    );
}


// ============================================================
// VERIFY ONE TABLE FIELD
// ============================================================

async function verifyTableField(
    page,
    base,
    row,
    field,
    expectedValue,
    logPrefix
) {

    const formattedExpectedValue =
        formatExpectedTableValue(
            field,
            expectedValue
        );

    const headerIndex =
        await getTableColumnIndex(
            page,
            base,
            field.inputname
        );

    const cell =
        row
            .locator('td')
            .nth(headerIndex - 1);

    const actualValue =
        (
            await cell.innerText()
        ).trim();

    console.log(
        `[${logPrefix}] ${field.inputname} | ` +
        `Expected: "${formattedExpectedValue}" | ` +
        `Actual: "${actualValue}"`
    );

    expect(actualValue)
        .toBe(
            formattedExpectedValue
        );
}


// ============================================================
// LOCATE ROW USING ANCHOR FIELD
// ============================================================

async function findRowByAnchor(
    page,
    base,
    field,
    value
) {

    const anchorValue =
        formatExpectedTableValue(
            field,
            value
        );

    const row =
        page
            .locator(base.locators.tableRows)
            .filter({
                hasText: anchorValue
            })
            .first();

    await expect(row).toBeVisible();

    return row;
}


// ============================================================
// TEST SET
// ============================================================

function registerModuleCrudTests({
    test,
    base,
    mod,
    validationConfig
}) {


    // ========================================================
    // TEST 16
    // CREATE EMPLOYEE USING VALIDATIONMAP
    // ========================================================

    test(
        '16 - CRUD - Create Employee using validationmap',
        async ({ page }) => {

            await loadEmployeesReport(
                page,
                base
            );


            // ------------------------------------------------
            // OPEN CREATE MODAL
            // ------------------------------------------------

            await page.locator(
                base.locators.createEmployee
            ).click();


            // ------------------------------------------------
            // GENERATE + FILL ALL FIELDS
            // ------------------------------------------------

            const createdValues = {};

            for (
                const field
                of validationConfig.validationmap
            ) {

                const {
                    inputname
                } = field;

                const control =
                    page.locator(
                        `[data-key-type="${inputname}"]`
                    );

                await expect(
                    control
                ).toBeVisible();

                const value =
                    String(
                        generateTestValue(field)
                    );

                await control.pressSequentially(
                    value
                );

                createdValues[inputname] =
                    value;
            }


            // ------------------------------------------------
            // RECORD STATE
            // ------------------------------------------------

            const recordStateInput =
                page.locator(
                    base.locators.recordStateInput
                );

           

            /*
             * Record State is expected to be checked
             * by default by the application.
             *
             * Do NOT click it here.
             */

            await expect(
                recordStateInput
            ).toBeChecked();

            createdValues.recordstate =
                true;


            // ------------------------------------------------
            // SUBMIT
            // ------------------------------------------------

            const submitButton =
                page.locator(
                    base.locators.modalSubmit
                );

            await expect(
                submitButton
            ).toBeEnabled();


            await Promise.all([

                page.waitForResponse(
                    response =>
                        response.url()
                            .includes(
                                base.api.create
                            ) &&
                        response.status() >= 200 &&
                        response.status() < 300
                ),

                page.waitForResponse(
                    response =>
                        response.url()
                            .includes(
                                base.api.search
                            ) &&
                        response.status() >= 200 &&
                        response.status() < 300
                ),

                submitButton.click()
            ]);


            // ------------------------------------------------
            // TABLE REFRESHED
            // ------------------------------------------------

            await expect(
                page.locator(
                    base.locators.table
                )
            ).toBeVisible();


            // ------------------------------------------------
            // LOCATE CREATED ROW
            // ------------------------------------------------

            const anchorField =
                validationConfig.validationmap[0];

            const createdRow =
                await findRowByAnchor(
                    page,
                    base,
                    anchorField,
                    createdValues[
                        anchorField.inputname
                    ]
                );


            // ------------------------------------------------
            // VERIFY ALL FIELDS
            // ------------------------------------------------

            for (
                const field
                of validationConfig.validationmap
            ) {

                await verifyTableField(
                    page,
                    base,
                    createdRow,
                    field,
                    createdValues[
                        field.inputname
                    ],
                    'CRUD CREATE VERIFY'
                );
            }


            console.log(
                '[PASS] Test 16 - Employee created and verified successfully'
            );
        }
    );


    // ========================================================
    // TEST 17
    // DYNAMIC FIELD CARTESIAN PRODUCT VALIDATION
    // ========================================================

    test(
        '17 - data Form - dynamic field cartesian product validation using validationmap',
        async ({ page }) => {

            await loadEmployeesReport(
                page,
                base
            );


            // ------------------------------------------------
            // OPEN CREATE MODAL
            // ------------------------------------------------

            await page.locator(
                base.locators.createEmployee
            ).click();


            const fields =
                validationConfig.validationmap;


            // ------------------------------------------------
            // N x N COMBINATIONS
            // ------------------------------------------------

            const combinations =
                fields.flatMap(
                    field =>
                        fields.map(
                            otherField => [
                                field,
                                otherField
                            ]
                        )
                );


            console.log(
                `[VALIDATION] Fields: ${fields.length}`
            );

            console.log(
                `[VALIDATION] Combinations: ${combinations.length}`
            );


            // ------------------------------------------------
            // EXECUTE EVERY COMBINATION
            // ------------------------------------------------

            for (
                const combination
                of combinations
            ) {

                console.log(
                    `[VALIDATION] Combination: ${
                        combination
                            .map(
                                field =>
                                    field.inputname
                            )
                            .join(' + ')
                    }`
                );


                // --------------------------------------------
                // FILL FIELDS
                // --------------------------------------------

                for (
                    const field
                    of combination
                ) {

                    const control =
                        page.locator(
                            `[data-key-type="${field.inputname}"]`
                        );

                    await expect(
                        control
                    ).toBeVisible();

                    const value =
                        String(
                            generateTestValue(field)
                        );

                    await control.pressSequentially(
                        value
                    );
                }


                // --------------------------------------------
                // UNIQUE FIELDS
                // --------------------------------------------

                const fieldsToValidate =
                    [
                        ...new Map(
                            combination.map(
                                field => [
                                    field.inputname,
                                    field
                                ]
                            )
                        ).values()
                    ];


                // --------------------------------------------
                // CLEAR + VALIDATE
                // --------------------------------------------

                for (
                    const field
                    of fieldsToValidate
                ) {

                    const control =
                        page.locator(
                            `[data-key-type="${field.inputname}"]`
                        );

                    await control.press(
                        'ControlOrMeta+A'
                    );

                    await control.press(
                        'Backspace'
                    );


                    await expect(
                        page.locator(
                            `#lblmsg${field.inputname}`
                        )
                    ).toBeVisible();
                }


                // --------------------------------------------
                // SUBMIT MUST REMAIN DISABLED
                // --------------------------------------------

                await expect(
                    page.locator(
                        base.locators.modalSubmit
                    )
                ).toBeDisabled();


                // --------------------------------------------
                // RESET
                // --------------------------------------------

                for (
                    const field
                    of fieldsToValidate
                ) {

                    await page.locator(
                        `[data-key-type="${field.inputname}"]`
                    ).fill('');
                }
            }
        }
    );


    // ========================================================
    // TEST 18
    // CREATE + UPDATE EMPLOYEE
    // ========================================================

    test(
        '18 - CRUD - Create and Update Employee using validationmap',
        async ({ page }) => {

            await loadEmployeesReport(
                page,
                base
            );


            // ------------------------------------------------
            // OPEN CREATE MODAL
            // ------------------------------------------------

            await page.locator(
                base.locators.createEmployee
            ).click();


            // ------------------------------------------------
            // CREATE
            // ------------------------------------------------

            const createdValues = {};

            for (
                const field
                of validationConfig.validationmap
            ) {

                const {
                    inputname
                } = field;

                const control =
                    page.locator(
                        `[data-key-type="${inputname}"]`
                    );

                await expect(
                    control
                ).toBeVisible();

                const value =
                    String(
                        generateTestValue(field)
                    );

                await control.pressSequentially(
                    value
                );

                createdValues[inputname] =
                    value;
            }


            // ------------------------------------------------
            // RECORD STATE
            // ------------------------------------------------

            const recordStateInput =
                page.locator(
                    base.locators.recordStateInput
                );

            await expect(
                recordStateInput
            ).toBeChecked();


            // ------------------------------------------------
            // CREATE
            // ------------------------------------------------

            const submitButton =
                page.locator(
                    base.locators.modalSubmit
                );

            await expect(
                submitButton
            ).toBeEnabled();


            await Promise.all([

                page.waitForResponse(
                    response =>
                        response.url()
                            .includes(
                                base.api.create
                            ) &&
                        response.status() >= 200 &&
                        response.status() < 300
                ),

                page.waitForResponse(
                    response =>
                        response.url()
                            .includes(
                                base.api.search
                            ) &&
                        response.status() >= 200 &&
                        response.status() < 300
                ),

                submitButton.click()
            ]);


            await expect(
                page.locator(
                    base.locators.table
                )
            ).toBeVisible();


            // ------------------------------------------------
            // LOCATE CREATED ROW
            // ------------------------------------------------

            const anchorField =
                validationConfig.validationmap[0];

            let employeeRow =
                await findRowByAnchor(
                    page,
                    base,
                    anchorField,
                    createdValues[
                        anchorField.inputname
                    ]
                );


            // ------------------------------------------------
            // VERIFY CREATE
            // ------------------------------------------------

            for (
                const field
                of validationConfig.validationmap
            ) {

                await verifyTableField(
                    page,
                    base,
                    employeeRow,
                    field,
                    createdValues[
                        field.inputname
                    ],
                    'CREATE VERIFY'
                );
            }


            // =================================================
            // UPDATE
            // =================================================

            console.log(
                '[CRUD] Created record verified. Starting UPDATE...'
            );


            const editButton =
                employeeRow.locator(
                    'td[data-tbledit-type] a'
                ).first();

            await expect(
                editButton
            ).toBeVisible();

            await editButton.click();


            // ------------------------------------------------
            // VERIFY EDIT FORM
            // ------------------------------------------------

            for (
                const field
                of validationConfig.validationmap
            ) {

                await expect(
                    page.locator(
                        `[data-key-type="${field.inputname}"]`
                    )
                ).toBeVisible();
            }


            // ------------------------------------------------
            // GENERATE UPDATED VALUES
            // ------------------------------------------------

            const updatedValues = {};

            for (
                const field
                of validationConfig.validationmap
            ) {

                const {
                    inputname
                } = field;

                const control =
                    page.locator(
                        `[data-key-type="${inputname}"]`
                    );

                const value =
                    String(
                        generateTestValue(field)
                    );

                await control.press(
                    'ControlOrMeta+A'
                );

                await control.press(
                    'Backspace'
                );

                await control.pressSequentially(
                    value
                );

                updatedValues[inputname] =
                    value;
            }


            // ------------------------------------------------
            // RECORD STATE MUST REMAIN ACTIVE
            // ------------------------------------------------

            await expect(
                recordStateInput
            ).toBeChecked();


            // ------------------------------------------------
            // UPDATE
            // ------------------------------------------------

            await expect(
                submitButton
            ).toBeEnabled();


            await Promise.all([

                page.waitForResponse(
                    response =>
                        response.url()
                            .includes(
                                base.api.update
                            ) &&
                        response.status() >= 200 &&
                        response.status() < 300
                ),

                page.waitForResponse(
                    response =>
                        response.url()
                            .includes(
                                base.api.search
                            ) &&
                        response.status() >= 200 &&
                        response.status() < 300
                ),

                submitButton.click()
            ]);


            await expect(
                page.locator(
                    base.locators.table
                )
            ).toBeVisible();


            // ------------------------------------------------
            // LOCATE UPDATED ROW
            // ------------------------------------------------

            employeeRow =
                await findRowByAnchor(
                    page,
                    base,
                    anchorField,
                    updatedValues[
                        anchorField.inputname
                    ]
                );


            // ------------------------------------------------
            // VERIFY UPDATED VALUES
            // ------------------------------------------------

            for (
                const field
                of validationConfig.validationmap
            ) {

                await verifyTableField(
                    page,
                    base,
                    employeeRow,
                    field,
                    updatedValues[
                        field.inputname
                    ],
                    'UPDATE VERIFY'
                );
            }


            console.log(
                '[PASS] Test 18 - Employee created, updated and verified successfully'
            );
        }
    );


    // ========================================================
    // TEST 19
    // UPDATE EACH FIELD INDIVIDUALLY
    // ========================================================

    test(
        '19 - CRUD - Update each field individually using validationmap',
        async ({ page }) => {

            await loadEmployeesReport(
                page,
                base
            );


            // ------------------------------------------------
            // CREATE BASELINE RECORD
            // ------------------------------------------------

            await page.locator(
                base.locators.createEmployee
            ).click();


            const originalValues = {};

            for (
                const field
                of validationConfig.validationmap
            ) {

                const {
                    inputname
                } = field;

                const control =
                    page.locator(
                        `[data-key-type="${inputname}"]`
                    );

                await expect(
                    control
                ).toBeVisible();

                const value =
                    String(
                        generateTestValue(field)
                    );

                await control.pressSequentially(
                    value
                );

                originalValues[inputname] =
                    value;
            }


            // ------------------------------------------------
            // RECORD STATE
            // ------------------------------------------------

            const recordStateInput =
                page.locator(
                    base.locators.recordStateInput
                );

            await expect(
                recordStateInput
            ).toBeChecked();


            // ------------------------------------------------
            // CREATE BASELINE
            // ------------------------------------------------

            const submitButton =
                page.locator(
                    base.locators.modalSubmit
                );

            await expect(
                submitButton
            ).toBeEnabled();


            await Promise.all([

                page.waitForResponse(
                    response =>
                        response.url()
                            .includes(
                                base.api.create
                            ) &&
                        response.status() >= 200 &&
                        response.status() < 300
                ),

                page.waitForResponse(
                    response =>
                        response.url()
                            .includes(
                                base.api.search
                            ) &&
                        response.status() >= 200 &&
                        response.status() < 300
                ),

                submitButton.click()
            ]);


            await expect(
                page.locator(
                    base.locators.table
                )
            ).toBeVisible();


            // ------------------------------------------------
            // LOCATE BASELINE RECORD
            // ------------------------------------------------

            const anchorField =
                validationConfig.validationmap[0];

            let employeeRow =
                await findRowByAnchor(
                    page,
                    base,
                    anchorField,
                    originalValues[
                        anchorField.inputname
                    ]
                );


            // =================================================
            // UPDATE EACH FIELD INDIVIDUALLY
            // =================================================

            for (
                const field
                of validationConfig.validationmap
            ) {

                const {
                    inputname
                } = field;

                console.log(
                    `[PARTIAL UPDATE] Updating only: ${inputname}`
                );


                // ------------------------------------------------
                // OPEN EDIT
                // ------------------------------------------------

                const editButton =
                    employeeRow.locator(
                        'td[data-tbledit-type] a'
                    ).first();

                await expect(
                    editButton
                ).toBeVisible();

                await editButton.click();


                // ------------------------------------------------
                // VERIFY EDIT FORM
                // ------------------------------------------------

                for (
                    const configuredField
                    of validationConfig.validationmap
                ) {

                    await expect(
                        page.locator(
                            `[data-key-type="${configuredField.inputname}"]`
                        )
                    ).toBeVisible();
                }


                // ------------------------------------------------
                // UPDATE ONLY CURRENT FIELD
                // ------------------------------------------------

                const control =
                    page.locator(
                        `[data-key-type="${inputname}"]`
                    );

                const newValue =
                    String(
                        generateTestValue(field)
                    );

                await control.press(
                    'ControlOrMeta+A'
                );

                await control.press(
                    'Backspace'
                );

                await control.pressSequentially(
                    newValue
                );


                // ------------------------------------------------
                // SUBMIT UPDATE
                // ------------------------------------------------

                await expect(
                    submitButton
                ).toBeEnabled();


                await Promise.all([

                    page.waitForResponse(
                        response =>
                            response.url()
                                .includes(
                                    base.api.update
                                ) &&
                            response.status() >= 200 &&
                            response.status() < 300
                    ),

                    page.waitForResponse(
                        response =>
                            response.url()
                                .includes(
                                    base.api.search
                                ) &&
                            response.status() >= 200 &&
                            response.status() < 300
                    ),

                    submitButton.click()
                ]);


                // ------------------------------------------------
                // EXPECTED STATE
                // ------------------------------------------------

                const expectedValues = {
                    ...originalValues,
                    [inputname]: newValue
                };


                // ------------------------------------------------
                // LOCATE UPDATED ROW
                // ------------------------------------------------

                employeeRow =
                    await findRowByAnchor(
                        page,
                        base,
                        anchorField,
                        expectedValues[
                            anchorField.inputname
                        ]
                    );


                // ------------------------------------------------
                // VERIFY EVERY FIELD
                // ------------------------------------------------

                for (
                    const verifyField
                    of validationConfig.validationmap
                ) {

                    await verifyTableField(
                        page,
                        base,
                        employeeRow,
                        verifyField,
                        expectedValues[
                            verifyField.inputname
                        ],
                        'PARTIAL UPDATE VERIFY'
                    );
                }


                // ------------------------------------------------
                // PERSIST NEW VALUE
                // ------------------------------------------------

                originalValues[inputname] =
                    newValue;
            }


            console.log(
                '[PASS] Test 19 - Every field updated individually and all untouched fields preserved'
            );
        }
    );
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    registerModuleCrudTests
};