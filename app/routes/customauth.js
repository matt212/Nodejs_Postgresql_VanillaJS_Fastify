
let dep = require("./utils/dependentVariables.js");
let baseAuthObj = require('../../app/config/baseAuth');
let mod = Object.assign(
  {},
  {
    Name: "muser",
    id: "muserid",
    type: "base"
  },
  dep.baseUtilsRoutes
);

async function routes(fastify, options) {


  fastify.get('/login', function (req, reply) {
    
    reply.view('../views/login/login.ejs');
  })
  fastify.get('/getAccessToken', { preValidation: [fastify.isSession] }, async function (req, reply) {

    return reply.view('../views/login/accessTokenlisting.ejs');
  })
  fastify.post('/getToken', function (request, reply) {
    var Objappkey = {};
    Objappkey.base = request.body.appkey;
    var token = fastify.jwt.sign(Objappkey);
    reply.send({ token: token })
  })
  fastify.post(
    "/login",
    { preValidation: [fastify.islogin] },
    async (request, reply, err) => {

      let token = request.session.get('userLoggedInfor');

      if (token) {
        console.log(request.session.get('redirectURL'))

        reply.send({ status: "success", redirect: request.session.get('redirectURL') })
      }

    }
  );


}

module.exports = routes