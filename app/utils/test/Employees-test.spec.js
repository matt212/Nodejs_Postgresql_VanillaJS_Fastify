let testbase = {
  evalModulename: 'employees'
}
const { base } = require('../../routes/utils/sqlConstruct.js')
let genSpecs = require('./Generic.spec.js')
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

    genSpecs.genericApiPostSuccess(testbase).then(function (data) {
      console.log(data.body.count)
      console.log(data.body.rows)
      done()
    })
  })
})
