let dep = require('./utils/dependentVariables')
let mod = Object.assign(
  {},
  {
    Name: 'employees',
    id: 'employeesid',
    type: 'base'
  },
  dep.baseUtilsRoutes
)
var validatorSchema = require('./utils/' + mod.Name + '/payloadSchema')
async function routes (fastify, options) {
  fastify.get(
    '/',
    { preValidation: [fastify.isSession, fastify.isModuleAccess] },
    async (request, reply) => {
      dep.assignVariables(mod)
      let validationConfig = require('./utils/' +
        mod.Name +
        '/validationConfig.js')
      reply.header('x-token', request.session.get('userLoggedInfor'))
      reply.view(
        'employees/employees.ejs',
        dep.pageRenderObj(request, reply, validationConfig)
      )
    }
  )

  fastify.post(
    dep.routeUrls.searchtype[0],
    {
      config: dep.cGzip,
      schema: validatorSchema.searchLoadSchema,
      preValidation: [fastify.authenticate]
    },
    (request, reply) => {
      dep.assignVariables(mod)
      var req = {}
      req.body = request.body
      dep
        .searchtypePerf(req, reply, mod)
        .then(arg => {
          reply.code = 200
          reply.send(arg)
        })
        .catch(function (error) {
          reply.code(400).send(error.trim())
        })
    }
  )
  fastify.post(
    dep.routeUrls.searchtype[1],
    {
      config: dep.cGzip,
      schema: validatorSchema.searchLoadSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      // fastify.log.debug(request.body);
      dep.assignVariables(mod)
      var req = {}

      req.body = request.body
      dep
        .searchtype(req, reply, mod)
        .then(arg => {
          reply.send(arg)
        })
        .catch(function (error) {
          reply.code(400).send({ status: error.trim() })
        })
    }
  )
  fastify.post(
    dep.routeUrls.searchtypegroupby,
    {
      config: dep.cGzip,
      schema: validatorSchema.searchGroupbyJsonSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.assignVariables(mod)
      dep.SearchTypeGroupBy(request, reply, mod)
    }
  )
  fastify.post(
    dep.routeUrls.create,
    {
      schema: validatorSchema.insertLoadSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.assignVariables(mod)
      dep.createRecord(request, reply)
    }
  )
  fastify.post(
    dep.routeUrls.exportexcel,
    {
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.assignVariables(mod)
      dep.exportExcel(request, reply, mod, fastify)
    }
  )

  fastify.post(
    dep.routeUrls.uploadcontent,
    {
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.assignVariables(mod)
      return dep.uploadContent(request, reply)
    }
  )
  fastify.post(
    dep.routeUrls.update,
    {
      schema: validatorSchema.updateLoadSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.updateRecord(request, reply)
    }
  )
  fastify.post(
    dep.routeUrls.searchtypegroupbyId,
    {
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.assignVariables(mod)
      dep.searchtypegroupbyId(request, reply, mod)
    }
  )
  fastify.post(
    dep.routeUrls.delete,
    {
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.assignVariables(mod)
      dep.deleteHardRecord(request, reply)
    }
  )
  fastify.post(
    dep.routeUrls.pivotresult,
    {
      config: dep.cGzip,
      schema: validatorSchema.searchPivotJsonSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.assignVariables(mod)
      dep.pivotResult(request, reply, mod)
    }
  )
}

module.exports = routes
