// Compatibility configuration for the current Employees module.
// The operational test suite intentionally uses the same module/API behavior
// as the known-passing employees.spec.js baseline.
module.exports = {
  name: 'employees',
  id: 'employeesid',
  type: 'base',
  route: '/employees',
  api: {
    search: '/employees/api/searchtype/',
    searchCount: '/employees/api/searchtypeCount/'
  }
};
