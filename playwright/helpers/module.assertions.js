const { expect } = require('@playwright/test');
const selectors = require('../selectors/module.selectors');

async function expectReportReady(page, timeout = 30000) {
  await expect(page.locator(selectors.reportContainer)).not.toHaveClass(/loading-report-container/, { timeout });
  await expect(page.locator(selectors.table)).toBeVisible({ timeout });
}

module.exports = { expectReportReady };
