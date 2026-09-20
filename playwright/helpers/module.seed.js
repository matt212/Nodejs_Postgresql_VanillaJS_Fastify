// ============================================================
// GENERIC MODULE SEED
//
// Creates baseline records required by the Playwright suite.
// This is NOT a normal test.
// It is executed from baseline.spec.js using beforeAll().
// ============================================================

const { expect } = require('@playwright/test');

const {
    generateTestValue
} = require('./module.values');


// ============================================================
// SEED MODULE DATA
// ============================================================

async function seedModuleData({
    page,
    mod,
    base,
    validationConfig,
    openControlBar,
    recordCount = 10
}) {

    console.log(
        `[SEED] Starting module seed for "${mod.Name}"`
    );

    console.log(
        `[SEED] Creating ${recordCount} baseline records`
    );


    // ========================================================
    // LOAD MODULE
    // ========================================================

    await page.goto(
        '/' + mod.Name
    );

    await page.waitForTimeout(
        3000
    );


    // ========================================================
    // OPEN CONTROL BAR
    // ========================================================

    await openControlBar(
        page,
        base
    );


    // ========================================================
    // CREATE BASELINE RECORDS
    // ========================================================

    for (
        let recordNo = 1;
        recordNo <= recordCount;
        recordNo++
    ) {

        console.log(
            `[SEED] Creating record ${recordNo}/${recordCount}`
        );


        // ----------------------------------------------------
        // OPEN CREATE MODAL
        // ----------------------------------------------------

        await page.locator(
            base.locators.createEmployee
        ).click();


        // ----------------------------------------------------
        // FILL ALL CONFIGURED FIELDS
        // ----------------------------------------------------

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


            // IMPORTANT:
            // Values come ONLY from module.values.js
            const value =
                String(
                    generateTestValue(field)
                );


            console.log(
                `[SEED] Record ${recordNo} | ` +
                `${inputname} = "${value}"`
            );


            await control.pressSequentially(
                value
            );
        }


        // ====================================================
        // RECORD STATE
        //
        // Application should have Active checked by default.
        // We VERIFY it instead of clicking it.
        // ====================================================

        


        // ====================================================
        // SUBMIT
        // ====================================================

        const submitButton =
            page.locator(
                base.locators.modalSubmit
            );


        await expect(
            submitButton
        ).toBeEnabled();


        // ====================================================
        // CREATE + TABLE REFRESH
        // ====================================================

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


        // ====================================================
        // VERIFY TABLE AVAILABLE
        // ====================================================

        await expect(
            page.locator(
                base.locators.table
            )
        ).toBeVisible();


        console.log(
            `[SEED] Record ${recordNo}/${recordCount} created`
        );
    }


    // ========================================================
    // FINAL RESULT
    // ========================================================

    console.log(
        `[SEED] Successfully created ${recordCount} ` +
        `baseline records for "${mod.Name}"`
    );
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    seedModuleData
};