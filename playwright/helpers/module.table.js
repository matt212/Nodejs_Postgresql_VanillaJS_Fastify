const selectors = require('../selectors/module.selectors');

async function getColumnIndex(page, field) {
  return page.locator(selectors.tableHeader(field)).evaluate(el => el.cellIndex);
}

async function getColumnValues(page, field) {
  const index = await getColumnIndex(page, field);
  return page.locator(selectors.tableColumnCells(index)).allTextContents();
}

module.exports = { getColumnIndex, getColumnValues };
