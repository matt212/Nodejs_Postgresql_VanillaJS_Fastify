const { test, expect } = require('@playwright/test');

test('Login and Employees page loads', async ({ page }) => {

    // Go directly to Employees
    await page.goto('/employees');

    // Login page should appear because we are not authenticated
    await expect(page.locator('#txtname')).toBeVisible();
    await expect(page.locator('#txtpass')).toBeVisible();

    // Login
    await page.locator('#txtname').fill('krennic');
    await page.locator('#txtpass').fill('orson');

    await page.getByRole('button', { name: 'Submit' }).click();

    // Wait until login navigation completes
    await expect(page).toHaveURL(/employees/);

    // Wait for the Employees page to actually finish loading
    await page.waitForLoadState('domcontentloaded');

    // Verify we are on Employees
    await expect(page).toHaveURL(/employees/);
     // 6. Screenshot
    // await page.screenshot({
    //     path: 'playwright/screenshots/employees-loaded.png',
    //     fullPage: true
    // });

    // 7. Keep browser visible for 3 seconds
    await page.waitForTimeout(3000);
    // 4. Click + to open date-range accordion
    // TODO: exact selector from your HTML

    // Find Control Bar specifically
const controlBar = page.locator(
    "//div[contains(@class,'box')][.//h3[normalize-space()='Control Bar']][1]"
);

// Click Control Bar +
await page.locator(
    "//h3[normalize-space()='Control Bar']/following-sibling::div[contains(@class,'box-tools')]//button[@data-widget='collapse']"
).click();

// Control Bar is considered loaded when its date-range control is visible
await expect(page.locator('#reservation')).toBeVisible();

// Open date picker
await page.locator('#reservation').click();
    

  // Set the daterangepicker internal state
await page.evaluate(() => {
    const input = window.jQuery('#reservation');
    const picker = input.data('daterangepicker');

    if (!picker) {
        throw new Error('daterangepicker instance not found on #reservation');
    }

    picker.setStartDate('1982-08-07');
    picker.setEndDate('2026-09-06');
});

// Verify the displayed date range
console.log(
    'Date range:',
    await page.locator('#reservation').inputValue()
);

// Click the actual Apply button
await page.locator(
    '.daterangepicker .applyBtn'
).click();

// Wait for the application to finish loading the report
await expect(page.locator('#dvreportcontainer'))
    .not.toHaveClass(/loading-report-container/);

// Optional: wait until the report table is visible
await expect(page.locator('#divreportcontent').first()).toBeVisible();

// Take evidence screenshot
await page.screenshot({
    path: 'playwright/screenshots/employees-date-filtered.png',
    fullPage: true
});

await page.waitForTimeout(20000);


});