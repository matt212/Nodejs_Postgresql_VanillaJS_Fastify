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