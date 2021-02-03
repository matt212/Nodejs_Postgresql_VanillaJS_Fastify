let currentmodulename = 'mrole'
let currentmoduleid = 'mroleid'
let currentrolemodname = 'role'
let currentmodname = 'modname'

let multiselects = {}
let multiselectfunc = {}

let baseurlobj = {
  getpaginatesearchtypeurl: '/' + currentmodulename + '/api/searchtype/',
  createdata: '/' + currentmodulename + '/api/bulkCreate/',
  createdatarole: '/' + currentrolemodname + '/api/create/',
  updatedata: '/' + currentmodulename + '/api/update/',
  exceldata: '/' + currentmodulename + '/api/exportexcel/',
  uploaddata: '/' + currentmodulename + '/api/uploadcontent/',
  getpaginatesearchtypegroupby:
    '/' + currentmodulename + '/api/searchtypegroupby/',
  getpaginatemodnamesearchtypegroupby:
    '/' + currentmodname + '/api/searchtypegroupbyId/',
  getpaginateRolesearchtypegroupby:
    '/' + currentrolemodname + '/api/searchtypegroupbyId/',
  exportexcelcalc: '/' + currentmodulename + '/api/exportexcelcalc/',
  pivotresult: '/' + currentmodulename + '/api/pivotresult/',
  deletemrole: '/' + currentmodulename + '/api/customDestroy/'
}

let basefunction = function () {
  return {
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
    getpaginatemodnamesearchtypegroupby: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getpaginatemodnamesearchtypegroupby

      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    },
    getpaginateRolesearchtypegroupby: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getpaginateRolesearchtypegroupby

      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        ajaxbase.response = argument
        return argument
      })
    },
    insert: function (base) {
      base = basemod_modal.mrolepayloadformat(base)
      return basemod_modal.insertmrole(base).then(function (data) {
        ajaxbase.response = data
        return ajaxbase
      })
    },
    deleterecord: function (base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.deletemrole

      return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        return base
      })
    },
    update: function (base) {
      base = basemod_modal.mrolepayloadformat(base)
console.log(base)
      // return this.deleterecord(base)
      //   .then(basemod_modal.insertmrole)
      //   .then(function (data) {
      //     //console.log(data)
      //     ajaxbase.response = data
      //     return ajaxbase
      //   })
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
    }
  }
}
/*accesstype multiselect*/
let basemod_modal = {
  modalpopulate: function () {
    var interset = validationmap
    let redlime = doChunk(interset, 2)
    $('#overlaycontent').empty()
    var htmlcontent = ''
    redlime.forEach(function (item) {
      htmlcontent += '<div class="row">'
      item.forEach2(function (element) {
        if (element.inputtype == 'multiselect') {
          htmlcontent += basemultiselectaccess.htmlpopulatemodular(
            element.inputtextval
          )
        } else {
          htmlcontent +=
            '<div class="form-group overlaytxtalign col-md-5">' +
            '<div class="col-sm-15">' +
            '<label class="lblhide" id="lblmsg' +
            element.inputtextval +
            '">' +
            '<i class="fa fa-bell-o"></i> Input with warning' +
            '</label>' +
            '<input type="text" data-attribute="' +
            element.fieldvalidatename +
            '" class="form-control" maxLength="' +
            element.fieldmaxlength +
            '"' +
            ' data-form-type="false" onkeyup="javascript:reqops.formvalidation(this)" id="cltrl' +
            element.inputtextval +
            '" placeholder="' +
            element.inputplaceholder.capitalize() +
            '">' +
            '</div></div>'
        }
      })
      htmlcontent += '</div>'
    })

    var chkcontent =
      ' <input type="hidden" name="' +
      currentmoduleid +
      '" value="0" id="cltrl' +
      currentmoduleid +
      '"> <div class="form-group overlaytxtalign col-md-5">' +
      '<div class="col-sm-offset-2 col-sm-15">' +
      '<div>' +
      '<label>' +
      '<input type="checkbox" id="cltrlrecordstate" onclick="javascript:tableops.onchk(this)" value="true"> Remember me' +
      '</label>' +
      '</div>' +
      '</div>' +
      '</div>'

    $('#overlaycontent').html(htmlcontent + chkcontent)
  },
  insertrole: function (base) {
    if (base.datapayload.rolename != undefined) {
      var obj = {}
      obj.rolename = base.datapayload.rolename
      ajaxbase.payload = obj
      ajaxbase.url = baseurlobj.createdatarole
      return new Promise(function (resolve, reject) {
        ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
          resolve(argument)
        })
      })
    }
  },
  insertmrole: function (base) {
    /*var obj = {}
         obj.rolename = base.datapayload.role*/
    ajaxbase.payload = base.datapayload
    ajaxbase.url = baseurlobj.createdata
    return new Promise(function (resolve, reject) {
      ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
        resolve(argument)
      })
    })
  },
  mrolepayloadformat: function (data) {
    var isactivearrayobj = {
      recordstate: base.interimdatapayload.recordstate
    }
    console.log(multiselects);
    //flatting multiselects objects
    var temp = Object.fromEntries(
      Object.entries(multiselects).map(([k, v]) => [
        k,
        datatransformutils.flat(v)
      ])
    )
    let b = { ...temp, ...isactivearrayobj }
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
  },
  afterhtmlpopulate: function () {
    $('#basetable tbody tr td:last-child').attr(
      'onclick',
      'javascript:basemod_modal.ontdedit(this)'
    )
    $('#basetable tbody tr td:nth-child(1) input:checkbox').attr(
      'onclick',
      'javascript:basemod_modal.tablechkbox(this)'
    )
  },
  ontdedit: function (arg) {
    var armroleid = $(arg).attr('data-tbledit-type')
    ajaxbase.isedit = true
    var interncontent = ajaxbase[currentmodulename].rows
    interncontent = interncontent.filter(function (doctor) {
      return doctor[currentmoduleid] == armroleid
    })
    base.editrecord = interncontent
    $('#cltrl' + currentmoduleid).val(armroleid)
    datatransformutils.editMultiSelect({
      multiselectfunc,
      validationmap,
      content: interncontent
    })

    if (interncontent[0].recordstate) {
      $('#cltrlrecordstate').prop('checked', true)
      $('#cltrlrecordstate').val(true)
      base.interimdatapayload.recordstate= true
      base.datapayload.recordstate = true
    } else {
      $('#cltrlrecordstate').prop('checked', false)
      $('#cltrlrecordstate').val(false)
      base.interimdatapayload.recordstate= false
      base.datapayload.recordstate = false
    }
    $('#btnbutton').click()
  },
  tablechkbox: function (arg) {},
  
  populatemodularddl: function () {
    validationmap.forEach2(function (data) {
      if (data.inputtype == 'multiselect') {
        var p = {}
        p.fieldname = data.inputtextval

        //p.fieldkey = data.inputname
        p.fieldkey = data.inputtextval
        p.secondaryKey = data.inputname
        p.selecttype = data.selecttype
        basemultiselectaccess.multiselectmodular(p)
      }
    })
  }
}

let accesstypecontent = [
  {
    key: 'accesstype',
    text: 'ViewOnly',
    val: 'VO'
  },
  {
    key: 'accesstype',
    text: 'AllAccess',
    val: 'AA'
  }
]

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

    //multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, this["onchange" + arg.fieldname])
    multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, function (
      data
    ) {
      multiselects[arg.secondaryKey] = data
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
  multiSelectCommonResponse: function (data,argument) {
    
      var internfield = Object.keys(argument.rows[0])
    var  sets = argument.rows.map(function (doctor) {
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
  remotefuncmname: function (data) {
    return new Promise(function (resolve, reject) {
      basefunction()
        .getpaginatemodnamesearchtypegroupby(
          basemultiselectaccess.multiSelectCommon(data)
        )
        .then(function (argument) {
          var sets = argument.rows

    if (sets[0] != undefined) {
          resolve(basemultiselectaccess.multiSelectCommonResponse(data,argument))
    }
        })
    })
  },
  remotefuncrolename: function (data) {
    return new Promise(function (resolve, reject) {
      basefunction()
        .getpaginateRolesearchtypegroupby(
          basemultiselectaccess.multiSelectCommon(data)
        )
        .then(function (argument) {
          var sets = argument.rows

    if (sets[0] != undefined) {
          resolve(basemultiselectaccess.multiSelectCommonResponse(data,argument))
    }
        })
    })
  },
  remotefuncaccesstype: function (data) {
    return new Promise(function (resolve, reject) {
      resolve(accesstypecontent)
    })
  },
  htmlpopulatemodular: function (fieldname) {
    var htmlcontents =
      '<div class="form-group col-sm-6">' +
      '<div class="col-sm-15">' +
      '<label class="lblhide" id="lblmsgddlddlmulti">' +
      '<i class="fa fa-bell-o"></i> Input with warning' +
      '</label>' +
      '<div id="in' +
      fieldname +
      '"></div>' +
      '</div></div>'
    return htmlcontents

    //$(htmlcontents).insertBefore($("#overlaycontent.form-group.overlaytxtalign.col-md-12"))
  }
}

$(function () {
  basemod_modal.modalpopulate()
  basemod_modal.populatemodularddl()
  /*
      basemultiselectaccess.multiselectaccesstype();
      basemultiselectaccess.multiselectmodname();*/

  $('.form-horizontal input:text').on('keydown keyup change', function () {
    var sel = $('.form-horizontal input:text[data-form-type]').length

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
