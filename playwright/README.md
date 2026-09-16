# Generic Playwright Module Test Refactor

This package refactors the supplied Employees Playwright suite into a reusable module-oriented structure without introducing `EmployeesPage.js`, `CustomerPage.js`, etc.

## Structure

```text
Playwright_Module_Refactor/
├── config/
│   └── module.config.js
├── selectors/
│   └── module.selectors.js
├── helpers/
│   ├── module.lifecycle.js
│   ├── module.validation.js
│   ├── module.table.js
│   └── module.assertions.js
├── data/
│   └── module.testdata.js
├── tests/
│   └── module.spec.js
└── source/
    └── employees.spec.original.js
```

## Important

The source artifact available in the conversation/library is the 4,995-line `employees.spec.js` snapshot and contains **23 tests (01–23)**. It does not contain the later 24–30 tests discussed separately. Those seven tests are intentionally not fabricated or silently added. The original snapshot is preserved under `source/`.

The refactored test file is generic at the module/configuration level: route and API prefix are supplied by `config/module.config.js`. For the next generated module, change the configuration and keep the generic helpers/test contract rather than creating a new Page Object class.

## Run

Run from the repository root because the generated suite imports the module's existing validation configuration:

```bash
npx playwright test playwright/tests/module.spec.js
```

If this package is copied into the existing repo's `playwright/` directory, adjust the relative path to `validationConfig.js` only if the repo layout differs.

## Selector strategy

The selector layer centralizes stable IDs, CSS selectors and dynamic selector factories. The recommended next generator enhancement is to emit `data-testid` attributes such as `module-data-table`, `module-filter-first_name`, `module-save`, and `module-page-size`; these can replace brittle XPath/CSS selectors progressively without changing test intent.

## Coverage preserved

The supplied 23-test contract covers module access, control/date/report loading, table mapping/data/count, consolidated search, dynamic multi-select controls, single-field filtering, field permutations, multi-select permutations, sorting, UI/screenshot validation, validationmap-driven CRUD, update flows, full-word filtering, soft delete and restore.
