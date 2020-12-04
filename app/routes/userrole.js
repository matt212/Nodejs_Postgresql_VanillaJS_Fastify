let dep = require("./utils/dependentVariables.js");
const router = dep.express.Router();

let mod = Object.assign(
  {},
  {
    Name: "userrolemapping",
    id: "userrolemappingid",
    type: "userrole"
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
  (req, res) => {
    dep.searchtype(req, res, mod);
    //  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  }
);

router.post(
  dep.routeUrls.searchtypegroupby,
  dep.authfunctions.validateAccesstoken,
  dep.cacheMiddleware(20),
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
  dep.cacheMiddleware(20),
  (req, res) => {
    dep.pivotResult(req, res, mod);
    dep.MemoryUsage();
  }
);
router.post(
  dep.routeUrls.bulkCreate,
  dep.authfunctions.validateAccesstoken,
  function(req, res) {
    dep.bulkCreate(req, res);
  }
);

module.exports = router;
