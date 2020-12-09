 const pinoInspector = require('pino-inspector')
 const path = require('path')
 const fs = require('fs')
 const fastify = require('fastify')({
 // logger: { prettyPrint: true, level: 'debug', prettifier: pinoInspector }
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


fastify.register(require('fastify-secure-session'), {
  secret: 'averylogphrasebiggerthanfortytwochars',
  salt: 'mq9hDxBVDbspDR6n',
  cookie: {
    path: '/',
    secure:false
    // options for setCookie, see https://github.com/fastify/fastify-cookie
  }
})
fastify.register(require('../../app/config/baseAuth'))
fastify.register(require('../routes/customauth'), { prefix: '/' })
fastify.register(require('../routes/emp_fastify'), { prefix: 'employees' })
 

// Run the server!
fastify.listen(3011, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
// fastify.register(require('fastify-socket.io'), {
//   // put your options here
// })
// //using express for only swagger panel
var express = require("express");
var Swaggerapp = express();
const swaggerSpec = require('./configuration/swagger');
const swaggerUi = require("swagger-ui-express");
Swaggerapp.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
Swaggerapp.listen(3012, function () {
  console.log("Express server listening on port 3012");
});
