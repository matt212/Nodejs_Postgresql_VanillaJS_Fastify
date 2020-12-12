const { resolve } = require('bluebird')
var supertest = require('supertest')
//var should = require("should");

var should = require('chai').should()

before(async () => {
  require('../app2.js')
})

// This agent refers to PORT where program is running.

var server = supertest.agent('http://localhost:3011')

// UNIT test begin
let loginsuccess=function(cred)
{
  return promise = new Promise((resolve, reject) => {
  
  var user = cred
    server
      .post('/login')
      .send(user)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          resolve({status:'fail',content:err})
          //return done(err)
        }

        res.body.status.should.equal('success')
        res.body.redirect.should.equal('/employees')
        resolve({status:'pass'})
      })
    })
}
describe('Crud', function () {
  // #1 should return home page

  it('Throws Validation Message when Input fields are empty or blank', function (done) {
    //calling ADD api
    loginsuccess({ username: 'krennic', password: 'orson' }).then(function(data)
    {
      if(data.status=="pass")
      {
        server
        .get('/employees')
        .expect('Content-type', /text\/html/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            console.log(err)
            return done(err)
          }
  
          //res.status.should.equal(200);
          //res.body.should.include.keys(['token'])
          
          var sessionval=(Object.keys(res))
          console.log(sessionval)
                 
          done()
        })
    
      }
      else
      {
        done("fail")
      }
    })
    
  })
  
    
  })