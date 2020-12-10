let dep = require('./utils/dependentVariables.js')
var validatorSchema = require('./utils/employees/empSchema.js')
let mod = Object.assign(
  {},
  {
    Name: 'employees',
    id: 'employeesid',
    type: 'base'
  },
  dep.baseUtilsRoutes
)

async function routes (fastify, options) {
  fastify.get(
    '/',
    { preValidation: [fastify.isSession, fastify.isModuleAccess] },
    async (request, reply) => {
      dep.assignVariables(mod)
      let validationConfig = require('./utils/' +
        mod.Name +
        '/validationConfig.js')

      reply.view(
        '../views/employees/employees.ejs',
        dep.pageRenderObj(request, reply, validationConfig)
      )
    }
  )

  fastify.post(
    dep.routeUrls.searchtype[0],
    {
      schema: validatorSchema.searchLoadSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      dep.assignVariables(mod)
      var req = {}
      req.body = request.body
      dep.searchtypePerf(req, reply, mod).then(arg => {
        reply.code = 200
        reply.send(arg)
      })
    }
  )
  fastify.post(
    dep.routeUrls.searchtype[1],
    {
      schema: validatorSchema.searchLoadSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      // fastify.log.debug(request.body);
      dep.assignVariables(mod)
      var req = {}

      req.body = request.body
      dep.searchtype(req, reply, mod).then(arg => {
        reply.send(arg)
      })
    }
  )
  fastify.post(
    dep.routeUrls.searchtypegroupby,
    {
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
      dep.deleteRecord(request, reply)
    }
  )
  fastify.post(
    dep.routeUrls.pivotresult,
    {
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
