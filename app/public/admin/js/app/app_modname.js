let currentmodulename = "modname";
let currentmoduleid = "modnameid";
let baseurlobj = {
  getpaginatesearchtypeurl: "/" + currentmodulename + "/api/searchtype/",
  createdata: "/" + currentmodulename + "/api/create/",
  updatedata: "/" + currentmodulename + "/api/update/",
  exceldata: "/" + currentmodulename + "/api/exportexcel/",
  uploaddata: "/" + currentmodulename + "/api/uploadcontent/",
  getpaginatesearchtypegroupby:
    "/" + currentmodulename + "/api/searchtypegroupby/",
  exportexcelcalc: "/" + currentmodulename + "/api/exportexcelcalc/",
  pivotresult: "/" + currentmodulename + "/api/pivotresult/"
};
let basefunction = function() {
  return {
    getpaginatesearchtype: function(base) {
      ajaxbase.payload = base.datapayload;
      ajaxbase.url = baseurlobj.getpaginatesearchtypeurl;
      $("a[href$='revenue-chart']").tab("show");
      //$("#trloader").show()
      //$("#basetable tbody").slideUp("slow").hide();

      $("table").addClass("loading");
      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
        ajaxbase.response = argument;
        ajaxbase[currentmodulename] = argument;
        /*$("#trloader").hide()
                 $("#basetable tbody").slideDown("slow").show();*/
        $("table").removeClass("loading");

        return argument;
      });
    },
    getpaginatesearchtypegroupby: function(base) {
      ajaxbase.payload = base.datapayload;
      ajaxbase.url = baseurlobj.getpaginatesearchtypegroupby;

      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
        ajaxbase.response = argument;
        return argument;
      });
    },
    insert: function(base) {
      ajaxbase.payload = base.datapayload;
      ajaxbase.url = baseurlobj.createdata;

      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
        ajaxbase.response = argument;
        return argument;
      });
    },
    update: function(base) {
      ajaxbase.payload = base.datapayload;
      ajaxbase.url = baseurlobj.updatedata;

      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
        ajaxbase.response = argument;
        return argument;
      });
    },
    exportexcel: function(base) {
      ajaxbase.url = baseurlobj.exceldata;
      ajaxbase.payload = base.datapayload;
      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
        ajaxbase.response = argument;
        return argument;
      });
    },
    getpivotreport: function(base) {
      $("#dvloader").show();

      ajaxbase.url = baseurlobj.pivotresult;
      ajaxbase.payload = base.datapayload;
      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
        ajaxbase.response = argument;

        $("#dvloader").hide();

        return argument;
      });
    }
  };
};
let basemod_modal = {
  afterhtmlpopulate: function() {}
};
