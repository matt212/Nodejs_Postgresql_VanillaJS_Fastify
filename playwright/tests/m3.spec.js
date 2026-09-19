


const { test, expect } = require('@playwright/test');
let mod =  {
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
// ============================================================

const {
    registerModuleScreenLoadTests
} = require(
    '../testsets/module.screenload.js'
);


registerModuleScreenLoadTests({
    test,
    base,
    mod,
    validationConfig
});


// ============================================================
// TEST 08-13
// ============================================================

const {
    registerModuleFilterTests
} = require(
    '../testsets/module.filter.js'
);

registerModuleFilterTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
// TEST 14
// ============================================================

const {
    registerModuleSortTests
} = require(
    '../testsets/module.sort.js'
);

registerModuleSortTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
// TEST 15
// ============================================================

const {
    registerModuleReportTests
} = require(
    '../testsets/module.report.js'
);

registerModuleReportTests({
    test,
    base,
    mod,
    validationConfig
});



// ============================================================
// TEST 16-19
// CRUD - CREATE EMPLOYEE
// ============================================================
const {
    registerModuleCrudTests
} = require(
    '../testsets/module.crud.js'
);
registerModuleCrudTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
//TEST 20-21
// ============================================================
const {
    registerModuleAdvancedFilterTests
} = require(
    '../testsets/module.advancedFilters.js'
);
registerModuleAdvancedFilterTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
// TEST 22
// ============================================================

const {
    registerModuleDeleteTests
} = require(
    '../testsets/module.delete.js'
);
registerModuleDeleteTests({
    test,
    base,
    mod,
    validationConfig
});

// ============================================================
// TESTS 24 - 30
//
// Additional high-value UI coverage:
//
// 24 - Pagination + Page Size
// 25 - Newest / Oldest navigation
// 26 - Empty-result search
// 27 - Clear / Remove filter
// 28 - Filter + Sort
// 29 - Filter + Pagination
// 30 - Delete -> Active absence -> Restore -> Deleted absence
//
// These tests are designed to be pasted AFTER TEST 23.
// ============================================================

// ============================================================
// TEST 23
// PAGINATION + PAGE SIZE
// ============================================================


const {
    registerModulePaginationTests
} = require(
    '../testsets/module.pagination.js'
);


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




// Test 26-27 
const {
    registerModuleFilterStateTests
} = require(
    '../testsets/module.filterState.js'
);


registerModuleFilterStateTests({
    test,
    base,
    mod,
    validationConfig
});


// Test 29 
const {
    registerModuleLifeCycleTests
} = require(
    '../testsets/module.lifeCycle.js'
);


registerModuleLifeCycleTests({
    test,
    base,
    mod,
    validationConfig
});
















