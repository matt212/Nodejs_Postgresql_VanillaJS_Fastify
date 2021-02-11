let selectArr = []
let basesearchobj = {}
let basesearchar = new Array()
let basesearcharconsolidated = new Array()

let basedataset = {}
let base = {
  appkey: location.hostname + (location.port ? ':' + location.port : ''),
  config: {
    headers: {
      'x-access-token': customToken
    }
  },
  timeinternprimary: 'Month',
  timeinternsecondary: 'Month',
  XpageSize: 40,
  Xpageno: 0,
  YpageSize: 20,
  Ypageno: 0,
  pivotinternload: true,
  searchtype: 'NoFilter',
  //for Muti control access data for EDIT AND update across use interimdatapayload child object of base
  interimdatapayload: {}
}
let ajaxurl = {
  auth: '/getToken'
}

let ajaxbase = {
  postauth: base.config
}
let validations = {
  string: [/^[a-zA-Z ]+$/, 'Please enter valid  name'],
  number: [/^[0-9]+$/, 'Please enter valid number'],
  email: [
    /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    'Please enter a valid email address'
  ],
  mobile: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please enter a valid mobile number'],
  password_set1: [
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    'Please enter Minimum eight characters, at least one letter and one number'
  ],
  password_set2: [
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
    'Please enter Minimum eight characters, at least one letter, one number and one special character'
  ],
  password_set3: [
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    'Please enter Minimum eight characters, at least one uppercase letter, one lowercase letter and one number'
  ],
  password_set4: [
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/,
    'Please enter Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
  ],
  password_set4: [
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}/,
    'Please enter Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
  ],
  date: [
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    'Please enter valid date'
  ]
}
let setintervalparams = {
  width: 1,
  id: ''
}
let host = location.protocol.concat('//').concat(window.location.hostname)
let socket = io.connect()
socket.on('news', function (data) {
  var then = new Date()

  clearInterval(setintervalparams.id)

  var loop = setintervalparams.width

  var ids = setInterval(function () {
    loop++
    if (loop === 101) {
      clearInterval(ids)
      loop = 0
      setintervalparams.width = 0
      $('#uploadsavemsg').html(data + ' records are inserted ! ')
    } else {
      $('#lbluploadprogress').html(loop + '%')
      $('#dvuploadprogress').css('width', loop + '%')
      $('#uploadsave').html(loop + '%')
    }
  }, 20)
})
socket.on('newsdownloadsets', function (data) {
  var filenome = data.replace('.csv', '')
  clearInterval(setintervalparams.id)
  var loop = setintervalparams.width

  var ids = setInterval(function () {
    loop++
    if (loop === 101) {
      clearInterval(ids)
      loop = 0
      setintervalparams.width = 0
      $('#libasenotifications').hide()
      $('#libasenotificationrow').show()
      $('#spn_dv' + filenome).hide()
      $('#dv_set_progress' + filenome).before(
        '<a href="../exportCsv/' +
          data +
          '"><i class="fa fa-download text-aqua"></i> <span  style="white-space: normal !important;">' +
          data +
          '</span></a>'
      )
      $('#uploadsave').hide()
    } else {
      $('#uploadsave').show()
      $('#lbluploadprogress' + filenome + '').html(loop + '%')
      $('#dvuploadprogress' + filenome + '').css('width', loop + '%')
      $('#uploadsave').html(loop + '%')
    }
  }, 20)
})
socket.on('newsdownload', function (data) {
  socket.emit('end')
})

socket.on('newsdownloadsetprogressstats', function (data) {
  $('#libasenotifications').hide()
  $('#libasenotificationrow').show()

  var filenames = data.filenames
  var count = data.count <= 0 ? 40 : parseInt(data.count)

  $('#libasenotificationrow').append(
    '<span style="color: #28669c;" id="spn_dv' +
      filenames +
      '">Data processing in progress !</span><div id="dv_set_progress' +
      filenames +
      '"><small class="pull-right"><label id="lbluploadprogress' +
      filenames +
      '">%</label></small>' +
      '<div class="progress xs">' +
      '<div class="progress-bar progress-bar-aqua" id="dvuploadprogress' +
      filenames +
      '" style="width: 20%;" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">' +
      '</div>' +
      '</div>' +
      '<div class="ripple-container">' +
      '<div class="ripple ripple-on ripple-out" style="left: 205.203px; top: 42px; background-color: rgb(33, 150, 243); transform: scale(32.875);"></div>' +
      '</div></div>'
  )

  clearInterval(setintervalparams.id)
  setintervalparams.id = setInterval(frame, 750)
  setintervalparams.width = 0

  function frame () {
    if (setintervalparams.width >= count) {
      clearInterval(id)
      setintervalparams.width = 0
    } else {
      setintervalparams.width++

      $('#lbluploadprogress' + filenames + '').html(
        setintervalparams.width + '%'
      )
      $('#dvuploadprogress' + filenames + '').css(
        'width',
        setintervalparams.width + '%'
      )
      $('#uploadsave').html(setintervalparams.width + '%')
    }
  }
})
socket.on('newsrecordset', function (data) {
  $('#uploadnotification').html(data)
})
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
  $('.form-horizontal input:text').on('keydown keyup change', function () {
    var sel = $(
      '.form-horizontal input:text[data-form-type] input:checkbox[data-form-type]'
    ).length

    if (sel <= 0) {
      $('#btnmodalsub').prop('disabled', false)
    } else {
      $('#btnmodalsub').prop('disabled', true)
    }
  })
})
/* pivot report and chart */
let pivotutils = {
  pivotreport: function () {
    base.datapayload = payloadprepared()

    basefunction()
      .getpivotreport(base)
      .then(function (data) {
        pivotutils.processpivotresponse(data)
        // console.log(base.internaxis);
        // console.log(base.yaxisarray);

        var tablecontent_rows_consolidate = []
        for (i = 0; i <= base.tablecontent_rows.length - 1; i++) {
          var internsets = base.tablecontent_rows[i]
          var keys = Object.keys(base.tablecontent_rows[i])
          var internobj = {}
          keys.forEach(function (element) {
            var internval = internsets[element]
            internobj[element] = isNaN(parseInt(internval))
              ? 0
              : parseInt(internval)
          })

          tablecontent_rows_consolidate.push(internobj)
          internobj = {}
        }

        base.tablecontent_rows_consolidate = tablecontent_rows_consolidate

        pivotutils.tblpivotyaxis(base)
        pivotutils.tblpivotxaxis(base)
        if (base.pivotinternload) {
          if (base.internaxis.length - 1 != base.Xtotalpivotrecorset) {
            basepagination.bootpaginationxaxis(base)
            $('#dvaxis').css('overflow-x', 'scroll')
            $('#dvaxis').css('margin-top', '0%')
          } else {
            $('#page-selection-xaxis').html('')
          }
          if (base.Ytotalpivotrecorset != base.table_rows.length - 1) {
            basepagination.bootpaginationyaxis(base)
            $('#dvaxis').css('overflow-x', 'scroll')
            //$("#dvaxis").css('margin-top', '-3%');
          } else {
            $('#page-selection-yaxis').html('')
          }
        }
        initcharts(base.internaxis, base.yaxisarray)
        init3dcharts(base)
        pivotutils.drilldownpieparent()
        $('#btnPivotDownload').show()
      })
  },
  /*drilldown pieparent */
  drilldownpieparent: function () {
    var searchString = "'total'"
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
    var parentdrilldown = rawcontent
      .filter(function (doctor) {
        return doctor.yaxis !== 'total' // if truthy then keep item
      })
      .map(function (nested) {
        return {
          name: nested.yaxis,
          y: parseInt(nested.subtotal),
          drilldown: nested.yaxis
        }
      })

    //console.log(parentdrilldown)
    /*child drilldown*/

    var childdrilldown = rawcontent
      .filter(function (doctor) {
        return doctor.yaxis !== 'total' // if truthy then keep item
      })
      .map(function (nested) {
        var childdrilldowninner = Object.keys(nested)
          .filter(function (img) {
            return img != 'yaxis' && img != 'subtotal'
          })
          .map(function (element) {
            var ar = []
            ar.push(element)
            ar.push(nested[element] === null ? 0 : parseInt(nested[element]))

            return ar
          })
        // console.log(red[0][0] + "--" + red[0][1]

        return {
          name: nested.yaxis,
          id: nested.yaxis,
          data: childdrilldowninner
        }
      })

    base.parentdrilldown = parentdrilldown
    base.childrendrilldown = childdrilldown
    populatepiechart(base)
  },
  tblpivotyaxis: function (base) {
    var firsts = base.table_cols
    var baset = base.table_rows
    $('#tblpivotcol thead').html(' ')
    $('#tblpivotcol tbody').html(' ')
    $('#tblpivotcol thead ').append('<tr>')
    for (f of firsts) {
      $('#tblpivotcol thead tr')
        .last()
        .append('<th>' + f + '</th>')
        .fadeIn('slow')
    }

    for (s of baset) {
      $('#tblpivotcol tbody ').append('<tr>')
      for (f of firsts) {
        $('#tblpivotcol tbody tr')
          .last()
          .append('<td>' + s[f] + '</td>')
          .fadeIn('slow')
      }
    }
  },
  tblpivotxaxis: function (base) {
    var firsts = base.tablecontent_cols
    var baset = base.tablecontent_rows_consolidate
    $('#tblpivotxaxis thead').html(' ')
    $('#tblpivotxaxis tbody').html(' ')

    $('#tblpivotxaxis thead ').append('<tr>')
    for (f of firsts) {
      $('#tblpivotxaxis thead tr')
        .last()
        .append('<th>' + f + '</th>')
        .fadeIn('slow')
    }

    for (s of baset) {
      $('#tblpivotxaxis tbody ').append('<tr>')
      for (f of firsts) {
        $('#tblpivotxaxis tbody tr')
          .last()
          .append('<td>' + s[f] + '</td>')
          .fadeIn('slow')
      }
    }
  },
  processpivotresponse: function (data) {
    var internrespobj = data
    base.rawpivotdata = data
    if (internrespobj.rows.length > 0) {
      var reverset = datatransformutils.removeJsonAttrs(internrespobj.rows, [
        'interncolumn'
      ])
      var reversetintern = datatransformutils.removeJsonAttrs(
        internrespobj.rows,
        ['interncolumn']
      )

      var doc = reversetintern.map(function (doctor) {
        return {
          // return what new object will look like
          Monthsegregation: doctor.yaxis
        }
      })

      var internreverset = datatransformutils.removeJsonAttrs(reverset, [
        'yaxis'
      ])

      var yaxisarray = []
      var yaxisobj = {}
      for (index = 0; index < internreverset.length; ++index) {
        //console.log(internreverset[index]);
        //console.log(doc[index])
        var interndatasetname = internreverset[index]

        //var dataArray = Object.keys(interndatasetname).map(val => isNaN(parseInt(interndatasetname[val])) ? 0 : parseInt(interndatasetname[val]));

        // console.log(dataArray);
        //yaxisobj.name = doc[index].Monthsegregation
        var dataArray = Object.keys(interndatasetname)
          .filter(word => word != 'subtotal')
          .map(function (val) {
            return isNaN(parseInt(interndatasetname[val]))
              ? 0
              : parseInt(interndatasetname[val])
          })

        yaxisobj.name = doc[index].Monthsegregation
        yaxisobj.data = dataArray
        yaxisarray.push(yaxisobj)
        yaxisobj = {}
      }

      var internaxis = Object.keys(internreverset[0])

      // console.log(yaxisarray);
      base.internaxis = internaxis
      base.yaxisarray = yaxisarray
      base.table_rows = doc
      base.table_cols = Object.keys(doc[0])
      base.tablecontent_rows = internreverset

      base.tablecontent_cols = Object.keys(internreverset[0])

      base.Xtotalpivotrecorset = internrespobj.Xcount
      base.Ytotalpivotrecorset = internrespobj.Ycount

      base.subtotal = internrespobj.totaldoc
    }
  },
  setselxaxis: function () {
    base.pivotparamXaxis = $('#selxaxis').val()
    var pivotparamYaxis = base.pivotparamXaxis
    base.Ypageno = 0
    base.Xpageno = 0
    base.pivotinternload = true
    if (pivotparamYaxis.includes('date')) {
      $('#chkprimary').css('visibility', 'visible')
      $('#chkprimary').css('height', '')
    } else {
      $('#chkprimary').css('visibility', 'hidden')
      $('.rptbasediv').css('height', '10px')
      base.timeinternsecondary = ''
    }
  },
  setselyaxis: function () {
    base.pivotparamYaxis = $('#selyaxis').val()
    base.Ypageno = 0
    base.Xpageno = 0
    base.pivotinternload = true
    var pivotparamYaxis = base.pivotparamYaxis
    if (pivotparamYaxis.includes('date')) {
      $('#chksecondary').css('visibility', 'visible')
    } else {
      $('#chksecondary').css('visibility', 'hidden')
      base.timeinternprimary = ''
    }
  },
  setseldatefields: function () {
    base.datecolsearch = $('#seldatefields').val()
    $('.topdatepicker').show()
  },
  exportexcelPivot: function () {
    var csvdataset = Papa.unparse(base.rawpivotdata.rows)
    var exportFilename = currentmodulename + '.csv'
    var csvData = new Blob([csvdataset], {
      type: 'text/csv;charset=utf-8;'
    })
    //IE11 & Edge
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(csvData, exportFilename)
    } else {
      //In FF link must be added to DOM to be clicked
      var link = document.createElement('a')
      link.href = window.URL.createObjectURL(csvData)
      link.setAttribute('download', exportFilename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
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
      xhr.send(fd)
      //return deffered.promise
    })
  },
  flpupload: function () {
    $('#uploadfiles').click()
  },
  clearControls: function () {
    $('input[type=text]').each(function () {
      $(this).val('')
    })
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

      function frame () {
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

      $('#cltrl' + objectKey).val(value)
      $('#cltrl' + objectKey).removeAttr('data-form-type')
    })

    if (interncontent[0].recordstate == true) {
      $('#cltrlrecordstate').prop('checked', true)
    } else {
      $('#cltrlrecordstate').prop('checked', false)
    }

    $('#btnbutton').click()
  },
  btnSubmit: function () {
    var $fields = $('input:text, input:hidden')
      .not("[name^='__']")
      .not("[id^='_filter']")
    var data = $fields.formToJSON()

    /*var doctors = data.map(function(doctor) {
               var o = {};
               o[doctor.position] = doctor.positionval;
               return o;
           });*/
    Object.keys(data).forEach(function (element) {
      var internset = element.replace('cltrl', '')

      if (element.includes('_filter')) {
        delete data[element]
      } else {
        datatransformutils.rename(data, element, internset)
      }
    })

    if (ajaxbase.isedit) {
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

        function frame () {
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
  formvalidation: function (argument) {
    var fieldattr = $(argument).attr('data-attribute')

    var internset = {}
    internset.content = argument
    internset.contenttype = fieldattr

    baseobjvalidation.validationinterface(internset)
  }
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

/*multiselect filter params */
let multiselect = {
  searchbarautocomplete: function (baseobj) {
    let internobj = {}
    let internar = []
    let fieldval = $(baseobj).val()
    let fieldname = $(baseobj).data('multipleselect-autocomplete')
    let fieldid = $(baseobj).data('multipleselect-autocomplete-key')

    this.appendautopopulate(baseobj, fieldid)
    baseobj.position = fieldname
    internobj[fieldname] = fieldval.toLowerCase()
    let internbasearh = []
    internar.push(internobj)

    if (basesearchar.length > 0) {
      //check if current search element and discard from metafilter
      internbasearh.push(basesearchar)

      internbasearh = datatransformutils.removeJsonAttrs(internbasearh[0], [
        fieldid
      ])

      internbasearh =
        Object.keys(internbasearh[0]).length == 0 ? [] : internbasearh
      //end region
    }

    filterparam.pageno = 0
    filterparam.pageSize = 20
    filterparam.searchtype = 'Columnwise'
    filterparam.searchparam = internar
    filterparam.searchparamkey = fieldid
    internbasearh = internbasearh.filter(
      value => Object.keys(value).length !== 0
    )

    filterparam.searchparammetafilter = internbasearh
    filterparam.ispaginate = true
    base.datapayload = filterparam

    var internbasesearchar = basesearchar

    basefunction()
      .getpaginatesearchtypegroupby(base)
      .then(function (argument) {
        /*    $("#dv_" + baseobj.position + "").html("");
                   $("#dv_" + baseobj.position + "").show();*/

        $('#dv_' + fieldid + '').html('')
        $('#dv_' + fieldid + '').show()

        let internset = argument.rows

        //remove already selected items from select object !
        if (internbasesearchar.length > 0) {
          var toRem = internbasesearchar.map(function (a) {
            return a[fieldid]
          })[0]

          if (toRem != undefined) {
            internset = internset.filter(
              el => !toRem.includes(el[fieldid].toString().toLowerCase())
            )
          } else {
            console.log(internset)
            console.log('something is undefined ')
          }
        }
        //end region

        let redlime = ''
        internset.forEach(function (obj) {
          redlime +=
            '<div><a class="highlightselect" href=\'javascript:multiselect.onsearchtext("' +
            fieldid +
            '","' +
            obj[fieldname].toString().toLowerCase() +
            '","' +
            obj[fieldid].toString().toLowerCase() +
            '");\'>' +
            obj[fieldname] +
            '  </a></div>'
        })

        var cssfirst =
          '<span class="select2-dropdown select2-dropdown--above" dir="ltr" style="width: 825px;">'
        //$("#dv_" + baseobj.position + "").html(redlime);
        $('#dv_' + fieldid + '').html(redlime)
      })
      .catch(function onError (err) {
        console.log(err)
      })
  },
  appendautopopulate: function (arg, field) {
    var red =
      '<div id="cltrl_filter_chips_' +
      field +
      '">' +
      '</div>' +
      '<div id="dv_' +
      field +
      '" class="srchpara">' +
      '</div>'
    $(red).insertAfter($(arg))
  },
  onsearchtext: function (key, val, valid) {
    $('#dv_' + key).html(' ')
    $('#dv_' + key).hide()
    $('#cltrl_filter_' + key).val('')

    this.assignsearchparams(key, valid)

    $('#cltrl_filter_chips_' + key).append(
      '<div class="selectchips"><span ID="cltrl_filter_span_' +
        key +
        '" onclick=\'javascript:multiselect.removefilterdiv(this,"' +
        key +
        '", "' +
        valid +
        '");\' class="select2choiceremove" role="presentation">×</span>' +
        val.capitalize() +
        '</div>'
    )
  },
  assignsearchparams: function (key, val) {
    var internar = []

    if (isNaN(val)) {
      val = val.toLowerCase()
      internar.push(val)
    } else {
      internar.push(val)
    }

    //UPDATE
    if (
      basesearchar.filter(function (e) {
        return e[key] != undefined
      }).length > 0
    ) {
      var interncon = basesearchar
      interncon = interncon
        .filter(function (e) {
          return e[key] != undefined
        })
        .map(function (doctor) {
          return {
            [key]: doctor[key].concat(val)
          }
        })
      this.updateNameById(basesearchar, key, interncon[0][key])
    } else {
      // ADD
      basesearchobj[key] = internar
      // basesearchobj[key] = {
      //   isArray: true
      // }
      basesearchar.push(basesearchobj)

      basesearchobj = {}
    }
  },

  removefilterdiv: function (argument, key, val) {
    $(argument)
      .parent()
      .remove()

    var interncon = basesearchar
    interncon = interncon
      .filter(function (e) {
        return e[key] != undefined
      })
      .map(function (doctor) {
        return {
          [key]: doctor[key].remByVal(val)
        }
      })

    this.updateNameById(basesearchar, key, interncon[0][key])

    if (interncon[0][key].length <= 0) {
      basesearchar = datatransformutils.removeJsonAttrs(basesearchar, [key])
    }
    basesearchar = basesearchar.filter(value => Object.keys(value).length !== 0)
  },
  fieldfilters: function (arg) {
    if (
      $(arg)
        .children()
        .hasClass('fa-plus')
    ) {
      $('.fieldsfilterbar').slideToggle(300)
      $(arg)
        .children()
        .removeClass('fa-plus')
        .addClass('fa-minus')
    } else {
      $('.fieldsfilterbar').slideToggle(300)
      $(arg)
        .children()
        .removeClass('fa-minus')
        .addClass('fa-plus')
    }
  },
  updateNameById: function (obj, id, value) {
    Object.keys(obj).some(function (key) {
      if (obj[key][id] != undefined) {
        obj[key][id] = value
        return true
      }

      //return true;
    })
  },
  removeFromArray: function (key, val) {
    var interncon = basesearchar
    interncon = interncon
      .filter(function (e) {
        return e[key] != undefined
      })
      .map(function (doctor) {
        return {
          [key]: doctor[key].remByVal(val)
        }
      })

    this.updateNameById(basesearchar, key, interncon[0][key])

    // if (interncon[0][key].length <= 0) {
    //   basesearchar = datatransformutils.removeJsonAttrs(basesearchar, [key]);
    // }
    basesearchar = basesearchar.filter(value => Object.keys(value).length !== 0)
  }
}
/*Modular html populate content for all modules*/
let htmlpopulate = {
  highlightconsolidatesearch: function () {
    var $tableRows = $('#basetable tr')
    var $tableElements = $tableRows.children()
    var txtconsol = $('#txtconsolidatesearch').val()
    if (txtconsol != '') {
      this.highlightTextinHtml(txtconsol)
    }
  },
  htmlpopulatemodal: function () {
    $('#overlaycontent').html(' ')
    base.idstatus = true
    var internsearchbar = baseloadsegments.moduleattributepopulate()

    var htmlcontent = ''
    internsearchbar = validationmap

    internsearchbar.forEach(function (element) {
      htmlcontent +=
        '<div class="form-group overlaytxtalign col-md-5">' +
        '<div class="col-sm-15">' +
        '<label class="lblhide" id="lblmsg' +
        element.inputname +
        '">' +
        '<i class="fa fa-bell-o"></i> Input with warning' +
        '</label>' +
        '<input type="text" data-attribute="' +
        element.fieldvalidatename +
        '" class="form-control" maxLength="' +
        element.fieldmaxlength +
        '"' +
        ' data-form-type="false" onkeyup="javascript:reqops.formvalidation(this)" id="cltrl' +
        element.inputname +
        '" placeholder="' +
        element.inputname.replace('_', ' ').capitalize() +
        '">' +
        '</div></div>'
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
      this.baseCheckbox
    //'<input type="checkbox" id="cltrlrecordstate" onclick="javascript:tableops.onchk(this)" value=true> Remember me' +
    '</label>' + '</div>' + '</div>' + '</div>'

    $('#overlaycontent').html(htmlcontent + chkcontent)
  },
  baseCheckbox: `<div class="checkbox tablechk">
   <label>
   <input type="checkbox" id="cltrlrecordstate" onclick="javascript:tableops.onchk(this)" value=true> Remember me
   <span class="checkbox-material">
   </span> 
   </label>
   </div>`,
  htmlpopulatetableheader: function () {
    $('#basetable thead tr').html('')
    base.idstatus = true
    //var internsearchbar = baseloadsegments.moduleattributepopulate();

    var internsearchbar = applyfields
    var htmlcontent = ''
    var interncontent =
      '<th style="display:none;">ID</th>' +
      '<th style="width: 10%" ;>' +
      '<div class="checkbox tablechk">' +
      '<label>' +
      '<input type="checkbox" id="tblselectallchk" onclick="javascript:tableops.tblselectall();"><span class="checkbox-material"></span> Check all' +
      '</label>' +
      '</div>' +
      '</th>'
    internsearchbar.forEach(function (element) {
      htmlcontent +=
        ' <th onclick="tableops.sort(this)" data-field-header="' +
        element +
        '">' +
        '<span class=" sortorderasc fa fa-fw">' +
        '</span>' +
        element.replace('_', ' ').capitalize() +
        '</th>'
    })
    $('#basetable thead tr').html(interncontent + htmlcontent)
  },
  htmlpopulatefilterbar: function () {
    basesearchar = []
    $('#dvfilterbar  div.fieldsfilterbar').html('')
    $('#dvfilterbar  div.fieldsfilterbarconsolidated').html('')
    base.idstatus = true
    //var internsearchbar = baseloadsegments.moduleattributepopulate();
    var internsearchbar = applyfields
    var htmlcontent = ''
    internsearchbar.forEach(function (element) {
      var onsearchfield = validationmap
        .filter(function (data) {
          return data.inputtextval == element
        })
        .map(function (dt) {
          return dt.inputname
        })[0]

      onsearchfield = onsearchfield != undefined ? onsearchfield : element
      htmlcontent +=
        '<div style="display: inline-block;">' +
        '<input type="text" style="width:45%;" class="form-control"data-multipleselect-autocomplete-key="' +
        onsearchfield +
        '" data-multipleselect-autocomplete="' +
        element +
        '" id="cltrl_filter_' +
        onsearchfield +
        '" oninput="multiselect.searchbarautocomplete(this)" placeholder="' +
        element.replace('_', ' ') +
        '">' +
        /* '<div id="cltrl_filter_chips_' + element + '">' +
                    '</div>' +
                    '<div id="dv_' + element + '" class="srchpara">' +
                    '</div>' +*/
        '</div>'
    })
    $('#dvfilterbar div.fieldsfilterbar').html(htmlcontent)
    $('#dvfilterbar div.fieldsfilterbar').append(
      '<div style="display: inline-block;">' +
        '<div class="zoom-menu">' +
        '<a class="zoom-fab zoom-btn-sm zoom-btn-report scale-transition" onclick="javascript:reqops.srchparams();"><i class="fa fa-bolt"></i></a>' +
        '</div>' +
        '</div>'
    )

    $('#dvfilterbar div.fieldsfilterbarconsolidated').append(
      '<div style="display: inline-block;float:right;">' +
        '<div class="input-group input-group-sm input-group-sm-override" style="width: 150px;">' +
        '<div class="form-group ">' +
        '<input type="text" id="txtconsolidatesearch" name="table_search" class="form-control pull-right" placeholder="Search">' +
        '</div>' +
        '<div class="input-group-btn">' +
        '<button type="submit" onclick="javascript:reqops.consolidatesearch();" class="btn btn-default"><i class="fa fa-search"></i></button>' +
        '</div>' +
        '</div>' +
        '</div>'
    )

    $('#dvfilterbar div.fieldsfilterbarconsolidated').append(
      '<div style="display: inline-block;float: right;padding-right: 30px;">' +
        '<a class="zoom-fab zoom-btn-sm zoom-btn-report scale-transition" onclick="javascript:multiselect.fieldfilters(this)"><i class="fa fa-plus" ></i></a>' +
        '</div>'
    )

    /*for apply date range*/
    internsearchbar.forEach(function (element) {
      if (element.includes('date')) {
        /*for applying date range filter dynamically*/
        //$('#cltrl_filter_birth_date').addClass('datepicker')
        $('#cltrl_filter_birth_date')
          .parent()
          .remove()
      }
    })
  },
  htmlpopulatetable: function (arg) {
    $('#basetable tbody')
      .children()
      .remove()
    var baset = arg.rows
    var rcount = arg.count
    if (rcount > 0) {
      $('#spcurrentPage').html(base.pageno)
      $('#sppageSize').html(base.pageSize)
      $('#sptotalUsers').html(arg.count)
      base.idstatus = false
      base.excludedatecol = false
      // var internsearchbar = baseloadsegments.moduleattributepopulate()
      var internsearchbar = applyfields
      var fielddate = ''
      let keys = internsearchbar.map(o => Object.values(o)).toString()

      var baset = alasql(
        'SELECT ' + internsearchbar + ', ' + [currentmoduleid] + ' FROM ? ',
        [baset]
      )

      var interset = datatransformutils.removeJsonAttrs(baset, ['updated_date'])
      var interset = datatransformutils.removeJsonAttrs(interset, [
        'created_date'
      ])
      var interset = datatransformutils.removeJsonAttrs(interset, [
        'recordstate'
      ])

      var firsts = Object.keys(interset[0]).remove(currentmoduleid)

      for (s of baset) {
        $('#basetable tbody ').append('<tr>')
        var items =
          '<div class="checkbox tablechk" >' +
          '<label>' + //id="tblkchk_' + s[currentmoduleid] + '"
          '<input type="checkbox" data-chk-type="' +
          s[currentmoduleid] +
          '" class="tblkchk"  onclick="javascript:tableops.tablechkbox(' +
          s[currentmoduleid] +
          ')"><span class="checkbox-material"><span class="check"></span></span> ' +
          '</label>' +
          '</div>'
        $('#basetable tbody tr')
          .last()
          .append('<td>' + items + '</td>')
        for (f of firsts) {
          if (f.includes('date')) {
            fielddate = moment(s[f], 'YYYY-MM-DD[T]HH:mm:ss').format(
              'DD MMM YYYY'
            )
          } else {
            fielddate = s[f]
          }

          isStaticMappingCheckpoint =
            validationmap.filter(dt => dt.childcontent != undefined).length <= 0
              ? fielddate
              : datatransformutils.staticValsMapping(f, fielddate)
          $('#basetable tbody tr')
            .last()
            .append('<td>' + isStaticMappingCheckpoint + '</td>')
        }

        $('#basetable tbody tr')
          .last()
          .append(
            '<td  data-tbledit-type="' +
              s[currentmoduleid] +
              '" onclick=javascript:reqops.ontdedit(' +
              s[currentmoduleid] +
              ")><a class='edithover' href='javascript:void(0);'>edit</a></td>"
          )
      }
    }
    this.tblvisiblity()
    basemod_modal.afterhtmlpopulate()
    $('#divreportcontent').show()
  },
  tblvisiblity: function () {
    var theadth = $('#basetable thead th').length
    var tbodytr = $('#basetable tbody tr:eq(0) td').length

    if (tbodytr > 0) {
      var baseitems = datatransformutils.getminusincrement(tbodytr, theadth)

      baseitems.forEach2(function (op) {
        $('#basetable tbody tr td:nth-child(' + op + ')').hide()
      })
    }
  },
  highlightTextinHtml: function (term, base) {
    if (!term) return
    base = $('#basetable')
    var re = new RegExp('(' + RegExp.escape(term) + ')', 'gi')
    var replacement = "<span class='highlightedsearch'>" + term + '</span>'
    $('*', base)
      .contents()
      .each(function (i, el) {
        if (el.nodeType === 3) {
          var data = el.data
          if ((data = data.replace(re, replacement))) {
            var wrapper = $('<span>').html(data)
            $(el)
              .before(wrapper.contents())
              .remove()
          }
        }
      })
  },
  dehighlightinHtml: function (term, base) {
    var text = document.createTextNode(term)
    $('span.highlightedsearch', base).each(function () {
      this.parentNode.replaceChild(text.cloneNode(false), this)
    })
  },
  multiCheckBoxPopulate: function (elem, currentset) {
    return `<div class="custom-control custom-checkbox">
    <label><input type="checkbox" class="custom-control-input" id="cltrl${
      currentset.id
    }${elem[currentset.id]}" 
    onclick="javascript:basemod_modal.on${currentset.name}Control(this)" 
    data-key="${currentset.id}"
    data-val="${elem[currentset.id]}"
    data-attribute="checkboxMulti"
    data-parentVal="${currentset.name}"       
    value="${elem[currentset.id]}">${elem[currentset.text]}
    </label></div>`
  },
  multiCheckboxPopulatePrimary: function (currentset, internhtmlcontent) {
    return `<div class="form-group overlaytxtalign col-md-5" data-attribute="checkboxMulti"  data-form-type="true">
    <div class="col-sm-15">
           <label class="lblhide" id="lblmsg${currentset.id}">
           <i class="fa fa-bell-o"></i> Please select gender
           </label>${internhtmlcontent}</div>
           </div></div>`
  },
  multiCheckBoxPopulateSecondary: function (element) {
    return `<div class="form-group overlaytxtalign col-md-5">
    <div class="col-sm-15">
    <label class="lblhide" id="lblmsg${element.inputname}">
    <i class="fa fa-bell-o"></i>  ${element.inputname} is required
    </label>
    <input type="text" data-attribute="${
      element.fieldvalidatename
    }" class="form-control" maxLength="${element.fieldmaxlength}"
    data-form-type="false" onkeyup="javascript:reqops.formvalidation(this)" id="cltrl${
      element.inputname
    }" placeholder="${element.inputplaceholder.capitalize()}">
    </div></div>`
  },
  genericCheckboxHtml: function (currentmoduleid) {
    return `<input type="hidden" name="${currentmoduleid}" value="0" id="cltrl${currentmoduleid}"> 
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
   </div></label></div></div></div>`
  },
  genericCheckboxHtmlPrimary: function () {
    return `<div class="checkbox tablechk">
   <label>
   <input type="checkbox" id="cltrlrecordstate" onclick="javascript:tableops.onchk(this)" value=true> Remember me
   <span class="checkbox-material">
   </span> 
   </label>
   </div>`
  },
  genericRecordState: function (interncontent, base) {
    if (interncontent[0].recordstate) {
      $('#cltrlrecordstate').prop('checked', true)
      $('#cltrlrecordstate').val(true)
      base.datapayload.recordstate = true
      base.interimdatapayload.recordstate = true
      $('#cltrlrecordstate').removeAttr('data-form-type')
    } else {
      $('#cltrlrecordstate').prop('checked', false)
      $('#cltrlrecordstate').val(false)
      base.datapayload.recordstate = false
      base.interimdatapayload.recordstate = false
    }
    $('#btnbutton').click()
  },
  customRadioPopulate: function (elem, currentset) {
    return `<div class="custom-control custom-radio">
    <label><input type="radio" class="custom-control-input" id="cltrl${
      currentset.id
    }${elem[currentset.id]}" 
    onclick="javascript:basemod_modal.on${currentset.name}Control(this)" 
    data-key="${currentset.id}"
    name="customRadio${currentset.name}"
    data-val="${elem[currentset.id]}"  
    value="${elem[currentset.id]}">${elem[currentset.text]}
    </label></div>`
  },
  customRadioPopulatePrimary: function (currentset, internhtmlcontent) {
    return `<div class='form-group overlaytxtalign col-md-5' onclick="javascript:reqops.formvalidation(this)" data-attribute="radio" data-form-type="true">
    <div class="col-sm-15">
                  <label class="lblhide" id="lblmsg${currentset.id}">
                  <i class="fa fa-bell-o"></i> Please select gender
                  </label>
    ${internhtmlcontent}</div></div>`
  },
  genericMultiControlpayload: function (
    base,
    internim,
    updateIds,
    currentmoduleid
  ) {
    var isactivearrayobj = {
      recordstate: base.interimdatapayload.recordstate
    }
    //flatting multiselects objects
    var temp = Object.fromEntries(
      Object.entries(internim.datapayload).map(([k, v]) => [
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
    if (ajaxbase.isedit) {
      updateIds.forEach(function (dt, i) {
        if (interns[i] == undefined) {
          base.datapayload = {
            delObj: {
              [currentmoduleid]: dt
            }
          }
          basefunction()
            .deleterecord(base)
            .then(function (dt) {})
        } else {
          interns[i][currentmoduleid] = dt
        }
      })
      let a1 = interns
      a1.forEach(function (dt, i) {
        if (Object.keys(dt).includes(currentmoduleid)) {
        } else {
          base.datapayload = dt
          basefunction()
            .singleInsert(base)
            .then(function (dt) {})
          delete interns[i]
        }
      })
      base.datapayload = interns.filter(Boolean)
      return base
    } else {
      let o = {
        payset: interns
      }
      base.datapayload = o
      return base
    }
  }
}
/*ajax api utils POST AND GET method*/
let ajaxutils = {
  basegetmethod: function (ajaxbase) {
    //console.log(base.config);
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ajaxbase.url,
        headers: ajaxbase.getauth,
        method: 'GET',
        dataType: 'json',

        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(xhr)
        }
      })
    })
  },
  basepostmethod: function (ajaxbase) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: 'POST',
        url: ajaxbase.url,
        headers: ajaxbase.postauth.headers,
        //contentType: "application/json",
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(ajaxbase.payload),
        success: function (data) {
          resolve(data)
          //console.log(data)
        },
        error: function (xhr) {
          console.log(xhr)
          reject(xhr)
        }
      })
    })
  },
  basepostmethodrawbody: function (ajaxbase) {
    return new Promise(function (resolve, reject) {
      $.ajax(ajaxbase.url, {
        headers: ajaxbase.postauth.headers,
        //{action:'x',params:['a','b','c']}
        type: 'POST',
        processData: false,
        data: JSON.stringify(ajaxbase.payload),
        contentType: 'multipart/form-data', //typically 'application/x-www-form-urlencoded', but the service you are calling may expect 'text/json'... check with the service to see what they expect as content-type in the HTTP header.

        /*
                          $.ajax({

                              type: "POST",
                              url: ajaxbase.url,
                              headers: ajaxbase.postauth.headers,
                              //contentType: "application/json",
                         

                              contentType: "application/json; charset=UTF-8",
                              
                              data: JSON.stringify(ajaxbase.payload),*/
        success: function (data) {
          resolve(data)
          //console.log(data)
        },
        error: function (xhr) {
          console.log(xhr)
          reject(xhr)
        }
      })
    })
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
    reqops.formvalidation(argument)
  }
}
/*field validation*/
var baseobjvalidation = {
  emailvalidation: function (argument) {
    validation = new RegExp(validations['email'][0])
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'control-label-format')
      $(argument).attr('data-form-type', 'true')
    } else {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'hide')
      $(argument).removeAttr('data-form-type')
    }
  },
  numbervalidation: function (argument) {
    validation = new RegExp(validations['number'][0])
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'control-label-format')
      $(argument).attr('data-form-type', 'true')
    } else {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'hide')
      $(argument).removeAttr('data-form-type')
    }
  },
  mobilevalidation: function (argument) {
    validation = new RegExp(validations['mobile'][0])
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'control-label-format')
      $(argument).attr('data-form-type', 'true')
    } else {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'hide')
      $(argument).removeAttr('data-form-type')
    }
  },
  passwordvalidation: function (argument) {
    validation = new RegExp(validations['password_set1'][0])
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'control-label-format')

      $(argument).attr('data-form-type', 'true')
    } else {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'hide')
      $(argument).removeAttr('data-form-type')
    }
  },
  textvalidation: function (argument) {
    validation = new RegExp(validations['string'][0])
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'control-label-format')
      $(argument).attr('data-form-type', 'true')
    } else {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'hide')
      $(argument).removeAttr('data-form-type')
    }
  },
  checkboxvalidation: function (argument) {
    if ($(argument).is(':checked')) {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'hide')
      $(argument).removeAttr('data-form-type')
    } else {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'control-label-format')
      $(argument).attr('data-form-type', 'true')
    }
  },
  checkboxvalidationMulti: function (argument) {
    if ($(argument).is(':checked')) {
      $(argument)
        .parents(':eq(2)')
        .find('.control-label-format')
        .attr('class', 'lblhide')
      $(argument)
        .parents(':eq(4)')
        .find(`.form-group`)
        .removeAttr('data-form-type')
    } else {
      if (this.checkboxvalidationSecondary(argument)) {
        $(argument)
          .parents(':eq(2)')
          .find('.lblhide')
          .attr('class', 'control-label-format')
        $(argument)
          .parents(':eq(4)')
          .find(`.form-group`)
          .attr('data-form-type', 'true')
      }
      //console.log([namesake].data[$(argument).attr("data-key")].length)
    }
  },
  checkboxvalidationSecondary: function (argument) {
    var namesake = `current${$(argument).attr('data-parentVal')}`
    var condt = eval(namesake).data[$(argument).attr('data-key')].length

    if (condt <= 0) {
      return true
    } else {
      return false
    }
  },
  radiovalidation: function (argument) {
    $(argument).removeAttr('data-form-type')
    validationListener()
  },
  genvalidation: function (argument) {
    if (argument.value == '') {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'hide')
      $(argument).removeAttr('data-form-type')
    } else {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'control-label-format')
      $(argument).attr('data-form-type', 'true')
    }
  },
  multiSelectValidation: function (argument) {
    var fieldattr = $(argument).attr('data-key')

    if (
      Array.isArray(multiselects[fieldattr]) &&
      multiselects[fieldattr].length
    ) {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'hide')
      $(argument).removeAttr('data-form-type')
    } else {
      $(argument)
        .parent()
        .find('label')
        .attr('class', 'control-label-format')
      $(argument).attr('data-form-type', 'true')
    }
  },
  validationinterface: function (internset) {
    switch (internset.contenttype) {
      case 'email':
        this.emailvalidation(internset.content)
        break
      case 'number':
        this.numbervalidation(internset.content)
        break
      case 'mobile':
        this.mobilevalidation(internset.content)
        break
      case 'string':
        this.textvalidation(internset.content)
        break
      case 'checkbox':
        this.checkboxvalidation(internset.content)
        break
      case 'checkboxMulti':
        this.checkboxvalidationMulti(internset.content)
        break
      case 'radio':
        this.radiovalidation(internset.content)
        break
      case 'passwordvalidation':
        this.passwordvalidation(internset.content)
        break
      case 'multiSelect':
        this.multiSelectValidation(internset.content)
        break
      default:
        this.genvalidation(internset.content)
    }
  }
}

/*page load functions*/
let baseloadsegments = {
  initialdatatableload: function () {
    //filterparam.colsearch = "createdAt";

    filterparam.searchparam = ['NA']
    filterparam.searchtype = 'NoFilter'
    filterparam.daterange = datefilter
    base.pageno = base.pageno === undefined ? 0 : base.pageno
    base.pageSize = base.pageSize === undefined ? 20 : base.pageSize
    filterparam.pageno = base.pageno
    filterparam.pageSize = base.pageSize
    filterparam.datecolsearch = base.datecolsearch
    base.datapayload = filterparam

    $('#dvreportcontainer').show()
    $('#dvparentfilterbar').show()
    $('#dvreportcontainer').addClass('loading-report-container')
    basefunction()
      .getpaginatesearchtype(base)
      .then(function (argument) {
        //console.log(argument);

        htmlpopulate.htmlpopulatetable(argument)
        basepagination.bootpagination(argument)

        if ($('#dvreportcontainer').hasClass('collapsed-box')) {
          $('#rptwidget').click()
        }
        $('#dvreportcontainer').removeClass('loading-report-container')
      })
    /* var data = angular
         .element(document.querySelector('[ng-controller="baseController"]'))
         .scope()
         .pagingsearchtype();*/
  },
  getapptoken: function (ajaxbase) {
    basedataset.appkey = base.appkey
    //setting up url for api
    ajaxbase.url = ajaxurl.auth
    ajaxbase.payload = basedataset

    return new Promise(function (resolve, reject) {
      //  console.log(ajaxutils);
      ajaxutils
        .basepostmethod(ajaxbase)
        .then(baseloadsegments.setconfig)
        .then(function (argument) {
          resolve(argument)
        })
        .catch(function onError (err) {
          console.log(err)
        })
    })
  },
  setconfig: function (data) {
    return new Promise(function (resolve, reject) {
      //base.config["headers"]["x-access-token"] = data.token;
      ajaxbase.postauth['headers']['x-access-token'] = data.token
      //ajaxbase.postauth = base.config;

      resolve(ajaxbase)
    })
  },
  moduleattributepopulate: function () {
    var jsonintern = moduleattributes.split(',')

    jsonintern
      .remove('updated_date')
      .remove('created_date')
      .remove('recordstate')
    if (base.idstatus) {
      jsonintern.remove(currentmoduleid)
    }
    if (base.excludedatecol) {
      //var searchString = "%date%";
      // var res = alasql('SELECT COLUMN * FROM [?] WHERE [0] LIKE ?', [jsonintern, searchString]);
      var res = jsonintern.filter(function (item) {
        return !item.includes('date')
      })
      jsonintern = res
      /*console.log(res);
               res.forEach(function(argument) {
                   jsonintern.remove(argument);
               })*/
    }

    return jsonintern
  },
  populateaxiskeys: function () {
    base.idstatus = true
    base.excludedatecol = false
    //base.moduleattributes = baseloadsegments.moduleattributepopulate();
    base.moduleattributes = applyfields
    $('#selxaxis').append('<option></option>')
    base.moduleattributes.forEach(function (element) {
      $('#selxaxis').append(
        '<option value = ' +
          element +
          '>' +
          element.replace('_', ' ').capitalize() +
          '</option>'
      )
    })
    $('#selxaxis').select2({
      placeholder: 'Select a horizontal ( xaxis ) paramaters',
      allowClear: true
    })
    $('#selyaxis').append('<option></option>')
    base.moduleattributes.forEach(function (element) {
      $('#selyaxis').append(
        '<option value = ' +
          element +
          '>' +
          element.replace('_', ' ').capitalize() +
          '</option>'
      )
    })
    $('#selyaxis').select2({
      placeholder: 'Select a vertical ( yaxis ) paramaters',
      allowClear: true
    })
    /*for date filtes for date range*/
    var jsonintern = moduleattributes.split(',')

    /*        var searchString = "%date%";
                 console.log(jsonintern)      
                   var res = alasql('SELECT COLUMN * FROM [?] WHERE [0] LIKE ?', [jsonintern, searchString]);
                  console.log(res)
                   var searchString = "%update%";
  
                   var res = alasql('SELECT COLUMN * FROM [?] WHERE [0] NOT LIKE ?', [res, searchString]);
                   console.log(res)
  
           */
    var arr = jsonintern.filter(function (item) {
      return item.includes('date')
    })
    var res = arr.filter(function (item) {
      return !item.includes('update')
    })

    $('#seldatefields').append('<option></option>')
    res.forEach(function (element) {
      $('#seldatefields').append(
        '<option value = ' +
          element +
          '>' +
          element.replace('_', ' ').capitalize() +
          '</option>'
      )
    })
    $('#seldatefields').select2({
      placeholder: 'Select date field',
      allowClear: true
    })
    $('#seldatefields').val('created_date') // Select the option with a value of 'US'
    $('#seldatefields').trigger('change')
  },
  basePopulateMultiControlsPopulate: function (validationmap, keys) {
    return validationmap
      .filter(function (doctor) {
        return doctor.inputtypemod == keys // if truthy then keep item
      })
      .map(function (doctor) {
        return doctor.inputtypeVal
      })[0]
  },
  basePopulateMultiControls: function (key) {
    return {
      searchparam: [
        {
          [key]: ''
        }
      ],
      searchparamkey: key,
      searchtype: 'Columnwise',
      searchparammetafilter: []
    }
  }
}
/*get access token*/
// baseloadsegments.getapptoken(ajaxbase).then(arg => {
//   console.log(arg);
// });

function payloadprepared () {
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
let datatransformutils = {
  findAndRemove: function (array, property, value) {
    array.forEach(function (result, index) {
      if (result[property] === value) {
        //Remove from array
        array.splice(index, 1)
      }
    })
  },
  staticValsMapping: function (f, fielddate) {
    var re = validationmap
    var r1 = re.filter(dt => dt.inputtypemod == f)

    if (Array.isArray(r1) && r1.length) {
      if (r1[0].childcontent != undefined) {
        var r2 = fielddate.includes(',') ? fielddate.split(',') : fielddate

        var redlime = []
        if (Array.isArray(r2) && r2.length) {
          r2.forEach(function (dt) {
            redlime.push(
              r1[0].childcontent.filter(dt1 => dt1.val == dt)[0].text
            )
          })
          return redlime.join(',')
        } else {
          return r1[0].childcontent.filter(dt1 => dt1.val == r2)[0].text
        }
      }
    } else {
      return fielddate
    }
  },
  rename: function (obj, oldName, newName) {
    if (!obj.hasOwnProperty(oldName)) {
      return false
    }

    obj[newName] = obj[oldName]
    delete obj[oldName]
    return true
  },
  removeJsonAttrs: function (json, attrs) {
    return JSON.parse(
      JSON.stringify(json, function (k, v) {
        return attrs.indexOf(k) !== -1 ? undefined : v
      })
    )
  },
  getCartesian: function (object) {
    return Object.entries(object).reduce(
      (r, [k, v]) => {
        var temp = []
        r.forEach(s =>
          (Array.isArray(v) ? v : [v]).forEach(w =>
            (w && typeof w === 'object'
              ? datatransformutils.getCartesian(w)
              : [w]
            ).forEach(x => temp.push(Object.assign({}, s, { [k]: x })))
          )
        )
        return temp
      },
      [{}]
    )
  },
  flat: v =>
    v && typeof v === 'object'
      ? Object.values(v).flatMap(datatransformutils.flat)
      : v,
  getparentchildAR: function (r1) {
    var key = Object.keys(r1[0])[0]
    var o = {
      [key]: r1.map(a => a[key])
    }
    return o
  },
  isNumberKey: function (evt) {
    var charCode = evt.which ? evt.which : evt.keyCode
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false

    return true
  },
  editMultiSelect: function (obj) {
    var a1 = obj.validationmap.filter(dt => dt.inputtype == 'multiselect')
    var res = obj.content.map(function (data) {
      return a1.map(function (da) {
        var inten = {}

        obj.multiselectfunc[da.inputtextval].destroy(da.inputtextval)
        if (data[da.inputCustomMapping].indexOf(',') != -1) {
          /**check and assign values to multiselect control */
          if (isNaN(parseInt(data[da.inputname].split(',')[0]))) {
            multiselects[da.inputname] = [
              {
                [da.inputtextval]: data[da.inputname].split(',')
              }
            ]
          } else {
            multiselects[da.inputname] = [
              {
                [da.inputtextval]: data[da.inputname].split(',').map(Number)
              }
            ]
          }

          /**end region */
          inten[da.inputtextval] = data[da.inputCustomMapping]
            .split(',')
            .map(function (dt, i) {
              return {
                key: da.inputtextval,
                text:
                  da.childcontent != undefined
                    ? datatransformutils.staticValsMapping(
                        da.inputCustomMapping,
                        dt
                      )
                    : dt,
                vals: isNaN(parseInt(data[da.inputname].split(',')[i]))
                  ? data[da.inputname].split(',')[i]
                  : parseInt(data[da.inputname].split(',')[i])
              }
            })
        } else {
          if (isNaN(parseInt(data[da.inputname]))) {
            multiselects[da.inputname] = [
              {
                [da.inputtextval]: [data[da.inputname]]
              }
            ]
          } else {
            multiselects[da.inputname] = [
              {
                [da.inputtextval]: [parseInt(data[da.inputname])]
              }
            ]
          }

          inten[da.inputtextval] = {
            key: da.inputtextval,
            text:
              da.childcontent != undefined
                ? datatransformutils.staticValsMapping(
                    da.inputCustomMapping,
                    data[da.inputCustomMapping]
                  )
                : data[da.inputCustomMapping],
            vals: isNaN(parseInt(data[da.inputname]))
              ? data[da.inputname]
              : parseInt(data[da.inputname])
            //vals: y
          }
        }

        return inten
      })
    })[0]

    res.forEach(function (dat) {
      Object.values(dat).forEach(function (dt) {
        if (Array.isArray(dt)) {
          dt.forEach(function (dt1) {
            obj.multiselectfunc[Object.keys(dat)[0]].onsearchtext(dt1)
          })
        } else {
          obj.multiselectfunc[Object.keys(dat)[0]].onsearchtext(dt)
        }
      })
    })
  },
  getminusincrement: function (a, b) {
    var ars = []
    var N = parseInt(a - b)
    var ar = [...Array(N).keys()]
    ar.forEach(function (element) {
      ars.push(parseInt((a -= 1)))
    })
    return ars
  },
  addArrayinJson: function (filterparam, key, val) {
    var a = []
    a.push(val)
    var o = {}
    o[key] = a
    var filt = filterparam.filter(function (dr) {
      return Object.keys(dr).find(x => x == key)
    })
    if (filt.length > 0) {
      filterparam = filt.map(function (dr) {
        dr[key].push(val)
        return dr
      })
    } else {
      filterparam.push(o)
    }

    return filterparam
  }
}
const equijoin = (xs, ys, primary, foreign, sel) => {
  const ix = xs.reduce((ix, row) => ix.set(row[primary], row), new Map())
  return ys.map(row => sel(ix.get(row[foreign]), row))
}
if (!String.prototype.contains) {
  String.prototype.contains = function () {
    return String.prototype.indexOf.apply(this, arguments) !== -1
  }
}
Array.prototype.exclude = function (list) {
  return this.filter(function (el) {
    return list.indexOf(el) < 0
  })
}
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax
  while (L && this.length) {
    what = a[--L]
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1)
    }
  }
  return this
}

Array.prototype.moveUp = function (value, by) {
  var index = this.indexOf(value),
    newPos = index - (by || 1)

  if (index === -1) throw new Error('Element not found in array')

  if (newPos < 0) newPos = 0

  this.splice(index, 1)
  this.splice(newPos, 0, value)
}
String.prototype.capitalize = function () {
  return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
    return p1 + p2.toUpperCase()
  })
}
Array.prototype.remByVal = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val) {
      this.splice(i, 1)
      i--
    }
  }
  return this
}
const doChunk = (list, size) =>
  list.reduce(
    (r, v) =>
      (!r.length || r[r.length - 1].length === size
        ? r.push([v])
        : r[r.length - 1].push(v)) && r,
    []
  )
Array.prototype.forEach2 = function (a) {
  var l = this.length
  for (var i = 0; i < l; i++) a(this[i], i)
}

Array.prototype.map2 = function (a) {
  var l = this.length
  var array = new Array(l),
    i = 0
  for (; i < l; i++) {
    array[i] = a(this[i], i)
  }
  return array
}
$.fn.formToJSON = function () {
  var out = {}

  var cleanValue = function ($f) {
    var v = $f.val() || ''
    // clean values?
    return v
  }

  var pushValue = function (o, id, v) {
    if (o[id] != null) {
      if (!o[id].push) {
        o[id] = [o[id]]
      }

      if (v.includes('[')) {
        v = isNaN(parseInt(v)) ? v : parseInt(v)
        o[id].push(JSON.parse(v)[0])
      } else {
        o[id].push(v)
      }
    } else {
      if (v.includes('[')) {
        v = isNaN(parseInt(v)) ? v : parseInt(v)
        o[id] = JSON.parse(v)
      } else {
        o[id] = v
      }
    }
  }

  var pushLevel = function (o, list, v) {
    var id = list.shift()
    if (list.length == 0) {
      pushValue(o, id, v)
    } else {
      if (o[id] == null) {
        o[id] = {}
      }
      pushLevel(o[id], list, v)
    }
  }

  this.each(function (i, f) {
    var v = cleanValue($(f))
    var idList = f.id.replace(/:\d*/g, '').split('.')

    pushLevel(out, idList, v)
  })
  return out
}
RegExp.escape = function (text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

/*end region */

let cartesianProduct = function (arr) {
  return arr.reduce(
    function (a, b) {
      return a
        .map(function (x) {
          return b.map(function (y) {
            return x.concat(y)
          })
        })
        .reduce(function (a, b) {
          return a.concat(b)
        }, [])
    },
    [[]]
  )
}
