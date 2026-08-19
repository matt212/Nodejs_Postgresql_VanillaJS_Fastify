// let dep = require('./utils/dependentVariables.js')
// let baseAuthObj = require('../../app/config/baseAuth')

// let mod = Object.assign(
//   {},
//   {
//     Name: 'muser',
//     id: 'muserid',
//     type: 'base'
//   },
//   dep.baseUtilsRoutes
// )

// async function routes (fastify, options) {

//   fastify.get('/', async function (request, reply) {
//     let statusMsg = request.session.get('statusMessage')

//     return reply.view('../views/login/login.ejs', {
//       statusMessage: statusMsg
//     })
//   })


//   fastify.get('/login', async function (request, reply) {
//     let statusMsg = request.session.get('statusMessage')

//     return reply.view('../views/login/login.ejs', {
//       statusMessage: statusMsg
//     })
//   })


//   fastify.get(
//     '/getAccessToken',
//     { preValidation: [fastify.isSession] },
//     async function (req, reply) {
//       return reply.view('../views/login/accessTokenlisting.ejs')
//     }
//   )


//   fastify.post('/getToken', async function (request, reply) {

//     let Objappkey = {}

//     Objappkey.base = request.body.appkey

//     let token = fastify.jwt.sign(Objappkey)

//     return reply.send({
//       token: token
//     })

//   })


//   fastify.post(
//     '/logout',
//     { preValidation: [fastify.isSession] },
//     async (request, reply) => {

//       let token = request.session.get('userLoggedInfor')

//       if (token) {
//         request.session.delete()

//         return reply.send({
//           status: 'success',
//           redirect: '/login'
//         })
//       }

//       return reply.send({
//         status: 'failed'
//       })
//     }
//   )


//   fastify.post(
//     '/login',
//     { preValidation: [fastify.islogin] },
//     async (request, reply) => {

//       let token = request.session.get('userLoggedInfor')

//       if (token) {
//         return reply.send({
//           status: 'success',
//           redirect: request.session.get('redirectURL')
//         })
//       }

//       return reply.send({
//         status: 'failed'
//       })
//     }
//   )

// }

// module.exports = routes

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


  /*
   * Access-token listing page.
   *
   * This endpoint already requires a valid authenticated session.
   */
  fastify.get(
    '/getAccessToken',
    { preValidation: [fastify.isSession] },
    async function (req, reply) {
      return reply.view('../views/login/accessTokenlisting.ejs')
    }
  )


  /*
   * SECURITY FIX: CVE-001
   *
   * /getToken must NEVER sign attacker-controlled request.body.appkey.
   *
   * The previous implementation allowed:
   *
   *   unauthenticated request
   *        -> request.body.appkey
   *        -> fastify.jwt.sign()
   *
   * which made this endpoint an unauthenticated JWT signing oracle.
   *
   * The endpoint is now protected by isSession and the JWT payload is
   * constructed exclusively from the trusted RBAC information stored in
   * the authenticated server-side session.
   */
  fastify.post(
    '/getToken',
    { preValidation: [fastify.isSession] },
    async function (request, reply) {

      try {

        const sessionUserInfo =
          request.session.get('decodeduserLoggedInfor')

        if (
          !sessionUserInfo ||
          !Array.isArray(sessionUserInfo.base) ||
          sessionUserInfo.base.length === 0
        ) {
          return reply.code(401).send({
            status: 'fail',
            msgstatus: 'Authenticated user information is missing'
          })
        }

        /*
         * Do NOT use request.body.appkey here.
         *
         * The authorization information comes only from the server-side
         * authenticated session.
         */
        const trustedBase = sessionUserInfo.base

        /*
         * Extract the authenticated user ID from trusted RBAC data.
         */
        const userRecord = trustedBase.find(function (user) {
          return user &&
            user.muserID !== undefined &&
            user.muserID !== null
        })

        if (
          !userRecord ||
          userRecord.muserID === undefined ||
          userRecord.muserID === null
        ) {
          return reply.code(401).send({
            status: 'fail',
            msgstatus: 'Authenticated user ID is missing'
          })
        }

        /*
         * Explicitly construct the JWT payload.
         *
         * No request-body claims are copied into the token.
         */
        const tokenPayload = {
          base: trustedBase,
          sub: String(userRecord.muserID),
          tokenType: 'access'
        }

        /*
         * Keep token lifetime bounded.
         *
         * If the application's JWT registration already defines expiresIn,
         * this value can be omitted. Keeping it here makes the security
         * property explicit.
         */
        const token = fastify.jwt.sign(
          tokenPayload,
          {
            expiresIn: '1h'
          }
        )

        return reply.send({
          token: token
        })

      } catch (err) {

        fastify.log.error(err)

        return reply.code(500).send({
          status: 'fail',
          msgstatus: 'Unable to generate access token'
        })
      }
    }
  )


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

