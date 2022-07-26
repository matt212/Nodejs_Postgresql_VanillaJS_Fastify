 let currentmodulename = "mrole";
 let currentmoduleid = "mroleid"
 let currentrolemodname = "role";
 let currentmodname = "modname";
 let y = "";
 let x = "";
 let multiselects = {};
 let multiselectfunc = {};
 let dynamicmultiselects = {};
 let baseurlobj = {
     getpaginatesearchtypeurl: '/' + currentmodulename + '/api/searchtype/',
     createdata: '/' + currentmodulename + '/api/bulkCreate/',
     createdatarole: '/' + currentrolemodname + '/api/create/',
     updatedata: '/' + currentmodulename + '/api/update/',
     exceldata: '/' + currentmodulename + '/api/exportexcel/',
     uploaddata: '/' + currentmodulename + '/api/uploadcontent/',
     getpaginatesearchtypegroupby: '/' + currentmodulename + '/api/searchtypegroupby/',
     getpaginatemodnamesearchtypegroupby: '/' + currentmodname + '/api/searchtypegroupby/',
     exportexcelcalc: '/' + currentmodulename + '/api/exportexcelcalc/',
     pivotresult: '/' + currentmodulename + '/api/pivotresult/',
 }
 let basefunction = function() {
     return {
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
         getpaginatemodnamesearchtypegroupby: function(base) {


             ajaxbase.payload = base.datapayload
             ajaxbase.url = baseurlobj.getpaginatemodnamesearchtypegroupby;

             return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                 ajaxbase.response = argument;
                 return argument;
             })

         },
         insert: function(base) {


             return basemod_modal.insertrole(base).then(basemod_modal.mrolepayloadformat).then(basemod_modal.insertmrole).then(function(data) {

                 //console.log(data)
                 ajaxbase.response = data;
                 return ajaxbase;

             })

         },
         update: function(base) {


             ajaxbase.payload = base.datapayload
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

         }

     }
 }
 /*accesstype multiselect*/
 let basemod_modal = {
     modalpopulate: function() {
         var interset = validationmap

         let redlime = doChunk(interset, 2)
         $("#overlaycontent").empty();
         var htmlcontent = "";
         redlime.forEach(function(item) {

             htmlcontent += '<div class="row">'
             item.forEach2(function(element) {


                if(element.inputtype=="multiselect")
                {
                    
                     htmlcontent += basemultiselectaccess.htmlpopulatemodular(element.inputtextval)

                 /*if (element.inputname == "accesstype") {

                     htmlcontent += basemultiselectaccess.htmlpopulateaccesstype()


                 } else if (element.inputname == "mname") {

                     htmlcontent += basemultiselectaccess.htmlpopulatemodname()


                 } */
             }
                 else {
                     htmlcontent += '<div class="form-group overlaytxtalign col-md-5">' +
                         '<div class="col-sm-15">' +
                         '<label class="lblhide" id="lblmsg' + element.inputname + '">' +
                         '<i class="fa fa-bell-o"></i> Input with warning' +
                         '</label>' +
                         '<input type="text" data-attribute="' + element.fieldvalidatename + '" class="form-control" maxLength="' + element.fieldmaxlength + '"' +
                         ' data-form-type="false" onkeyup="javascript:reqops.formvalidation(this)" id="cltrl' + element.inputname + '" placeholder="' + element.inputname.replace('_', ' ').capitalize() + '">' +
                         '</div></div>';
                 }

             })
             htmlcontent += '</div>'
         })

         var chkcontent = ' <input type="hidden" name="' + currentmoduleid + '" value="0" id="cltrl' + currentmoduleid + '"> <div class="form-group overlaytxtalign col-md-5">' +
             '<div class="col-sm-offset-2 col-sm-15">' +
             '<div>' +
             '<label>' +
             '<input type="checkbox" id="cltrlrecordstate" onclick="javascript:tableops.onchk(this)" value="true"> Remember me' +
             '</label>' +
             '</div>' +
             '</div>' +
             '</div>';

         $("#overlaycontent").html(htmlcontent + chkcontent);
     },
     insertrole: function(base) {
         var obj = {}
         obj.rolename = base.datapayload.role
         ajaxbase.payload = obj
         ajaxbase.url = baseurlobj.createdatarole;
         return new Promise(function(resolve, reject) {
             ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                 resolve(argument);
             })
         })
     },
     insertmrole: function(base) {
         /*var obj = {}
         obj.rolename = base.datapayload.role*/
         ajaxbase.payload = base.datapayload
         ajaxbase.url = baseurlobj.createdata;
         return new Promise(function(resolve, reject) {
             ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                 resolve(argument);
             })
         })
     },
     mrolepayloadformat: function(data) {
         var modname = multiselects.modname[0].mname
         var accesstype = multiselects.accesstype[0].accesstype


         var rolobh = {};
         var roles = []
         var isactivearr = [];

         var isactivearr = [];
         rolobh.mroleID = data.roleid;
         roles.push(rolobh);
         var isactivearrayobj = {};
         var isactiveparam = base.datapayload.recordstate
         if (isactiveparam != undefined && isactiveparam == "active") {
             isactivearrayobj.isactive = true;

         } else {
             isactivearrayobj.isactive = false;
         }
         isactivearr.push(isactivearrayobj);


         var internaccesstype = accesstype.map(function(doctor) {
             return { accesstype: doctor }
         })
         var internmodname = modname.map(function(doctor) {
             return { modnameID: doctor }
         })

         var a = cartesianProduct([internmodname, internaccesstype, roles, isactivearr]);

         var providedre = a.map(function(country) {
             return {
                 modulename: country[0].modnameID,
                 accesstype: country[1].accesstype,
                 rolename: country[2].mroleID,
                 isactive: country[3].isactive
             };
         });

         base.datapayload = providedre
         return base;
     },
     afterhtmlpopulate: function() {

         // $('#basetable tbody tr td:eq(5)').hide();
         //  $('#basetable tbody tr td:eq(6)').hide();
         $('#basetable tbody tr td:nth-child(6)').hide();
         $('#basetable tbody tr td:nth-child(7)').hide();

         $('#basetable tbody tr td:nth-child(8)').attr('onclick', 'javascript:basemod_modal.ontdedit(this)')
         $('#basetable tbody tr td:nth-child(1) input:checkbox').attr('onclick', 'javascript:basemod_modal.tablechkbox(this)')

     },
     ontdedit: function(arg) {

         var armroleid = $(arg).attr('data-tbledit-type')
         ajaxbase.isedit = true;
         var interncontent = ajaxbase.response.rows;
         interncontent = interncontent.filter(function(doctor) {
             return doctor[currentmoduleid] == armroleid;
         })

         var formatresponse = this.formatresponse(interncontent);

         formatresponse.forEach2(function(data) {



             if (data.inputtype == "textbox") {
                 $("#cltrl" + data.inputtextval).val(data.vals)
                 $("#cltrl" + data.inputtextval).removeAttr('data-form-type');
             } else if (data.inputtype == "multiselect" && data.inputtextval == "accesstype") {
                 multiselectfunc[data.inputtextval].destroy(data.inputtextval)
                 var internsets = data.vals
                 internsets.forEach2(function(dat) {

                     var accesscontent = accesstypecontent.filter(function(doctor) {
                         return doctor.val == data;
                     })

                     multiselectfunc[data.inputtextval].onsearchtext(accesscontent[0].key, accesscontent[0].text, accesscontent[0].val);
                     /*var accesscontent = accesstypecontent.filter(function(doctor) {
                         return doctor.val == data;
                     })

                     y.onsearchtext(accesscontent[0].key, accesscontent[0].text, accesscontent[0].val);*/
                 })
             }



         })
         /*var rein = interncontent[0].accesstype.split(',')

         y.destroy('accesstype')
         rein.forEach2(function(data) {
             var accesscontent = accesstypecontent.filter(function(doctor) {
                 return doctor.val == data;
             })

             y.onsearchtext(accesscontent[0].key, accesscontent[0].text, accesscontent[0].val);
         })
         var rein = interncontent[0].modulename.split(',')
         x.destroy("mname")
         rein.forEach(function(value, i) {

             x.onsearchtext("mname", value, parseInt(interncontent[0].modid.split(',')[i]));
         });

         Object.keys(interncontent[0]).map(function(objectKey, index) {
             var value = interncontent[0][objectKey];

             $("#cltrl" + objectKey).val(value)

             $("#cltrl" + objectKey).removeAttr('data-form-type');
         });

         if (interncontent[0].recordstate == "active") {
             $('#cltrlrecordstate').prop('checked', true);
         } else {
             $('#cltrlrecordstate').prop('checked', false);
         }*/

         $("#btnbutton").click();

     },
     tablechkbox: function(arg) {
         console.log($(arg).attr('data-chk-type'))
     },
     formatresponse: function(data) {

         var res = this.formatserverfieldmap(data)
         
        

         var result = equijoin(res, validationmap, "key", "inputtextval",
             ({
                 vals
             }, {
                 inputtype,
                 inputtextval
             }) => ({
                 inputtype,
                 inputtextval,
                 vals
             }));

         return result;
     },
     formatserverfieldmap: function(data) {
         var applyfield = applyfields;
         var res = data.map(function(data) {
             return applyfield.map(function(da) {

                 var y = (data[da].indexOf(',') != -1 ? data[da].split(',') : data[da]);
                 console.log(data[da])
                 return {
                     key: da,
                     vals: y
                 }
             })
         })[0]
         return res;
     },
     populatemodularddl:function()
     {
       
        validationmap.forEach2(function(data)
        {
            if(data.inputtype == "multiselect")
            {
                
                var p={}
                p.fieldname=data.inputtextval
                p.fieldkey=data.inputname
                basemultiselectaccess.multiselectmodular(p); 
            }
        })
        console.log(multiselectfunc)

     }


 }

 let accesstypecontent = [{
     "key": "accesstype",
     "text": "ViewOnly",
     "val": "VO",
 }, {
     "key": "accesstype",
     "text": "AllAccess",
     "val": "AA",
 }]

 let basemultiselectaccess = {

     multiselectaccesstype: function() {
         var multiselconfig1 = {
             selectevent: '#inaccesstype',
             fieldkey: 'accesstype',
             remotefunc: this.contaccestype
         }
         y = new multisel(multiselconfig1, this.onmultiaccesschange)
         y.init()
     },
     multiselectmodular: function(arg) {
         var multiselectconfig = {
             selectevent: '#in' + arg.fieldname,
             fieldkey: arg.fieldkey,
             remotefunc: this["remotefunc" + arg.fieldname]
         }

         multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, this["onchange" + arg.fieldname])
         multiselectfunc[arg.fieldname].init();

     },
    onchangeaccesstype: function(data) {

         multiselects.accesstype = data
     },
     onchangemodulename: function(data) {

         multiselects.modname = data
         
     },
     multiselectmodname: function() {
         var multiselconfig1 = {
             selectevent: '#inmodname',
             fieldkey: 'mname',
             remotefunc: this.contmodname
         }
         x = new multisel(multiselconfig1, this.onmultimodnamechange)
         x.init()

     },
     htmlpopulatemodnamefilterparam: function(internar) {
         var filtparam = {}
         filtparam.pageno = 0
         filtparam.pageSize = 20
         filtparam.searchtype = "Columnwise"
         filtparam.searchparam = internar;
         filtparam.searchparammetafilter = []
         filtparam.ispaginate = true
         base.datapayload = filtparam

         return base;
     },
     htmlpopulatemrolefilterparam: function(internar) {
         var filtparam = {}
         filtparam.modulename = internar.mname;
         filtparam.rolename = internar.roleid
         base.datapayload = filtparam

         return base;
     },
     onmultiaccesschange: function(data) {

         multiselects.accesstype = data
     },
     onmultimodnamechange: function(data) {

         multiselects.modname = data

     },
     remotefuncmodulename: function(data) {
         return new Promise(function(resolve, reject) {

             var arin = []
             var intern = {}
             intern[data.fieldname] = data.fieldval
             arin.push(intern)
             intern = {}
             var internbase = basemultiselectaccess.htmlpopulatemodnamefilterparam(arin)

             basefunction().getpaginatemodnamesearchtypegroupby(internbase).then(function(argument) {
                 var sets = argument.rows
                 sets = sets.map(function(doctor) {
                     return { // return what new object will look like
                         key: data.fieldname,
                         text: doctor.mname,
                         val: doctor.modnameid
                     };
                 });

                 resolve(sets)
             })
         })
     },
     remotefuncaccesstype: function(data) {
         return new Promise(function(resolve, reject) {
             resolve(accesstypecontent)
         })
     },
     htmlpopulateaccesstype: function() {
         var htmlcontent = '<div class="form-group col-sm-6">' +
             '<div class="col-sm-15">' +
             '<label class="lblhide" id="lblmsgddlaccestype">' +
             '<i class="fa fa-bell-o"></i> Input with warning' +
             '</label>' +
             '<div id="inaccesstype"></div>' +
             '</div></div>';

         return htmlcontent;
         //$(htmlcontent).insertAfter($("#overlaycontent div"))
     },
     htmlpopulatemodname: function() {
         var htmlcontents = '<div class="form-group col-sm-6">' +
             '<div class="col-sm-15">' +
             '<label class="lblhide" id="lblmsgddlddlmulti">' +
             '<i class="fa fa-bell-o"></i> Input with warning' +
             '</label>' +
             '<div id="inmodname"></div>' +
             '</div></div>';
         return htmlcontents;

         //$(htmlcontents).insertBefore($("#overlaycontent.form-group.overlaytxtalign.col-md-12"))
     },
     htmlpopulatemodular: function(fieldname) {
         var htmlcontents = '<div class="form-group col-sm-6">' +
             '<div class="col-sm-15">' +
             '<label class="lblhide" id="lblmsgddlddlmulti">' +
             '<i class="fa fa-bell-o"></i> Input with warning' +
             '</label>' +
             '<div id="in'+fieldname+'"></div>' +
             '</div></div>';
         return htmlcontents;

         //$(htmlcontents).insertBefore($("#overlaycontent.form-group.overlaytxtalign.col-md-12"))
     }

 }


 $(function() {
     basemod_modal.modalpopulate()
     basemod_modal.populatemodularddl();
    /*
     basemultiselectaccess.multiselectaccesstype();
     basemultiselectaccess.multiselectmodname();*/

     $(".form-horizontal input:text").on("keydown keyup change", function() {

         var sel = $('.form-horizontal input:text[data-form-type]').length;

         if (sel <= 0) {
             $('#btnmodalsub').prop('disabled', false)
         } else {
             $('#btnmodalsub').prop('disabled', true)
         }
     })








 })

 /*select  fields from one array to another array */
 /*var res = moduleattributes.map(function(data) {
          return applyfields.map(function(da) {
              return {
                  [da]: data[da] }
          })
      })*/

 /*modularsel:function()
     {
         var interset = JSON.parse(validationmap.replace(/&quot;/g, '"'))
 interset.forEach2(function(element) {
    console.log(element.inputname)

var modmulti={}
modmulti.fieldname=element.inputname
modmulti.remotefunc="remotefunc"+modmulti.fieldname
modmulti.onmultichange="onmultichange"+modmulti.fieldname
multiselects["const"+modmulti.fieldname]=basemultiselectaccess.multiselectmodularaccesstype(basepopulate)
multiselects["remotefunc"+modmulti.fieldname] = "remotefunc"+modmulti.fieldname
multiselects["onmultichange"+modmulti.fieldname] = new Function('obj', 'dynamicmultiselects[obj.type]=obj.val;');


 })


     }*/