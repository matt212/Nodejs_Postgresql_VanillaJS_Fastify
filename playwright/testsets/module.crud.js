// Reserved for incremental extraction after baseline validation.\nmodule.exports = {};
const { expect } = require('@playwright/test');

const {
    loadEmployeesReport,
} = require('../helpers/module.filters');


// ============================================================
// GENERIC CRUD VALUE GENERATORS
// ============================================================

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

    switch (
        String(fieldvalidatename).toLowerCase()
    ) {

        case 'string':

            return generateRandomAlphabetic(
                maxLength
            );


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


// ============================================================
// DATE DISPLAY FORMAT
// ============================================================

function formatExpectedTableValue(
    field,
    value
) {

    if (
        field.fieldtypename === 'DATE' &&
        value
    ) {

        const [
            day,
            month,
            year
        ] = String(value).split('-');

        return new Date(
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

    return value;
}


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


test('16 - CRUD - Create Employee using validationmap', async ({ page }) => {

    // ------------------------------------------------------------
    // Load the Employees report
    // ------------------------------------------------------------

    await loadEmployeesReport(page,base);


    // ------------------------------------------------------------
    // Open the Create Employee modal
    // ------------------------------------------------------------

    await page.locator(
        base.locators.createEmployee
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
        page.locator(base.locators.recordStateInput);

    const recordStateControl =
        page.locator(
            base.locators.recordStateControl
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
        page.locator(base.locators.modalSubmit);

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
                r.url().includes(base.api.create) &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        page.waitForResponse(
            r =>
                r.url().includes(base.api.search) &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        submitButton.click()
    ]);


    // ------------------------------------------------------------
    // Wait for the refreshed Employees table
    // ------------------------------------------------------------

    await expect(
        page.locator(base.locators.table)
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
        page.locator(base.locators.tableRows)
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

        await loadEmployeesReport(page,base);


        // ------------------------------------------------------------
        // Open the Create Employee modal
        // ------------------------------------------------------------

        await page.locator(
            base.locators.createEmployee
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
                page.locator(base.locators.modalSubmit)
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

    await loadEmployeesReport(page,base);


    // ------------------------------------------------------------
    // Open the Create Employee modal
    // ------------------------------------------------------------

    await page.locator(
        base.locators.createEmployee
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
        page.locator(base.locators.recordStateInput);

    const recordStateControl =
        page.locator(
            base.locators.recordStateControl
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
        page.locator(base.locators.modalSubmit);

    await expect(submitButton).toBeEnabled();


    const [
        createResponse,
        searchTypeResponse
    ] = await Promise.all([

        page.waitForResponse(
            r =>
                r.url().includes(base.api.create) &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        page.waitForResponse(
            r =>
                r.url().includes(base.api.search) &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        submitButton.click()
    ]);


    // ------------------------------------------------------------
    // Wait for refreshed table
    // ------------------------------------------------------------

    await expect(
        page.locator(base.locators.table)
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
        page.locator(base.locators.tableRows)
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
                r.url().includes(base.api.update) &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        page.waitForResponse(
            r =>
                r.url().includes(base.api.search) &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        submitButton.click()
    ]);


    // ------------------------------------------------------------
    // Wait for refreshed table
    // ------------------------------------------------------------

    await expect(
        page.locator(base.locators.table)
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
 await page.waitForSelector(base.locators.tableRows);
    employeeRow =
        page.locator(base.locators.tableRows)
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

    await loadEmployeesReport(page,base);


    // ------------------------------------------------------------
    // CREATE baseline record
    // ------------------------------------------------------------

    await page.locator(
        base.locators.createEmployee
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
        page.locator(base.locators.recordStateInput);

    const recordStateControl =
        page.locator(
            base.locators.recordStateControl
        );

    if (!(await recordStateInput.isChecked())) {
        await recordStateControl.click();
    }

    await expect(recordStateInput).toBeChecked();


    // ------------------------------------------------------------
    // CREATE
    // ------------------------------------------------------------

    const submitButton =
        page.locator(base.locators.modalSubmit);

    await Promise.all([

        page.waitForResponse(
            r =>
                r.url().includes(base.api.create) &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        page.waitForResponse(
            r =>
                r.url().includes(base.api.search) &&
                r.status() >= 200 &&
                r.status() < 300
        ),

        submitButton.click()
    ]);


    // ------------------------------------------------------------
    // Locate created row
    // ------------------------------------------------------------

    await expect(page.locator(base.locators.table)).toBeVisible();

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
        page.locator(base.locators.tableRows)
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
                    r.url().includes(base.api.update) &&
                    r.status() >= 200 &&
                    r.status() < 300
            ),

            page.waitForResponse(
                r =>
                    r.url().includes(base.api.search) &&
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
            page.locator(base.locators.tableRows)
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
})
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    registerModuleCrudTests
};