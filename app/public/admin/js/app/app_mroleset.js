let currentmodulename = 'mroleset'
let currentmoduleid = 'mrolesetid'

let currentgender = {
  name: 'gender',
  id: 'genderid',
  text: 'name',
  data: {
    genderid: []
  }
}
let currentrole = 'role'
let currentmodname = 'modname'
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
  deletemroleset: `/${currentmodulename}/api/customDestroy/`,
  //
  getcurrentModgendergroupby: `${currentgender.name}/api/searchtypegroupbyId/`,
  getcurrentModrolegroupby: `${currentrole}/api/searchtypegroupbyId/`,
  getcurrentModmodnamegroupby: `${currentmodname}/api/searchtypegroupbyId/`
}
let basefunction = function () {
  return {
    //
    genderMultiKeysLoad: function (keys) {
      //keys="gender"
      base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
      return this.getcurrentModgendergroupby(base).then(function (argument) {
        return argument
      })
    },
    roleMultiKeysLoad: function (keys) {
      //keys="gender"
      base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
      return this.getcurrentModrolegroupby(base).then(function (argument) {
        return argument
      })
    },
    modnameMultiKeysLoad: function (keys) {
      //keys="gender"
      base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
      return this.getcurrentModmodnamegroupby(base).then(function (argument) {
        return argument
      })
    },

    mrolesetMultiKeysLoad: function (keys) {
      //keys="gender"
      base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
      return this.getpaginatesearchtypegroupby(base).then(function (argument) {
        return argument
      })
    },
    getpaginatesearchtype: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getpaginatesearchtypeurl
      $("a[href$='revenue-chart']").tab('show')
      //$("#trloader").show()
      //$("#basetable tbody").slideUp("slow").hide();

      $('table').addClass('loading')
      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        ajaxbase[currentmodulename] = argument
        /*$("#trloader").hide()
         $("#basetable tbody").slideDown("slow").show();*/
        $('table').removeClass('loading')

        return argument
      })
    },
    getpaginatesearchtypegroupby: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getpaginatesearchtypegroupby

      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    },
    insert: function (base) {
      ajaxbase.payload = basemod_modal.payloadformat(base).datapayload
      ajaxbase.url = baseurlobj.createdata

      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    },
    deleterecord: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.deletemroleset

      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        return base
      })
    },
    update: function (base) {
      return Promise.mapSeries(
        basemod_modal.payloadformat(base).datapayload,
        function (dt) {
          ajaxbase.payload = dt
          ajaxbase.url = baseurlobj.updatedata
          return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
            ajaxbase.response = argument
            return argument
          })
        }
      ).then(a => {
        console.log(a)
        return a
      })
    },
    singleInsert: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.singleCreatedata
      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    },
    exportexcel: function (base) {
      ajaxbase.url = baseurlobj.exceldata
      ajaxbase.payload = base.datapayload
      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    },
    getpivotreport: function (base) {
      $('#dvloader').show()

      ajaxbase.url = baseurlobj.pivotresult
      ajaxbase.payload = base.datapayload
      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument

        $('#dvloader').hide()

        return argument
      })
    },
    //

    getcurrentModgendergroupby: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getcurrentModgendergroupby
      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    },
    getcurrentModrolegroupby: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getcurrentModrolegroupby
      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    },
    getcurrentModmodnamegroupby: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getcurrentModmodnamegroupby
      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    }
  }
}
//
let validationListener = function () {
  var sel = $(
    '.form-horizontal input:text[data-form-type], input:checkbox[data-form-type], div[data-form-type]'
  ).length

  if (sel <= 0) {
    $('#btnmodalsub').prop('disabled', false)
  } else {
    $('#btnmodalsub').prop('disabled', true)
  }
}

let basemultiselectaccess = {
  multiselectmodular: function (arg) {
    var multiselectconfig = {
      selectevent: '#in' + arg.fieldname,
      fieldkey: arg.fieldkey,
      selecttype: arg.selecttype,
      selecttype: arg.selecttype,
      placeholder: arg.fieldname,
      remotefunc: this['remotefunc' + arg.fieldname]
    }

    multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, function (
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
  multiSelectCommon: function (data) {
    var arin = []
    var intern = {}
    intern[data.fieldname] = data.fieldval
    arin.push(intern)
    intern = {}
    var internbase = basemultiselectaccess.htmlpopulatemodnamefilterparam(arin)
    return internbase
  },
  multiSelectCommonResponse: function (data, argument) {
    var internfield = Object.keys(argument.rows[0])
    var sets = argument.rows.map(function (doctor) {
      return {
        // return what new object will look like
        key: data.fieldname,
        text: doctor[internfield[0]],
        val: doctor[internfield[1]]
      }
    })
    return sets
  },
  htmlpopulatemodnamefilterparam: function (internar) {
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
  htmlpopulatemrolefilterparam: function (internar) {
    var filtparam = {}
    filtparam.modulename = internar.mname
    filtparam.rolename = internar.roleid
    base.datapayload = filtparam

    return base
  },
  htmlpopulatemodular: function (fieldname) {
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
  remotefuncrolename: function (data) {
    return new Promise(function (resolve, reject) {
      basefunction()
        .getcurrentModrolegroupby(basemultiselectaccess.multiSelectCommon(data))
        .then(function (argument) {
          var sets = argument.rows

          if (sets[0] != undefined) {
            resolve(
              basemultiselectaccess.multiSelectCommonResponse(data, argument)
            )
          }
        })
    })
  },
  remotefuncmname: function (data) {
    return new Promise(function (resolve, reject) {
      basefunction()
        .getcurrentModmodnamegroupby(
          basemultiselectaccess.multiSelectCommon(data)
        )
        .then(function (argument) {
          var sets = argument.rows

          if (sets[0] != undefined) {
            resolve(
              basemultiselectaccess.multiSelectCommonResponse(data, argument)
            )
          }
        })
    })
  },
  remotefuncaccesstype: function (data) {
    return new Promise(function (resolve, reject) {
      resolve(accesstypecontent)
    })
  }
}
$(function () {
  basemod_modal.modalpopulate()

  basemod_modal.populatemodularddl()
  $('.form-horizontal input[type="text"], input[type="checkbox"]').on(
    'keydown keyup change',
    function () {
      validationListener()
    }
  )
})
let basemod_modal = {
  modalpopulate: function () {
    var interset = validationmap
    let redlime = doChunk(interset, 2)
    $('#overlaycontent').empty()
    var htmlcontent = ''
    var internhtmlcontent = ''
    redlime.forEach(function (item) {
      htmlcontent += `<div class="row">`
      item.forEach2(function (element) {
        if (element.inputtype == 'multiselect') {
          htmlcontent += basemultiselectaccess.htmlpopulatemodular(element)
        }

        //rchkelse
        else if (
          element.inputtype == 'checkbox' &&
          element.inputtypemod == currentgender.name
        ) {
          var internhtmlcontent = ' '
          basefunction()
            .genderMultiKeysLoad(currentgender.text)
            .then(function (data) {
              data.rows.forEach((elem, index) => {
                internhtmlcontent =
                  internhtmlcontent +
                  htmlpopulate.multiCheckBoxPopulate(elem, currentgender)
              })
              $('#overlaycontent').append(
                htmlpopulate.multiCheckboxPopulatePrimary(
                  currentgender,
                  internhtmlcontent
                )
              )
            })
        } else {
          htmlcontent += htmlpopulate.multiCheckBoxPopulateSecondary(element)
        }
      })

      htmlcontent += `</div>`
    })

    var chkcontent = htmlpopulate.genericCheckboxHtml(currentmoduleid)

    $('#overlaycontent').html(htmlcontent + chkcontent)
  },

  ongenderControl: function (data) {
    var key = $(data).data().key
    var val = $(data).data().val
    if ($(data)[0].checked) {
      currentgender.data[key] = [...currentgender.data[key], ...[val]]
    } else {
      currentgender.data[key] = currentgender.data[key].filter(
        item => parseInt(item) !== val
      )
    }
    reqops.formvalidation(data)
    validationListener()
  },
  onMultiControlChk: function (data) {},
  baseCheckbox: htmlpopulate.genericCheckboxHtmlPrimary(),

  afterhtmlpopulate: function () {
    $('#basetable tbody tr td:last-child').attr(
      'onclick',
      'javascript:basemod_modal.ontdedit(this)'
    )
    $('#basetable tbody tr td:nth-child(1) input:checkbox').attr(
      'onclick',
      'javascript:basemod_modal.tablechkbox(this)'
    )
    //$("a[href='#sales-chart'").hide()
  },
  ontdedit: function (arg) {
    var armodid = $(arg).attr('data-tbledit-type')
    ajaxbase.isedit = true
    var interncontent = ajaxbase[currentmodulename].rows

    interncontent = interncontent.filter(function (doctor) {
      return doctor[currentmoduleid] == armodid
    })
    base.editrecord = interncontent
    $('#cltrl' + currentmoduleid).val(armodid)
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
    formatresponse.forEach2(function (data) {
      if (data.inputtype == 'textbox') {
        $('#cltrl' + data.key).val(data.val)
        $('#cltrl' + data.key).removeAttr('data-form-type')
      } else if (data.inputtype == 'radio') {
        $(
          `#overlaycontent .form-group.overlaytxtalign.col-md-5 .custom-control.custom-radio  [data-val="${data.val}"]`
        ).prop('checked', true)
      } else if (data.inputtype == 'checkbox') {
        $('*[data-attribute="checkboxMulti"]').removeAttr('data-form-type')
        $(`#overlaycontent .checkbox.tablechk [type="checkbox"]`).each(
          function (index) {
            $(this).attr('checked', false)
          }
        )
        var intern = data.val.includes(',') ? data.val.split(',') : [data.val]
        intern.forEach(function (dr) {
          $(
            `#overlaycontent .form-group.overlaytxtalign.col-md-5 .custom-control.custom-checkbox  [data-val='${dr}']`
          ).prop('checked', true)
        })

        currentgender.data[data.key] = intern
      }
    })
    //active comma denominator
    //console.log(interncontent[0].recordstate)
    htmlpopulate.genericRecordState(interncontent, base)
  },
  tablechkbox: function (arg) {},
  baseResponseformat: function (validationmap, dt) {
    return validationmap.map(function (dr) {
      return {
        key: dr.inputname,
        val: dt[dr.inputname],
        inputtype: dr.inputtype
      }
    })
  },

  populatemodularddl: function () {
    validationmap.forEach2(function (data) {
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
  payloadformat: function (arg) {
    let updateIds
    if (ajaxbase.isedit) {
      updateIds = arg.datapayload[currentmoduleid].split(',')
      delete arg.datapayload[currentmoduleid]
    }
    let internim = {
      datapayload: {
        ...arg.datapayload,
        ...currentgender.data,
        ...multiselects
      }
    }
    return htmlpopulate.genericMultiControlpayload(
      base,
      internim,
      updateIds,
      currentmoduleid
    )
  }
}
//
let accesstypecontent = [
  {
    text: 'ViewOnly',
    val: 'VO',
    key: 'accesstype'
  },
  {
    text: 'AllAccess',
    val: 'AA',
    key: 'accesstype'
  }
]
