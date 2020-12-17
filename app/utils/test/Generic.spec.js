let Promises = require('bluebird')
var supertest = require('supertest')
var should = require('chai').should()
var expect = require('chai').expect
let tokenvalEval
let loadModulePayLoad = {
  searchparam: ['NA'],
  pageno: 0,
  pageSize: 20,
  disableDate: true
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

let loginsuccess = function (
  cred = { username: 'krennic', password: 'orson' }
) {
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
  console.log(JSON.stringify(interim3))
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
module.exports = {
  expect,
  dep,
  Promises,
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
  genericApiPost
}
