const {
  test,
  expect
} = require('@playwright/test');
let mod = {
  Name: 'employees',
  id: 'employeesid',
  type: 'base'
};
let validationConfig = require('../../app/routes/utils/' + mod.Name + '/validationConfig.js')
// ============================================================
// base - CENTRAL LOCATOR / CONTROL / API REGISTRY
// Behavior-preserving refactor: values are the original selectors.
// ============================================================
const {
  base
} = require('../config/Module/' + mod.Name + '.config.js');
// ============================================================
// OPEN CONTROL BAR
// ============================================================
const {
  openControlBar,
  applyDateRange,
  loadEmployeesReport,
  openFilterBar,
  getFirstRowData,
  applyDynamicEmployeeFilter,
  selectOneDynamicEmployeeFilter
} = require('../helpers/module.filters');
// ============================================================
// TEST 01-07/
/*
Test 01: Verifies the user can access the Employees module after login.
Test 02: Verifies the Control Bar opens successfully.
Test 03: Verifies the date range can be changed and the report reloads.
Test 04: Verifies the Employees report table and rows load successfully.
Test 05: Verifies dynamic table columns are generated correctly.
Test 06: Verifies the table contains valid employee row data.
Test 07: Verifies the total employee count is displayed correctly.
*/
// ============================================================
const {
  registerModuleScreenLoadTests
} = require('../testsets/module.screenload.js');
registerModuleScreenLoadTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================
// TEST 08-13
/*
Test 08: Verifies the Filter Bar can be opened successfully.
Test 09: Verifies Consolidated Search returns matching employee records and highlights the searched value.
Test 10: Verifies dynamic multi-select filter controls are available and correctly discovered from the module configuration.
Test 11: Verifies each individual dynamic filter field can return and apply matching employee records.
Test 12: Verifies single-value combinations/permutations of multiple filter fields return records matching all selected criteria.
Test 13: Verifies multiple selected values across dynamic filter-field combinations return only matching records.
Test 25: Verifies Consolidated Search with a non-existent value returns exactly zero records.
Test 26: Verifies removing a dynamic filter restores the report to the current unfiltered state and validates the restored count against the Count API.
*/
// ============================================================
const {
  registerModuleFilterTests
} = require('../testsets/module.filter.js');
registerModuleFilterTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================
// TEST 14
/*

Test 14: Verifies all dynamically generated table columns support ascending and descending sorting and send the correct sort parameters to the Search API.
Test 24: Verifies Newest and Oldest record navigation works correctly, including the expected ASC/DESC sorting, ACTIVE record state, Search/Count API requests and responses, and successful UI refresh.

*/
// ============================================================
const {
  registerModuleSortTests
} = require('../testsets/module.sort.js');
registerModuleSortTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================
// TEST 15
/*
Test 15: Verifies the filtered Employees report UI is displayed correctly 
and confirms the Filter Bar and report table are visible.

*/
// ============================================================
const {
  registerModuleReportTests
} = require('../testsets/module.report.js');
registerModuleReportTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================
// TEST 16-19
// CRUD - CREATE EMPLOYEE
/*

Test 16: Verifies an Employee can be created dynamically using the validation map and that all configured field values are correctly saved and displayed in the report.
Test 17: Verifies form validation across all dynamically generated field combinations and ensures submission remains disabled when validation errors exist.
Test 18: Verifies an Employee can be created and then updated using dynamically generated validation-map fields, with all values revalidated after the update.
Test 19: Verifies each validation-map field can be updated individually while ensuring all other existing field values remain unchanged.

*/
// ============================================================
const {
  registerModuleCrudTests
} = require('../testsets/module.crud.js');
registerModuleCrudTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================
//TEST 20-21
/*
Test 20: Verifies full-word filtering using complete values from a random table row across all N×N field permutations.
Test 21: Verifies multi-select filtering using two complete, distinct values from actual table data 
across all N×N field permutations,including autocomplete, selected chips, and returned table values.

*/
// ============================================================
const {
  registerModuleAdvancedFilterTests
} = require('../testsets/module.advancedFilters.js');
registerModuleAdvancedFilterTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================
// TEST 22
/*
Test 22: Verifies an active employee can be soft-deleted and subsequently 
located and confirmed in the Deleted records using the same whole-word Consolidated Search.

*/
// ============================================================
const {
  registerModuleDeleteTests
} = require('../testsets/module.delete.js');
registerModuleDeleteTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================
// TEST 23
// PAGINATION + PAGE SIZE
/*
Test 23: Verifies pagination and page-size behavior.

Changes page size to 5 and confirms the Search API is triggered.
Verifies the first page contains 1–5 rows and a valid total record count.
Navigates to Page 2 when available.
Confirms Page 2 also contains 1–5 rows.
When more than 5 records exist, verifies Page 2 data differs from Page 1.
Confirms the active pagination indicator shows page 2.
Uses actual Search API responses rather than arbitrary waits.
*/
// ============================================================
const {
  registerModulePaginationTests
} = require('../testsets/module.pagination.js');
registerModulePaginationTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================
// TEST 24
// NEWEST / OLDEST RECORD NAVIGATION
// code is clubbed with test 14 in sort.js 
// ============================================================
// ============================================================ 
// Test 25 - Consolidated search returns zero records for a non-existent value
// Test 26 - Clear and remove dynamic filter returns report to unfiltered state
// code is clubbed with test module.filter.js
// ============================================================
// ============================================================ 
// Test 26-27 
/*
Test 27: Verifies a dynamic filter and column sorting work together.
Applies one dynamic employee filter and confirms filtered records exist.
Dynamically selects a sortable table column.
Verifies DESC sorting sends the correct sortcolumn and DESC order to the Search API.
Verifies the selected filter value remains present in the DESC request.
Verifies ASC sorting sends the correct sortcolumn and ASC order.
Verifies the selected filter remains active during ASC sorting.
Confirms the filtered table remains visible after sorting.


Test 28: Verifies a dynamic filter and pagination work together.
Applies one dynamic employee filter and confirms records exist.
Changes page size to 5.
Verifies the filtered first page contains 1–5 records.
Navigates to actual Page 2 only when the filtered result has more than 5 records.
Verifies Page 2 also respects the page size of 5.
Confirms Page 2 contains different records from Page 1.
Confirms the page size remains 5 after navigation.
Confirms the dynamic filter remains active and the filtered total count is unchanged.
Confirms Page 2 is selected when the active-page indicator is available.

*/
// ============================================================ 
const {
  registerModuleFilterStateTests
} = require('../testsets/module.filterState.js');
registerModuleFilterStateTests({
  test,
  base,
  mod,
  validationConfig
});
// ============================================================ 
// Test 29 
/*
Test 29: Verifies the complete Delete → Restore employee lifecycle.
Loads Active employees and selects a random employee.
Captures the employee ID and a whole-word value from the selected row for Consolidated Search.
Changes the employee from Active → Deleted and verifies the update, Search, and Count APIs succeed.
Confirms the deleted employee is absent from Active records.
Switches to Deleted records and uses the same Consolidated Search value to locate the employee.
Confirms the exact employee exists in Deleted records.
Restores the employee from Deleted → Active and verifies the update, Search, and Count APIs.
Uses Newest navigation and then searches again using the same original search value.
Confirms the restored employee is present in Active records.
Switches back to Deleted and confirms the employee is absent from Deleted records.
Overall validates the complete lifecycle: Active → Deleted → Search Deleted → Restore → Active → Deleted absence.

*/
// ============================================================ 
const {
  registerModuleLifeCycleTests
} = require('../testsets/module.lifeCycle.js');
registerModuleLifeCycleTests({
  test,
  base,
  mod,
  validationConfig
});