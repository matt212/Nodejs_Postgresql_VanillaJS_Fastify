let testbase = {
  evalModulename: 'employees'
}
let genSpecs = require('./Generic.spec.js')
genSpecs.setevalModulename(testbase.evalModulename)
describe('Begin Tests', function () {
  // #1 should return home page
  before(function (done) {
    genSpecs
      .loginsuccess()
      .then(genSpecs.loadCurrentModule)
      .then(function (data) {
        testbase.tokenvalEval = data
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
  it('Throws Validation Message when Input fields are empty or blank', function (done) {
    //calling ADD api

    genSpecs.server
      .post('/' + evalModulename + genSpecs.dep.searchtype[0])
      .send(genSpecs.loadModulePayLoad)
      .set('x-access-token', testbase.tokenvalEval)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err)
        } else {
          console.log(res.body.count)
          console.log(res.body.rows)
          done()
        }
      })
  })
})
