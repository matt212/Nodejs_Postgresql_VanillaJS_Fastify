const pinoInspector = require('pino-inspector')
const path = require('path')

const fastify = require('fastify')({
  logger: { prettyPrint: true, level: 'debug', prettifier: pinoInspector }
})

fastify.register(require('fastify-cors'),{
})
fastify.register(require('fastify-jwt'), {
  secret: 'supersecret',
})


fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../') + "/public",
   // optional: default '/'
})

fastify.get('/getAccessToken', function (req, reply) {
  return reply.sendFile('admin/html/accessTokenlisting.html'); // serving path.join(__dirname, 'public', 'myHtml.html') directly
})
fastify.register(require('../routes/emp_fastify'), { prefix: 'employees' })

fastify.post('/getToken', function (request, reply) {
  
  var red = {};
  red.base =request.body.appkey;
  var token = fastify.jwt.sign("abc123");

  reply.send({ token: token })
})
fastify.decorate("authenticate",  function(request, reply) {
  try {
    
    {
      
      let token = request.headers["x-access-token"];
      console.log(request.headers);
      //request.jwtVerify()
      console.log(token)
      if (token) {
        request.jwtVerify(token, function (err, decoded) {
          if (err) {
            console.log(err)
            // return ({
            //   success: false,
            //   message: "Failed to authenticate token."
            // });
          } else {
            // if everything is good, save to request for use in other routes
            request.decoded = decoded;
            
          }
        });
      }
      
    }
    
  } catch (err) {
    reply.send(err)
  }
})

// Run the server!
fastify.listen(3011, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
//using express for only swagger panel
var express = require("express");
var Swaggerapp = express();
const swaggerSpec = require('./configuration/swagger');
const swaggerUi = require("swagger-ui-express");
Swaggerapp.use('/documentations', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
Swaggerapp.listen(3012, function () {
  console.log("Express server listening on port 3012");
});
