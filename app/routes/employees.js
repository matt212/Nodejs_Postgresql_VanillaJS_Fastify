let dep = require('./utils/dependentVariables')
let mod = Object.assign({}, {
  Name: 'employees',
  id: 'employeesid',
  type: 'base'
}, dep.baseUtilsRoutes)
var validatorSchema = require('./utils/' + mod.Name + '/payloadSchema')
async function routes(fastify, options) {
  /*
   * GET Employees page
   */
  fastify.get('/', {
    preValidation: [fastify.isSession, fastify.isModuleAccess]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const validationConfig = require('./utils/' + mod.Name + '/validationConfig.js')
      reply.header('x-token', request.session.get('userLoggedInfor'))
      const ejsRelease = request.session.get('releaseEnv') === 'public-release' ? '-release' : ''
      
      return reply.view(`${mod.Name}/${mod.Name}${ejsRelease}.ejs`, dep.pageRenderObj(request, reply, validationConfig))
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: '/',
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(500).send({
        error: 'Internal Server Error'
      })
    }
  })
  /*
   * SEARCH TYPE - Load
   */
  fastify.post(dep.routeUrls.searchtype[0], {
    config: dep.cGzip,
    schema: validatorSchema.searchLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const req = {
        body: request.body
      }
      const result = await dep.searchtypePerf(req, mod)
      return reply.code(200).send(result)
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.searchtype[0],
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
  /*
   * SEARCH TYPE - Optimized
   */
  fastify.post(dep.routeUrls.searchtype[1], {
    config: dep.cGzip,
    schema: validatorSchema.searchLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const req = {
        body: request.body
      }
      const result = await dep.searchtypeOptimizedBaseParameterized(req, mod)
      return reply.code(200).send(result)
    } catch (error) {
      
      return reply.code(400).send({
        status: error.toString()
      })
    }
  })
  /*
   * SEARCH TYPE - Count
   */
  fastify.post(dep.routeUrls.searchtype[2], {
    config: dep.cGzip,
    schema: validatorSchema.searchLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const req = {
        body: request.body
      }
      const result = await dep.searchtypeOptimizedBaseCountParamterizedCached(req, mod)
      return reply.code(200).send(result)
    } catch (error) {
      dep.captureErrorLog({
        error: error.stack.toString(),
        url: dep.routeUrls.searchtype[2],
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
  /*
   * SEARCH TYPE GROUP BY
   */
  fastify.post(dep.routeUrls.searchtypegroupby, {
    config: dep.cGzip,
    schema: validatorSchema.searchGroupbyJsonSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const result = await dep.SearchTypeGroupByParameterized(request, mod)
      return reply.code(200).send(result)
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.searchtypegroupby,
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
  /*
   * CREATE RECORD
   */
  fastify.post(dep.routeUrls.create, {
    schema: validatorSchema.insertLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      let result = await dep.createRecord(request, mod)
      dep.clearCountCache()
      return reply.code(200).send(result)
    } catch (error) {
      dep.captureErrorLog({
        error: error.stack.toString(),
        url: dep.routeUrls.create,
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
  /*
   * EXPORT EXCEL
   */
  fastify.post(dep.routeUrls.exportexcel, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const result = await dep.exportExcel(request, reply, mod, fastify)
      return result
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.exportexcel,
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
  /*
   * UPLOAD CONTENT
   */
  fastify.post(dep.routeUrls.uploadcontent, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const result = await dep.uploadContent(request, reply)
      return result
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.uploadcontent,
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
  /*
   * UPDATE RECORD
   */
  fastify.post(dep.routeUrls.update, {
    schema: validatorSchema.updateLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const result = await dep.updateRecord(request, reply)
      dep.clearCountCache()
      return reply.code(200).send(result)
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.update,
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
  /*
   * SEARCH TYPE GROUP BY ID
   */
  fastify.post(dep.routeUrls.searchtypegroupbyId, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const result = await dep.searchtypegroupbyId(request, mod)
      return reply.code(200).send(result)
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.searchtypegroupbyId,
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
  /*
   * DELETE RECORD
   */
  fastify.post(dep.routeUrls.delete, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const result = await dep.deleteHardRecord(request)
      dep.clearCountCache()
      return reply.code(200).send(result)
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.delete,
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(500).send({
        status: 'failed',
        error: error.message
      })
    }
  })
  /*
   * PIVOT RESULT
   */
  fastify.post(dep.routeUrls.pivotresult, {
    config: dep.cGzip,
    schema: validatorSchema.searchPivotJsonSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const result = await dep.isPivotCacheOptimized(request, reply, mod)
      return reply.code(200).send(result)
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.pivotresult,
        modname: mod.Name,
        payload: request.body
      })
      return reply.code(400).send({
        status: error
      })
    }
  })
}
module.exports = routes