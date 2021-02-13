 let currentmodulename = "employees";
 let currentmoduleid = "employeesid"
 //definition
 let baseurlobj = {
     getpaginatesearchtypeurl: `/${currentmodulename}/api/searchtype/`,
     createdata: `/${currentmodulename}/api/create/`,
     updatedata: `/${currentmodulename}/api/update/`,
     exceldata: `/${currentmodulename}/api/exportexcel/`,
     uploaddata: `/${currentmodulename}/api/uploadcontent/`,
     getpaginatesearchtypegroupby: `/${currentmodulename}/api/searchtypegroupby/`,
     pivotresult: `/${currentmodulename}/api/pivotresult/`,
     deleteemployees: `/${currentmodulename}/api/customDestroy/`,
     //initialization
 }
 let basefunction = function() {
     return {
        //groupBySets 
        employeesMultiKeysLoad:function(keys)
         {
             //keys="gender"
            base.datapayload=baseloadsegments.basePopulateMultiControls(keys)
            return this
            .getpaginatesearchtypegroupby(base)
            .then(function (argument) {
                return argument
            })
         },
         getpaginatesearchtype: function(base) {
             ajaxbase.payload = base.datapayload
             ajaxbase.url = baseurlobj.getpaginatesearchtypeurl;
             $("a[href$='revenue-chart']").tab('show');
             //$("#trloader").show()
             //$("#basetable tbody").slideUp("slow").hide();

             $('table').addClass('loading')
             return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                 ajaxbase.response = argument;
                 ajaxbase[currentmodulename] = argument
                 /*$("#trloader").hide()
                 $("#basetable tbody").slideDown("slow").show();*/
                 $('table').removeClass('loading')

                 return argument;
             })

         },
         getpaginatesearchtypegroupby: function(base) {


             ajaxbase.payload = base.datapayload
             ajaxbase.url = baseurlobj.getpaginatesearchtypegroupby;

             return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                 ajaxbase.response = argument;
                 return argument;
             })

         },
         insert: function(base) {


             ajaxbase.payload = basemod_modal.payloadformat(base).datapayload
             ajaxbase.url = baseurlobj.createdata;

             return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                 ajaxbase.response = argument;
                 return argument;
             })

         },
         deleterecord: function (base) {
            ajaxbase.payload = base.datapayload
            ajaxbase.url = baseurlobj.deleteemployees
      
            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
              return base
            })
          },
         update: function(base) {
            ajaxbase.payload = basemod_modal.payloadformat(base).datapayload
            ajaxbase.url = baseurlobj.updatedata;

            return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                ajaxbase.response = argument;
                return argument;
            })
             //updateRecord
         },
         //SingleCreate
         exportexcel: function(base) {



             ajaxbase.url = baseurlobj.exceldata;
             ajaxbase.payload = base.datapayload;
             return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                 ajaxbase.response = argument;
                 return argument;
             })

         },
         getpivotreport: function(base) {


             $("#dvloader").show()


             ajaxbase.url = baseurlobj.pivotresult;
             ajaxbase.payload = base.datapayload;
             return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                 ajaxbase.response = argument;

                 $("#dvloader").hide()

                 return argument;
             })

         },
         //implementation

     }
 }
 //baseOffLoad
 let basemod_modal = {afterhtmlpopulate: function(){},
 customClearControl:function(){//clearControls
},
 payloadformat: function (arg) {
     //insertpayloadData
}}
 //StaticMulitSelectData