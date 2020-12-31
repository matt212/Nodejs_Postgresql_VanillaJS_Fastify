let Promises = require('bluebird')
var supertest = require('supertest')
var chai = require('chai')
chai.config.includeStack = true
var should = chai.should()
var expect = chai.expect
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

let controlPayset = function (validationConfig, entry) {
  let fieldtype = ''
  if (validationConfig.validationmap[0].hasOwnProperty('inputtextval')) {
    fieldtype = validationConfig.validationmap.filter(
      o1 => o1.inputtextval == entry
    )[0]
  } else {
    fieldtype = validationConfig.validationmap.filter(
      o1 => o1.inputname == entry
    )[0]
  }
  return fieldtype
}
let controlPaysetMulti = function (validationConfig, entry) {
  let fieldtype = ''

  fieldtype = validationConfig.validationmap.filter(
    o1 => o1.inputCustomMapping == entry
  )[0]

  return fieldtype
}

let createModPayLoad = function (validationConfig) {
  if (validationConfig.validationmap[0].hasOwnProperty('inputtextval')) {
    return createModulePayLoad.makepayloadControl(validationConfig)
  } else {
    return createModulePayLoad.makepayload(validationConfig)
  }
}
let customMultiInsertDelete = function (testbase, evalModulename) {
  let o = {}
  o.multiInsert = function (entry) {
    return new Promise((resolve, reject) => {
      try {
        testbase.apiUrl = '/' + evalModulename + dep.create
        testbase.responseCode = 200
        testbase.payload = entry
        genericApiPost(testbase)
          .then(function (data) {
            resolve(data.body.createdId)
          })
          .catch(err => console.log(err))
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }
  o.multiDel = function (DelAr) {
    var delObj = { [testbase.evalModulename + 'id']: DelAr }

    return new Promise((resolve, reject) => {
      testbase.apiUrl = '/' + evalModulename + dep.delete
      testbase.responseCode = 200
      testbase.payload = delObj
      genericApiPost(testbase)
        .then(function (data) {
          resolve(data)
        })
        .catch(err => console.log(err))
    })
  }

  o.multiInsertforSearch = function (createdID) {
    if (createdID != undefined) {
      o.singleInsertID = createdID
    }

    return new Promise((resolve, reject) => {
      Promises.mapSeries(testbase.schemaBaseValidatorPayloadAr, o.multiInsert)
        .then(a => {
          var o1 = {
            singleInsertID: o.singleInsertID,
            a: a
          }
          resolve(o1)
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
let metaTestcaseGen = function (a) {
  let testbase = {
    evalModulename: a
  }
  let validationConfig = require('../../routes/utils/' +
    testbase.evalModulename +
    '/validationConfig.js')
  validationConfig = validationconfigInit(validationConfig)
  /*for getting and passing to rest of tests fields and validationConfig*/
  testbase = customTestsInit(testbase, validationConfig)
  setevalModulename(testbase.evalModulename)
  return { a: testbase, b: validationConfig }
}
let customTestsInit = function (testbase, validationConfig) {
  let appField = {}
  if (validationConfig.validationmap[0].hasOwnProperty('inputtextval')) {
    appField = validationConfig.validationmap.map(function (doctor) {
      return doctor.inputname
    })
  } else {
    appField = validationConfig.applyfields
  }
  testbase.schemaBaseValidatorPayload = createModPayLoad(validationConfig)

  /*Generate multi insert payloads by passing second parameter as number recordset to generate*/
  testbase.schemaBaseValidatorPayloadAr = genPayloadByNum(validationConfig, 2)

  /*Schema validatior with removing one by ony fields*/
  testbase.schemaValValidatorPayload = schemaValueValidatorPayload(
    appField,
    testbase.schemaBaseValidatorPayload
  )
  /*Schema validatior with blank fields one by ony fields*/
  testbase.schemaValValidatorPayloadBlank = schemaValueValidatorPayloadBlank(
    appField,
    testbase.schemaBaseValidatorPayload
  )
  /*Schema validatior with Max  fields validations one by ony fields*/
  testbase.schemaValValidatorPayloadMaxLenght = schemaValValidatorPayloadMaxLenght(
    appField,
    testbase.schemaBaseValidatorPayload
  )
  return testbase
}
let getParentfromValidationMap=function(validationConfig)
{
  let a1 = validationConfig.validationmap
        .map(a => (a.inputParent != undefined ? a.inputParent : undefined))
        .filter(Boolean)
  return a1      
}
let MultiControlTestCaseGen = function (testbase, validationConfig) {
  return (promise = new Promise((resolve, reject) => {
    try {
      let a1 = validationConfig.validationmap
        .map(a => (a.inputParent != undefined ? a.inputParent : undefined))
        .filter(Boolean)
      ModularizeDataGen(a1)
        .then(function (data) {
          let a = initMultiPayloadforSearch(
            data,
            validationConfig.validationmap,
            a1
          )
          // console.log(a.searchtype)
          // console.log(a.insertUpdateDelete)
          //console.log(a.insertUpdateDelete[0])
          testbase.searchtype1 = a.searchtype
          testbase.insertUpdateDelete1 = a.insertUpdateDelete
          testbase.baseData=a.baseData
          testbase = customTestsInitMultiControl(testbase, validationConfig)
          setevalModulename(testbase.evalModulename)
          PrimarytestInit(testbase).then(function (data) {
            console.log('*****Multi Records are inserted sucessfully*****')
            //testbase.schemaBaseValidatorPayloadAr1=a.searchtype
            resolve(data)
          })
        })
        .catch(err => console.log(err))
    } catch (error) {
      console.log(error)
      reject(error)
    }
  }))
}
let customTestsInitMultiControl = function (testbase, validationConfig) {
  let appField = {}
  let p = {}
  if (validationConfig.validationmap[0].hasOwnProperty('inputtextval')) {
    appField = validationConfig.validationmap.map(function (doctor) {
      return doctor.inputname
    })
  } else {
    appField = validationConfig.applyfields
  }
  testbase.schemaBaseValidatorPayload = testbase.insertUpdateDelete1[0]

  /*Generate multi insert payloads by passing second parameter as number recordset to generate*/

  testbase.schemaBaseValidatorPayloadAr = testbase.insertUpdateDelete1

  /*Generate multi searchtypepayload for mulitselect multicolumn test cases*/

  testbase.schemaBaseValidatorPayloadAr1 = testbase.searchtype1

  /*Schema validatior with removing one by ony fields*/
  testbase.schemaValValidatorPayload = schemaValueValidatorPayload(
    appField,
    testbase.schemaBaseValidatorPayload
  )
  /*Schema validatior with blank fields one by ony fields*/
  testbase.schemaValValidatorPayloadBlank = schemaValueValidatorPayloadBlank(
    appField,
    testbase.schemaBaseValidatorPayload
  )
  /*Schema validatior with Max  fields validations one by ony fields*/
  testbase.schemaValValidatorPayloadMaxLenght = schemaValValidatorPayloadMaxLenght(
    appField,
    testbase.schemaBaseValidatorPayload
  )
  return testbase
}
let removeJsonAttrs = function (json, attrs) {
  return JSON.parse(
    JSON.stringify(json, function (k, v) {
      return attrs.indexOf(k) !== -1 ? undefined : v
    })
  )
}
let loginsuccess = function (cred) {
  try {
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
  } catch (error) {
    console.error(error)
  }
}
let ModularizeDataGen = function (applyfields) {
  return (promise = new Promise((resolve, reject) => {
    Promises.mapSeries(applyfields, ModularizeDataGen1)
      .then(a => {
        resolve(a)
      })
      .catch(err => console.log(err))
  }))
}
let ModularizeDataGen1 = function (a) {
  return (promise = new Promise((resolve, reject) => {
    let testbase = {
      evalModulename: a
    }

    let validationConfig = require('../../routes/utils/' +
      testbase.evalModulename +
      '/validationConfig.js')
    validationConfig = validationconfigInit(validationConfig)
    /*for getting and passing to rest of tests fields and validationConfig*/
    testbase = customTestsInit(testbase, validationConfig)
    setevalModulename(testbase.evalModulename)
    
    PrimarytestInit(testbase).then(function (data) {
      resolve(data)
    })
  }))
}
let setevalModulename = function (data) {
  evalModulename = data
}
let customRefentialModnameInsert = function (modulename) {
  return new Promise((resolve, reject) => {
    let l1 = metaTestcaseGen(modulename)

    MultiControlTestCaseGen(l1.a, l1.b)
      .then(function (data) {
        
        testbase.token = data.token
        insertMochaScript(data, modulename).then(function (dt) {
          resolve(dt)
        })
      })
      .catch(err => console.log(err))
  })
}
let insertMochaScript = function (payload, evalModname) {
  return new Promise((resolve, reject) => {
    testbase = consolidatedPayload().payload202(
      payload.insertUpdateDelete1,
      evalModname
    )

    genericApiPost(testbase)
      .then(function (data) {
        let resp = {
          a: payload.insertUpdateDelete1,
          b: data.body,
          c:payload.schemaBaseValidatorPayloadAr1
        }
        resolve(resp)
      })
      .catch(err => console.log(err))
  })
}
let genericApiPost = function (data) {
  return (promise = new Promise((resolve, reject) => {
    try {
      server
        .post(data.apiUrl)
        .send(data.payload)
        .set('x-access-token', data.token)
        .expect('Content-type', /json/)
        .expect(data.responseCode)
        .end(function (err, res) {
          if (err) {
            //console.log({error:err.message,url:data.apiUrl, payload:JSON.stringify(data.payload)})
            reject({
              error: err.message,
              url: data.apiUrl,
              payload: JSON.stringify(data.payload)
            })
          } else {
            resolve(res)
          }
        })
    } catch (error) {
      console.log(error)
      reject({ error: true, payload: data })
    }
  }))
}
let idmapping = function (validationmap, a, b) {
  let arr3 = a.map((item, i) => Object.assign({}, item, b[i]))

  let a1 = removeJsonAttrs(arr3, ['recordstate'])

  var ar2 = []
  a1.forEach(function (b) {
    var o = {
      /*get id */
      // [getidfromobj(validationmap, Object.keys(b)[0])]: b[Object.keys(b)[0]],
      // [getidfromobj(validationmap, Object.keys(b)[1])]: b[Object.keys(b)[1]]
      /*assign apply field custommapping */
      [getidfromobjinputCustomMapping(validationmap, Object.keys(b)[0])]: b[
        Object.keys(b)[0]
      ],
      [getidfromobjinputCustomMapping(validationmap, Object.keys(b)[1])]: b[
        Object.keys(b)[1]
      ]
    }
    ar2.push(o)
  })

  return ar2
}
let getidfromobj = function (validationmap, val) {
  var basesets = validationmap
    .filter(function (dt) {
      return dt.inputtextval == val
    })
    .map(function (dt) {
      return dt.inputname
      //return dt.inputCustomMapping
    })
  return basesets.toString()
}
let getidfromobjinputCustomMapping = function (validationmap, val) {
  var basesets = validationmap
    .filter(function (dt) {
      return dt.inputtextval == val
    })
    .map(function (dt) {
      return dt.inputCustomMapping
    })
  return basesets.toString()
}
let getidfromobjinputParent = function (validationmap, val) {
  var basesets = validationmap
    .filter(function (dt) {
      return dt.inputParent == val
    })
    .map(function (dt) {
      return dt.inputname
      //return dt.inputCustomMapping
    })
  return basesets.toString()
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
let initMultiPayloadforSearch = function (data, validationmap, ap) {
  let ar1 = []
  let ar2 = []
  //console.log(data);
  ap.forEach(function (entry) {
    let b1 = data
      .filter(a => a.evalModulename == entry)
      .map(function (doctor) {
        return {
          a1: doctor.schemaBaseValidatorPayloadAr,
          a2: doctor.schemaBaseValidatorPayload,
          a3: doctor.schemaValValidatorPayloadBlank,
          a4: doctor.schemaValValidatorPayloadMaxLenght,
          a5: doctor.DelAr,
          a6: doctor.singleInsertID
        }
      })

    let interimObj = b1[0].a5.map(function (a) {
      return {
        [getidfromobjinputParent(validationmap, entry)]: a
      }
    })
    ar2.push(interimObj)

    ar1.push(b1[0].a1)
    //console.log(b1[0].a2);
  })

  let o = {
    searchtype: idmapping(validationmap, ar1[0], ar1[1]),
    insertUpdateDelete: ar2[0].map((item, i) =>
      Object.assign({}, item, ar2[1][i])
    )
  }
  let o1 = {
    searchtype: o.searchtype.map((item, i) =>
      Object.assign(
        {},
        item,
        [
          { accesstype: 'AA', recordstate: true },
          { accesstype: 'AA', recordstate: true }
        ][i]
      )
    ),
    insertUpdateDelete: o.insertUpdateDelete.map((item, i) =>
      Object.assign(
        {},
        item,
        [
          { accesstype: 'AA', recordstate: true },
          { accesstype: 'AA', recordstate: true }
        ][i]
      )
    ),
    baseData:data
  }
  return o1
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

            testbase.DelAr = data.a
            testbase.singleInsertID = data.singleInsertID
            resolve(testbase)
          })
          .catch(err => console(err))
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
    inputtextval: 'recordstate',
    fieldtypename: 'boolean',
    fieldvalidatename: 'boolean',
    fieldmaxlength: '4'
  }
  validationConfig.validationmap.push(recordstateobj)
  return validationConfig
}
let FirstTimeloadCurrentModule = function () {
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

          res.statusCode.should.equal(302)
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
  o.payload2 = function (testbase, evalModulename, validationConfig) {
    testbase.schemaBaseValidatorPayload = createModPayLoad(validationConfig)
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
      let fieldtype = controlPayset(validationConfig, entry)

      if (fieldtype.fieldtypename == 'DATE') {
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
        fieldtype.fieldtypename == 'boolean' ||
        fieldtype.fieldtypename == 'BIGINT' ||
        fieldtype.fieldtypename == 'INTEGER'
      ) {
        o1.searchparam = [
          {
            [entry]: [testbase.schemaBaseValidatorPayload[entry]]
          }
        ]
        o1.disableDate = true
        o1.searchtype = 'Columnwise'
      } else if (fieldtype.fieldtypename == 'STRING') {
        let interimval = testbase.schemaBaseValidatorPayload[entry]
        if (
          fieldtype.fieldtypename.toLowerCase() != fieldtype.fieldvalidatename
        ) {
          if (fieldtype.fieldvalidatename == 'number') {
            interimval = interimval
          } else {
            interimval = interimval.toLowerCase()
          }
        } else {
          interimval = interimval.toLowerCase()
        }
        o1.searchparam = [
          {
            [entry]: [interimval]
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

      let fieldtype = controlPayset(validationConfig, entry)

      if (fieldtype.fieldtypename == 'DATE') {
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
        fieldtype.fieldtypename == 'boolean' ||
        fieldtype.fieldtypename == 'BIGINT' ||
        fieldtype.fieldtypename == 'INTEGER'
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
      } else if (fieldtype.fieldtypename == 'STRING') {
        let interimval1 = testbase.schemaBaseValidatorPayloadAr[0][entry]
        let interimval2 = testbase.schemaBaseValidatorPayloadAr[1][entry]
        if (
          fieldtype.fieldtypename.toLowerCase() != fieldtype.fieldvalidatename
        ) {
          if (fieldtype.fieldvalidatename == 'number') {
            interimval1 = interimval1
            interimval2 = interimval2
          } else {
            interimval1 = interimval1.toLowerCase()
            interimval2 = interimval2.toLowerCase()
          }
        } else {
          interimval1 = interimval1.toLowerCase()
          interimval2 = interimval2.toLowerCase()
        }
        o1.searchparam = [
          {
            [entry]: [interimval1, interimval2]
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

      let fieldtype = controlPayset(validationConfig, entry).fieldtypename

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
      } else if (fieldtype == 'boolean') {
        /*there cannot be multi boolean Filter */
      } else {
        o1.searchparam = multicolumngenAr(
          testbase.schemaBaseValidatorPayloadAr[0],
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

      if (Number.isInteger(searchVal)) {
        searchVal = searchVal
      } else {
        searchVal = searchVal.substring(0, 3)
      }

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

    let fieldtype = controlPayset(validationConfig, entry).fieldtypename

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

    let fieldtype = controlPayset(validationConfig, entry).fieldtypename

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
  o.payload191 = function (
    testbase,
    entry,
    evalModulename,
    validationConfig,
    schemaBaseValidatorPayloadAr1
  ) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 200
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

    let fieldtype = controlPaysetMulti(validationConfig, entry).fieldtypename

    if (fieldtype == 'DATE') {
      o1.daterange = {
        startdate: new Date(
          schemaBaseValidatorPayloadAr1[0][entry]
        ).toLocaleDateString(),
        enddate: new Date(
          schemaBaseValidatorPayloadAr1[0][entry]
        ).toLocaleDateString()
      }
      o1.datecolsearch = entry
      o1.disableDate = false
    } else if (fieldtype == 'boolean') {
      /*there cannot be multi boolean Filter */
    } else {
      o1.searchparam = multicolumngenAr(schemaBaseValidatorPayloadAr1[0], entry)

      o1.disableDate = true
      o1.searchtype = 'Columnwise'
    }
    testbase.payload = o1
    return testbase
  }
  o.payload231 = function (testbase, entry, evalModulename, validationConfig) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 400
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

    let fieldtype = controlPayset(validationConfig, entry).fieldtypename

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
  o.payload221 = function (testbase, entry, evalModulename, validationConfig) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 400
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

    let fieldtype = controlPaysetMulti(validationConfig, entry).fieldtypename

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
  o.payload171 = function (
    testbase,
    entry,
    evalModulename,
    validationConfig,
    schemaBaseValidatorPayload1
  ) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 200
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))
    let fieldtype = controlPayset(validationConfig, entry)

    if (fieldtype.fieldtypename == 'DATE') {
      o1.daterange = {
        startdate: new Date(
          schemaBaseValidatorPayload1[entry]
        ).toLocaleDateString(),
        enddate: new Date(
          schemaBaseValidatorPayload1[entry]
        ).toLocaleDateString()
      }
      o1.datecolsearch = entry
      o1.disableDate = false
    } else if (
      fieldtype.fieldtypename == 'boolean' ||
      fieldtype.fieldtypename == 'BIGINT' ||
      fieldtype.fieldtypename == 'INTEGER'
    ) {
      o1.searchparam = [
        {
          [entry]: [schemaBaseValidatorPayload1[entry]]
        }
      ]
      o1.disableDate = true
      o1.searchtype = 'Columnwise'
    } else if (fieldtype.fieldtypename == 'STRING') {
      let interimval = schemaBaseValidatorPayload1[entry]
      if (
        fieldtype.fieldtypename.toLowerCase() != fieldtype.fieldvalidatename
      ) {
        if (fieldtype.fieldvalidatename == 'number') {
          interimval = interimval
        }
      } else {
        interimval = interimval.toLowerCase()
      }
      o1.searchparam = [
        {
          [entry]: [interimval]
        }
      ]
      o1.disableDate = true
      o1.searchtype = 'Columnwise'
    }

    testbase.payload = o1
    return testbase
  }
  o.payload181 = function (
    testbase,
    entry,
    evalModulename,
    validationConfig,
    schemaBaseValidatorPayload1
  ) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 200
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))

    let fieldtype = controlPaysetMulti(validationConfig, entry)

    if (fieldtype == undefined) {
      console.log(entry)
    }
    if (fieldtype.fieldtypename == 'DATE') {
      o1.daterange = {
        startdate: new Date(
          schemaBaseValidatorPayload1[0][entry]
        ).toLocaleDateString(),
        enddate: new Date(
          schemaBaseValidatorPayload1[0][entry]
        ).toLocaleDateString()
      }
      o1.datecolsearch = entry
      o1.disableDate = false
    } else if (
      fieldtype.fieldtypename == 'boolean' ||
      fieldtype.fieldtypename == 'BIGINT' ||
      fieldtype.fieldtypename == 'INTEGER'
    ) {
      o1.searchparam = [
        {
          [entry]: [
            schemaBaseValidatorPayload1[0][entry],
            schemaBaseValidatorPayload1[1][entry]
          ]
        }
      ]
      o1.disableDate = true
      o1.searchtype = 'Columnwise'
    } else if (fieldtype.fieldtypename == 'STRING') {
      let interimval1 = schemaBaseValidatorPayload1[0][entry]
      let interimval2 = schemaBaseValidatorPayload1[1][entry]
      // if (
      //   fieldtype.fieldtypename.toLowerCase() != fieldtype.fieldvalidatename
      // ) {
      //   if (fieldtype.fieldvalidatename == 'number') {
      //     interimval1 = interimval1
      //     interimval2 = interimval2
      //   }
      // } else {
      interimval1 = interimval1.toLowerCase()
      interimval2 = interimval2.toLowerCase()
      //      }
      o1.searchparam = [
        {
          [entry]: [interimval1, interimval2]
        }
      ]
      o1.disableDate = true
      o1.searchtype = 'Columnwise'
    }
    testbase.payload = o1
    return testbase
  }
  o.payload201 = function (
    testbase,
    evalModulename,
    validationConfig,
    { a = schemaBaseValidatorPayloadAr1 }
  ) {
    testbase.apiUrl = '/' + evalModulename + dep.searchtype[1]
    testbase.responseCode = 200
    var o1 = JSON.parse(JSON.stringify(loadModulePayLoad))
    Object.keys(a[0])[0]
    var searchVal = a[0][Object.keys(a[0])[0]]

    if (Number.isInteger(searchVal)) {
      searchVal = searchVal
    } else {
      searchVal = searchVal.substring(0, 3)
    }

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
  }
  o.payload202 = function (payload, evalModulename) {
    testbase.apiUrl = '/' + evalModulename + dep.bulkCreate
    testbase.responseCode = 200
    let o = {}
    o.payset=payload
    testbase.payload = o
    return testbase
  }
  return o
}
module.exports = {
  expect,
  dep,
  Promises,
  insertMochaScript,
  getParentfromValidationMap,
  metaTestcaseGen,
  customRefentialModnameInsert,
  MultiControlTestCaseGen,
  customTestsInitMultiControl,
  idmapping,
  initMultiPayloadforSearch,
  ModularizeDataGen,
  ModularizeDataGen1,
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
  dataCleanUp,
  getidfromobj
}
