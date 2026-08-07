let dep = require('./utils/dependentVariables.js')
let baseAuthObj = require('../../app/config/baseAuth')

let mod = Object.assign(
  {},
  {
    Name: 'muser',
    id: 'muserid',
    type: 'base'
  },
  dep.baseUtilsRoutes
)

async function routes (fastify, options) {

  fastify.get('/', async function (request, reply) {
    let statusMsg = request.session.get('statusMessage')

    return reply.view('../views/login/login.ejs', {
      statusMessage: statusMsg
    })
  })


  fastify.get('/login', async function (request, reply) {
    let statusMsg = request.session.get('statusMessage')

    return reply.view('../views/login/login.ejs', {
      statusMessage: statusMsg
    })
  })


  fastify.get(
    '/getAccessToken',
    { preValidation: [fastify.isSession] },
    async function (req, reply) {
      return reply.view('../views/login/accessTokenlisting.ejs')
    }
  )


  fastify.post('/getToken', async function (request, reply) {

    let Objappkey = {}

    Objappkey.base = request.body.appkey

    let token = fastify.jwt.sign(Objappkey)

    return reply.send({
      token: token
    })

  })


  fastify.post(
    '/logout',
    { preValidation: [fastify.isSession] },
    async (request, reply) => {

      let token = request.session.get('userLoggedInfor')

      if (token) {
        request.session.delete()

        return reply.send({
          status: 'success',
          redirect: '/login'
        })
      }

      return reply.send({
        status: 'failed'
      })
    }
  )


  fastify.post(
    '/login',
    { preValidation: [fastify.islogin] },
    async (request, reply) => {

      let token = request.session.get('userLoggedInfor')

      if (token) {
        return reply.send({
          status: 'success',
          redirect: request.session.get('redirectURL')
        })
      }

      return reply.send({
        status: 'failed'
      })
    }
  )

}

module.exports = routes