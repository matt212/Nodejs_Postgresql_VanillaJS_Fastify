let testbase = {
  evalModulename: 'employees'
}
let genSpecs = require('./Generic.spec.js')
let validationConfig = require('../../routes/utils/' +
  testbase.evalModulename +
  '/validationConfig.js')
validationConfig.applyfields.push('recordstate')

testbase.schemaBaseValidatorPayload = genSpecs.createModPayLoad(
  validationConfig
)

testbase.schemaValValidatorPayload = genSpecs.schemaValueValidatorPayload(
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
    genSpecs.server.get('/logout').end(function (err, res) {
      if (err) return done(err)
      console.log('****************logout successfully****************')
      done()
    })
  })
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

  testbase.schemaValValidatorPayload.forEach(function (entry) {
    
    it(`For insert Operation test case By Removing ${entry.key} from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
      testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
      testbase.responseCode = 400
      testbase.payload = entry.schemaContent
      return genSpecs.genericApiPost(testbase).then(function (data) {
        data.body.statusCode.should.equal(400)
        data.body.error.should.equal('Bad Request')
        
        data.body.message.should.equal(`body should have required property '${entry.key}'`)
      })
    })
  })
  // testbase.schemaValueValidatorPayload.forEach(function (entry) {
  //   console.log(entry)
  //   it(`For insert Operation test case By Removing ${entry.key} from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
  //     testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
  //     testbase.responseCode = 400
  //     testbase.payload = entry.content
  //     return genSpecs.genericApiPost(testbase).then(function (data) {
  //       console.log(data.body)
  //       // data.body.error.should.equal('Bad Request')
  //       // data.body.message.should.equal(
  //       //   `body should have required property '.${entry.key}'`
  //       // )
  //       //body should have required property '.recordstate'
  //     })
  //   })
  // })
})
