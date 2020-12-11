var supertest = require('supertest')
//var should = require("should");

var should = require('chai').should()

before(async () => {
  require('../app2.js')
})

// This agent refers to PORT where program is running.

var server = supertest.agent('http://localhost:3011')

// UNIT test begin

describe('login', function () {
  // #1 should return home page

  it('logins as expected when valid username and password are passed', function (done) {
    //calling ADD api
    var user = { username: 'krennic', password: 'orson' }
    server
      .post('/login')
      .send(user)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          console.log(err)
          return done(err)
        }

        //res.status.should.equal(200);
        //res.body.should.include.keys(['token'])
        res.body.status.should.equal('success')
        res.body.redirect.should.equal('/employees')
        done()
      })
  })
  it('it shows valid messages when incorrect username and password is entered', function (done) {
    //calling ADD api
    var user = { username: 'krennic', password: 'or' }
    server
      .post('/login')
      .send(user)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          console.log(err)
          return done(err)
        }

        //res.status.should.equal(200);
        //res.body.should.include.keys(['token'])
        res.body.status.should.equal('fail')
        res.body.msgstatus.should.equal('Invalid Username/Password')
        done()
      })
  })
  it('logouts as expected', function (done) {
    //calling ADD api
    server
      .post('/logout')
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          console.log(err)
          // return done(err)
        }
        res.status.should.equal(200)
        res.body.status.should.equal('success')
        res.body.redirect.should.equal('/login')
        done()
      })
  })
  it('redirects to login when you are on not loggedin when you try to access directy employees report page ', function (done) {
    //calling ADD api
    server
      .get('/employees')
      .expect(302)
      .expect('Location', '/login')
      .end(function (err, res) {
        if (err) {
          console.log(err)
          return done(err)
        }
        done()
      })
  })
})
