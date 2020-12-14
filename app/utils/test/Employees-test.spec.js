let testbase = {
  evalModulename: 'employees'
}
let genSpecs = require('./Generic.spec.js')
let validationConfig = require('../../routes/utils/' +
  testbase.evalModulename +
  '/validationConfig.js')
validationConfig.applyfields.push('recordstate')
var recordstateobj = {
  inputname: 'recordstate',
  fieldtypename: 'boolean',
  fieldvalidatename: 'boolean',
  fieldmaxlength: '4'
}
validationConfig.validationmap.push(recordstateobj)
/*for getting and passing to rest of tests fields and validationConfig*/
testbase.schemaBaseValidatorPayload = genSpecs.createModPayLoad(
  validationConfig
)

/*Schema validatior with removing one by ony fields*/
testbase.schemaValValidatorPayload = genSpecs.schemaValueValidatorPayload(
  validationConfig.applyfields,
  testbase.schemaBaseValidatorPayload
)
/*Schema validatior with blank fields one by ony fields*/
testbase.schemaValValidatorPayloadBlank = genSpecs.schemaValueValidatorPayloadBlank(
  validationConfig.applyfields,
  testbase.schemaBaseValidatorPayload
)
/*Schema validatior with Max  fields validations one by ony fields*/
testbase.schemaValValidatorPayloadMaxLenght = genSpecs.schemaValValidatorPayloadMaxLenght(
  validationConfig.applyfields,
  testbase.schemaBaseValidatorPayload
)

genSpecs.setevalModulename(testbase.evalModulename)
describe('Begin Tests', function () {
  // #1 should return home page
  before(function (done) {
    genSpecs
      .loginsuccess()
      .then(genSpecs.loadCurrentModule)
      .then(function (data) {
        testbase.token = data
        console.log(
          '****************login and loaded the module  successfully****************'
        )
        done()
      })
  })

  after(function (done) {
    genSpecs.server.post('/logout').end(function (err, data) {
      if (err) return done(err)
      console.log('****************logout successfully****************')

      data.statusCode.should.equal(200)
      data.body.status.should.equal('success')
      data.body.redirect.should.equal('/login')
      done()
    })
  })
  //success
  ///redirect login
  it('loads as expected conventionally', function (done) {
    testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[0]
    testbase.payload = genSpecs.loadModulePayLoad
    testbase.responseCode = 200
    genSpecs.genericApiPost(testbase).then(function (data) {
      // console.log(data.body.count)
      // console.log(data.body.rows)
      done()
    })
  })
  describe('****************Schema Removal Validation Test Cases****************', function () {
    testbase.schemaValValidatorPayload.forEach(function (entry) {
      it(`For insert Operation test case By Removing ${entry.key} from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
        testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
        testbase.responseCode = 400
        testbase.payload = entry.schemaContent
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.statusCode.should.equal(400)
          data.body.error.should.equal('Bad Request')

          data.body.message.should.equal(
            `body should have required property '${entry.key}'`
          )
        })
      })
    })
  })
  describe('****************Schema Blank/Empty Validation Test Cases****************', function () {
    testbase.schemaValValidatorPayloadBlank.forEach(function (entry) {
      it(`For insert Operation test case By assigning ${entry.key} as blank/empty from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
        testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
        testbase.responseCode = 400
        testbase.payload = entry.schemaContent
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.error.should.equal('Bad Request')

          let fieldtype = validationConfig.validationmap.filter(
            o => o.inputname == entry.key
          )[0].fieldtypename
          if (fieldtype == 'boolean') {
            data.body.message.should.equal(
              `body.${entry.key} should be boolean`
            )
          } else if (fieldtype == 'DATE') {
            data.body.message.should.equal(
              `body.${entry.key} should match format "date-time"`
            )
          } else {
            data.body.message.should.equal(
              `body.${entry.key} should NOT be shorter than 1 characters`
            )
          }
        })
      })
    })
  })

  describe('****************Schema MaxLenght Validation Test Cases****************', function () {
    testbase.schemaValValidatorPayloadMaxLenght.forEach(function (entry) {
      it(`For insert Operation test case By assigning ${entry.key} as maxLenght of fields value from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
        testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
        testbase.responseCode = 400
        testbase.payload = entry.schemaContent
        return genSpecs.genericApiPost(testbase).then(function (data) {
          let fieldtype = validationConfig.validationmap.filter(
            o => o.inputname == entry.key
          )[0]
          if (fieldtype.fieldtypename == 'boolean') {
            data.body.message.should.equal(
              `body.${entry.key} should be boolean`
            )
          } else if (fieldtype.fieldtypename == 'DATE') {
            data.body.message.should.equal(
              `body.${entry.key} should match format "date-time"`
            )
          } else {
            data.body.message.should.equal(
              `body.${entry.key} should NOT be longer than ${fieldtype.fieldmaxlength} characters`
            )
          }
        })
      })
    })
  })
})
