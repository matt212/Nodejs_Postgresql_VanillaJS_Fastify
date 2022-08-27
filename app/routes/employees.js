const { isError } = require('util')
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
async function routes(fastify, options) {
  fastify.get(
    '/',
    { preValidation: [fastify.isSession, fastify.isModuleAccess] },
    async (request, reply) => {
      try {
        dep.assignVariables(mod)
        let validationConfig = require('./utils/' +
          mod.Name +
          '/validationConfig.js')
        reply.header('x-token', request.session.get('userLoggedInfor'))
        let ejsRelease = (request.session["releaseEnv"] == "public-release" ? '-release' : '')
        
        reply.view(
          `${mod.Name}/${mod.Name}${ejsRelease}.ejs`,
          dep.pageRenderObj(request, reply, validationConfig)
        )
      } catch (error) {
        dep.captureErrorLog({ "error": error, "url":"/", "modname": mod.Name, "payload": request.body })
        
      }
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
          dep.captureErrorLog({ "error": error,"url":dep.routeUrls.searchtype[0], "modname": mod.Name, "payload": request.body })
          
          reply.code(400).send(error)
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

      //dep.searchtype
      dep
        //.searchtypeOptimizedBase(req, reply, mod)
        .searchtypeOptimizedBaseParameterized(req, reply, mod)
        .then(arg => {
          reply.send(arg)
        })
        .catch(function (error) {
          dep.captureErrorLog({ "error": error,"url":dep.routeUrls.searchtype[1], "modname": mod.Name, "payload": request.body })
          
          reply.code(400).send({ status: error })
        })
    }
  )


  fastify.post(
    dep.routeUrls.searchtype[2],
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
      //dep.searchtype
      dep
        .searchtypeOptimizedBaseCountParamterized(req, reply, mod)
        .then(arg => {
          reply.send(arg)
        })
        .catch(function (error) {
          dep.captureErrorLog({ "error": error,"url":dep.routeUrls.searchtype[2], "modname": mod.Name, "payload": request.body })
          
          reply.code(400).send({ status: error })
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
      try {
      dep.assignVariables(mod)
      dep.SearchTypeGroupBy(request, reply, mod)
    }
   catch (error) {
    dep.captureErrorLog({ "error": error,"url":dep.routeUrls.searchtypegroupby, "modname": mod.Name, "payload": request.body })
    
  }
})
  fastify.post(
    dep.routeUrls.create,
    {
      schema: validatorSchema.insertLoadSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        dep.assignVariables(mod)
        dep.createRecord(request, reply)
      } catch (error) {
        dep.captureErrorLog({ "error": error,"url":dep.routeUrls.create, "modname": mod.Name, "payload": request.body })
        
      }
    }
  )
  fastify.post(
    dep.routeUrls.exportexcel,
    {
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        dep.assignVariables(mod)
        dep.exportExcel(request, reply, mod, fastify)
      } catch (error) {
        dep.captureErrorLog({ "error": error,"url":dep.routeUrls.exportexcel, "modname": mod.Name, "payload": request.body })
        
      }
    }
  )

  fastify.post(
    dep.routeUrls.uploadcontent,
    {
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        dep.assignVariables(mod)
        return dep.uploadContent(request, reply)
      } catch (error) {

        dep.captureErrorLog({ "error": error,"url":dep.routeUrls.uploadcontent, "modname": mod.Name, "payload": request.body })
        
      }
    }
  )
  fastify.post(
    dep.routeUrls.update,
    {
      schema: validatorSchema.updateLoadSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        dep.updateRecord(request, reply)
      } catch (error) {
        dep.captureErrorLog({ "error": error,"url":dep.routeUrls.update, "modname": mod.Name, "payload": request.body })
        
      }
    }
  )
  fastify.post(
    dep.routeUrls.searchtypegroupbyId,
    {
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        dep.assignVariables(mod)
        dep.searchtypegroupbyId(request, reply, mod)
      } catch (error) {
        dep.captureErrorLog({ "error": error,"url":dep.routeUrls.searchtypegroupbyId, "modname": mod.Name, "payload": request.body })
        
      }
    }
  )
  fastify.post(
    dep.routeUrls.delete,
    {
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        dep.assignVariables(mod)
        dep.deleteHardRecord(request, reply)
      } catch (error) {
        dep.captureErrorLog({ "error": error,"url":dep.routeUrls.delete, "modname": mod.Name, "payload": request.body })
        
      }
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
      //dep.pivotResult(request, reply, mod)
      //dep.isPivotCache(request, reply, mod)
      //isPivotCacheOptimized
      dep
        .isPivotCacheOptimized(request, reply, mod)
        .then(arg => {
          reply.code = 200

          reply.send(arg)
        })
        .catch(function (error) {
          dep.captureErrorLog({ "error": error,"url":dep.routeUrls.pivotresult, "modname": mod.Name, "payload": request.body })
          
          reply.code(400).send(error)
        })
    }
  )
}

module.exports = routes
