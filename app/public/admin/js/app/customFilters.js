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