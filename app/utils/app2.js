const fastify = require('fastify')({
    logger: false
  })
  
  // Declare a route
 
  fastify.register(require('../routes/emp_fastify'), { prefix: 'emp' })
  
  // Run the server!
  fastify.listen(3011, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })