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
          ' data-form-type="false" onkeyup="javascript:reqopsValidate.formvalidation(this)" id="cltrl' +
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
    }
  }