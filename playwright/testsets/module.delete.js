const {
  test,
  expect
} = require('@playwright/test');
const {
  openControlBar,
  applyDateRange,
  loadEmployeesReport,
  openFilterBar,
  getFirstRowData
} = require('../helpers/module.filters');

function registerModuleDeleteTests({
  test,
  base,
  mod,
  validationConfig
}) {
  // ============================================================
  // TEST 22
  // SOFT DELETE - RANDOM ACTIVE EMPLOYEE
  // ============================================================
  test('22 - Soft Delete - Random active employee and verify in Deleted records', async ({
    page
  }) => {
    test.setTimeout(120000);
    await loadEmployeesReport(page, base);
    const rows = page.locator(base.locators.tableRows);
    const rowCount = await rows.count();
    expect(rowCount, 'Employees report should contain at least one row').toBeGreaterThan(0);
    const randomIndex = Math.floor(Math.random() * rowCount);
    const selectedRow = rows.nth(randomIndex);
    console.log(`Test 22 - Selected random row: ${randomIndex + 1} of ${rowCount}`);
    // ------------------------------------------------------------
    // CAPTURE EMPLOYEE ID + WHOLE-WORD SEARCH VALUE
    // ------------------------------------------------------------
    const editCell = selectedRow.locator('td[data-tbledit-type]').first();
    await expect(editCell).toBeVisible({
      timeout: 30000
    });
    const employeeId = await editCell.getAttribute('data-tbledit-type');
    expect(employeeId, 'Selected employee must have a data-tbledit-type ID').not.toBeNull();
    expect(employeeId).not.toBe('');
    // first visible business column = first_name
    const searchValue = (await selectedRow.locator('td').nth(1).textContent() || '').trim();
    expect(searchValue, 'Selected employee must have a searchable value').not.toBe('');
    console.log(`Test 22 - Selected employee ID: ${employeeId}`);
    console.log(`Test 22 - Whole-word search value: "${searchValue}"`);
    // ------------------------------------------------------------
    // OPEN EDIT
    // ------------------------------------------------------------
    await editCell.click();
    const recordStateInput = page.locator(base.locators.recordStateInput);
    await expect(recordStateInput).toBeAttached({
      timeout: 30000
    });
    await expect(recordStateInput).toBeChecked();
    // ------------------------------------------------------------
    // SOFT DELETE
    // ------------------------------------------------------------
    await setCheckboxState(page, base.locators.recordStateInput, false);
    // ------------------------------------------------------------
    // SUBMIT
    // ------------------------------------------------------------
    const updateResponsePromise = page.waitForResponse(response => response.url().includes(base.api.update) && response.status() === 200, {
      timeout: 30000
    });
    const activeSearchResponsePromise = page.waitForResponse(response => response.url().includes(base.api.search) && response.request().method() === 'POST' && response.status() === 200, {
      timeout: 30000
    });
    const activeSearchCountResponsePromise = page.waitForResponse(response => response.url().includes(base.api.count) && response.request().method() === 'POST' && response.status() === 200, {
      timeout: 30000
    });
    await page.locator(base.locators.modalSubmit).click();
    await updateResponsePromise;
    console.log(`Test 22 - UPDATE completed for ${employeeId}`);
    await activeSearchResponsePromise;
    await activeSearchCountResponsePromise;
    console.log('Test 22 - ACTIVE SEARCHTYPE completed after delete');
    await expect(page.locator(base.locators.reportContent)).toBeVisible({
      timeout: 30000
    });
    await expect(page.locator(base.locators.table)).toBeVisible({
      timeout: 30000
    });
    // ------------------------------------------------------------
    // OPEN PAGING
    // ------------------------------------------------------------
    const pagingParent = page.locator(base.locators.pagingParent);
    const pagingMenu = page.locator(base.locators.pagingMenu);
    await expect(pagingParent).toBeVisible({
      timeout: 30000
    });
    console.log('[PAGING BEFORE]', await pagingMenu.evaluate(el => ({
      display: getComputedStyle(el).display,
      inlineStyle: el.style.display
    })));
    await pagingParent.click();
    console.log('[PAGING AFTER CLICK]', await pagingMenu.evaluate(el => ({
      display: getComputedStyle(el).display,
      inlineStyle: el.style.display
    })));
    await expect(pagingMenu).toBeVisible({
      timeout: 10000
    });
    // ------------------------------------------------------------
    // SELECT DELETED
    // ------------------------------------------------------------
    const deletedSearchResponsePromise = page.waitForResponse(response => response.url().includes(base.api.search) && response.request().method() === 'POST' && response.status() === 200, {
      timeout: 30000
    });
    const deletedCountResponsePromise = page.waitForResponse(response => response.url().includes(base.api.count) && response.request().method() === 'POST' && response.status() === 200, {
      timeout: 30000
    });
    await page.locator(base.locators.deleted).click();
    await deletedSearchResponsePromise;
    await deletedCountResponsePromise;
    console.log('Test 22 - DELETED SEARCHTYPE completed');
    console.log('Test 22 - DELETED SEARCHTYPE COUNT completed');
    await expect(page.locator(base.locators.reportContent)).toBeVisible({
      timeout: 30000
    });
    await expect(page.locator(base.locators.table)).toBeVisible({
      timeout: 30000
    });
    // ------------------------------------------------------------
    // OPEN CONSOLIDATED SEARCH
    // ------------------------------------------------------------
    await openFilterBar(page, base);
    const consolidatedSearch = page.locator(base.locators.consolidatedSearch);
    await expect(consolidatedSearch).toBeVisible({
      timeout: 10000
    });
    // ------------------------------------------------------------
    // SEARCH DELETED RECORD USING SAME CONSOLIDATED SEARCH
    //
    // Application state is now DELETED, therefore:
    //
    // filterparam.recordstate = "DELETED"
    //
    // ------------------------------------------------------------
    const consolidatedSearchResponsePromise = page.waitForResponse(response => response.url().includes(base.api.search) && response.request().method() === 'POST' && response.status() === 200, {
      timeout: 30000
    });
    const consolidatedCountResponsePromise = page.waitForResponse(response => response.url().includes(base.api.count) && response.request().method() === 'POST' && response.status() === 200, {
      timeout: 30000
    });
    // Existing consolidated-search action.
    await consolidatedSearch.fill(searchValue);
    await page.locator(base.locators.consolidatedSearchAction).click();
    await consolidatedSearchResponsePromise;
    await consolidatedCountResponsePromise;
    console.log(`Test 22 - Consolidated DELETED search completed for "${searchValue}"`);
    // ------------------------------------------------------------
    // VERIFY DELETED RECORD
    // ------------------------------------------------------------
    await expect(page.locator(base.locators.tableRows).filter({
      hasText: searchValue
    }).first()).toBeVisible({
      timeout: 30000
    });
    console.log(`Test 22 PASS - Employee ${employeeId} verified in Deleted records`);
  });
  async function setCheckboxState(page, inputSelector, checked) {
    const input = page.locator(inputSelector);
    await expect(input).toBeAttached({
      timeout: 30000
    });
    const currentState = await input.isChecked();
    if (currentState !== checked) {
      const control = input.locator('xpath=following-sibling::span[contains(@class,"checkbox-material")]').first();
      await control.click();
    }
    await expect(input).toBeChecked({
      checked
    });
  }
}
module.exports = {
  registerModuleDeleteTests
}; // Reserved for incremental extraction after baseline validation.\nmodule.exports = {};