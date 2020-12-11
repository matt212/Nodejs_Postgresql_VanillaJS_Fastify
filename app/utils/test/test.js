var supertest = require('supertest')
//var should = require("should");

var should = require('chai').should()


before(async () => {
  require('../app2.js')
})

// This agent refers to PORT where program is running.

var server = supertest.agent('http://localhost:3011')

// UNIT test begin

describe('base test ', function () {
  // #1 should return home page

  
  it('is should login pass', function (done) {
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
        res.body.status.should.equal('success');
        res.body.redirect.should.equal('/employees');
        done()
      })
  })
  it('is should login fail', function (done) {
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
        res.body.status.should.equal('fail');
        res.body.msgstatus.should.equal('Invalid Username/Password');
        done()
      })
  })
  it('check if Session for Employees', function (done) {
    //calling ADD api
    server
      .get('/employees')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          console.log(err)
          return done(err)
        }
        
        res.status.should.equal(200);
        -
        
        done()
      })
  })
})

/*older*/
/*const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;

describe("Posting is easy to test with supertest", function() {

    it("login", function(done) {
        var user = { username: 'krennic', password: 'orson1' };

        request(app)
            .post("/login")
            .send(user)
            .expect(302)
            .expect('Location', '/listing')
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });

    });
    it('logs', function(done) {
        console.log('b');
        done();
    });
    it("auth", function(done) {
        var auth = { appkey: 'localhost:3009' };

        request("http://localhost:3009")
            .post("/authenticate")
            .send(auth)
            .expect(200)

            //.expect('Location', '/listing')
            .end(function(err, res) {
                //if (err) return done(err);
                console.log(res.body)
                 expect(err).to.be.null;
                 //expect(res).to.have.status(200);

                //console.log(res.body.hasOwnProperty("token"));
                done();

            });

        //.expect("marcus is stored", done);
    });


});*/
