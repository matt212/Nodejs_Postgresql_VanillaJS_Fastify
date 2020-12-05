
let dep = require("./utils/dependentVariables.js");
let mod = Object.assign(
  {},
  {
    Name: "employees",
    id: "employeesid",
    type: "base"
  },
  dep.baseUtilsRoutes
);

async function routes(fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
  

  fastify.post(dep.routeUrls.searchtype[0], {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    
    dep.assignVariables(mod);
    var req = {}

    req.body = request.body;
     dep.searchtypePerf(req, reply, mod).then(arg => {
     reply.send(arg)
    });
  })
  fastify.post(dep.routeUrls.searchtype[1],{
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    // fastify.log.debug(request.body);
    dep.assignVariables(mod);
    var req = {}

    req.body = request.body;
     dep.searchtype(req, reply, mod).then(arg => {
      reply.send(arg)
    });
  })
}

module.exports = routes