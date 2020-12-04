const { resolve } = require("bluebird");
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
  
async function routes (fastify, options) {
    fastify.get('/',  async(request, reply) => {
        return { hello: 'world' }
      })
      fastify.get(dep.routeUrls.searchtype[0],  async(request, reply) => {
        dep.assignVariables(mod);
        var req={}
         req.body={
          "searchparam": "NA",
          "daterange": {
            "startdate": "1982-12-30",
            "enddate": "2019-01-29"
          },
          "colsearch": "createdAt",
          "datecolsearch": "birth_date",
          "pageno": 0,
          "pageSize": 20
        }
               
        return dep.searchtype(req, reply, mod).then(arg => {
            
            return arg
         }); 
      })
  }
  
  module.exports = routes