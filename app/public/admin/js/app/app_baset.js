 let currentmodulename = "baset";
 let currentmoduleid = "basetid"

 let currentaccesstype = {
   name: "accesstype",
   id: "accesstypeid",
   text: "name",
   data: {
     "accesstypeid": []
   }
 };
 let baseurlobj = {
   getpaginatesearchtypeurl: `/${currentmodulename}/api/searchtype/`,
   createdata: `/${currentmodulename}/api/bulkCreate/`,
   singleCreatedata: `/${currentmodulename}/api/create/`,
   updatedata: `/${currentmodulename}/api/update/`,
   exceldata: `/${currentmodulename}/api/exportexcel/`,
   uploaddata: `/${currentmodulename}/api/uploadcontent/`,
   getpaginatesearchtypegroupby: `/${currentmodulename}/api/searchtypegroupby/`,
   pivotresult: `/${currentmodulename}/api/pivotresult/`,
   deletebaset: `/${currentmodulename}/api/customDestroy/`,
   //
   getcurrentModaccesstypegroupby: `${currentaccesstype.name}/api/searchtypegroupbyId/`,
 }
 let basefunction = function() {
   return {
     //

     basetMultiKeysLoad: function(keys) {
       //keys="gender"
       base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
       return this
         .getpaginatesearchtypegroupby(base)
         .then(function(argument) {
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
     deleterecord: function(base) {
       ajaxbase.payload = base.datapayload
       ajaxbase.url = baseurlobj.deletebaset

       return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
         return base
       })
     },
     update: function(base) {


       return Promise.mapSeries(basemod_modal.payloadformat(base).datapayload, function(dt) {
         ajaxbase.payload = dt
         ajaxbase.url = baseurlobj.updatedata;
         return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
           ajaxbase.response = argument;
           return argument;
         })
       }).then(a => {
         console.log(a)
         return a
       })
     },
     singleInsert: function(base) {
       ajaxbase.payload = base.datapayload
       ajaxbase.url = baseurlobj.singleCreatedata;
       return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
         ajaxbase.response = argument;
         return argument;
       })
     },
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
     //


   }
 }
 //
 let validationListener = function() {
   var sel = $('#overlaycontent input:text[data-form-type], input:checkbox[data-form-type], div[data-form-type]').length;

   if (sel <= 0) {
     $('#btnmodalsub').prop('disabled', false)
   } else {
     $('#btnmodalsub').prop('disabled', true)
   }
 }
 //multiSelectInit6
 $(function() {
   basemod_modal.modalpopulate()
   //multiSelectInit7
   $('#overlaycontent input[type="text"], input[type="checkbox"]').on("keydown keyup change", function() {
     validationListener()
   })
 })
 let basemod_modal = {
   modalpopulate: function() {
     var interset = validationmap
     var redlime = new Array(Math.ceil(interset.length / 2)).fill().map(_ => interset.splice(0, 2))
     $("#overlaycontent").empty();
     var htmlcontent = "";
     var internhtmlcontent = "";
     redlime.forEach(function(item) {

       htmlcontent += `<div class="row">`
       item.forEach(function(element) {
         //multiSelectInit8
         //multiselectelse   


         //rchkelse   

         if (element.inputtype == "checkbox" && element.inputtypemod == currentaccesstype.name) {
           accesstypecontent.forEach((elem, index) => {

             internhtmlcontent = internhtmlcontent + htmlPopulateCustomControl.multiCheckBoxPopulate(elem, currentaccesstype)
           })
           $('#overlaycontent').append(htmlPopulateCustomControl.multiCheckboxPopulatePrimary(currentaccesstype, internhtmlcontent))
         } else {
           htmlcontent += htmlPopulateCustomControl.textBoxPopulateSecondary(element);
         }

       })

       htmlcontent += `</div>`
     })

     var chkcontent = htmlPopulateCustomControl.genericCheckboxHtml(currentmoduleid);

     $("#overlaycontent").html(htmlcontent + chkcontent);
   },

   onaccesstypeControl: function(data) {
     var key = $(data).data().key;
     var val = $(data).data().val;
     if ($(data)[0].checked) {
       currentaccesstype.data[key] = [...currentaccesstype.data[key], ...[val]]
     } else {
       currentaccesstype.data[key] = currentaccesstype.data[key].filter(item => parseInt(item) !== val)
     }
     reqopsValidate.formvalidation(data);
     validationListener()
   },
   onMultiControlChk: function(data) {},
   baseCheckbox: htmlPopulateCustomControl.genericCheckboxHtmlPrimary(),
   //multiSelectInit9
   afterhtmlpopulate: function() {
     $('#basetable tbody tr td:last-child').attr('onclick', 'javascript:basemod_modal.ontdedit(this)')
     $('#basetable tbody tr td:nth-child(1) input:checkbox').attr('onclick', 'javascript:basemod_modal.tablechkbox(this)')
     //$("a[href='#sales-chart'").hide()
   },
   ontdedit: function(arg) {

     var armodid = $(arg).attr('data-tbledit-type')
     ajaxbase.isedit = true;
     var interncontent = ajaxbase[currentmodulename].rows;

     interncontent = interncontent.filter(function(doctor) {
       return doctor[currentmoduleid] == armodid;
     })
     base.editrecord = interncontent;
     $('#cltrl' + currentmoduleid).val(armodid);
     var formatresponse = this.baseResponseformat(
       validationmap,
       interncontent[0]
     )
     //multiSelectInit4
     formatresponse.forEach(function(data) {

       if (data.inputtype == "textbox") {
         $("#cltrl" + data.key).val(data.val)
         $("#cltrl" + data.key).removeAttr('data-form-type');
       } else if (data.inputtype == "radio") {
         $(`#overlaycontent .form-group.overlaytxtalign.col-md-5 .custom-control.custom-radio  [data-val="${data.val}"]`).prop("checked", true)


       } else if (data.inputtype == "checkbox") {
         $('*[data-attribute="checkboxMulti"]').removeAttr('data-form-type');
         $(`#overlaycontent .checkbox.tablechk [type="checkbox"]`).each(function(index) {
           $(this).attr("checked", false)
         })
         var intern = data.val.includes(',') ? data.val.split(',') : [data.val]
         intern.forEach(function(dr) {

           $(`#overlaycontent .form-group.overlaytxtalign.col-md-5 .custom-control.custom-checkbox  [data-val='${dr}']`).prop("checked", true)

         })

         currentaccesstype.data[data.key] = intern
       }
     })
     //active comma denominator
     //console.log(interncontent[0].recordstate)
     htmlPopulateCustomControl.genericRecordState(interncontent, base)

   },
   tablechkbox: function(arg) {},
   baseResponseformat: function(validationmap, dt) {
     return validationmap.map(function(dr) {
       return {
         key: dr.inputname,
         val: dt[dr.inputname],
         inputtype: dr.inputtype
       }
     })
   },
   //multiSelectInit5,
   customClearControl: function() {

     currentaccesstype.data.accesstype = []
   },
   payloadformat: function(arg) {

     let updateIds;
     if (ajaxbase.isedit) {
       updateIds = arg.datapayload[currentmoduleid].split(',')
       delete arg.datapayload[currentmoduleid]
     }
     let internim = {
       datapayload: {
         ...arg.datapayload,
         ...currentaccesstype.data
       }
     }
     return htmlPopulateCustomControl.genericMultiControlpayload(
       base,
       internim,
       updateIds,
       currentmoduleid
     )

   }
 }
 //
 let accesstypecontent = [{
     "accesstypeid": "vo",
     "name": "viewonly",
     "key": "accesstype"
   },
   {
     "accesstypeid": "aa",
     "name": "AllAccess",
     "key": "accesstype"
   }
 ]