const pinoInspector = require('pino-inspector')
const fastify = require('fastify')({
   logger: { prettyPrint: true, level: 'debug', prettifier: pinoInspector } 
})

fastify.register(require('fastify-cors'))
fastify.register(require('../routes/emp_fastify'), { prefix: 'employees' })

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
Swaggerapp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
Swaggerapp.listen(3012, function () {
  console.log("Express server listening on port 3012");
});
