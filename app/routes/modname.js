let dep = require("./utils/dependentVariables.js");
const router = dep.express.Router();
let mod = Object.assign(
  {},
  {
    Name: "modname",
    id: "modnameid",
    type: "base"
  },
  dep.baseUtilsRoutes
);
router.post(
  dep.routeUrls.searchtypegroupbyId,
  dep.authfunctions.validateAccesstoken,
  (req, res) => {
    dep.assignVariables(mod);
    dep.searchtypegroupbyId(req, res, mod);
  }
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
    dep.createRecord(req, res);
  }
);
router.post(
  dep.routeUrls.exportexcel,
  dep.authfunctions.validateAccesstoken,
  dep.cacheMiddleware(20),
  (req, res) => {
    dep.exportExcel(req, res);
  }
);

router.post(dep.routeUrls.uploadcontent, (req, res) => {
  return dep.uploadContent(req);
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
  dep.cacheMiddleware(20),
  (req, res) => {
    dep.searchtype(req, res, mod);
    //  const used = process.memoryUsage().heapUsed / 1024 / 1024;
    dep.MemoryUsage();
  }
);

router.post(
  dep.routeUrls.searchtypegroupby,
  dep.authfunctions.validateAccesstoken,
  dep.cacheMiddleware(20),
  (req, res) => {
    dep.assignVariables(mod);
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
  dep.cacheMiddleware(20),
  (req, res) => {
    dep.pivotResult(req, res);
    //dep.MemoryUsage();
  }
);
module.exports = router;
