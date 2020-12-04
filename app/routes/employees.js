let dep = require("./utils/dependentVariables.js");
const router = dep.express.Router();

let mod = Object.assign(
  {},
  {
    Name: "employees",
    id: "employeesid",
    type: "base"
  },
  dep.baseUtilsRoutes
);

router.get("/", dep.authfunctions.validateAccesstoken, (req, res) => {
  dep.assignVariables(mod);
  let validationConfig = require("./utils/" +
    mod.Name +
    "/validationConfig.js");

  dep.pageRender(req, res, validationConfig);

});
router.post(
  dep.routeUrls.create,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.assignVariables(mod);
    dep.createRecord(req, res);
  }
);
router.post(
  dep.routeUrls.exportexcel,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.assignVariables(mod);
    dep.exportExcel(req, res, mod);
  }
);

router.post(dep.routeUrls.uploadcontent, (req, res) => {
  dep.assignVariables(mod);
  return dep.uploadContent(req, res);
});
router.post(
  dep.routeUrls.update,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.updateRecord(req, res);
  }
);
router.post(
  dep.routeUrls.searchtype,
  dep.authfunctions.validateAccesstoken,

  (req, res) => {
    
    dep.assignVariables(mod);
    dep.searchtype(req, res, mod);
    //  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  }
);

router.post(
  dep.routeUrls.searchtypegroupby,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.assignVariables(mod);
    dep.SearchTypeGroupBy(req, res, mod);
  }
);
router.post(
  dep.routeUrls.searchtypegroupbyId,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.assignVariables(mod);
    dep.searchtypegroupbyId(req, res, mod);
  }
);
router.post(
  dep.routeUrls.delete,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.assignVariables(mod);
    dep.deleteRecord(req, res);
  }
);
router.post(
  dep.routeUrls.pivotresult,
  dep.authfunctions.validateAccesstoken,

  (req, res) => {
    dep.assignVariables(mod);
    dep.pivotResult(req, res, mod);

  }
);

module.exports = router;
