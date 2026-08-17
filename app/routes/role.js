const dep = require('./utils/dependentVariables');
const mod = {
  Name: 'role',
  id: 'roleid',
  type: 'base',
  ...dep.baseUtilsRoutes
};
const validatorSchema = require(`./utils/${mod.Name}/payloadSchema`);
async function routes(fastify, options) {
  // GET ROLE PAGE
  fastify.get('/', {
    preValidation: [
      fastify.isSession,
      fastify.isModuleAccess
    ]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    const validationConfig = require(`./utils/${mod.Name}/validationConfig.js`);
    reply.header('x-token', request.session.get('userLoggedInfor'));
    return reply.view(`${mod.Name}/${mod.Name}.ejs`, dep.pageRenderObj(request, reply, validationConfig));
  });
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
      console.log(error)
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
      const result = await dep.searchtypeOptimizedBaseCountParamterized(req, mod)
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
  // CREATE
  fastify.post(dep.routeUrls.create, {
    schema: validatorSchema.insertLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      let result = await dep.createRecord(request, mod)
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
  // EXPORT EXCEL
  fastify.post(dep.routeUrls.exportexcel, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.exportExcel(request, reply, mod, fastify);
  });
  // UPLOAD CONTENT
  fastify.post(dep.routeUrls.uploadcontent, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.uploadContent(request, reply);
  });
  // UPDATE
  fastify.post(dep.routeUrls.update, {
    schema: validatorSchema.updateLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.updateRecord(request, reply);
  });
  // SEARCH TYPE GROUP BY ID
  fastify.post(dep.routeUrls.searchtypegroupbyId, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod);
      const result = await dep.searchtypegroupbyId(request, mod);
      return reply.code(200).send(result);
    } catch (error) {
      dep.captureErrorLog({
        error,
        url: dep.routeUrls.searchtypegroupbyId,
        modname: mod.Name,
        payload: request.body
      });
      return reply.code(400).send({
        status: error
      });
    }
  });
  // DELETE
  fastify.post(dep.routeUrls.delete, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.deleteHardRecord(request, reply);
  });
  // PIVOT RESULT
  fastify.post(dep.routeUrls.pivotresult, {
    config: dep.cGzip,
    schema: validatorSchema.searchPivotJsonSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.pivotResult(request, reply, mod);
  });
}
module.exports = routes;