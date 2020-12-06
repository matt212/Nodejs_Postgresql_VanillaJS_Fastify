 const pinoInspector = require('pino-inspector')
 const path = require('path')

const fastify = require('fastify')({
  logger: { prettyPrint: true, level: 'debug', prettifier: pinoInspector }
})
fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs')
  }
})

fastify.register(require('fastify-cors'))
fastify.register(require('fastify-jwt'), {
  secret: 'supersecret',
  expiresIn: "1h"
})


fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../') + "/public",
  // optional: default '/'
})




 fastify.register(require('../routes/customauth'), { prefix: '/' })
 fastify.register(require('../routes/emp_fastify'), { prefix: 'employees' })
 fastify.decorate("authenticate", async function (request, reply) {
  try {
    let token = request.headers["x-access-token"];

    if (token) {
      await fastify.jwt.verify(token, function (err, decoded) {
        if (err) {
          reply.send(err)
        } else {
          console.log("passed")
          // if everything is good, save to request for use in other routes
          request.decoded = decoded;
          return true
        }
      });
    }
    else {
      reply.send("Authentication Is required, Token Missing")
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
fastify.register(require('fastify-socket.io'), {
  // put your options here
})
// //using express for only swagger panel
var express = require("express");
var Swaggerapp = express();
const swaggerSpec = require('./configuration/swagger');
const swaggerUi = require("swagger-ui-express");
Swaggerapp.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
Swaggerapp.listen(3012, function () {
  console.log("Express server listening on port 3012");
});
