
//document .ready !
$(function () {
  baseloadsegments.populateaxiskeys()
  htmlpopulate.htmlpopulatetableheader()
  htmlpopulate.htmlpopulatemodal()

  //for test/

  // baseloadsegments.initialdatatableload();
  $('#tooglecheck1 input').change(function () {
    if ($(this).is(':checked')) {
      $(this)
        .next()
        .text('without consolidated')
      renderall()
    } else {
      renderconsolidated()
      $(this)
        .next()
        .text('consolidated result')
    }
  })
  $('#tooglecheck2 input').change(function () {
    if ($(this).is(':checked')) {
      $(this)
        .next()
        .text('without consolidated')
      renderall3d()
    } else {
      renderconsolidated3d()
      $(this)
        .next()
        .text('consolidated result')
    }
  })

  /* var red = '(cost=0.00..50779.28 rows=7501 width=54) (actual time=0.028..592.775 rows=600290 loops=1)'
        console.log(red.split(' ')[5].split('=')[1])*/
  //$(".sidebar-toggle").click();
  $('.form-horizontal input:text ,[data-attribute="date"]').on('keydown keyup change', function () {
    var sel = $('#overlaycontent *[data-form-type]').length;
    //var sel=document.querySelectorAll("[data-form-type]").length

    if (sel <= 0) {
      $('#btnmodalsub').prop('disabled', false)
    } else {
      $('#btnmodalsub').prop('disabled', true)
    }
  })
})
/*user submit events*/
let reqops = {
  uploadFile: function (file) {
    //var deffered, list;
    //deffered = Promise.defer();
    return new Promise(function (resolve, reject) {
      var url = baseurlobj.uploaddata
      var xhr = new XMLHttpRequest()
      var fd = new FormData()


      xhr.open('POST', url, true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          // Every thing ok, file uploaded
          // console.log(xhr.responseText); // handle response.
          //deffered.resolve(xhr.responseText);
          resolve(xhr.responseText)
        }
      }
      fd.append('upload_file', file)
      xhr.setRequestHeader('x-access-token', customToken);
      xhr.send(fd)
      //return deffered.promise
    })
  },
  flpupload: function () {
    $('#uploadfiles').click()
  },
  clearControls: function () {

    var inputElements = document.getElementsByTagName('input');

    for (var i = 0; i < inputElements.length; i++) {
      if (inputElements[i].type == 'text' || inputElements[i].type == 'date') {
        inputElements[i].value = '';
      }
    }


    $('#cltrlrecordstate').prop('checked', false)
    $(`#overlaycontent .selectchips`).remove()
    $(
      `#overlaycontent .form-group.overlaytxtalign.col-md-5 .custom-control.custom-radio `
    ).each(function (index) {
      $(this)
        .find('[type="radio"]')
        .prop('checked', false)
    })
    $(`#overlaycontent *[data-attribute="checkboxMulti"]`).each(function (
      index
    ) {
      $(this).prop('checked', false)
    })
    basemod_modal.customClearControl()
  },
  fileSelected: function (element) {
    var myFileSelected = element.files[0]
    reqops.uploadFile(myFileSelected).then(function (a) {
      $('#uploadfiles').val('')
      $('#uploadsave').show()
      $('#uploadsavemsg').show()
      $('#notificationsid').show()
      $('#uploadsavemsg').html('Data processing in progress !')

      setintervalparams.id = setInterval(frame, 750)

      function frame() {
        if (setintervalparams.width >= 24263) {
          clearInterval(setintervalparams.id)
        } else {
          setintervalparams.width++
          //elem.style.width = width + '%';
          $('#lbluploadprogress').html(setintervalparams.width + '%')
          $('#dvuploadprogress').css('width', setintervalparams.width + '%')
          $('#uploadsave').show()
          $('#uploadsave').html(setintervalparams.width + '%')
        }
      }
    })
  },
  /*all column search !*/
  consolidatesearch: function () {
    base.searchtype = 'consolidatesearch'
    base.idstatus = true
    base.excludedatecol = true
    //var internsearchbar = baseloadsegments.moduleattributepopulate();
    var internsearchbar = applyfields
    var cons = {}
    basesearcharconsolidated = []
    cons.consolidatecol = internsearchbar
    cons.consolidatecolval = $('#txtconsolidatesearch')
      .val()
      .trim()
    basesearcharconsolidated.push(cons)

    base.datapayload = payloadprepared()

    basefunction()
      .getpaginatesearchtype(base)
      .then(function (data) {
        htmlpopulate.htmlpopulatetable(data)
        basepagination.bootpagination(data)
        htmlpopulate.highlightconsolidatesearch()
        if ($('#dvreportcontainer').hasClass('collapsed-box')) {
          $('#rptwidget').click()
        }
      })
  },
  ontdedit: function (arg) {
    // console.log(arg)

    ajaxbase.isedit = true
    var interncontent = ajaxbase.response.rows
    interncontent = interncontent.filter(function (doctor) {
      return doctor[currentmoduleid] == arg
    })
    // console.log(interncontent[0]);
    Object.keys(interncontent[0]).map(function (objectKey, index) {
      var value = interncontent[0][objectKey]

      var icers = validationmap
        .filter(p => p.inputname === objectKey)
        .map(y => y.fieldvalidatename)


      if (icers.toString() == "date") {
        value = moment(value).format('YYYY-MM-DD');
      }

      $('#cltrl' + objectKey).val(value)
      $('#cltrl' + objectKey).removeAttr('data-form-type')
    })

    if (interncontent[0].recordstate == true) {
      $('#cltrlrecordstate').prop('checked', true)
      base.interimdatapayload.recordstate = true
    } else {
      $('#cltrlrecordstate').prop('checked', false)
      base.interimdatapayload.recordstate = false
    }

    $('#btnbutton').click()
  },

  extractDatafromfields: function () {
    let p = {}
    validationmap.forEach(function (a) {

      p[a.inputname] = $(`[data-key-type="${a.inputname}"]`).val();

    })

    return p
  },

  btnSubmit: function () {

    data = this.extractDatafromfields()
    if (ajaxbase.isedit) {
      data[currentmoduleid] = $('#cltrl' + currentmoduleid).val()
      base.datapayload = data

      base.datapayload.recordstate =
        base.interimdatapayload.recordstate == undefined
          ? base.datapayload.recordstate
          : base.interimdatapayload.recordstate
      basefunction()
        .update(base)
        .then(function (argument) {

          baseloadsegments.initialdatatableload()
          reqops.clearControls()

          $('#btnmodalclose').click()
        })
    } else {
      delete data[currentmoduleid]

      base.datapayload = data
      base.datapayload.recordstate = base.interimdatapayload.recordstate
      basefunction()
        .insert(base)
        .then(function (argument) {
          baseloadsegments.initialdatatableload()
          reqops.clearControls()

          $('#btnmodalclose').click()
        })
    }
  },
  exportexcel: function () {
    base.datapayload = payloadprepared()

    basefunction()
      .exportexcel(base)
      .then(function (data) {
        $('#uploadfiles').val('')

        $('#uploadsave').show()
        $('#uploadsavemsg').show()

        $('#notificationsid').show()

        $('#uploadsavemsg').html('Preparing for download !')
        setintervalparams.id = setInterval(frame, 750)

        function frame() {
          if (setintervalparams.width >= 24263) {
            clearInterval(id)
          } else {
            setintervalparams.width++
            //elem.style.width = width + '%';
            $('#lbluploadprogress').html(setintervalparams.width + '%')
            $('#dvuploadprogress').css('width', setintervalparams.width + '%')
            $('#uploadsave').html(setintervalparams.width + '%')
          }
        }
      })
  },
  srchparams: function () {
    base.searchtype = 'Columnwise'
    base.datapayload = payloadprepared()
    basefunction()
      .getpaginatesearchtype(base)
      .then(function (data) {
        htmlpopulate.htmlpopulatetable(data)
        basepagination.bootpagination(data)

        if ($('#dvreportcontainer').hasClass('collapsed-box')) {
          $('#rptwidget').click()
        }
      })
  },

}
/* all reports pagination*/
let basepagination = {
  //base report bootpag
  bootpagination: function (argument) {
    $('#page-selection').unbind('page')
    $('#page-selection').empty()

    var pagesize = $('#inppagesize').val()
    var totalpagecount = argument.count
    var maxvisiblesize =
      argument.count <= 100 ? Math.round(totalpagecount / pagesize) : 5
    //console.log(maxvisiblesize);
    if (maxvisiblesize > 0) {
      $('#page-selection')
        .bootpag({
          page: 1,
          total: totalpagecount,
          maxVisible: maxvisiblesize,
          leaps: true
        })
        .on('page', this.bootpagescallback)
    }
  },
  bootpagescallback: function (event, num) {
    base.pageno = num - 1

    baseloadsegments.initialdatatableload()
    return false
  },
  // end region
  bootpaginationxaxis: function (argument) {
    $('#page-selection-xaxis').unbind('page')
    $('#page-selection-xaxis').empty()
    $('#page-selection-xaxis')
      .bootpag({
        page: 1,
        total: argument.Xtotalpivotrecorset,
        maxVisible: 5,
        leaps: true
      })
      .on('page', this.bootpagescallbackxaxis)
  },
  bootpagescallbackxaxis: function (event, num) {
    base.Xpageno = num

    base.pivotinternload = false
    pivotutils.pivotreport()
    //return false;
  },
  //yaxis pagination
  bootpaginationyaxis: function (argument) {
    $('#page-selection-yaxis').unbind('page')
    $('#page-selection-yaxis').empty()
    $('#page-selection-yaxis')
      .bootpag({
        page: 1,
        total: argument.Ytotalpivotrecorset,
        maxVisible: 5,
        leaps: true
      })
      .on('page', this.bootpagescallbackyaxis)
  },
  bootpagescallbackyaxis: function (event, num) {
    base.Ypageno = num

    base.pivotinternload = false
    pivotutils.pivotreport()
    //return false;
  }
}

/*report crud operations*/
let tableops = {
  tblchkall: function () {
    $('#msgchksptotalUsers').html('clear selection')
    if (base.tblchk) {
      this.unchecktblall()
      base.tblchk = false
      base.pageSize = base.internpageSize
    } else {
      base.tblchk = true

      //remove element from array by keyname
      this.clearfieldselection()
      base.internpageSize = base.pageSize
      base.pageSize = parseInt($('#sptotalUsers').html())
    }
  },
  tablechkbox: function (argument) {
    var idx = selectArr.indexOf(argument)

    if (idx == -1) {
      selectArr.push(argument)
    } else {
      selectArr.splice(idx, 1)
      multiselect.removefilterdiv(this, currentmoduleid, argument)
    }

    selectArr.forEach(function (element) {
      multiselect.assignsearchparams(currentmoduleid, element)
    })
  },
  clearfieldselection: function () {
    basesearchar = basesearchar.filter(function (doctor) {
      return !Object.keys(doctor).includes(currentmoduleid) // if truthy then keep item
    })
  },
  unchecktblall: function () {
    $('#tblchkmsg').hide()
    $('.tblkchk').prop('checked', false)
    selectArr = []
    $('#tblselectallchk').prop('checked', false)
    base.pageSize = base.internpageSize
    base.tblchk = false
    this.clearfieldselection()
  },
  tblselectall: function () {
    if ($('#tblselectallchk').prop('checked')) {
      $('.tblkchk').prop('checked', true)
      $('#tblchkmsg').show()
      $('#msgsppageSize').html($('#sppageSize').html())
      $('#msgchksptotalUsers').html($('#sptotalUsers').html())

      $('.tblkchk').each(function () {
        var cmodid = $(this).data().chkType
        selectArr = []

        tableops.tablechkbox(cmodid)
      })
    } else {
      $('.tblkchk').prop('checked', false)
      $('#tblchkmsg').hide()
      selectArr = []
    }
  },
  sort: function (dv) {
    var sortcol = $(dv).attr('data-field-header')
    $(dv)
      .find('span')
      .toggleClass('sortorderdesc sortorderasc')
    //console.log($(dv).find('span').hasClass('sortorderasc'));
    //console.log($(dv).find('span').hasClass('sortorderdesc'));
    if (
      $(dv)
        .find('span')
        .hasClass('sortorderdesc')
    ) {
      this.dynamicsorting(sortcol, true)
    } else {
      this.dynamicsorting(sortcol, false)
    }
  },
  dynamicsorting: function (columnname, sortorder) {
    var colorder = sortorder
    var y = colorder == true ? 'DESC' : 'ASC'
    filterparam.sortcolumn = columnname
    filterparam.sortcolumnorder = y
    base.pageno = 0

    filterparam.pageno = base.pageno
    filterparam.pageSize = base.pageSize
    filterparam.ispaginate = true
    base.datapayload = filterparam

    basefunction()
      .getpaginatesearchtype(base)
      .then(function (argument) {
        // console.log(argument);
        htmlpopulate.htmlpopulatetable(argument)
      })
  },
  onchk: function (argument) {

    if ($(argument).prop('checked')) {
      $(argument).val(true)

      base.interimdatapayload.recordstate = true
    } else {
      $(argument).val(false)

      base.interimdatapayload.recordstate = false
    }
    reqopsValidate.formvalidation(argument)
  }
}


/*get access token*/
// baseloadsegments.getapptoken(ajaxbase).then(arg => {
//   console.log(arg);
// });

function payloadprepared() {
  filterparam.colsearch = 'intercolumn'
  filterparam.searchparam = basesearchar

  if (base.tblchk) {
    base.pageno = 0
    if (base.pageSize == undefined) {
      base.pageSize = 20
    }
    filterparam.ispaginate = true
  } else {
    filterparam.ispaginate = false
    base.pageno = 0
    //base.pageSize = parseInt($("#sptotalUsers").html());
  }

  filterparam.pageno = base.pageno
  filterparam.pageSize = base.pageSize
  filterparam.pivotparamXaxis = base.pivotparamXaxis
  filterparam.pivotparamYaxis = base.pivotparamYaxis
  filterparam.timeinternprimary = base.timeinternprimary
  filterparam.timeinternsecondary = base.timeinternsecondary
  filterparam.XpageSize = base.XpageSize
  filterparam.Xpageno = base.Xpageno
  filterparam.YpageSize = base.YpageSize
  filterparam.Ypageno = base.Ypageno
  filterparam.searchtype = base.searchtype
  filterparam.datecolsearch = base.datecolsearch
  filterparam.basesearcharconsolidated = basesearcharconsolidated
  filterparam.sortcolumn = 1
  filterparam.sortcolumnorder = 'desc'

  return filterparam
}
/*data transform utils*/
