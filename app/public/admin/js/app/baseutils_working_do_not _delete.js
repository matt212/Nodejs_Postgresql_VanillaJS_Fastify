   var ajaxurl = {}
   var ajaxbase = {}
   var basesearchobj = {}
   var basesearchar = new Array()
   var basesearcharconsolidated = new Array()
   var base = new Object()
   var basedataset = {}
   base.appkey = location.hostname + (location.port ? ':' + location.port : '');
   base.config = { headers: { "x-access-token": "MwMDAiLCJpYXQiOjE0NzM2MTQ4MDgsImV4cCI6MTQ3MzYxODQwOH0" } };
   base.timeinternprimary = ""
   base.timeinternsecondary = ""
   base.XpageSize = 40;
   base.Xpageno = 0;
   base.YpageSize = 20;
   base.Ypageno = 0;
   base.pivotinternload = true;
   ajaxurl.auth = '/authenticate';
   base.searchtype = "Columnwise"

   ajaxbase.postauth = base.config;


   var validations = {
       email: [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, 'Please enter a valid email address']
   };


   var now = new Date(); //http://139.59.29.135:1337
   var protocol = location.protocol;
   var slashes = protocol.concat("//");
   var host = slashes.concat(window.location.hostname);
   var socket = io.connect(host + ':1338', {
       reconnect: true
   })
   // </fold
   socket.on('news', function(data) {

       var then = new Date();

       clearInterval(id);



       var loop = width;

       var ids = setInterval(function() {
           loop++;
           if (loop === 101) {
               clearInterval(ids);
               loop = 0;
               width = 0;
               $("#uploadsavemsg").html(data + " records are inserted ! ");


           } else {

               $("#lbluploadprogress").html(loop + "%")
               $("#dvuploadprogress").css('width', loop + "%")
               $("#uploadsave").html(loop + "%")
           }

       }, 20);

   })

   socket.on('newsdownloadsets', function(data) {


       var filenome = data.replace('.csv', '')
       clearInterval(id);
       var loop = width;

       var ids = setInterval(function() {
           loop++;
           if (loop === 101) {
               clearInterval(ids);
               loop = 0;
               width = 0;
               $("#libasenotifications").hide();
               $("#libasenotificationrow").show();
               $("#spn_dv" + filenome).hide();
               $("#dv_set_progress" + filenome).before('<a href="../' + data + '"><i class="fa fa-download text-aqua"></i> <span  style="white-space: normal !important;">' + data + '</span></a>');
               $("#uploadsave").hide();

           } else {

               $("#lbluploadprogress" + filenome + "").html(loop + "%")
               $("#dvuploadprogress" + filenome + "").css('width', loop + "%")
               $("#uploadsave").html(loop + "%")
           }

       }, 20);

   })
   socket.on('newsdownloadsetprogressstats', function(data) {
       $("#libasenotifications").hide();
       $("#libasenotificationrow").show();

       var filenames = data.filenames;
       var count = (data.count <= 0 ? 40 : parseInt(data.count));

       $("#libasenotificationrow").append('<span style="color: #28669c;" id="spn_dv' + filenames + '">Data processing in progress !</span><div id="dv_set_progress' + filenames + '"><small class="pull-right"><label id="lbluploadprogress' + filenames + '">%</label></small>' +
           '<div class="progress xs">' +
           '<div class="progress-bar progress-bar-aqua" id="dvuploadprogress' + filenames + '" style="width: 20%;" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">' +
           '</div>' +
           '</div>' +
           '<div class="ripple-container">' +
           '<div class="ripple ripple-on ripple-out" style="left: 205.203px; top: 42px; background-color: rgb(33, 150, 243); transform: scale(32.875);"></div>' +
           '</div></div>');

       clearInterval(id);
       id = setInterval(frame, 750);
       width = 0;

       function frame() {
           if (width >= count) {
               clearInterval(id);
               width = 0;
           } else {
               width++;

               $("#lbluploadprogress" + filenames + "").html(width + "%")
               $("#dvuploadprogress" + filenames + "").css('width', width + "%")
               $("#uploadsave").html(width + "%")
           }
       }

   })

   socket.on('newsdownload', function(data) {

   })
   socket.on('newsrecordset', function(data) {
       $("#uploadnotification").html(data);
   })
   var now = "";
   var width = 1;
   var id = "";
   fileSelected = function(element) {
       now = new Date();
       var myFileSelected = element.files[0];


       uploadFile(myFileSelected).then(function(a) {


           $("#uploadfiles").val('');

           $("#uploadsave").show();
           $("#uploadsavemsg").show();
           $("#uploadsaveddl").attr("data-toggle", "dropdown");
           $("#uploadsavemsg").html("Data processing in progress !");

           id = setInterval(frame, 750);

           function frame() {
               if (width >= 24263) {
                   clearInterval(id);
               } else {
                   width++;
                   //elem.style.width = width + '%';
                   $("#lbluploadprogress").html(width + "%")
                   $("#dvuploadprogress").css('width', width + "%")
                   $("#uploadsave").html(width + "%")
               }
           }




       })

   }
   var selectArr = [];

   function tablechkbox(argument) {



       var idx = selectArr.indexOf(argument)

       if (idx == -1) {
           selectArr.push(argument);
       } else {
           selectArr.splice(idx, 1)
           removefilterdiv(this, currentmoduleid, argument)
       }

       selectArr.forEach(function(element) {

           assignsearchparams(currentmoduleid, element);
       });

   }
   /* pivot report and chart */
   function pivotreport() {

       base.datapayload = payloadprepared();

       basefunction().getpivotreport(base).then(function(data) {

           processpivotresponse(data);
           // console.log(base.internaxis); 
           // console.log(base.yaxisarray);

           var tablecontent_rows_consolidate = []
           for (i = 0; i <= base.tablecontent_rows.length - 1; i++) {

               var internsets = base.tablecontent_rows[i];
               var keys = Object.keys(base.tablecontent_rows[i])
               var internobj = {}
               keys.forEach(function(element) {

                   var internval = internsets[element];
                   internobj[element] = isNaN(parseInt(internval)) ? 0 : parseInt(internval)

               });

               tablecontent_rows_consolidate.push(internobj)
               internobj = {}
           }

           base.tablecontent_rows_consolidate = tablecontent_rows_consolidate

           tblpivotyaxis(base);
           tblpivotxaxis(base)
           if (base.pivotinternload) {
               if ((base.internaxis.length - 1) != base.Xtotalpivotrecorset) {
                   bootpaginationxaxis(base)
                   $("#dvaxis").css('overflow-x', 'scroll')
                   $("#dvaxis").css('margin-top', '0%');

               } else {
                   $("#page-selection-xaxis").html("")
               }
               if (base.Ytotalpivotrecorset != (base.table_rows.length - 1)) {
                   bootpaginationyaxis(base)
                   $("#dvaxis").css('overflow-x', 'scroll')
                   //$("#dvaxis").css('margin-top', '-3%');
               } else {
                   $("#page-selection-yaxis").html("")
               }



           }
           initcharts(base.internaxis, base.yaxisarray);
           init3dcharts(base);
           drilldownpieparent();

       })

   }
   /*drilldown pieparent */
   function drilldownpieparent() {


       var searchString = "'total'";
       var rawcontent = base.rawpivotdata.rows

       //  var cols = base.internaxis.toString().replace(/\ /g, "")
       // console.log(cols);
       //var res = alasql('SELECT ' + cols + ' FROM ? WHERE yaxis=' + searchString, [rawcontent]);
       // console.log(res);


       /*dynamic object array snippets */
       /*var parentdrilldown = rawcontent.filter(function(doctor) {
           return doctor.yaxis === 'total'; // if truthy then keep item
       }).map(function(nested) {
           return Object.keys(nested).map(function(element) {
               return {
                   name: element,
                   y: nested[element],
                   drilldown: element
               };
           });
       })[0];
       parentdrilldown = parentdrilldown.filter(function(doctor) {
           return doctor.y !== 'total'; // if truthy then keep item
       })*/

       /*updatedcontent*/
       var parentdrilldown = rawcontent.filter(function(doctor) {
           return doctor.yaxis !== 'total'; // if truthy then keep item
       }).map(function(nested) {

           return {
               name: nested.yaxis,
               y: parseInt(nested.subtotal),
               drilldown: nested.yaxis
           };
       });

       //console.log(parentdrilldown)
       /*child drilldown*/

       var childdrilldown = rawcontent.filter(function(doctor) {
           return doctor.yaxis !== 'total'; // if truthy then keep item
       }).map(function(nested) {

           var childdrilldowninner = Object.keys(nested).filter(function(img) {
               return (img != 'yaxis' && img != 'subtotal')
           }).map(function(element) {
               var ar = []
               ar.push(element)
               ar.push(nested[element] === null ? 0 : parseInt(nested[element]))

               return (ar);
           });
           // console.log(red[0][0] + "--" + red[0][1]

           return {
               name: nested.yaxis,
               id: nested.yaxis,
               data: childdrilldowninner
           };

       });


       base.parentdrilldown = parentdrilldown
       base.childrendrilldown = childdrilldown
       populatepiechart(base);

   }

   function tblpivotyaxis(base) {


       var firsts = base.table_cols
       var baset = base.table_rows
       $("#tblpivotcol thead").html(' ')
       $("#tblpivotcol tbody").html(' ')
       $('#tblpivotcol thead ').append('<tr>')
       for (f of firsts) {
           $('#tblpivotcol thead tr').last().append('<th>' + f + '</th>').fadeIn('slow');

       }


       for (s of baset) {

           $('#tblpivotcol tbody ').append('<tr>')
           for (f of firsts) {

               $('#tblpivotcol tbody tr').last().append('<td>' + s[f] + '</td>').fadeIn('slow');

           }

       }
   }

   function tblpivotxaxis(base) {


       var firsts = base.tablecontent_cols
       var baset = base.tablecontent_rows_consolidate
       $("#tblpivotxaxis thead").html(' ')
       $("#tblpivotxaxis tbody").html(' ')

       $('#tblpivotxaxis thead ').append('<tr>')
       for (f of firsts) {
           $('#tblpivotxaxis thead tr').last().append('<th>' + f + '</th>').fadeIn('slow');

       }



       for (s of baset) {

           $('#tblpivotxaxis tbody ').append('<tr>')
           for (f of firsts) {

               $('#tblpivotxaxis tbody tr').last().append('<td>' + s[f] + '</td>').fadeIn('slow');

           }

       }
   }

   function processpivotresponse(data) {
       var internrespobj = data;
       base.rawpivotdata = data;
       if (internrespobj.rows.length > 0) {
           var reverset = removeJsonAttrs(internrespobj.rows, ["interncolumn"]);
           var reversetintern = removeJsonAttrs(internrespobj.rows, ["interncolumn"]);

           var doc = reversetintern.map(function(doctor) {
               return { // return what new object will look like
                   Monthsegregation: doctor.yaxis,
               };
           });



           var internreverset = removeJsonAttrs(reverset, ["yaxis"]);

           var yaxisarray = []
           var yaxisobj = {}
           for (index = 0; index < internreverset.length; ++index) {
               //console.log(internreverset[index]);
               //console.log(doc[index])
               var interndatasetname = internreverset[index]



               //var dataArray = Object.keys(interndatasetname).map(val => isNaN(parseInt(interndatasetname[val])) ? 0 : parseInt(interndatasetname[val]));

               // console.log(dataArray);
               //yaxisobj.name = doc[index].Monthsegregation
               var dataArray = Object.keys(interndatasetname).filter(word => word != "subtotal").map(function(val) {

                   return isNaN(parseInt(interndatasetname[val])) ? 0 : parseInt(interndatasetname[val])
               })

               yaxisobj.name = doc[index].Monthsegregation
               yaxisobj.data = dataArray
               yaxisarray.push(yaxisobj)
               yaxisobj = {};
           }


           var internaxis = Object.keys(internreverset[0]);

           // console.log(yaxisarray);
           base.internaxis = internaxis
           base.yaxisarray = yaxisarray
           base.table_rows = doc
           base.table_cols = Object.keys(doc[0])
           base.tablecontent_rows = internreverset



           base.tablecontent_cols = Object.keys(internreverset[0])


           base.Xtotalpivotrecorset = internrespobj.Xcount;
           base.Ytotalpivotrecorset = internrespobj.Ycount;

           base.subtotal = internrespobj.totaldoc;



       }
   }

   function moduleattributepopulate() {
       var jsonintern = moduleattributes.split(',');
       jsonintern.remove('updated_date').remove('created_date').remove('recordstate');
       if (base.idstatus) {
           jsonintern.remove(currentmoduleid);
       }
       if (base.excludedatecol) {
           var searchString = "%date%";
           var res = alasql('SELECT COLUMN * FROM [?] WHERE [0] LIKE ?', [jsonintern, searchString]);
           res.forEach(function(argument) {
               jsonintern.remove(argument);
           })

       }

       return jsonintern;
   }

   function populateaxiskeys() {
       base.idstatus = true;
       base.excludedatecol = false;
       base.moduleattributes = moduleattributepopulate();
       $("#selxaxis").append('<option></option>')
       base.moduleattributes.forEach(function(element) {

           $("#selxaxis").append("<option value = " + element + ">" + element.replace('_', ' ').capitalize() + "</option>")

       });
       $("#selxaxis").select2({
           placeholder: "Select a horizontal ( xaxis ) paramaters",
           allowClear: true
       });
       $("#selyaxis").append('<option></option>')
       base.moduleattributes.forEach(function(element) {
           $("#selyaxis").append("<option value = " + element + ">" + element.replace('_', ' ').capitalize() + "</option>")
       })
       $("#selyaxis").select2({
           placeholder: "Select a vertical ( yaxis ) paramaters",
           allowClear: true
       });
       /*for date filtes for date range*/
       var jsonintern = moduleattributes.split(',');

       var searchString = "%date%";

       var res = alasql('SELECT COLUMN * FROM [?] WHERE [0] LIKE ?', [jsonintern, searchString]);

       var searchString = "%update%";

       var res = alasql('SELECT COLUMN * FROM [?] WHERE [0] NOT LIKE ?', [res, searchString]);

       $("#seldatefields").append('<option></option>')
       res.forEach(function(element) {
           $("#seldatefields").append("<option value = " + element + ">" + element.replace('_', ' ').capitalize() + "</option>")
       })
       $("#seldatefields").select2({
           placeholder: "Select date field",
           allowClear: true
       });

   }
   /*end region */
   function tblchkall() {

       $("#msgchksptotalUsers").html("clear selection")
       if (base.tblchk) {
           unchecktblall()
           base.tblchk = false;
           base.pageSize = base.internpageSize;
       } else {
           base.tblchk = true;

           //remove element from array by keyname
           clearfieldselection();
           base.internpageSize = base.pageSize;
           base.pageSize = parseInt($("#sptotalUsers").html())
       }


   }

   function clearfieldselection() {
       basesearchar = basesearchar.filter(function(doctor) {

           return (!Object.keys(doctor).includes(currentmoduleid)); // if truthy then keep item
       })
       console.log(basesearchar);

   }

   function unchecktblall() {
       $("#tblchkmsg").hide();
       $(".tblkchk").prop("checked", false);
       selectArr = [];
       $("#tblselectallchk").prop("checked", false)
       base.pageSize = base.internpageSize;
       base.tblchk = false;
       clearfieldselection();

   }

   function tblselectall() {

       console.log($("#tblselectallchk").prop("checked"));
       if ($("#tblselectallchk").prop("checked")) {

           $(".tblkchk").prop("checked", true);
           $("#tblchkmsg").show();
           $("#msgsppageSize").html($("#sppageSize").html())
           $("#msgchksptotalUsers").html($("#sptotalUsers").html())
           $(".tblkchk").each(function() {
               var cmodid = $(this).prop("id").split('_')[1];
               selectArr = [];
               tablechkbox(cmodid)
           });
       } else {
           $(".tblkchk").prop("checked", false);
           $("#tblchkmsg").hide();
           selectArr = [];

       }
   }

  

   function ontdedit(arg) {
       // console.log(arg)

       ajaxbase.isedit = true;
       var interncontent = ajaxbase.response.rows;
       interncontent = interncontent.filter(function(doctor) {
           return doctor[currentmoduleid] == arg;
       })
       // console.log(interncontent[0]);
       Object.keys(interncontent[0]).map(function(objectKey, index) {
           var value = interncontent[0][objectKey];

           $("#cltrl" + objectKey).val(value)
           $("#cltrl" + objectKey).removeAttr('data-form-type');
       });

       if (interncontent[0].recordstate == "active") {
           $('#cltrlrecordstate').prop('checked', true);
       } else {
           $('#cltrlrecordstate').prop('checked', false);
       }

       $("#btnbutton").click();
   }

   function btnSubmit() {


       var $fields = $("input:text, input:hidden, input:checkbox, select").not("[name^='__']");
       var data = $fields.formToJSON();
       console.log(data)
       /*var doctors = data.map(function(doctor) {
           var o = {};
           o[doctor.position] = doctor.positionval;
           return o;
       });*/
       Object.keys(data).forEach(function(element) {

           var internset = element.replace('cltrl', '')

           rename(data, element, internset)
       });


       if (ajaxbase.isedit) {

           base.datapayload = data;
           basefunction().update(base).then(function(argument) {
               initialdatatableload()
               $("#btnmodalclose").click();

           })

       } else {
           delete data[currentmoduleid];
           base.datapayload = data;
           basefunction().insert(base).then(function(argument) {
               initialdatatableload()
               $("#btnmodalclose").click();

           })



       }



   }

   function onchk(argument) {

       if ($(argument).prop('checked')) {
           $(argument).val("active")
       } else {
           $(argument).val("inactive")
       }
   }

   function rename(obj, oldName, newName) {

       if (!obj.hasOwnProperty(oldName)) {
           return false;
       }

       obj[newName] = obj[oldName];
       delete obj[oldName];
       return true;
   }

   function formvalidation(argument) {


       var fieldattr = $(arguments).attr('data-attribute')

       var internset = {}
       internset.content = argument
       internset.contenttype = fieldattr

       validationinterface(internset);


   }
   var baseobjvalidation = {
       emailvalidation: function(argument) {
           validation = new RegExp(validations['email'][0]);
           // validate the email value against the regular expression

           if (!validation.test(argument.value)) {

               $(argument).parent().find("label").attr("class", "control-label-format")
               $(argument).attr("data-form-type", "true")
           } else {
               $(argument).parent().find("label").attr("class", "hide")
               $(argument).removeAttr("data-form-type")
           }
       },
       genvalidation: function(argument) {

           if (argument.value == "") {

               $(argument).parent().find("label").attr("class", "control-label-format")
               $(argument).attr("data-form-type", "true")
           } else {
               $(argument).parent().find("label").attr("class", "hide")
               $(argument).removeAttr("data-form-type")
           }


       }
   }

   function validationinterface(internset) {
       switch (internset.contenttype) {
           case 'email':
               baseobjvalidation.emailvalidation(internset.content)
               break;
           case 'number':
               baseobjvalidation.numbervalidation(internset.content)
               break;
           case 'pincode':
               baseobjvalidation.emailvalidation(internset.content)
               break;
           case 'address':
               baseobjvalidation.emailvalidation(internset.content)
               break;
           default:
               baseobjvalidation.genvalidation(internset.content)
       }
   }

   //document .ready !
   $(function() {
       populateaxiskeys();
       htmlpopulatetableheader();
       htmlpopulatemodal();

       $('#tooglecheck1 input').change(function() {
           if ($(this).is(':checked')) {
               $(this).next().text("without consolidated");
               renderall();

           } else {
               renderconsolidated();
               $(this).next().text("consolidated result");

           }
       });
       $('#tooglecheck2 input').change(function() {
           if ($(this).is(':checked')) {
               $(this).next().text("without consolidated");
               renderall3d()

           } else {
               renderconsolidated3d()
               $(this).next().text("consolidated result");
           }
       });

       /* var red = '(cost=0.00..50779.28 rows=7501 width=54) (actual time=0.028..592.775 rows=600290 loops=1)'
        console.log(red.split(' ')[5].split('=')[1])*/
       $(".sidebar-toggle").click();
       $(".form-horizontal input:text").on("keydown keyup change", function() {
           var sel = $('.form-horizontal input:text[data-form-type]').length;
           if (sel <= 0) {
               $('#btnmodalsub').prop('disabled', false)
           } else {
               $('#btnmodalsub').prop('disabled', true)
           }
       })

  })

   function sort(dv) {

       var sortcol = $(dv).attr("data-field-header");
       $(dv).find('span').toggleClass("sortorderdesc sortorderasc");
       //console.log($(dv).find('span').hasClass('sortorderasc'));
       //console.log($(dv).find('span').hasClass('sortorderdesc'));
       if ($(dv).find('span').hasClass('sortorderdesc')) {

           dynamicsorting(sortcol, true)
       } else {

           dynamicsorting(sortcol, false)
       }
   }
   function dynamicsorting(columnname, sortorder) {


       var colorder = sortorder;
       var y = (colorder == true ? "DESC" : "ASC");
       filterparam.sortcolumn = columnname;
       filterparam.sortcolumnorder = y;
       base.pageno = 0;

       filterparam.pageno = base.pageno
       filterparam.pageSize = base.pageSize
       filterparam.ispaginate = true;
       base.datapayload = filterparam;

       basefunction().getpaginatesearchtype(base).then(function(argument) {
           // console.log(argument);
           htmlpopulatetable(argument);

       })
   } 

   function initialdatatableload() {
       filterparam.pageno = base.pageno
       filterparam.pageSize = base.pageSize
       filterparam.ispaginate = true;
       base.datapayload = filterparam;

       basefunction().getpaginatesearchtype(base).then(function(argument) {
           // console.log(argument);
           htmlpopulatetable(argument);
           highlightconsolidatesearch();

       })

   }

   function uploadFile(file) {
       //var deffered, list;
       //deffered = Promise.defer();
       return new Promise(function(resolve, reject) {
           var url = baseurlobj.uploaddata;
           var xhr = new XMLHttpRequest();
           var fd = new FormData();
           xhr.open("POST", url, true);
           xhr.onreadystatechange = function() {
               if (xhr.readyState == 4 && xhr.status == 200) {
                   // Every thing ok, file uploaded
                   // console.log(xhr.responseText); // handle response.
                   //deffered.resolve(xhr.responseText);
                   resolve(xhr.responseText);
               }
           };
           fd.append("upload_file", file);
           xhr.send(fd);
           //return deffered.promise
       })
   }

   
   function flpupload() {

       $("#uploadfiles").click();
   }



   /*base report bootpag*/
   function bootpagination(argument) {
       $('#page-selection').unbind('page');
       $('#page-selection').empty()

       var pagesize = $("#inppagesize").val()
       var totalpagecount = argument.count
       var maxvisiblesize = (argument.count <= 100 ? Math.round(totalpagecount / pagesize) : 5);
       //console.log(maxvisiblesize);
       if (maxvisiblesize > 0) {
           $('#page-selection').bootpag({
               page: 1,
               total: totalpagecount,
               maxVisible: maxvisiblesize,
               leaps: true
           }).on("page", bootpagescallback);
       }

   }

   function bootpagescallback(event, num) {

       base.pageno = (num - 1);

       initialdatatableload();
       return false;
   }
   /* end region */

   /*xaxis pagination*/
   function bootpaginationxaxis(argument) {
       $('#page-selection-xaxis').unbind('page');
       $('#page-selection-xaxis').empty()
       $('#page-selection-xaxis').bootpag({
           page: 1,
           total: argument.Xtotalpivotrecorset,
           maxVisible: 5,
           leaps: true
       }).on("page", bootpagescallbackxaxis);
   }

   function bootpagescallbackxaxis(event, num) {

       base.Xpageno = num;

       base.pivotinternload = false;
       pivotreport();
       //return false;
   }

   /*yaxis pagination*/
   function bootpaginationyaxis(argument) {
       $('#page-selection-yaxis').unbind('page');
       $('#page-selection-yaxis').empty()
       $('#page-selection-yaxis').bootpag({
           page: 1,
           total: argument.Ytotalpivotrecorset,
           maxVisible: 5,
           leaps: true
       }).on("page", bootpagescallbackyaxis);
   }

   function bootpagescallbackyaxis(event, num) {

       base.Ypageno = num;

       base.pivotinternload = false;
       pivotreport();
       //return false;
   }
   /*pivot x and y axis */
   function setselxaxis() {

       base.pivotparamXaxis = $("#selxaxis").val()
       var pivotparamYaxis = base.pivotparamXaxis;
       base.Ypageno = 0
       base.Xpageno = 0
       base.pivotinternload = true
       if (pivotparamYaxis.includes("date")) {
           $("#chkprimary").css('visibility', 'visible')
           $("#chkprimary").css('height', '');
       } else {
           $("#chkprimary").css('visibility', 'hidden')
           $(".rptbasediv").css('height', '10px');
           base.timeinternsecondary = ""
       }

   }

   function setselyaxis() {

       base.pivotparamYaxis = $("#selyaxis").val()
       base.Ypageno = 0
       base.Xpageno = 0
       base.pivotinternload = true
       var pivotparamYaxis = base.pivotparamYaxis
       if (pivotparamYaxis.includes("date")) {
           $("#chksecondary").css('visibility', 'visible')
       } else {
           $("#chksecondary").css('visibility', 'hidden')
           base.timeinternprimary = "";
       }

   }
   /*end region */
   function setseldatefields() {
       base.datecolsearch = $("#seldatefields").val()
       $(".topdatepicker").show()
   }

   function exportexcel() {

       base.datapayload = payloadprepared();

       basefunction().exportexcel(base)
           .then(function(data) {

               $("#uploadfiles").val('');

               $("#uploadsave").show()
               $("#uploadsavemsg").show()
               $("#uploadsaveddl").attr("data-toggle", "dropdown")
               $("#uploadsavemsg").html("Preparing for download !");
               id = setInterval(frame, 750);

               function frame() {
                   if (width >= 24263) {
                       clearInterval(id);
                   } else {
                       width++;
                       //elem.style.width = width + '%';
                       $("#lbluploadprogress").html(width + "%")
                       $("#dvuploadprogress").css('width', width + "%")
                       $("#uploadsave").html(width + "%")
                   }
               }

           });
   }






   getapptoken(ajaxbase);


   function getapptoken(ajaxbase) {
       basedataset.appkey = base.appkey;
       //setting up url for api 
       ajaxbase.url = ajaxurl.auth
       ajaxbase.payload = basedataset;

       return new Promise(function(resolve, reject) {

           basepostmethod(ajaxbase).then(setconfig).then(function(argument) {

               resolve(argument)

           }).catch(function onError(err) {
               console.log(err);
           });
       })
   }

   function setconfig(data) {
       return new Promise(function(resolve, reject) {

           //base.config["headers"]["x-access-token"] = data.token;
           ajaxbase.postauth["headers"]["x-access-token"] = data.token;
           //ajaxbase.postauth = base.config;

           resolve(ajaxbase);
       })
   }

   /*all column search !*/
   function consolidatesearch() {
       base.searchtype = "consolidatesearch"
       base.idstatus = true;
       base.excludedatecol = true;
       var internsearchbar = moduleattributepopulate()


       var cons = {}
       basesearcharconsolidated = []
       cons.consolidatecol = internsearchbar
       cons.consolidatecolval = $("#txtconsolidatesearch").val().trim()
       basesearcharconsolidated.push(cons);

       base.datapayload = payloadprepared();


       basefunction().getpaginatesearchtype(base).then(function(data) {
           htmlpopulatetable(data);
           bootpagination(data);
           highlightconsolidatesearch();
           if ($("#dvreportcontainer").hasClass('collapsed-box')) {

               $("#rptwidget").click();
           }

       })
   }

   function preloadpayload() {
       filterparam.colsearch = "intercolumn";
       filterparam.searchparam = basesearchar;
       base.pageno = 0;
       if (base.pageSize == undefined || base.pageSize == 0) {
           base.pageSize = 20;
       }

       filterparam.pageno = base.pageno
       filterparam.pageSize = base.pageSize
       filterparam.searchtype = base.searchtype

       filterparam.sortcolumn = 1;
       filterparam.sortcolumnorder = "desc";
       filterparam.ispaginate = true;
       return filterparam
   }

   function payloadprepared() {
       filterparam.colsearch = "intercolumn";
       filterparam.searchparam = basesearchar;

       if (base.tblchk) {
           base.pageno = 0;
           if (base.pageSize == undefined) {
               base.pageSize = 20;
           }
           filterparam.ispaginate = true
       } else {
           filterparam.ispaginate = false
           base.pageno = 0;
           //base.pageSize = parseInt($("#sptotalUsers").html());
       }

       filterparam.pageno = base.pageno
       filterparam.pageSize = base.pageSize
       filterparam.pivotparamXaxis = base.pivotparamXaxis
       filterparam.pivotparamYaxis = base.pivotparamYaxis
       filterparam.timeinternprimary = base.timeinternprimary
       filterparam.timeinternsecondary = base.timeinternsecondary
       filterparam.XpageSize = base.XpageSize;
       filterparam.Xpageno = base.Xpageno;
       filterparam.YpageSize = base.YpageSize;
       filterparam.Ypageno = base.Ypageno;
       filterparam.searchtype = base.searchtype
       filterparam.datecolsearch = base.datecolsearch;
       filterparam.basesearcharconsolidated = basesearcharconsolidated
       filterparam.sortcolumn = 1;
       filterparam.sortcolumnorder = "desc";

       return filterparam;
   }
   /*end region */

   /*multiselect filter params */
   function srchparams() {


       // console.log(JSON.parse(base.searchparam));
       base.searchtype = "Columnwise"
       base.datapayload = preloadpayload();


       basefunction().getpaginatesearchtype(base).then(function(data) {
           htmlpopulatetable(data);
           bootpagination(data);

           if ($("#dvreportcontainer").hasClass('collapsed-box')) {

               $("#rptwidget").click();
           }
       })
   }

  
   function searchbarautocomplete(baseobj) {



       let internobj = {}
       let internar = []
       let fieldval = $(baseobj).val()
       let fieldname = $(baseobj).data('multipleselect-autocomplete')
       baseobj.position = fieldname;
       internobj[fieldname] = fieldval.toLowerCase();
       let internbasearh = []
       internar.push(internobj)

       if (basesearchar.length > 0) {

           /*check if current search element and discard from metafilter */
           internbasearh.push(basesearchar)


           internbasearh = removeJsonAttrs(internbasearh[0], [fieldname])


           internbasearh = (Object.keys(internbasearh[0]).length == 0 ? [] : internbasearh);
           /*end region*/
       }

       filterparam.pageno = 0
       filterparam.pageSize = 20
       filterparam.searchtype = "Columnwise"
       filterparam.searchparam = internar;
       filterparam.searchparammetafilter = internbasearh
       filterparam.ispaginate = true
       base.datapayload = filterparam

       var internbasesearchar = basesearchar;

       basefunction().getpaginatesearchtypegroupby(base).then(function(argument) {

           $("#dv_" + baseobj.position + "").html("");
           $("#dv_" + baseobj.position + "").show();




           let internset = argument.rows

           /*remove already selected items from select object !*/
           if (internbasesearchar.length > 0) {
               var toRem = internbasesearchar.map(function(a) {
                   return a[Object.keys(a)]
               })[0]

               internset = internset.filter((el) => !toRem.includes(el[Object.keys(el)].toLowerCase()));

           }
           /*end region*/



           let redlime = "";
           internset.forEach(function(obj) {
               redlime += "<div><a class=\"highlightselect\" href='javascript:onsearchtext(\"" + Object.keys(obj) + "\",\"" + obj[Object.keys(obj)].toLowerCase() + "\");'>" + obj[Object.keys(obj)] + "  </a></div>";
           });

           //console.log("#dv_" + baseobj.position + "");
           var cssfirst = "<span class=\"select2-dropdown select2-dropdown--above\" dir=\"ltr\" style=\"width: 825px;\">";
           $("#dv_" + baseobj.position + "").html(redlime);

       }).catch(function onError(err) {
           console.log(err);
       });
       /*Todos.getpaginatesearchtype(base)
           .success(function(data) {


               var picked = [...new Set(data.rows.map(material => material[baseobj.position]))];


               let redlime = "";
               picked.forEach(function(obj) {
                   redlime += "<div class='LoginText'><a href='javascript:onsearchtext(\"" + baseobj.position + "\",\"" + obj + "\");'>" + obj + "</a></div>";
               });


               $("#dv_" + baseobj.position + "").fadeOut("fast").html(redlime).fadeIn("fast", function() {  });

           })*/
   }

   function onsearchtext(key, val) {

       $("#dv_" + key).html(" ");
       $("#dv_" + key).hide();
       $("#cltrl_filter_" + key).val('');
       assignsearchparams(key, val);

       $("#cltrl_filter_chips_" + key).append("<div class=\"selectchips\"><span ID=\"cltrl_filter_span_" + key + "\" onclick='javascript:removefilterdiv(this,\"" + key + "\", \"" + val + "\");' class=\"select2choiceremove\" role=\"presentation\">×</span>" + val.capitalize() + "</div>")
   }

   function assignsearchparams(key, val) {

       var internar = []
       if (isNaN(val)) {
           val = val.toLowerCase()
           internar.push(val)
       } else {

           internar.push(val)
       }


       /* UPDATE */
       if (basesearchar.filter(function(e) { return e[key] != undefined }).length > 0) {
           var interncon = basesearchar
           interncon = interncon.filter(function(e) { return e[key] != undefined }).map(function(doctor) {
               return {
                   [key]: doctor[key].concat(val)
               }
           })
           updateNameById(basesearchar, key, interncon[0][key]);
       } else {
           /* ADD */
           basesearchobj[key] = internar
           basesearchar.push(basesearchobj);
           basesearchobj = {}
       }
   }

   function removefilterdiv(arguments, key, val) {



       $(arguments).parent().remove()

       var interncon = basesearchar
       interncon = interncon.filter(function(e) { return e[key] != undefined }).map(function(doctor) {
           return {
               [key]: doctor[key].remByVal(val)
           }
       })

       updateNameById(basesearchar, key, interncon[0][key]);

       if (interncon[0][key].length <= 0) {
           basesearchar = removeJsonAttrs(basesearchar, [key]);

       }
       basesearchar = basesearchar.filter(value => Object.keys(value).length !== 0);

   }

   function fieldfilters(arg) {

       if ($(arg).children().hasClass('fa-plus')) {
           $(".fieldsfilterbar").slideToggle(300)
           $(arg).children().removeClass('fa-plus').addClass('fa-minus')
       } else {
           $(".fieldsfilterbar").slideToggle(300)
           $(arg).children().removeClass('fa-minus').addClass('fa-plus')
       }

   }
   /*end region */


   /*Modular html populate content for all modules*/

   function highlightconsolidatesearch() {
       var $tableRows = $('#basetable tr');
       var $tableElements = $tableRows.children();
       var txtconsol = $("#txtconsolidatesearch").val();
       if (txtconsol != "") {

           highlightTextinHtml(txtconsol);

       }

   }

   function htmlpopulatemodal() {

       base.idstatus = true;
       var internsearchbar = moduleattributepopulate()
       var htmlcontent = "";

       internsearchbar.forEach(function(element) {
           htmlcontent += '<div class="form-group overlaytxtalign col-md-5">' +
               '<div class="col-sm-15">' +
               '<label class="lblhide" id="lblmsg' + element + '">' +
               '<i class="fa fa-bell-o"></i> Input with warning' +
               '</label>' +
               '<input type="text" data-attribute="email" class="form-control" maxLength="100"' +
               ' data-form-type="false" onkeyup="javascript:formvalidation(this)" id="cltrl' + element + '" placeholder="' + element.replace('_', ' ').capitalize() + '">' +
               '</div></div>';
       })
       var chkcontent = ' <input type="hidden" name="' + currentmoduleid + '" value="0" id="cltrl' + currentmoduleid + '"> <div class="form-group overlaytxtalign col-md-5">' +
           '<div class="col-sm-offset-2 col-sm-15">' +
           '<div>' +
           '<label>' +
           '<input type="checkbox" id="cltrlrecordstate" onclick="javascript:onchk(this)" value="active"> Remember me' +
           '</label>' +
           '</div>' +
           '</div>' +
           '</div>';

       $("#overlaycontent").html(htmlcontent + chkcontent);
   }

   function htmlpopulatetableheader() {

       $("#basetable thead tr").html("")
       base.idstatus = true;
       var internsearchbar = moduleattributepopulate()
       var htmlcontent = "";
       var interncontent = '<th style="display:none;">ID</th>' +
           '<th style="width: 10%" ;>' +
           '<div class="checkbox tablechk">' +
           '<label>' +
           '<input type="checkbox" id="tblselectallchk" onclick="javascript:tblselectall();"><span class="checkbox-material"></span> Check all' +
           '</label>' +
           '</div>' +
           '</th>';
       internsearchbar.forEach(function(element) {

           htmlcontent += ' <th onclick="sort(this)" data-field-header="' + element + '">' +
               '<span class=" sortorderasc fa fa-fw">' +
               '</span>' + element.replace('_', ' ').capitalize() + '</th>';
       })
       $("#basetable thead tr").html(interncontent + htmlcontent)

   }


   function htmlpopulatefilterbar() {

       basesearchar = []
       $("#dvfilterbar  div.fieldsfilterbar").html("")
       $("#dvfilterbar  div.fieldsfilterbarconsolidated").html("")
       base.idstatus = true;
       var internsearchbar = moduleattributepopulate()
       var htmlcontent = "";
       internsearchbar.forEach(function(element) {
           htmlcontent += '<div style="display: inline-block;">' +
               '<input type="text" style="width:45%;" class="form-control" data-multipleselect-autocomplete="' + element + '" id="cltrl_filter_' + element + '" oninput="searchbarautocomplete(this)" placeholder="' + element.replace('_', ' ') + '">' +
               '<div id="cltrl_filter_chips_' + element + '">' +
               '</div>' +
               '<div id="dv_' + element + '" class="srchpara">' +
               '</div>' +
               '</div>';

       })
       $("#dvfilterbar div.fieldsfilterbar").html(htmlcontent)
       $("#dvfilterbar div.fieldsfilterbar").append('<div style="display: inline-block;">' +
           '<div class="zoom-menu">' +
           '<a class="zoom-fab zoom-btn-sm zoom-btn-report scale-transition" onclick="javascript:srchparams();"><i class="fa fa-bolt"></i></a>' +
           '</div>' +
           '</div>')

       $("#dvfilterbar div.fieldsfilterbarconsolidated").append('<div style="display: inline-block;float:right;">' +
           '<div class="input-group input-group-sm input-group-sm-override" style="width: 150px;">' +
           '<div class="form-group ">' +
           '<input type="text" id="txtconsolidatesearch" name="table_search" class="form-control pull-right" placeholder="Search">' +
           '</div>' +
           '<div class="input-group-btn">' +
           '<button type="submit" onclick="javascript:consolidatesearch();" class="btn btn-default"><i class="fa fa-search"></i></button>' +
           '</div>' +
           '</div>' +
           '</div>');

       $("#dvfilterbar div.fieldsfilterbarconsolidated").append('<div style="display: inline-block;float: right;padding-right: 30px;">' +
           '<a class="zoom-fab zoom-btn-sm zoom-btn-report scale-transition" onclick="javascript:fieldfilters(this)"><i class="fa fa-plus" ></i></a>' +
           '</div>')




       /*for apply date range*/
       internsearchbar.forEach(function(element) {
           if (element.includes("date")) {
               /*for applying date range filter dynamically*/
               //$('#cltrl_filter_birth_date').addClass('datepicker')
               $('#cltrl_filter_birth_date').parent().remove()
           }
       })
   }


   function htmlpopulatetable(arg) {



       $('#basetable tbody').children().remove();
       var baset = arg.rows;
       var rcount = arg.count;
       if (rcount > 0) {
           $("#spcurrentPage").html(base.pageno)
           $("#sppageSize").html(base.pageSize)
           $("#sptotalUsers").html(arg.count)
           base.idstatus = false;
           base.excludedatecol = false;
           var internsearchbar = moduleattributepopulate()
           var fielddate = "";
           //let keys = internsearchbar.map(o => Object.values(o)).toString();

           var baset = alasql('SELECT ' + internsearchbar + ' FROM ? ', [baset]);


           var firsts = Object.keys(baset[0]).remove(currentmoduleid)
           for (s of baset) {
               $('#basetable tbody ').append('<tr>');
               var items = '<div class="checkbox tablechk" >' +
                   '<label>' +
                   '<input type="checkbox" class="tblkchk" id="tblkchk_' + s[currentmoduleid] + '" onclick="javascript:tablechkbox(' + s + ')"><span class="checkbox-material"><span class="check"></span></span> ' +
                   '</label>' +
                   '</div>';
               $('#basetable tbody tr').last().append('<td>' + items + '</td>');
               for (f of firsts) {
                   if (f.includes('date')) {
                       fielddate = moment(s[f], 'YYYY-MM-DD[T]HH:mm:ss').format("DD MMM YYYY")
                   } else {
                       fielddate = s[f]
                   }

                   $('#basetable tbody tr').last().append('<td>' + fielddate + '</td>');

               }
               $('#basetable tbody tr').last().append('<td onclick=javascript:ontdedit(' + s.employeesid + ')><a class=\'edithover\' href=\'javascript:void(0);\'>edit</a></td>')
           }
       }
       $("#divreportcontent").show()


   }

   function highlightTextinHtml(term, base) {
       if (!term) return;
       base = $("#basetable");
       var re = new RegExp("(" + RegExp.escape(term) + ")", "gi");
       var replacement = "<span class='highlightedsearch'>" + term + "</span>";
       $("*", base).contents().each(function(i, el) {
           if (el.nodeType === 3) {
               var data = el.data;
               if (data = data.replace(re, replacement)) {
                   var wrapper = $("<span>").html(data);
                   $(el).before(wrapper.contents()).remove();
               }
           }
       });
   }

   function dehighlightinHtml(term, base) {
       var text = document.createTextNode(term);
       $('span.highlightedsearch', base).each(function() {
           this.parentNode.replaceChild(text.cloneNode(false), this);
       });
   }
   /*end region */



   /*ajax utils POST AND GET method*/

   function basegetmethod(ajaxbase) {
       //console.log(base.config);
       return new Promise(function(resolve, reject) {
           $.ajax({
               url: ajaxbase.url,
               headers: ajaxbase.getauth,
               method: 'GET',
               dataType: 'json',

               success: function(data) {
                   resolve(data);
               },
               error: function(xhr) {
                   reject(xhr)
               }

           });
       });
   }

   function basepostmethod(ajaxbase) {

       return new Promise(function(resolve, reject) {
           $.ajax({

               type: "POST",
               url: ajaxbase.url,
               headers: ajaxbase.postauth.headers,
               //contentType: "application/json",
               dataType: "json",
               contentType: "application/json; charset=UTF-8",
               data: JSON.stringify(ajaxbase.payload),
               success: function(data) {
                   resolve(data);
                   //console.log(data)
               },
               error: function(xhr) {
                   console.log(xhr)
                   reject(xhr)
               }

           });
       });
   }

   /*end region*/



   /* data utils*/

   function updateNameById(obj, id, value) {
       Object.keys(obj).some(function(key) {

           if (obj[key][id] != undefined) {
               obj[key][id] = value;
               return true;
           }



       })
   }
   String.prototype.capitalize = function() {
       return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
           return p1 + p2.toUpperCase();
       });
   };
   Array.prototype.remByVal = function(val) {
       for (var i = 0; i < this.length; i++) {
           if (this[i] === val) {
               this.splice(i, 1);
               i--;
           }
       }
       return this;
   }
   $.fn.formToJSON = function() {
       var out = {};

       var cleanValue = function($f) {
           var v = $f.val() || "";
           // clean values?
           return v;
       }

       var pushValue = function(o, id, v) {
           if (o[id] != null) {
               if (!o[id].push) {
                   o[id] = [o[id]];
               }
               o[id].push(v);
           } else {
               o[id] = v;
           }
       }

       var pushLevel = function(o, list, v) {
           var id = list.shift();
           if (list.length == 0) {
               pushValue(o, id, v)
           } else {
               if (o[id] == null) {
                   o[id] = {};
               }
               pushLevel(o[id], list, v)
           }
       }

       this.each(function(i, f) {
           var v = cleanValue($(f));
           var idList = f.id.replace(/:\d*/g, "").split(".");
           pushLevel(out, idList, v);
       });

       return out;
   }
   RegExp.escape = function(text) {
       return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
   }

   function findAndRemove(array, property, value) {
       array.forEach(function(result, index) {
           if (result[property] === value) {
               //Remove from array
               array.splice(index, 1);
           }
       });
   }

   function removeJsonAttrs(json, attrs) {
       return JSON.parse(JSON.stringify(json, function(k, v) {
           return attrs.indexOf(k) !== -1 ? undefined : v;
       }));
   }



   function isNumberKey(evt) {
       var charCode = (evt.which) ? evt.which : evt.keyCode;
       if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
           return false;

       return true;
   }
   if (!String.prototype.contains) {
       String.prototype.contains = function() {
           return String.prototype.indexOf.apply(this, arguments) !== -1;
       };
   }

   Array.prototype.exclude = function(list) {
       return this.filter(function(el) { return list.indexOf(el) < 0; })
   }
   Array.prototype.remove = function() {
       var what, a = arguments,
           L = a.length,
           ax;
       while (L && this.length) {
           what = a[--L];
           while ((ax = this.indexOf(what)) !== -1) {
               this.splice(ax, 1);
           }
       }
       return this;
   };

   Array.prototype.moveUp = function(value, by) {
       var index = this.indexOf(value),
           newPos = index - (by || 1);

       if (index === -1)
           throw new Error("Element not found in array");

       if (newPos < 0)
           newPos = 0;

       this.splice(index, 1);
       this.splice(newPos, 0, value);
   };


   /*end region */

    /*get keys in json array
   let keys =internsearchbar.map(o => Object.values(o));*/

   /*get values in json array
      let newArr = arr.map(obj => Object.values(obj));*/
   /*map seperate array keys to array fields 
   /* var myArray = [];

            baset.forEach(function(element) {
                var newobj = {};
                internkeysar.forEach(function(key) {

                    newobj[key] = element[key]
                });

                console.log(newobj)

                myArray.push(newobj)
                newobj = {};
            })
            console.log(JSON.stringify(myArray))*/




   /*var main = new Object();
   var isfilteron = false;
   var nameregex = /^[A-Za-z' *]{1,}$/;
   var emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   var phonenoregex = /^[0-9]{10,15}$/;
   var pincoderegex = /^[0-9]{6,6}$/;
   var errors = 0;
   //var modulename = "modulename";
   var tablename = "example1";
   var alpha = /[ A-Za-z]/;
   var numeric = /[0-9]/;
   var alphanumeric = /[ A-Za-z0-9]/;*/
   /*function searchpreloadpayload() {
       filterparam.colsearch = "intercolumn";
       filterparam.searchparam = basesearchar;
       base.pageno = 0;
       if (base.pageSize == undefined || base.pageSize == 0) {
           base.pageSize = 20;
       }

       filterparam.pageno = base.pageno
       filterparam.pageSize = base.pageSize
       filterparam.searchtype = base.searchtype

       filterparam.sortcolumn = 1;
       filterparam.sortcolumnorder = "desc";
       filterparam.ispaginate = true;
       return filterparam
   }*/



