let dep = require("./utils/dependentVariables.js");
const router = dep.express.Router();

let mod = Object.assign(
  {},
  {
    Name: "muser",
    id: "muserid",
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
  dep.MemoryUsage();
});
router.post(
  dep.routeUrls.create,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.createRecord(req, res);
  }
);
router.post(
  dep.routeUrls.exportexcel,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.exportExcel(req, res, mod);
  }
);

router.post(dep.routeUrls.uploadcontent, (req, res) => {
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
    dep.SearchTypeGroupBy(req, res, mod);
  }
);

router.post(
  dep.routeUrls.delete,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.deleteRecord(req, res);
  }
);
router.post(
  dep.routeUrls.pivotresult,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.pivotResult(req, res, mod);
    dep.MemoryUsage();
  }
);

module.exports = router;
