let currentmodulename = "mrole";
let currentmoduleid = "mroleid"

let currentrole = 'role'
let currentmodname = 'modname'
let multiselects = {}
let multiselectfunc = {}
let baseurlobj = {
  getpaginatesearchtypeurl: `/${currentmodulename}/api/searchtype/`,
  createdata: `/${currentmodulename}/api/bulkCreate/`,
  updatedata: `/${currentmodulename}/api/update/`,
  exceldata: `/${currentmodulename}/api/exportexcel/`,
  uploaddata: `/${currentmodulename}/api/uploadcontent/`,
  getpaginatesearchtypegroupby: `/${currentmodulename}/api/searchtypegroupby/`,
  pivotresult: `/${currentmodulename}/api/pivotresult/`,
  deletemrole: `/${currentmodulename}/api/customDestroy/`,
  //
  getcurrentModrolegroupby: `${currentrole}/api/searchtypegroupbyId/`,
  getcurrentModmodnamegroupby: `${currentmodname}/api/searchtypegroupbyId/`,
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
    modnameMultiKeysLoad: function(keys) {
      //keys="gender"
      base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
      return this
        .getcurrentModmodnamegroupby(base)
        .then(function(argument) {
          return argument
        })
    },

    aaaMultiKeysLoad: function(keys) {
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
      ajaxbase.url = baseurlobj.deletemrole

      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
        return base
      })
    },
    update: function(base) {

      base = basemod_modal.payloadformat(base)
      return this.deleterecord(base)
        .then(this.insert)
        .then(function(data) {
          ajaxbase.response = data
          return ajaxbase
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
  var sel = $('.form-horizontal input:text[data-form-type], input:checkbox[data-form-type], div[data-form-type]').length;

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
      remotefunc: this['remotefunc' + arg.fieldname]
    }


    multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, function(
      data
    ) {
      multiselects[arg.secondaryKey] = data
      reqops.formvalidation(
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
    var htmlcontents = `<div class="form-group col-sm-6"> 
       <div class="col-sm-15">
       <label class="lblhide" id="lblmsgddlddlmulti">
       <i class="fa fa-bell-o"></i> Please Select ${fieldname.inputCustomMapping} 
       </label>
       <div onkeyup="javascript:reqops.formvalidation(this)" data-attribute="multiSelect"
       data-key="${fieldname.inputname}" data-form-type="false" id="in${fieldname.inputtextval}"></div>
       </div></div>`
    return htmlcontents

    //$(htmlcontents).insertBefore($("#overlaycontent.form-group.overlaytxtalign.col-md-12"))
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
  remotefuncmname: function(data) {
    return new Promise(function(resolve, reject) {
      basefunction()
        .getcurrentModmodnamegroupby(
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
  remotefuncaccesstype: function(data) {
    return new Promise(function(resolve, reject) {
      resolve(accesstypecontent)
    })
  },
}
$(function() {
  basemod_modal.modalpopulate()

  basemod_modal.populatemodularddl()
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

        if (element.inputtype == 'multiselect') {
          htmlcontent += basemultiselectaccess.htmlpopulatemodular(element)
        }


        //rchkelse   
        else {
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

    {
      var isactivearrayobj = {
        recordstate: base.interimdatapayload.recordstate
      }
      //flatting multiselects objects
      var temp = Object.fromEntries(
        Object.entries(multiselects).map(([k, v]) => [
          k,
          datatransformutils.flat(v)
        ])
      )
      let b = {
        ...temp,
        ...isactivearrayobj
      }
      //apply cartesion for multiselects objects
      var interns = datatransformutils.getCartesian(b)
      let o = {
        payset: interns,
        delObj: {
          roleid: interns[0].roleid
        }
      }
      base.datapayload = o
      return base
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

    datatransformutils.editMultiSelect({
      multiselectfunc,
      validationmap,
      content: interncontent
    })
    $("[data-attribute='multiSelect']").removeAttr('data-form-type')
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


      }
    })
    //active comma denominator
    //console.log(interncontent[0].recordstate)
    if (interncontent[0].recordstate) {
      $('#cltrlrecordstate').prop('checked', true);
      $('#cltrlrecordstate').val(true);
      base.datapayload.recordstate = true
      base.interimdatapayload.recordstate = true
      $('#cltrlrecordstate').removeAttr('data-form-type')
    } else {
      $('#cltrlrecordstate').prop('checked', false);
      $('#cltrlrecordstate').val(false);
      base.datapayload.recordstate = false
      base.interimdatapayload.recordstate = false
    }
    $("#btnbutton").click();
  },
  tablechkbox: function(arg) {},

  populatemodularddl: function() {
    validationmap.forEach2(function(data) {
      if (data.inputtype == 'multiselect') {
        var p = {}
        p.fieldname = data.inputtextval
        p.fieldkey = data.inputtextval
        p.secondaryKey = data.inputname
        p.selecttype = data.selecttype
        basemultiselectaccess.multiselectmodular(p)
      }
    })
  },
  formatresponse: function(data) {

    var res = this.formatserverfieldmap(data)

    var result = equijoin(res, validationmap, "key", "inputCustomMapping",
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
//
let accesstypecontent = [{
    "text": "ViewOnly",
    "val": "VO",
    "key": "accesstype"
  },
  {
    "text": "AllAccess",
    "val": "AA",
    "key": "accesstype"
  }
]