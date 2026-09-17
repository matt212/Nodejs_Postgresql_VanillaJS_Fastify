# 30-Test Assertion Preservation

The executable `tests/module.spec.js` is copied from the supplied operational `employees.spec.js` baseline rather than rewritten.

Therefore the 30 tests and their existing assertions are preserved exactly.

## Regression-sensitive tests

### Test 14
Preserved exactly from the supplied baseline. It discovers rendered `data-field-header` values and verifies the API sort request against those actual field keys. No new API-to-DOM mapping is introduced.

### Test 28
Preserved exactly from the supplied baseline. It retains the existing filter + sort request/response synchronization and payload assertions.

### Test 29
Preserved exactly from the supplied baseline, including the explicit page-2 selector:
`#page-selection li a` with `hasText: /^2$/`.
It does not use `nth(1)` for page 2.

## Refactoring rule

Do not extract or alter a helper if doing so changes selector semantics, request timing, payload semantics, or field-key mapping. First establish the 30-test operational baseline; then extract one helper at a time while comparing the result against this source.
