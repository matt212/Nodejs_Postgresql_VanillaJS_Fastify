var supertest = require("supertest");
//var should = require("should");

var should = require('chai').should();
var should = require('chai').expect();

before(async () => {
    require('../../app/utils/app.js')
});


// This agent refers to PORT where program is running.

var server = supertest.agent("http://localhost:3009");

// UNIT test begin

describe("base test ", function () {
    // #1 should return home page

    var auth = { appkey: "localhost:3009" };

    it("auth", function (done) {
        //calling ADD api
        server
            .post("/authenticate")
            .send(auth)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    console.log(err)
                    return done(err)
                };
                console.log(res.body);
                //res.status.should.equal(200);
                res.body.should.include.keys(["token"]);
                //res.body.error.should.equal(false);
                done();

            });
    });

    it("should login", function (done) {
        var user = { username: "krennic", password: "orson" };

        server
            .post("/login")
            .send(user)
            .expect(302)
            .expect("Location", "/listing")
            .end(function (err, res) {
                if (err) {
                    console.log(err)
                    return done(err)
                };
                done();
            });
    });
});

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
