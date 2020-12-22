let Promises = require('bluebird')
var supertest = require('supertest')
var should = require('chai').should()
var expect = require('chai').expect
let tokenvalEval
let loadModulePayLoad = {
  searchparam: ['NA'],
  pageno: 0,
  pageSize: 20,
  disableDate: true,
  searchtype: 'NoFilter'
}
let PivotloadModulePayLoad = {
  searchparam: ['NA'],
  pageno: 0,
  pageSize: 20,
  disableDate: true,
  searchtype: 'NoFilter',
  pivotparamXaxis: 'birth_date',
  pivotparamYaxis: 'gender',
  timeinternprimary: '',
  timeinternsecondary: 'Month',
  XpageSize: 40,
  Xpageno: 0,
  YpageSize: 20,
  Ypageno: 0
}
before(async () => {
  require('../app.js')
})
/**daterange: {
    startdate: '1982-12-30',
    enddate: '2019-01-29'
  },
  datecolsearch: 'birth_date', */
//./utils/dependentVariables
let dep = require('../../../app/routes/utils/dependentVariables').routeUrls
let datatransformutils = require('../../../app/routes/utils/dependentVariables')
  .datatransformutils
let createModulePayLoad = require('./makePayLoad.js')
// This agent refers to PORT where program is running.

var server = supertest.agent('http://localhost:3011')

// UNIT test begin
let createModPayLoad = function (validationConfig) {
  return createModulePayLoad.makepayload(validationConfig)
}
let customMultiInsertDelete = function (testbase, evalModulename) {
  let o = {}
  o.multiInsert = function (entry) {
    return new Promise((resolve, reject) => {
      testbase.apiUrl = '/' + evalModulename + dep.create
      testbase.responseCode = 200
      testbase.payload = entry
console.log(testbase)
      genericApiPost(testbase).then(function (data) {
        resolve(data.body.createdId)
      })
    })
  }
  o.multiDel = function (DelAr) {
    var delObj = { [testbase.evalModulename + 'id']: DelAr }

    return new Promise((resolve, reject) => {
      testbase.apiUrl = '/' + evalModulename + dep.delete
      testbase.responseCode = 200
      testbase.payload = delObj
      genericApiPost(testbase).then(function (data) {
        resolve(data)
      })
    })
  }

  o.multiInsertforSearch = function (createdID) {
    if (createdID != undefined) {
      o.singleInsertID = createdID
    }

    return new Promise((resolve, reject) => {
      Promises.mapSeries(testbase.schemaBaseValidatorPayloadAr, o.multiInsert)
        .then(a => {
          a.singleInsertID = o.singleInsertID
          resolve(a)
        })
        .catch(err => console.log(err))
    })
  }
  o.multiDelete = function (ar) {
    return new Promise((resolve, reject) => {
      Promises.mapSeries(ar, o.multiDel).then(a => {
        //console.log(a)
        resolve(a)
      })
    })
  }
  return o
}
let customTestsInit = function (testbase, validationConfig) {
  testbase.schemaBaseValidatorPayload = createModPayLoad(validationConfig)

  /*Generate multi insert payloads by passing second parameter as number recordset to generate*/
  testbase.schemaBaseValidatorPayloadAr = genPayloadByNum(validationConfig, 2)

  /*Schema validatior with removing one by ony fields*/
  testbase.schemaValValidatorPayload = schemaValueValidatorPayload(
    validationConfig.applyfields,
    testbase.schemaBaseValidatorPayload
  )
  /*Schema validatior with blank fields one by ony fields*/
  testbase.schemaValValidatorPayloadBlank = schemaValueValidatorPayloadBlank(
    validationConfig.applyfields,
    testbase.schemaBaseValidatorPayload
  )
  /*Schema validatior with Max  fields validations one by ony fields*/
  testbase.schemaValValidatorPayloadMaxLenght = schemaValValidatorPayloadMaxLenght(
    validationConfig.applyfields,
    testbase.schemaBaseValidatorPayload
  )
  return testbase
}
let loginsuccess = function (cred) {
  return (promise = new Promise((resolve, reject) => {
    var user = cred
    server
      .post('/login')
      .send(user)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          resolve({ status: 'fail', content: err })
        }

        res.body.status.should.equal('success')
        res.body.redirect.should.equal('/' + evalModulename)
        resolve({ status: 'pass' })
      })
  }))
}
let setevalModulename = function (data) {
  evalModulename = data
}
let genericApiPost = function (data) {
  return (promise = new Promise((resolve, reject) => {
    server
      .post(data.apiUrl)
      .send(data.payload)
      .set('x-access-token', data.token)
      .expect('Content-type', /json/)
      .expect(data.responseCode)
      .end(function (err, res) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(res)
        }
      })
  }))
}
let schemavalidatorPayload = function (baseapplyFields) {
  var interimAr = []
  var internprimaryAr = baseapplyFields

  baseapplyFields.forEach(function (entry) {
    internprimaryAr = internprimaryAr.filter(item => item !== entry)
    interimAr.push({
      key: entry,
      content: datatransformutils.arraytoJSON(internprimaryAr)
    })
    internprimaryAr = baseapplyFields
  })
  return interimAr
}
let schemaValueValidatorPayload = function (baseapplyFields, baseObj) {
  var interimAr = []
  var baseinterncontent = baseObj
  baseapplyFields.forEach(function (entry) {
    interimAr.push({
      key: entry,
      schemaContent: datatransformutils.removefieldObj(baseinterncontent, entry)
    })
    baseinterncontent = {}
    baseinterncontent = baseObj
  })
  return interimAr
}
let schemaValueValidatorPayloadBlank = function (baseapplyFields, baseObj) {
  var interimAr = []
  baseapplyFields.forEach(function (entry) {
    var o = datatransformutils.updateJSONByKEY(baseObj, entry, '')
    interimAr.push({ key: entry, schemaContent: o })
  })

  return interimAr
}
let multicolumngenAr = function (baseObj, fieldname) {
  let interim3 = datatransformutils.multicolumnSearchFilter(baseObj)

  interim3 = interim3.filter(function (a) {
    return a.key == fieldname // if truthy then keep item
  })[0]

  return interim3.content
}
let schemaValValidatorPayloadMaxLenght = function (baseapplyFields, baseObj) {
  var interimAr = []
  baseapplyFields.forEach(function (entry) {
    var o = datatransformutils.updateJSONByKEY(
      baseObj,
      entry,
      createModulePayLoad.makeMaxlenghtpayload(baseObj, entry)
    )
    interimAr.push({ key: entry, schemaContent: o })
  })

  return interimAr
}
let genPayloadByNum = function (validationConfig, num) {
  var interim = []
  for (i = 0; i <= num - 1; i++) {
    interim.push(createModPayLoad(validationConfig))
  }
  return interim
}
let PrimarytestInit = function (testbase) {
  return new Promise((resolve, reject) => {
    FirstTimeloadCurrentModule()
      .then(loginsuccess)
      .then(loadCurrentModule)
      .then(function (data) {
        testbase.token = data
        console.log(
          '****************login and loaded the module  successfully****************'
        )
        customMultiInsertDelete(testbase, testbase.evalModulename)
          .multiInsert(testbase.schemaBaseValidatorPayload)
          .then(
            customMultiInsertDelete(testbase, testbase.evalModulename)
              .multiInsertforSearch
          )
          .then(function (data) {
            console.log('*****Multi Records are inserted sucessfully*****')
            testbase.DelAr = data

            testbase.singleInsertID = data.singleInsertID
            resolve(testbase)
          })
      })
  })
}
let dataCleanUp = function (testbase) {
  return new Promise((resolve, reject) => {
    if (testbase.singleInsertID != undefined) {
      testbase.DelAr.push(testbase.singleInsertID)
    }
    if (testbase.InsertID != undefined) {
      testbase.DelAr.push(testbase.InsertID)
    }
    customMultiInsertDelete(testbase, testbase.evalModulename)
      .multiDelete(testbase.DelAr)
      .then(function (data) {
        console.log('<<<<<<<data cleanUp Completed>>>>>>>')
        server.post('/logout').end(function (err, data) {
          if (err) return done(err)
          console.log('****************logout successfully****************')

          data.statusCode.should.equal(200)
          data.body.status.should.equal('success')
          data.body.redirect.should.equal('/login')
          resolve('success')
        })
      })
  })
}
let validationconfigInit = function (validationConfig) {
  validationConfig.applyfields.push('recordstate')
  var recordstateobj = {
    inputname: 'recordstate',
    fieldtypename: 'boolean',
    fieldvalidatename: 'boolean',
    fieldmaxlength: '4'
  }
  validationConfig.validationmap.push(recordstateobj)
  return validationConfig
}
let FirstTimeloadCurrentModule = function (data) {
  return (promise = new Promise((resolve, reject) => {
    server.post('/logout').end(function (err, data) {
      server
        .get('/' + evalModulename)
        //.expect('Content-type', /text\/html/)
        .end(function (err, res) {
          if (err) {
            console.log(err)
            reject(err)
          }

          data.statusCode.should.equal(302)
          // data.body.status.should.equal('success')
          // data.body.redirect.should.equal('/login')
          resolve((cred = { username: 'krennic', password: 'orson' }))
        })
    })
  }))
}
let loadCurrentModule = function (data) {
  return (promise = new Promise((resolve, reject) => {
    if (data.status == 'pass') {
      server
        .get('/' + evalModulename)
        .expect('Content-type', /text\/html/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            console.log(err)
            reject(err)
          }

          resolve(res.headers['x-token'])
        })
    } else {
      resolve('fail')
    }
  }))
}
let consolidatedPayload = function () {
  let o = {}
  o.payload1 = function (testbase, entry, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.create
    testbase.responseCode = 400
    testbase.payload = entry.schemaContent

    return testbase
  }
  o.payload2 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.create
    testbase.responseCode = 200
    testbase.payload = testbase.schemaBaseValidatorPayload

    return testbase
  }
  o.payload3 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.update
    testbase.responseCode = 400
    testbase.payload = testbase.schemaBaseValidatorPayload
    return testbase
  }
  o.payload4 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.update
    testbase.responseCode = 400
    testbase.schemaBaseValidatorPayload[testbase.evalModulename + 'id'] = NaN
    testbase.payload = testbase.schemaBaseValidatorPayload
    return testbase
  }
  o.payload5 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.update
    testbase.responseCode = 400
    testbase.schemaBaseValidatorPayload[
      testbase.evalModulename + 'id'
    ] = undefined
    testbase.payload = testbase.schemaBaseValidatorPayload
    return testbase
  }
  o.payload6 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.update
    testbase.responseCode = 200
    testbase.schemaBaseValidatorPayload[testbase.evalModulename + 'id'] =
      testbase.InsertID
    testbase.payload = testbase.schemaBaseValidatorPayload
    return testbase
  }
  o.payload7 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    var o = JSON.parse(JSON.stringify(loadModulePayLoad))
    o.disableDate = true
    testbase.payload = o
    testbase.responseCode = 200
    return testbase
  }
  o.payload8 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    var o = JSON.parse(JSON.stringify(loadModulePayLoad))
    o.daterange = {
      startdate: NaN,
      enddate: '2019-01-29'
    }
    o.disableDate = false
    testbase.payload = o
    testbase.responseCode = 400
    return testbase
  }
  o.payload9 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    var o = JSON.parse(JSON.stringify(loadModulePayLoad))
    o.daterange = {
      startdate: '1982-01-29',
      enddate: NaN
    }
    o.disableDate = false
    testbase.payload = o
    testbase.responseCode = 400
    return testbase
  }
  ;(o.payload10 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    var o = JSON.parse(JSON.stringify(loadModulePayLoad))
    o.daterange = {
      startdate: undefined,
      enddate: '1982-01-29'
    }
    o.disableDate = false
    testbase.payload = o
    testbase.responseCode = 400
    return testbase
  }),
    (o.payload11 = function (testbase, evalModulename) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      var o = JSON.parse(JSON.stringify(loadModulePayLoad))
      o.daterange = {
        startdate: '1982-01-29',
        enddate: undefined
      }
      o.disableDate = false
      testbase.payload = o
      testbase.responseCode = 400
      return testbase
    }),
    (o.payload12 = function (testbase, evalModulename) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      var o = JSON.parse(JSON.stringify(loadModulePayLoad))
      o.pageSize = NaN
      testbase.payload = o
      testbase.responseCode = 400
      return testbase
    }),
    (o.payload13 = function (testbase, evalModulename) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      var o = JSON.parse(JSON.stringify(loadModulePayLoad))
      o.pageSize = undefined
      testbase.payload = o
      testbase.responseCode = 400
      return testbase
    }),
    (o.payload14 = function (testbase, evalModulename) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      var o = JSON.parse(JSON.stringify(loadModulePayLoad))
      o.pageno = undefined
      testbase.payload = o
      testbase.responseCode = 400
      return testbase
    }),
    (o.payload15 = function (testbase, evalModulename) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      var o = JSON.parse(JSON.stringify(loadModulePayLoad))
      o.daterange = {
        startdate: '1982-01-29',
        enddate: '1982-01-29'
      }
      o.datecolsearch = NaN
      o.disableDate = false
      testbase.payload = o
      testbase.responseCode = 400
      return testbase
    }),
    (o.payload16 = function (testbase, evalModulename) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      var o = JSON.parse(JSON.stringify(loadModulePayLoad))
      o.daterange = {
        startdate: '1982-01-29',
        enddate: '1982-01-29'
      }
      o.datecolsearch = undefined
      o.disableDate = false
      testbase.payload = o
      testbase.responseCode = 400
      return testbase
    }),
    (o.payload17 = function (
      testbase,
      entry,
      evalModulename,
      validationConfig
    ) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      testbase.responseCode = 200
      var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

      let fieldtype = validationConfig.validationmap.filter(
        o1 => o1.inputname == entry
      )[0].fieldtypename

      if (fieldtype == 'DATE') {
        o1.daterange = {
          startdate: new Date(
            testbase.schemaBaseValidatorPayload[entry]
          ).toLocaleDateString(),
          enddate: new Date(
            testbase.schemaBaseValidatorPayload[entry]
          ).toLocaleDateString()
        }
        o1.datecolsearch = entry
        o1.disableDate = false
      } else if (
        fieldtype == 'boolean' ||
        fieldtype == 'BIGINT' ||
        fieldtype == 'INTEGER'
      ) {
        o1.searchparam = [
          {
            [entry]: [testbase.schemaBaseValidatorPayload[entry]]
          }
        ]
        o1.disableDate = true
        o1.searchtype = 'Columnwise'
      } else if (fieldtype == 'STRING') {
        let interimval = testbase.schemaBaseValidatorPayload[entry]

        o1.searchparam = [
          {
            [entry]: [interimval.toLowerCase()]
          }
        ]
        o1.disableDate = true
        o1.searchtype = 'Columnwise'
      }

      testbase.payload = o1
      return testbase
    }),
    (o.payload18 = function (
      testbase,
      entry,
      evalModulename,
      validationConfig
    ) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      testbase.responseCode = 200
      var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

      let fieldtype = validationConfig.validationmap.filter(
        o1 => o1.inputname == entry
      )[0].fieldtypename

      if (fieldtype == 'DATE') {
        o1.daterange = {
          startdate: new Date(
            testbase.schemaBaseValidatorPayloadAr[0][entry]
          ).toLocaleDateString(),
          enddate: new Date(
            testbase.schemaBaseValidatorPayloadAr[0][entry]
          ).toLocaleDateString()
        }
        o1.datecolsearch = entry
        o1.disableDate = false
      } else if (
        fieldtype == 'boolean' ||
        fieldtype == 'BIGINT' ||
        fieldtype == 'INTEGER'
      ) {
        o1.searchparam = [
          {
            [entry]: [
              testbase.schemaBaseValidatorPayloadAr[0][entry],
              testbase.schemaBaseValidatorPayloadAr[1][entry]
            ]
          }
        ]
        o1.disableDate = true
        o1.searchtype = 'Columnwise'
      } else if (fieldtype == 'STRING') {
        let interimval1 = testbase.schemaBaseValidatorPayloadAr[0][entry]
        let interimval2 = testbase.schemaBaseValidatorPayloadAr[1][entry]

        o1.searchparam = [
          {
            [entry]: [interimval1.toLowerCase(), interimval2.toLowerCase()]
          }
        ]
        o1.disableDate = true
        o1.searchtype = 'Columnwise'
      }
      testbase.payload = o1
      return testbase
    }),
    (o.payload19 = function (
      testbase,
      entry,
      evalModulename,
      validationConfig
    ) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      testbase.responseCode = 200
      var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

      let fieldtype = validationConfig.validationmap.filter(
        o1 => o1.inputname == entry
      )[0].fieldtypename

      if (fieldtype == 'DATE') {
        o1.daterange = {
          startdate: new Date(
            testbase.schemaBaseValidatorPayload[entry]
          ).toLocaleDateString(),
          enddate: new Date(
            testbase.schemaBaseValidatorPayload[entry]
          ).toLocaleDateString()
        }
        o1.datecolsearch = entry
        o1.disableDate = false
      } else if (fieldtype == 'boolean') {
        /*there cannot be multi boolean Filter */
      } else {
        o1.searchparam = multicolumngenAr(
          testbase.schemaBaseValidatorPayload,
          entry
        )

        o1.disableDate = true
        o1.searchtype = 'Columnwise'
      }
      testbase.payload = o1
      return testbase
    }),
    (o.payload20 = function (testbase, evalModulename, validationConfig) {
      testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
      testbase.responseCode = 200
      var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))
      Object.keys(testbase.schemaBaseValidatorPayload)[0]
      var searchVal =
        testbase.schemaBaseValidatorPayload[
          Object.keys(testbase.schemaBaseValidatorPayload)[0]
        ]
      searchVal = searchVal.substring(0, 3)
      o1.basesearcharconsolidated = [
        {
          consolidatecol: validationConfig.applyfields,
          consolidatecolval: searchVal
        }
      ]
      o1.disableDate = true
      o1.searchtype = 'consolidatesearch'
      testbase.payload = o1
      return testbase
    })
  o.payload21 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 400
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))
    o1.basesearcharconsolidated = undefined
    o1.disableDate = true
    o1.searchtype = 'consolidatesearch'
    testbase.payload = o1
    return testbase
  }
  o.payload22 = function (testbase, entry, evalModulename, validationConfig) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 400
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

    let fieldtype = validationConfig.validationmap.filter(
      o1 => o1.inputname == entry
    )[0].fieldtypename

    if (fieldtype == 'DATE') {
      o1.daterange = {
        startdate: undefined,
        enddate: undefined
      }
      o1.datecolsearch = entry
      o1.disableDate = false
    } else {
      o1.searchparam = [{ [entry]: [undefined] }]
      o1.disableDate = true
      o1.searchtype = 'Columnwise'
    }
    testbase.payload = o1
    return testbase
  }
  o.payload23 = function (testbase, entry, evalModulename, validationConfig) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 400
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

    let fieldtype = validationConfig.validationmap.filter(
      o1 => o1.inputname == entry
    )[0].fieldtypename

    if (fieldtype == 'DATE') {
      o1.daterange = {
        [undefined]: new Date(
          testbase.schemaBaseValidatorPayload[entry]
        ).toLocaleDateString(),
        [undefined]: new Date(
          testbase.schemaBaseValidatorPayload[entry]
        ).toLocaleDateString()
      }
      o1.datecolsearch = entry
      o1.disableDate = false
    } else {
      o1.searchparam = [
        { ['undefined']: [testbase.schemaBaseValidatorPayload[entry]] }
      ]
      o1.disableDate = true
      o1.searchtype = 'Columnwise'
    }
    testbase.payload = o1
    return testbase
  }
  o.payload24 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))
    o1.sortcolumn = NaN
    testbase.payload = o1
    testbase.responseCode = 400
    return testbase
  }
  o.payload25 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))
    o1.sortcolumnorder = NaN
    testbase.payload = o1
    testbase.responseCode = 400
    return testbase
  }
  o.payload26 = function (testbase, entry, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 200
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))
    o1.sortcolumnorder = 'ASC'
    o1.sortcolumn = entry
    o1.disableDate = true
    testbase.payload = o1
    return testbase
  }
  ;(o.payload27 = function (testbase, entry, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 200
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))
    o1.sortcolumnorder = 'DESC'
    o1.sortcolumn = entry
    o1.disableDate = true
    testbase.payload = o1
    return testbase
  }),
    (o.payload28 = function (testbase, evalModulename) {
      testbase.apiUrl = '/' + evalModulename + dep.pivotresult
      var o = JSON.parse(JSON.stringify(PivotloadModulePayLoad))
      o.XpageSize = undefined
      testbase.payload = o
      testbase.responseCode = 400
      return testbase
    })
  o.payload29 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.pivotresult
    var o = JSON.parse(JSON.stringify(PivotloadModulePayLoad))
    o.Xpageno = undefined
    testbase.payload = o
    testbase.responseCode = 400
    return testbase
  }
  o.payload30 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.pivotresult
    var o = JSON.parse(JSON.stringify(PivotloadModulePayLoad))
    o.YpageSize = undefined
    testbase.payload = o
    testbase.responseCode = 400
    return testbase
  }
  o.payload31 = function (testbase, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.pivotresult
    var o = JSON.parse(JSON.stringify(PivotloadModulePayLoad))
    o.Ypageno = undefined
    testbase.payload = o
    testbase.responseCode = 400
    return testbase
  }
  return o
}
module.exports = {
  expect,
  dep,
  Promises,
  consolidatedPayload,
  validationconfigInit,
  customMultiInsertDelete,
  customTestsInit,
  multicolumngenAr,
  genPayloadByNum,
  createModPayLoad,
  schemaValValidatorPayloadMaxLenght,
  datatransformutils,
  schemavalidatorPayload,
  schemaValueValidatorPayload,
  server,
  loginsuccess,
  loadCurrentModule,
  loadModulePayLoad,
  setevalModulename,
  schemaValueValidatorPayloadBlank,
  genericApiPost,
  PrimarytestInit,
  dataCleanUp
}
