 let currentmodulename = "mrole";
 let currentmoduleid = "mroleid";
 let currentrolemodname = "role";
 let currentmodname = "modname";

 let multiselects = {};
 let multiselectfunc = {};

 let baseurlobj = {
     getpaginatesearchtypeurl: '/' + currentmodulename + '/api/searchtype/',
     createdata: '/' + currentmodulename + '/api/bulkCreate/',
     createdatarole: '/' + currentrolemodname + '/api/create/',
     updatedata: '/' + currentmodulename + '/api/update/',
     exceldata: '/' + currentmodulename + '/api/exportexcel/',
     uploaddata: '/' + currentmodulename + '/api/uploadcontent/',
     getpaginatesearchtypegroupby: '/' + currentmodulename + '/api/searchtypegroupby/',
     getpaginatemodnamesearchtypegroupby: '/' + currentmodname + '/api/searchtypegroupbyId/',
     getpaginateRolesearchtypegroupby: '/' + currentrolemodname + '/api/searchtypegroupbyId/',
     exportexcelcalc: '/' + currentmodulename + '/api/exportexcelcalc/',
     pivotresult: '/' + currentmodulename + '/api/pivotresult/',
     deletemrole: '/' + currentmodulename + '/api/destroy'
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
         getpaginateRolesearchtypegroupby: function(base) {

            
            ajaxbase.payload = base.datapayload
            ajaxbase.url = baseurlobj.getpaginateRolesearchtypegroupby;
              
           
            return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                ajaxbase.response = argument;
                return argument;
            })
        },
         insert: function(base) {


             //return basemod_modal.insertrole(base).then(basemod_modal.mrolepayloadformat).then(basemod_modal.insertmrole).then(function(data) {
                base=basemod_modal.mrolepayloadformat(base)
                return basemod_modal.insertmrole(base).then(function(data) {
                 //console.log(data)
                 ajaxbase.response = data;
                 return ajaxbase;

             })
         },
         deleterecord: function(base) {


             ajaxbase.payload = base.datapayload
             ajaxbase.url = baseurlobj.deletemrole;

             return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {

                 return base;
             })
         },
         update: function(base) {

             return basemod_modal.insertrole(base).then(basemod_modal.mrolepayloadformat).then(this.deleterecord).then(basemod_modal.insertmrole).then(function(data) {

                 //console.log(data)
                 ajaxbase.response = data;
                 return ajaxbase;

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


                 if (element.inputtype == "multiselect") {

                     htmlcontent += basemultiselectaccess.htmlpopulatemodular(element.inputtextval)


                 } else {
                     htmlcontent += '<div class="form-group overlaytxtalign col-md-5">' +
                         '<div class="col-sm-15">' +
                         '<label class="lblhide" id="lblmsg' + element.inputtextval + '">' +
                         '<i class="fa fa-bell-o"></i> Input with warning' +
                         '</label>' +
                         '<input type="text" data-attribute="' + element.fieldvalidatename + '" class="form-control" maxLength="' + element.fieldmaxlength + '"' +
                         ' data-form-type="false" onkeyup="javascript:reqops.formvalidation(this)" id="cltrl' + element.inputtextval + '" placeholder="' + element.inputplaceholder.capitalize() + '">' +
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

         if (base.datapayload.rolename != undefined) {
             var obj = {}
             obj.rolename = base.datapayload.rolename
             ajaxbase.payload = obj
             ajaxbase.url = baseurlobj.createdatarole;
             return new Promise(function(resolve, reject) {
                 ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                     resolve(argument);
                 })
             })
         }
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
         var interns = {}


         /*  if (multiselects.modulename != undefined) {
             modulename = multiselects.modulename[0].mname

         } else {

             modulename = base.editrecord[0].mname.split(',')
         }
         if (multiselects.accesstype != undefined) {
             accesstype = multiselects.accesstype[0].accesstype
         } else {

             accesstype = base.editrecord[0].accesstype.split(',')
         }

*/

         var doct = validationmap.filter(function(doc) {
             return doc.inputtype == "multiselect"; // if truthy then keep item
         }).map(function(doct) {
             return { // return what new object will look like
                 inputname: doct.inputname,
                 inputtextval: doct.inputtextval
             };
         });
         
         doct.forEach(function(element) {
             if (multiselects[element.inputtextval] != undefined) {
                 interns[element.inputtextval] = multiselects[element.inputtextval][0][element.inputname]
             } else {
                 interns[element.inputtextval] = base.editrecord[0][element.inputname].split(',')
             }
         });
         var rolobh = {};
         var roles = []


         var isactivearr = [];
         rolobh.mroleID = data.roleid;
         roles.push(rolobh);
         var isactivearrayobj = {};
         var isactiveparam = base.datapayload.recordstate
        // console.log(base.datapayload.recordstate)
         if (isactiveparam != undefined || isactiveparam === true) {
             isactivearrayobj.recordstate = true;

         } else {
             isactivearrayobj.recordstate = false;
         }
         isactivearr.push(isactivearrayobj);


         var internaccesstype = interns.accesstype.map(function(doctor) {
             return { accesstype: doctor }
         })
         var internmodname = interns.modulename.map(function(doctor) {
             return { modnameID: doctor }
         })
         var internrolename = interns.rolename.map(function(doctor) {
            return { rolenameID: doctor }
        }) 
        
         var a = cartesianProduct([internmodname, internaccesstype, internrolename, isactivearr]);

         var providedre = a.map(function(country) {
             return {
                 modulename: country[0].modnameID,
                 accesstype: country[1].accesstype,
                 rolename: country[2].rolenameID,
                 recordstate: country[3].recordstate
             };
         });

         let o={}
         o.payset=providedre 
         base.datapayload = o
         return base;
     },
     afterhtmlpopulate: function() {
         $('#basetable tbody tr td:last-child').attr('onclick', 'javascript:basemod_modal.ontdedit(this)')
         $('#basetable tbody tr td:nth-child(1) input:checkbox').attr('onclick', 'javascript:basemod_modal.tablechkbox(this)')
         //$("a[href='#sales-chart'").hide()
     },
     ontdedit: function(arg) {

         var armroleid = $(arg).attr('data-tbledit-type')
         ajaxbase.isedit = true;
         var interncontent = ajaxbase[currentmodulename].rows;

         interncontent = interncontent.filter(function(doctor) {
             return doctor[currentmoduleid] == armroleid;
         })
         base.editrecord = interncontent;
         $('#cltrl' + currentmoduleid).val(armroleid);
         var formatresponse = this.formatresponse(interncontent);
console.log(JSON.stringify(formatresponse));
console.log(JSON.stringify(interncontent));
         formatresponse.forEach2(function(data) {

             if (data.inputtype == "textbox") {
                 $("#cltrl" + data.inputtextval).val(data.vals)
                 $("#cltrl" + data.inputtextval).removeAttr('data-form-type');
             } else if (data.inputtype == "multiselect" && data.inputtextval == "accesstype") {
                 multiselectfunc[data.inputtextval].destroy(data.inputtextval)
                 var internsets = data.vals

                 if (Array.isArray(internsets)) {
                     var accesscontent = "";
                     internsets.forEach2(function(dat) {

                         accesscontent = accesstypecontent.filter(function(doctor) {
                             return doctor.val == dat;
                         })
                         /*array*/
                         multiselectfunc[data.inputtextval].onsearchtext(accesscontent[0].key, accesscontent[0].text, accesscontent[0].val);
                     })
                 } else {
                     accesscontent = accesstypecontent.filter(function(doctor) {
                         return doctor.val == internsets;
                     })
                     /*string*/
                     multiselectfunc[data.inputtextval].onsearchtext(accesscontent[0].key, accesscontent[0].text, accesscontent[0].val);
                 }

             } else if (data.inputtype == "multiselect") {

                 //multiselectfunc[data.inputtextval].destroy(data.inputtextval)
                 multiselectfunc[data.inputtextval].destroy(data.inputname)
                 var internsets = data.vals
                 
                 ///normalize array
                 var coremulti = interncontent.map2(function(da) {
                    var y = (da[data.inputCustomMapping].indexOf(',') != -1 ? da[data.inputCustomMapping].split(',') : da[data.inputCustomMapping]);
                    //var x = (da[data.inputtextval + "id"].indexOf(',') != -1 ? da[data.inputtextval + "id"].split(',') : da[data.inputtextval + "id"]);
                    console.log(y)
                    console.log(data)
                    console.log(da)
                    var xy = basemod_modal.getidfromobj(data.inputtextval)
                    console.log(xy);
                    var x = (da[xy].toString().indexOf(',') != -1 ? da[xy].split(',') : da[xy]);
                    
                    return {
                        val: y,
                        id: x
                    }
                })

                 ///one to one array 
                 var ids = coremulti[0].id
                 if (Array.isArray(ids)) {
                    var intens = []
                    ids.forEach2(function(d, i) {
                        var r = {}
                        r.id = d
                        r.val = coremulti[0].val[i]
                        intens.push(r)
                        r = {}

                    })

                    /*get id from response*/
                    intens.forEach2(function(dat) {

                        multiselectfunc[data.inputtextval].onsearchtext(data.inputtextval, dat.val, parseInt(dat.id));
                    })
                } else {
                    
                    multiselectfunc[data.inputtextval].onsearchtext(data.inputtextval, coremulti[0].val, parseInt(coremulti[0].id));
                }
            
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
                 
         var result = equijoin(res, validationmap, "key", "inputCustomMapping",
             ({
                 vals
             }, {
                 inputtype,
                 inputtextval,
                 inputname,
                 inputCustomMapping
             }) => ({
                 inputtype,
                 inputtextval,
                 inputname,
                 inputCustomMapping,
                 vals
             }));

         return result;
     },
     formatserverfieldmap: function(data) {

         var applyfield = applyfields;
         var res = data.map(function(data) {
             return applyfield.map(function(da) {

                 var y = (data[da].indexOf(',') != -1 ? data[da].split(',') : data[da]);

                 return {
                     key: da,
                     vals: y
                 }
             })
         })[0]
         return res;
     },
     populatemodularddl: function() {

         validationmap.forEach2(function(data) {
             if (data.inputtype == "multiselect") {

                 var p = {}
                 p.fieldname = data.inputtextval
                 //p.fieldkey = data.inputname
                 p.fieldkey = data.inputtextval

                 basemultiselectaccess.multiselectmodular(p);
             }
         })
     },
     getidfromobj: function(val) {
        var basesets = validationmap.filter(function(dt) {
            return dt.inputtextval == val
        }).map(function(dt) {
            //return dt.inputname;
            return dt.inputCustomMapping

        })
        return basesets.toString();
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

     multiselectmodular: function(arg) {
         
         var multiselectconfig = {
             selectevent: '#in' + arg.fieldname,
             fieldkey: arg.fieldkey,
             placeholder: arg.fieldname,
             remotefunc: this["remotefunc" + arg.fieldname]
         }

         //multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, this["onchange" + arg.fieldname])
         multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, function(data) {
             
             multiselects[arg.fieldname] = data;

         })
         multiselectfunc[arg.fieldname].init();
     },
     htmlpopulatemodnamefilterparam: function(internar) {
         var filtparam = {}
         filtparam.pageno = 0
         filtparam.pageSize = 20
         filtparam.searchtype = "Columnwise"
         filtparam.searchparam = internar;
         filtparam.searchparammetafilter = []
         filtparam.ispaginate = true
         filtparam.disableDate=true
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
     remotefuncmname: function(data) {
         return new Promise(function(resolve, reject) {

             var arin = []
             var intern = {}
             intern[data.fieldname] = data.fieldval
             arin.push(intern)
             intern = {}
             var internbase = basemultiselectaccess.htmlpopulatemodnamefilterparam(arin)
             basefunction().getpaginatemodnamesearchtypegroupby(internbase).then(function(argument) {
                 var sets = argument.rows;
                 var internfield = Object.keys(sets[0])
                 sets = sets.map(function(doctor) {
                     return { // return what new object will look like
                         key: data.fieldname,
                         text: doctor[internfield[0]],
                         val: doctor[internfield[1]]
                     };
                 });
                 resolve(sets)
             })
         })
     },
     remotefuncrolename: function(data) {
        return new Promise(function(resolve, reject) {
            var arin = []
            var intern = {}
            intern[data.fieldname] = data.fieldval
            arin.push(intern)
            intern = {}
            var internbase = basemultiselectaccess.htmlpopulatemodnamefilterparam(arin)
            basefunction().getpaginateRolesearchtypegroupby(internbase).then(function(argument) {
                var sets = argument.rows;
                var internfield = Object.keys(sets[0])
                sets = sets.map(function(doctor) {
                    return { // return what new object will look like
                        key: data.fieldname,
                        text: doctor[internfield[0]],
                        val: doctor[internfield[1]]
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
     htmlpopulatemodular: function(fieldname) {
         var htmlcontents = '<div class="form-group col-sm-6">' +
             '<div class="col-sm-15">' +
             '<label class="lblhide" id="lblmsgddlddlmulti">' +
             '<i class="fa fa-bell-o"></i> Input with warning' +
             '</label>' +
             '<div id="in' + fieldname + '"></div>' +
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