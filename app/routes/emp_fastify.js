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
      config: {
        compress: {
          threshold: 128,
        }
      },
      schema: validatorSchema.searchLoadSchema,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      // dep.assignVariables(mod)
      // var req = {}
      // req.body = request.body
      // dep.searchtypePerf(req, reply, mod).then(arg => {
      //   reply.code = 200
      //   reply.send(arg)
      // })
      reply.send({
        "rows": [
          {
            "employeesid": 20667907,
            "first_name": "Xinglin",
            "last_name": "Morrin",
            "gender": "F",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667906,
            "first_name": "Xinglin",
            "last_name": "Morrin",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667905,
            "first_name": "Ortrud",
            "last_name": "Binding",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667904,
            "first_name": "Gennady",
            "last_name": "Thiran",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667903,
            "first_name": "Goh",
            "last_name": "Demke",
            "gender": "F",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667902,
            "first_name": "Taegyun",
            "last_name": "Zschoche",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667901,
            "first_name": "Sugwoo",
            "last_name": "Muniz",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667900,
            "first_name": "Haldun",
            "last_name": "Peek",
            "gender": "F",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667899,
            "first_name": "Tsz",
            "last_name": "England",
            "gender": "F",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667898,
            "first_name": "Gererd",
            "last_name": "Plesums",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667897,
            "first_name": "Prasadram",
            "last_name": "Dusink",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667896,
            "first_name": "Basem",
            "last_name": "Ashish",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667895,
            "first_name": "Lenore",
            "last_name": "Schieder",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667894,
            "first_name": "Francesca",
            "last_name": "Covnot",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667893,
            "first_name": "Aiman",
            "last_name": "Vecchi",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667892,
            "first_name": "Mechthild",
            "last_name": "Luft",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667891,
            "first_name": "Goh",
            "last_name": "Ermel",
            "gender": "F",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667890,
            "first_name": "Dzung",
            "last_name": "Candan",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667889,
            "first_name": "Mabry",
            "last_name": "Berstel",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          },
          {
            "employeesid": 20667888,
            "first_name": "Sanjiv",
            "last_name": "Frezza",
            "gender": "M",
            "birth_date": "2018-01-11T18:30:00.000Z",
            "recordstate": true,
            "created_date": "2019-02-28T16:38:09.849Z",
            "updated_date": "2019-02-28T16:38:09.849Z"
          }
        ],
        "count": "2088338"
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
