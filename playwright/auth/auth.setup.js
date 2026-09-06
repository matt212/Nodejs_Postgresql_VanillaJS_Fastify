const { test: setup, expect } = require('@playwright/test');

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {

    await page.goto('/employees');

    await expect(page.locator('#txtname')).toBeVisible();
    await expect(page.locator('#txtpass')).toBeVisible();

    await page.locator('#txtname').fill('krennic');
    await page.locator('#txtpass').fill('orson');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveURL(/employees/);

    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/employees/);

    // Give the legacy application time to complete
    // its initial page/session setup.
    await page.waitForTimeout(3000);

    // Save authenticated browser state.
    await page.context().storageState({
        path: authFile
    });

    console.log('Authentication state saved:', authFile);
});