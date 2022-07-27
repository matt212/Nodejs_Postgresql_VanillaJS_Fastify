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