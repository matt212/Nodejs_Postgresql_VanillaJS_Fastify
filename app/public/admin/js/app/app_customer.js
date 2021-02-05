 let currentmodulename = "customer";
 let currentmoduleid = "customerid"

 let currentgender = {
   name: "gender",
   id: "genderid",
   text: "name",
   data: {
     "genderid": []
   }
 };
 let baseurlobj = {
   getpaginatesearchtypeurl: '/' + currentmodulename + '/api/searchtype/',
   createdata: '/' + currentmodulename + '/api/create/',
   updatedata: '/' + currentmodulename + '/api/update/',
   exceldata: '/' + currentmodulename + '/api/exportexcel/',
   uploaddata: '/' + currentmodulename + '/api/uploadcontent/',
   getpaginatesearchtypegroupby: '/' + currentmodulename + '/api/searchtypegroupby/',
   pivotresult: '/' + currentmodulename + '/api/pivotresult/',
   //
   getcurrentModgendergroupby: '/' + currentgender.name + '/api/searchtypegroupbyId/',
 }
 let basefunction = function() {
   return {
     //
     genderMultiKeysLoad: function(keys) {
       //keys="gender"
       base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
       return this
         .getcurrentModgendergroupby(base)
         .then(function(argument) {
           return argument
         })
     },
     customerMultiKeysLoad: function(keys) {
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


       ajaxbase.payload = basemod_modal.payloadformat(base)
       ajaxbase.url = baseurlobj.createdata;

       return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
         ajaxbase.response = argument;
         return argument;
       })

     },
     update: function(base) {


       ajaxbase.payload = basemod_modal.payloadformat(base)
       ajaxbase.url = baseurlobj.updatedata;

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

     getcurrentModgendergroupby: function(base) {
       ajaxbase.payload = base.datapayload
       ajaxbase.url = baseurlobj.getcurrentModgendergroupby;
       return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
         ajaxbase.response = argument;
         return argument;
       })
     },

   }
 }
 //
 let validationListener = function() {
   var sel = $('.form-horizontal input:text[data-form-type], input:checkbox[data-form-type], div[data-form-type]').length;

   if (sel <= 0) {
     $('#btnmodalsub').prop('disabled', false)
   } else {
     $('#btnmodalsub').prop('disabled', true)
   }
 }
 $(function() {
   basemod_modal.modalpopulate()
   $('.form-horizontal input[type="text"], input[type="checkbox"]').on("keydown keyup change", function() {
     validationListener()
   })
 })

 let basemod_modal = {
   modalpopulate: function() {
     var interset = validationmap
     let redlime = doChunk(interset, 2)
     $("#overlaycontent").empty();
     var htmlcontent = "";
     var internhtmlcontent = "";
     redlime.forEach(function(item) {

       htmlcontent += `<div class="row">`
       item.forEach2(function(element) {


         //rchkelse   

         if (element.inputtype == "checkbox" && element.inputtypemod == currentgender.name) {
           var internhtmlcontent = " "
           basefunction().genderMultiKeysLoad(currentgender.text).then(function(data) {
             data.rows.forEach((elem, index) => {
               internhtmlcontent = internhtmlcontent + `<div class="custom-control custom-checkbox">
        <label><input type="checkbox" class="custom-control-input" id="cltrl${currentgender.id}${elem[currentgender.id]}" 
        onclick="javascript:basemod_modal.ongenderControl(this)" 
        data-key="${currentgender.id}"
        data-val="${elem[currentgender.id]}"
        data-attribute="checkboxMulti"
        data-parentVal="${currentgender.name}"       
        value="${elem[currentgender.id]}">${elem[currentgender.text]}
        </label></div>`
             })
             $('#overlaycontent').append(`<div class="form-group" data-attribute="checkboxMulti"  data-form-type="true">
             <div class="col-sm-15">
                    <label class="lblhide" id="lblmsg${currentgender.id}">
                    <i class="fa fa-bell-o"></i> Please select gender
                    </label>${internhtmlcontent}</div>
                    </div></div>`)
           });
         } else {
           htmlcontent += `<div class="form-group overlaytxtalign col-md-5">
                    <div class="col-sm-15">
                    <label class="lblhide" id="lblmsg${element.inputname}">
                    <i class="fa fa-bell-o"></i>  ${element.inputname} is required
                    </label>
                    <input type="text" data-attribute="${element.fieldvalidatename}" class="form-control" maxLength="${element.fieldmaxlength}"
                    data-form-type="false" onkeyup="javascript:reqops.formvalidation(this)" id="cltrl${element.inputname}" placeholder="${element.inputplaceholder.capitalize()}">
                    </div></div>`;
         }

       })

       htmlcontent += `</div>`
     })

     var chkcontent = `<input type="hidden" name="${currentmoduleid}" value="0" id="cltrl${currentmoduleid}"> 
    <div class="form-group overlaytxtalign col-md-5"><div class="col-sm-offset-2 col-sm-15"><div><label><div class="checkbox tablechk">
   <label>
   <div class="col-sm-15">
                    <label class="lblhide" id="lblmsgrecordstate">
                    <i class="fa fa-bell-o"></i> Please select Active
                    </label>
   <input type="checkbox" id="cltrlrecordstate" data-attribute="checkbox" data-form-type="true" onclick="javascript:tableops.onchk(this)" value="true"><span class="checkbox-material"><span class="check"></span></span> Remember me
   <span class="checkbox-material">
   </div>
   </span> 
   </label>
   </div></label></div></div></div>`;

     $("#overlaycontent").html(htmlcontent + chkcontent);
   },

   ongenderControl: function(data) {
     var key = $(data).data().key;
     var val = $(data).data().val;
     if ($(data)[0].checked) {
       currentgender.data[key] = [...currentgender.data[key], ...[val]]
     } else {
       currentgender.data[key] = currentgender.data[key].filter(item => item !== val)
     }
     reqops.formvalidation(data);
     
      validationListener()
     
     
   },
   onMultiControlChk: function(data) {},
   baseCheckbox: `<div class="checkbox tablechk">
   <label>
   <input type="checkbox" id="cltrlrecordstate" onclick="javascript:tableops.onchk(this)" value=true> Remember me
   <span class="checkbox-material">
   </span> 
   </label>
   </div>`,
   afterhtmlpopulate: function() {
     $('#basetable tbody tr td:last-child').attr('onclick', 'javascript:basemod_modal.ontdedit(this)')
     $('#basetable tbody tr td:nth-child(1) input:checkbox').attr('onclick', 'javascript:basemod_modal.tablechkbox(this)')
     //$("a[href='#sales-chart'").hide()
   },
   payloadformat: function(arg) {
     return {
       ...arg.datapayload,
       ...currentgender.data
     }
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
     var formatresponse = this.formatresponse(interncontent);

     formatresponse.forEach2(function(data) {

       if (data.inputtype == "textbox") {
         $("#cltrl" + data.inputname).val(data.vals)
         $("#cltrl" + data.inputname).removeAttr('data-form-type');
       } else if (data.inputtype == "radio") {
         $(`#overlaycontent .form-group .custom-control.custom-radio  [data-val="${data.vals}"]`).prop("checked", true)

       } else if (data.inputtype == "checkbox") {
         $(`#overlaycontent .checkbox.tablechk [type="checkbox"]`).each(function(index) {
           $(this).attr("checked", false)
         })
         data.vals.forEach(function(dr) {
           $(`#overlaycontent .form-group .custom-control.custom-checkbox  [data-val='${dr}']`).prop("checked", true)
         })
         currentgender.data[data.inputname] = data.vals
       }
     })
     //active comma denominator
     //console.log(interncontent[0].recordstate)
     if (interncontent[0].recordstate) {
       $('#cltrlrecordstate').prop('checked', true);
       $('#cltrlrecordstate').val(true);
       base.datapayload.recordstate = true
     } else {
       $('#cltrlrecordstate').prop('checked', false);
       $('#cltrlrecordstate').val(false);
       base.datapayload.recordstate = false
     }
     $("#btnbutton").click();
   },
   tablechkbox: function(arg) {},
   formatresponse: function(data) {

     var res = this.formatserverfieldmap(data)

     var result = equijoin(res, validationmap, "key", "inputname",
       ({
         vals
       }, {
         inputtype,
         inputname
       }) => ({
         inputtype,
         inputname,
         vals
       }));

     return result;
   },
   formatserverfieldmap: function(data) {

     var applyfield = applyfields;
     var res = data.map(function(data) {
       return applyfield.map(function(da) {

         //var y = (data[da].indexOf(',') != -1 ? data[da].split(',') : data[da]);
         var y = data[da]
         return {
           key: da,
           vals: y
         }
       })
     })[0]
     return res;
   },

 }