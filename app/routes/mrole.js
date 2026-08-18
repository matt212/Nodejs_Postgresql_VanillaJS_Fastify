const dep = require('./utils/dependentVariables');
const mod = {
  Name: 'mrole',
  id: 'mroleid',
  type: 'mrole',
  ...dep.baseUtilsRoutes
};
const validatorSchema = require(`./utils/${mod.Name}/payloadSchema`);
async function routes(fastify, options) {
  fastify.get('/', {
    preValidation: [
      fastify.isSession,
      fastify.isModuleAccess
    ]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    const validationConfig = require(`./utils/${mod.Name}/validationConfig.js`);
    reply.header('x-token', request.session.get('userLoggedInfor'))
    const ejsRelease = request.session.get('releaseEnv') === 'public-release' ? '-release' : ''
    return reply.view(`${mod.Name}/${mod.Name}${ejsRelease}.ejs`, dep.pageRenderObj(request, reply, validationConfig))
  });
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
        req.ismultiselect=true;
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
  fastify.post(dep.routeUrls.searchtypegroupby, {
    config: dep.cGzip,
    schema: validatorSchema.searchGroupbyJsonSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    // dep.assignVariables(mod);
    // return dep.SearchTypeGroupBy(request, reply, mod);
    try {
          dep.assignVariables(mod)
          request.ismultiselect=true;
          console.log("searchparamkey*******")
          console.log(request.body)
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
  });
  fastify.post(dep.routeUrls.create, {
    schema: validatorSchema.insertLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.createRecord(request, mod);
  });
  fastify.post(dep.routeUrls.exportexcel, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.exportExcel(request, reply, mod, fastify);
  });
  fastify.post(dep.routeUrls.uploadcontent, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.uploadContent(request, reply);
  });
  fastify.post(dep.routeUrls.update, {
    schema: validatorSchema.updateLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.updateRecord(request, reply);
  });
  fastify.post(dep.routeUrls.searchtypegroupbyId, {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      dep.assignVariables(mod)
      const result = await dep.searchtypegroupbyId(request, reply, mod)
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
  fastify.post(dep.routeUrls.delete, {
  preValidation: [fastify.authenticate]
}, async (request, reply) => {
  dep.assignVariables(mod);

  const result = await dep.deleteHardRecord(request);

  return reply.code(200).send(result);
});
  fastify.post(dep.routeUrls.pivotresult, {
    config: dep.cGzip,
    schema: validatorSchema.searchPivotJsonSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.pivotResult(request, reply, mod);
  });
  fastify.post(dep.routeUrls.bulkCreate, {
    config: dep.cGzip,
    schema: validatorSchema.insertBulkLoadSchema,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.bulkCreate(request, reply);
  });
  fastify.post(dep.routeUrls.customDestroy, {
    config: dep.cGzip,
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    dep.assignVariables(mod);
    return dep.customDestroy(request, reply);
  });
}
module.exports = routes;