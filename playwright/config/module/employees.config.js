// Compatibility configuration for the current Employees module.
// The operational test suite intentionally uses the same module/API behavior
// as the known-passing employees.spec.js baseline.
let mod = {
  Name: 'employees',
  id: 'employeesid',
  type: 'base'
};
const base = {
    locators: {
        controlBarCollapse: "//h3[normalize-space()='Control Bar']/following-sibling::div[contains(@class,'box-tools')]//button[@data-widget='collapse']",
        dateRange: "#reservation",
        reportContainer: "#dvreportcontainer",
        reportContent: "#divreportcontent",
        totalUsers: "#sptotalUsers",
        table: "#basetable",
        tableRows: "#basetable tbody tr",
        tableHeaders: "#basetable thead tr th[data-field-header]",
        filterBar: "#dvfilterbar",
        filterBarParentToggle: "//*[@id=\"dvparentfilterbar\"]/div[1]/div/button",
        dynamicFilterToggle: "//*[@id=\"dvfilterbar\"]/div[2]/div[2]/a",
        dynamicFilterContainer: ".fieldsfilterbar",
        dynamicFilterInputs: ".fieldsfilterbar input[data-multipleselect-autocomplete]",
        consolidatedSearch: "#txtconsolidatesearch",
        consolidatedSearchAction: "//*[@id=\"dvfilterbar\"]/div[2]/div[1]/div/div[2]",
        dynamicFilterApply: "#btnFilterbarSearch",
        pagingParent: "#dvpaginationsections .pagingsectionparent",
        pagingMenu: "#overlaypaging",
        newest: "#newestdiv",
        oldest: "#Oldestdiv",
        deleted: "#Deletediv",
        pageSize: "#inppagesize",
        pageLinks: "#page-selection li a",
        activePage: "#page-selection li.active",
        recordStateInput: "#cltrlrecordstate",
        recordStateControl: "xpath=/html/body/div[3]/div/div/div[2]/div[1]/form/div/div[5]/div/div/label/div",
        modalSubmit: "#btnmodalsub",
        createEmployee: "xpath=/html/body/div[2]/div[2]/section/div[1]/div[2]/div[1]/div[2]/div[1]/div/a"
    },
    api: {
        search: "/"+mod.Name+"/api/searchtype/",
        count: "/"+mod.Name+"/api/searchtypeCount/",
        update: "/"+mod.Name+"/api/update/",
        create: "/"+mod.Name+"/api/create/",
        groupBy: "/api/searchtypegroupby"
    },
    timing: {
        response: 30000,
        ui: 30000,
        menu: 10000,
        filter: 10000
    },
    mod
};
module.exports = {
    base
};