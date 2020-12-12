var supertest = require('supertest')
//var should = require("should");

var should = require('chai').should()
let tokenvalEval
before(async () => {
  require('../app2.js')
})

// This agent refers to PORT where program is running.

var server = supertest.agent('http://localhost:3011')

// UNIT test begin

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
        res.body.redirect.should.equal('/employees')
        resolve({ status: 'pass' })
      })
  }))
}
let loadCurrentModule = function (data) {
  return (promise = new Promise((resolve, reject) => {
    if (data.status == 'pass') {
      server
        .get('/employees')
        .expect('Content-type', /text\/html/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            console.log(err)
            reject(err)
          }

          tokenvalEval = res.headers['x-token']

          resolve({ status: 'pass' })
        })
    } else {
      resolve('fail')
    }
  }))
}

describe('Begin Tests', function () {
  // #1 should return home page
  before(function (done) {
    
      loginsuccess()
        .then(loadCurrentModule)
        .then(function (data) {
    console.log("****************login and loaded the module  successfully****************")       
          done()
        })
    
  })

  after(function (done) {
    server.get('/logout').end(function (err, res) {
      if (err) return done(err)
      console.log("****************logout successfully****************")
      done()

    })
  })
  it('Throws Validation Message when Input fields are empty or blank', function (done) {
    //calling ADD api
    //console.log(tokenvalEval)
    done()
  })
})
