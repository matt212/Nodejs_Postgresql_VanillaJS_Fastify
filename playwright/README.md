# Playwright Module Refactor - 30 Test Operational Baseline

This package is a compatibility-first structured package.

IMPORTANT:
`tests/module.spec.js` is the exact operational 30-test Employees suite supplied by the user. It has NOT been rewritten to introduce new DOM/API mappings.

This is intentional. The earlier refactor introduced a regression in Test 25 by assuming API `sortcolumn` values directly mapped to `data-field-header` DOM attributes. This package does not make that assumption.

The same principle applies to Tests 14, 28 and 29: their known-working request/response and selector behavior is preserved from the supplied Employees suite.

The helper/config directories are separated so extraction can be performed incrementally after the baseline is confirmed in the user's real application. They are not used to rewrite the operational suite yet.

Run from the project root after placing the package under `playwright/`:

    npx playwright test playwright/tests/module.spec.js

Or, when `playwright/tests` is configured as testDir:

    npx playwright test module

Verification performed on the package:
- 30 test declarations
- JavaScript syntax check passes
- Test 14 preserved from supplied baseline
- Test 28 preserved from supplied baseline
- Test 29 preserved from supplied baseline
- Original source retained under source/
