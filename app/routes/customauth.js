
let dep = require("./utils/dependentVariables.js");
let baseAuthObj = require('../../app/config/baseAuth');
let mod = Object.assign(
  {},
  {
    Name: "muser",
    id: "muserid",
    type: "base"
  },
  dep.baseUtilsRoutes
);

async function routes(fastify, options) {


  fastify.get('/login', function (req, reply) {
    //reply.view('/views/login/index.ejs', { text: 'text' })
    reply.view('../views/login/login.ejs',{'msgstatus': ''}); // serving path.join(__dirname, 'public', 'myHtml.html') directly
  })
  fastify.get('/getAccessToken', async function (req, reply) {
    //reply.view('/views/login/index.ejs', { text: 'text' })
    return reply.view('../views/login/accessTokenlisting.ejs'); // serving path.join(__dirname, 'public', 'myHtml.html') directly
  })
  fastify.post('/getToken', function (request, reply) {
    var Objappkey = {};
    Objappkey.base = request.body.appkey;
    var token = fastify.jwt.sign(Objappkey);
    reply.send({ token: token })
  })
  fastify.post(
    "/login",
    { preValidation: [fastify.islogin] },
    async (request, reply, err) => {
      console.log(request.session.get('userLoggedInfor'))
      
      let token = request.session.get('userLoggedInfor');
      
      
      if(token)
      {
        console.log(request.session.get('redirectURL'))
        
        reply.send({status:"success",redirect:request.session.get('redirectURL')})
      }  
      
    }
  );
  
  // fastify.post('/login', async (request, reply) => {

  //   dep.assignVariables(mod);
  //   var req={}
  //    req.body =
  //   {
  //     "searchparam": [
  //       {
  //         "username": [
  //           request.body.username
  //         ]
  //       },
  //       {
  //         "password": [
  //           request.body.password
  //         ]
  //       }
  //     ],
  //     "daterange": {
  //       "startdate": "1982-12-30",
  //       "enddate": "2019-01-29"
  //     },
  //     "colsearch": "createdAt",
  //     "datecolsearch": "created_date",
  //     "pageno": 0,
  //     "pageSize": 20,
  //     "searchtype": "Columnwise",
  //     "disableDate":true
  //   }
    
  //   dep.searchtype(req, reply, mod).then(arg => {
  //     reply.send(arg)
  //   });
  // })

}

module.exports = routes