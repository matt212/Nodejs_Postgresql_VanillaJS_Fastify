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


await page.waitForTimeout(2000);


// 1. Get all header field keys that have the data-field-header attribute
const headers = page.locator('#basetable thead tr th[data-field-header]');
const fieldKeys = await headers.evaluateAll(elements => 
  elements.map(el => el.getAttribute('data-field-header'))
);

// 2. Get all row cells for the very first data row inside the table body
// Note: We skip the first checkbox cell by matching only columns that contain text/data
const firstRowCells = page.locator('#basetable tbody tr').first().locator('td');

// 3. Combine them into an object using their runtime indexes
const firstRowData = {};
const firstCharacters = {};

for (let i = 0; i < fieldKeys.length; i++) {
  const key = fieldKeys[i];
  
  // +1 offset skips the checkbox column (td index 0)
  const cellText = await firstRowCells.nth(i + 1).textContent();
  const cleanValue = cellText.trim();
  
  firstRowData[key] = cleanValue;
  firstCharacters[key] = cleanValue.charAt(0); // Gets the first character
}

console.log('First Row Data Mapping:', firstRowData);
/* Output:
{
  first_name: 'omniman',
  last_name: 'red',
  gender: 'F',
  birth_date: '02 Jan 2020'
}
*/

console.log('First Characters For Your Filter Bar Loop:', firstCharacters);
/* Output:
{
  first_name: 'o',
  last_name: 'r',
  gender: 'F',
  birth_date: '0'
}
*/











console.log("first value", await page.locator('#sptotalUsers').textContent()); 
//click on filter accordion 
await page.locator(
    "//*[@id=\"dvparentfilterbar\"]/div[1]/div/button"
).click();
// Take evidence screenshot
await expect(page.locator('#dvfilterbar').first()).toBeVisible();

await page.screenshot({
    path: 'playwright/screenshots/employees-date-filtered.png',
    fullPage: true
});



//###########################Consolidated search for 'ab' in the table
await page.locator('#txtconsolidatesearch').fill('ab');


await page.locator('//*[@id="dvfilterbar"]/div[2]/div[1]/div/div[2]').click();

// 1. Wait for the table to be visible on the page
await page.locator('#divreportcontent').waitFor({ state: 'visible' });

// Locate the span and extract its text

await page.waitForResponse(response => 
  response.url().includes('/api/searchtypeCount/') && response.status() === 200
);

// Now read the DOM safely
const value = await page.locator('#sptotalUsers').textContent();
console.log(value);
// Filter the specific locator using the .filter() API
const highlightedSpan = page.locator('#basetable tbody tr td span.highlightedsearch').filter({ hasText: 'ab' });

// Assert that the first matching occurrence is visible
await expect(highlightedSpan.first()).toBeVisible();

// 1. Locate all table cells inside the body that contain the highlighted search
const cells = page.locator('#basetable tbody tr td:has(span.highlightedsearch)');

// 2. Extract the text content from all matching cells into an array
const allTexts = await cells.allTextContents();

// 3. Clean up the whitespace (removes newlines, tabs, and extra spaces)
const wordsContainingAb = allTexts.map(text => text.trim()).filter(text => text.length > 0);

console.log(wordsContainingAb);
// Output will look like: ['Mabry', 'Crabtree', 'Stabislas', 'Fabrizio', 'Hanabata', 'Shihab', ...]



//########################### END Consolidated search for 'ab' in the table




//######################### Multi-Select multi column filter

//*
await page.locator(
    "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a"
).click();
//
await expect(page.locator('.fieldsfilterbar')).toBeVisible();

const inputs = page.locator('.fieldsfilterbar input[type="text"]');

// Map through the inputs to pull out their placeholder attributes
const placeholders = await inputs.evaluateAll(elements => 
  elements.map(el => el.placeholder)
);
const inputIds = await inputs.evaluateAll(elements => elements.map(el => el.id));

const autocompleteValues = await inputs.evaluateAll(elements => 
  elements.map(el => el.getAttribute('data-multipleselect-autocomplete'))
);
console.log(inputIds);

console.log(placeholders);

console.log(autocompleteValues);


for (let i = 0; i < inputIds.length; i++) {
  const currentInputId = inputIds[i];
  const currentAttrValue = autocompleteValues[i];
  
  console.log(`--- Processing Filter Field: ${currentAttrValue} ---`);

  // 1. Focus, trigger autocomplete with the dynamic first character, and wait for data synchronization
  const filterInput = page.locator(`#${currentInputId}`);
  const firstCharacterToFill = firstCharacters[currentAttrValue] ? firstCharacters[currentAttrValue].toLowerCase() : 'a';
  await filterInput.fill(firstCharacterToFill);

  // Multi-response sync wait utilizing Promise.all to avoid racing conditions
  await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/searchtypegroupby') && res.status() === 200),
    expect(page.locator(`#dv_${currentAttrValue}`).first()).toBeVisible()
  ]);

  // 2. Select matching links target elements
  const links = page.locator(`#dv_${currentAttrValue} div a.highlightselect`);
  const totalItems = await links.count();

  if (totalItems === 0) {
    console.log(`No dropdown values generated for field: ${currentAttrValue}`);
    continue; // Skip to next field if current autocomplete panel is empty
  }

  // 3. Select random drop element options
  const randomIndex = Math.floor(Math.random() * totalItems);
  const rawName = await links.nth(randomIndex).textContent();
  const chosenName = rawName.trim();
  
  console.log(`[${currentAttrValue}] Randomly clicking index ${randomIndex}: "${chosenName}"`);
  await links.nth(randomIndex).click();

  // 4. Validate filter token wrapper display
  const chipContainer = page.locator(`#cltrl_filter_chips_${currentAttrValue}`);
  await expect(chipContainer).toContainText(chosenName);

  // 5. Execute search layout and monitor database pipeline responses
  await page.locator("//*[@id=\"dvfilterbar\"]/div[1]/div[4]/div").click();

  await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/searchtype/') && res.status() === 200),
    page.waitForResponse(res => res.url().includes('/api/searchtypeCount/') && res.status() === 200)
  ]);

  // 6. Inspect tabular extraction mapping constraints
  const compareHeader = page.locator(`#basetable thead tr th[data-field-header="${currentAttrValue}"]`);
  
  // FIX: Added + 1 adjustment because element cell indexes are 0-based, while CSS :nth-child paths are 1-based
  const compareColumnIndex = await compareHeader.evaluate(el => el.cellIndex);
  const compareColumnCells = page.locator(`#basetable tbody tr td:nth-child(${compareColumnIndex})`);
  
  const extractedTableTexts = await compareColumnCells.allTextContents();
  const cleanedTableNames = extractedTableTexts.map(name => name.trim());

  console.log(`Extracted tabular column entries:`, cleanedTableNames);

  // 7. Loop matching strict checks validation assert routines
  const allMatch = cleanedTableNames.every(name => name === chosenName);
  expect(allMatch).toBe(true);
  
  console.log(`[PASS] All tabular results for column successfully matched: "${chosenName}"`);
}



//######################### END  Multi-Select multi column filter

//await page.waitForTimeout(20000);

});