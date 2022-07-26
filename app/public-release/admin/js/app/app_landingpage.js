 let currentmodulename = "landingpage";
 let currentmoduleid = "landingpageid"

 let currentrole = 'role'
 let currentgender = 'gender'
 let currentmodname = {
   name: "modname",
   id: "modnameid",
   text: "mname",
   data: {
     "modnameid": []
   }
 };
 let multiselects = {}
 let multiselectfunc = {}
 let baseurlobj = {
   getpaginatesearchtypeurl: `/${currentmodulename}/api/searchtype/`,
   createdata: `/${currentmodulename}/api/bulkCreate/`,
   singleCreatedata: `/${currentmodulename}/api/create/`,
   updatedata: `/${currentmodulename}/api/update/`,
   exceldata: `/${currentmodulename}/api/exportexcel/`,
   uploaddata: `/${currentmodulename}/api/uploadcontent/`,
   getpaginatesearchtypegroupby: `/${currentmodulename}/api/searchtypegroupby/`,
   pivotresult: `/${currentmodulename}/api/pivotresult/`,
   deletelandingpage: `/${currentmodulename}/api/customDestroy/`,
   //
   getcurrentModrolegroupby: `/${currentrole}/api/searchtypegroupbyId/`,
   getcurrentModgendergroupby: `/${currentgender}/api/searchtypegroupbyId/`,
   getcurrentModmodnamegroupby: `/${currentmodname.name}/api/searchtypegroupbyId/`,
   DelObj:[]
 }
 let basefunction = function() {
   return {
     //

     roleMultiKeysLoad: function(keys) {
       //keys="gender"
       base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
       return this
         .getcurrentModrolegroupby(base)
         .then(function(argument) {
           return argument
         })
     },
     genderMultiKeysLoad: function(keys) {
       //keys="gender"
       base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
       return this
         .getcurrentModgendergroupby(base)
         .then(function(argument) {
           return argument
         })
     },
     modnameMultiKeysLoad: function(keys) {
       //keys="gender"
       base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
       return this
         .getcurrentModmodnamegroupby(base)
         .then(function(argument) {
           return argument
         })
     },
     landingpageMultiKeysLoad: function(keys) {
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
       ajaxbase.url = baseurlobj.deletelandingpage

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

     getcurrentModrolegroupby: function(base) {
       ajaxbase.payload = base.datapayload
       ajaxbase.url = baseurlobj.getcurrentModrolegroupby;
       return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
         ajaxbase.response = argument;
         return argument;
       })
     },
     getcurrentModgendergroupby: function(base) {
       ajaxbase.payload = base.datapayload
       ajaxbase.url = baseurlobj.getcurrentModgendergroupby;
       return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
         ajaxbase.response = argument;
         return argument;
       })
     },
     getcurrentModmodnamegroupby: function(base) {
       ajaxbase.payload = base.datapayload
       ajaxbase.url = baseurlobj.getcurrentModmodnamegroupby;
       return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
         ajaxbase.response = argument;
         return argument;
       })
     },

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

 let basemultiselectaccess = {
   multiselectmodular: function(arg) {
     var multiselectconfig = {
       selectevent: '#in' + arg.fieldname,
       fieldkey: arg.fieldkey,
       selecttype: arg.selecttype,
       selecttype: arg.selecttype,
       placeholder: arg.fieldname,
       parentId:arg.parentId,
       remotefunc: this['remotefunc' + arg.fieldname]
     }


     multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, function(
       data,isAddDel,DelVal
     ) {
       
       
       if(isAddDel=="del")
       {
        baseurlobj["DelObj"].push(DelVal)
       }
       multiselects[arg.secondaryKey] = data
       reqopsValidate.formvalidation(
         $(`#overlaycontent [data-key='${arg.secondaryKey}']`)
       )
       validationListener()
     })
     multiselectfunc[arg.fieldname].init()
   },
   multiSelectCommon: function(data) {
     var arin = []
     var intern = {}
     intern[data.fieldname] = data.fieldval
     arin.push(intern)
     intern = {}
     var internbase = basemultiselectaccess.htmlpopulatemodnamefilterparam(arin)
     return internbase
   },
   multiSelectCommonResponse: function(data, argument) {
     var internfield = Object.keys(argument.rows[0])
     var sets = argument.rows.map(function(doctor) {
       return {
         // return what new object will look like
         key: data.fieldname,
         text: doctor[internfield[0]],
         val: doctor[internfield[1]]
       }
     })
     return sets
   },
   htmlpopulatemodnamefilterparam: function(internar) {
     var filtparam = {}
     filtparam.pageno = 0
     filtparam.pageSize = 20
     filtparam.searchtype = 'Columnwise'
     filtparam.searchparam = internar
     filtparam.searchparammetafilter = []
     filtparam.ispaginate = true
     filtparam.disableDate = true
     base.datapayload = filtparam

     return base
   },
   htmlpopulatemrolefilterparam: function(internar) {
     var filtparam = {}
     filtparam.modulename = internar.mname
     filtparam.rolename = internar.roleid
     base.datapayload = filtparam

     return base
   },
   htmlpopulatemodular: function(fieldname) {
     return htmlPopulateCustomControl.genericddlPopulate(fieldname)
   },
   remotefuncrolename: function(data) {
     return new Promise(function(resolve, reject) {
       basefunction()
         .getcurrentModrolegroupby(
           basemultiselectaccess.multiSelectCommon(data)
         )
         .then(function(argument) {
           var sets = argument.rows

           if (sets[0] != undefined) {
             resolve(
               basemultiselectaccess.multiSelectCommonResponse(data, argument)
             )
           }
         })
     })
   },
   remotefuncname: function(data) {
     return new Promise(function(resolve, reject) {
       basefunction()
         .getcurrentModgendergroupby(
           basemultiselectaccess.multiSelectCommon(data)
         )
         .then(function(argument) {
           var sets = argument.rows

           if (sets[0] != undefined) {
             resolve(
               basemultiselectaccess.multiSelectCommonResponse(data, argument)
             )
           }
         })
     })
   },
 }
 $(function() {
   basemod_modal.modalpopulate()

   basemod_modal.populatemodularddl()
   $('#overlaycontent input[type="text"], input[type="checkbox"]').on("keydown keyup change", function() {
     validationListener()
   })
 })
 let basemod_modal = {
   modalpopulate: function() {
     var interset = [...validationmap]
     var redlime = new Array(Math.ceil(interset.length / 2)).fill().map(_ => interset.splice(0, 2))
     $("#overlaycontent").empty();
     var htmlcontent = "";
     var internhtmlcontent = "";
     redlime.forEach(function(item) {

       htmlcontent += `<div class="row">`
       item.forEach(function(element) {

         if (element.inputtype == 'multiselect') {
           htmlcontent += basemultiselectaccess.htmlpopulatemodular(element)
         } else


           //rchkelse   

           if (element.inputtype == "checkbox" && element.inputtypemod == currentmodname.name) {
             var internhtmlcontent = " "
             basefunction().modnameMultiKeysLoad(currentmodname.text).then(function(data) {
               data.rows.forEach((elem, index) => {

                 internhtmlcontent = internhtmlcontent + htmlPopulateCustomControl.multiCheckBoxPopulate(elem, currentmodname)
               })
               $('#overlaycontent').append(htmlPopulateCustomControl.multiCheckboxPopulatePrimary(currentmodname, internhtmlcontent))

             });
           }

         else {
           htmlcontent += htmlPopulateCustomControl.textBoxPopulateSecondary(element);
         }

       })

       htmlcontent += `</div>`
     })
     //clientbasedJS 
     var chkcontent = htmlPopulateCustomControl.genericCheckboxHtml(currentmoduleid);
     $("#overlaycontent").append(htmlcontent + chkcontent);
   },

   onmodnameControl: function(data) {
     var key = $(data).data().key;
     var val = $(data).data().val;
     if ($(data)[0].checked) {
       currentmodname.data[key] = [...currentmodname.data[key], ...[val]]
     } else {
       baseurlobj["DelObj"].push({[currentmodname.id]:val})
       currentmodname.data[key] = currentmodname.data[key].filter(item => (isNaN(parseInt(item)) ? item : parseInt(item)) !== val)

     }
     reqopsValidate.formvalidation(data);
     validationListener()
   },
   onMultiControlChk: function(data) {},
   baseCheckbox: htmlPopulateCustomControl.genericCheckboxHtmlPrimary(),


   afterhtmlpopulate: function() {
     $('#basetable tbody tr td:last-child').attr('onclick', 'javascript:basemod_modal.ontdedit(this)')
     $('#basetable tbody tr td:nth-child(1) input:checkbox').attr('onclick', 'javascript:basemod_modal.tablechkbox(this)')
     //$("a[href='#sales-chart'").hide()
   },
   //editStart
   ontdedit: function(arg) {

     var armodid = $(arg).attr('data-tbledit-type')
     ajaxbase.isedit = true;
     var interncontent = ajaxbase[currentmodulename].rows;

     interncontent = interncontent.filter(function(doctor) {
       return doctor[currentmoduleid] == armodid;
     })
     base.editrecord = interncontent;
     base.editId=armodid
     $('#cltrl' + currentmoduleid).val(parseInt(armodid));
     var formatresponse = this.baseResponseformat(
       validationmap,
       interncontent[0]
     )

     datatransformutils.editMultiSelect({
       multiselectfunc,
       validationmap,
       content: interncontent
     })
     $("[data-attribute='multiSelect']").removeAttr('data-form-type')
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

         currentmodname.data[data.key] = intern
       }
     })
     //active comma denominator
     //console.log(interncontent[0].recordstate)
     htmlPopulateCustomControl.genericRecordState(interncontent, base)

   },
   //editEnd
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

   populatemodularddl: function() {
     validationmap.forEach(function(data) {
       if (data.inputtype == 'multiselect') {
         var p = {}
         p.fieldname = data.inputtextval
         p.fieldkey = data.inputtextval
         p.secondaryKey = data.inputname
         p.selecttype = data.selecttype
         p.parentId=data.inputtypeID
         basemultiselectaccess.multiselectmodular(p)
       }
     })
   },
   customClearControl: function() {

     currentmodname.data.modnameid = []
     multiselects = {}
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
         ...multiselects,
         ...currentmodname.data
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