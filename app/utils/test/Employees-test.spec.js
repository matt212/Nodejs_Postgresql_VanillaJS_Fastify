let testbase = {
  evalModulename: 'employees'
}
let genSpecs = require('./Generic.spec.js')
let validationConfig = require('../../routes/utils/' +
  testbase.evalModulename +
  '/validationConfig.js')
validationConfig.applyfields.push('recordstate')

testbase.schemaValidatorPayload = genSpecs.schemavalidatorPayload(
  validationConfig.applyfields
)
console.log(JSON.stringify(testbase))
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
  // it('loads as expected conventionally', function (done) {
  //   testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[0]
  //   testbase.payload = genSpecs.loadModulePayLoad
  //   testbase.responseCode=200;
  //   genSpecs.genericApiPost(testbase).then(function (data) {
  //     console.log(data.body.count)
  //     console.log(data.body.rows)
  //     done()
  //   })
  // })
})
/**
Object.keys(applyfields).reduce((r, key) => 
(Object.assign(r, {[applyfields[key]]: ""})), {}); 
* 
 */
/**{
  "first_name": "asa",
  "last_name": "asa",
  "gender": "F",
  "birth_date": "12-10-1989",
  "recordstate": true
}
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body should have required property '.first_name'"
} */
