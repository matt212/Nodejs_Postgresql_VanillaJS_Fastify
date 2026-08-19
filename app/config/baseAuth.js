// const models = require('../models')
// const connections = require('./db')
// const superadmin = require('./superadmin.json')
// const fastifyPlugin = require('fastify-plugin')
// async function baseDecorator (fastify, options) {
//   let jwtverify = function (token) {
//     return new Promise(function (resolve, reject) {
//       fastify.jwt.verify(token, function (err, decoded) {
//         if (err) {
//           reject(err)
//         } else {
//           // if everything is good, save to request for use in other routes
//           resolve(decoded)
//         }
//       })
//     })
//   }

//   fastify.decorate('authenticate', async function (request, reply) {
//     try {
//       let token = request.headers['x-access-token']

//       if (token) {
//         await fastify.jwt.verify(token, function (err, decoded) {
//           if (err) {
//             reply.code = 401
//             reply.send({ status: 'fail', msgstatus: err })
//           } else {
//             // if everything is good, save to request for use in other routes
//             request.decoded = decoded
//             return true
//           }
//         })
//       } else {
//         reply.code = 401
//         reply.send('Authentication Is required, Token Missing')
//       }
//     } catch (err) {
//       reply.send(err)
//     }
//   })
//   fastify.decorate('isSession', async function (request, reply) {
//     try {
//       let token = request.session.get('userLoggedInfor')

//       if (token) {
//         await fastify.jwt.verify(token, function (err, decoded) {
//           if (err) {
//             reply.redirect('/login')
//           } else {
//             // if everything is good, save to request for use in other routes
//             request.decoded = decoded
//             request.session.set('decodeduserLoggedInfor', decoded)

//             return true
//           }
//         })
//       } else {
//         request.session.set('intendedredirect', request.url)
//         reply.redirect('/login')
//       }
//     } catch (err) {
//       reply.send(err)
//     }
//   })
//   fastify.decorate(
//   'islogin',
//   async function (
//     request,
//     reply,
//     basestate = {
//       successRedirect: '/employees',
//       failureRedirect: '/login'
//     }
//   ) {

//     try {

//       const user = await models.muser.findOne({
//         where: {
//           username: request.body.username,
//           password: request.body.password
//         },
//         attributes: [
//           'email',
//           'username',
//           'muserid'
//         ]
//       })


//       if (!user) {

//         return reply.send({
//           status: 'fail',
//           msgstatus: 'Invalid Username/Password'
//         })

//       }


//       const data = await rbac(user.dataValues.muserid)


//       const ObjLoggedinfo = {}

//       ObjLoggedinfo.base = data


//       const token = fastify.jwt.sign(ObjLoggedinfo)


//       request.session.set(
//         'userLoggedInfor',
//         token
//       )


//       if (request.session.get('intendedredirect')) {

//         request.session.set(
//           'redirectURL',
//           request.session.get('intendedredirect')
//         )

//       } else {

//         request.session.set(
//           'redirectURL',
//           basestate.successRedirect || '/employees'
//         )

//       }


//       return


//     } catch (err) {

//       fastify.log.error(err)

//       return reply.send({
//         status: 'no login'
//       })

//     }

//   }
// )
//   fastify.decorate('isPayLoadSecure', async function (request, reply) {

//   var re = /ALTER|alter|CREATE|create|DELETE|delete|DROP|drop|EXECUTE|execute|INSERT|insert|MERGE|merge|select|SELECT|update|UPDATE|UNION|union/

//   let vali = new RegExp(re)

//   if (!request.body.searchparam.includes("NA")) {

//     if (vali.test(JSON.stringify(request.body.searchparam))) {

//       return reply.code(403).send({
//         status: "SQL injection detected - Bad Request"
//       })

//     }

//   }

//   return

// })
//   fastify.decorate('isModuleAccess', async function (request, reply) {

//   let baseurlar = request.raw.url.split('/')

//   let fileusers = request.session.get('decodeduserLoggedInfor')?.base


//   // check if module/page exists in db
//   if (fileusers !== undefined) {

//     fileusers = fileusers.map(function (doctor) {
//       return (
//         doctor.Modulename
//           .toString()
//           .split(',')
//           .indexOf(baseurlar[1]) > -1
//       )
//     })


//     if (fileusers.toString().indexOf('true') > -1) {

//       // authorized
//       return

//     } else {

//       // not authorized
//       request.session.set(
//         'statusMessage',
//         'you are not authorized to view that module'
//       )

//       return reply.redirect('/login')

//     }


//   } else {

//     request.session.set(
//       'statusMessage',
//       'Session expire Please re login'
//     )

//     return reply.redirect('/login')

//   }

// })

//   let rbac = function (id) {
//     return new Promise((resolve, reject) => {
//       var sqlstatement = ''
//       if (id == 1 || id == 2) {
//         sqlstatement =
//           `select array_agg(DISTINCT Mname) Modulename 
//           from 
//           ( 
//           select Mname 
//           from modname limit 100 offset 0 
//           ) as a`
//       } else {
//         //sqlstatement = 'set @_total = 0;  call shitgotdeep.utils(' + id + ', 1, @_total); select @_total;`

//         sqlstatement =
//           `select   ROLEID as RoleID,Rolename,  isactive ,muserid,
//            string_agg(distinct ModID::text,',') as ModID, 
//            string_agg(distinct Modulename,',')as Modulename, 
//            string_agg(distinct Accestype,',') as accesstype , 
//            string_agg(distinct mroleID::text,',') as mroleID from 
//            ( 
//            select ur.muserid,r.mroleid, r.recordstate as isactive,rl.roleid AS ROLEID,n.modnameID as modID, n.Mname as Modulename,rl.rolename as Rolename, r.accesstype as Accestype
//            from mrole r
//            left join modname n on r.modulename::int=n.modnameid
//            left join role rl on r.rolename::int=rl.roleid
//            join userrolemapping ur on ur.muserid=${id}
//           )
//            as a  GROUP BY ROLEID,Rolename,isactive,muserid`
//       }

//       connections
//         .query(sqlstatement)
//         .then(result => {
//           var projects = result.rows

//           if (id == 1 || id == 2) {
//             //console.log(superadmin);

//             var tempsuperadmin = superadmin

//             if (projects.length <= 1) {
//               tempsuperadmin[0].slidenav = tempsuperadmin[0].Modulename.toString().split(
//                 ','
//               )
//               tempsuperadmin = tempsuperadmin.filter(function (doctor) {
//                 return doctor.muserID == id // if truthy then keep item
//               })

//               resolve(tempsuperadmin)
//             } else {
//               tempsuperadmin[0].slidenav = projects[0].modulename
//               tempsuperadmin[0].Modulename = projects[0].modulename.toString()

//               resolve(tempsuperadmin)
//             }
//           } else {
//             var doctors = projects.map(function (doctor) {
//               return {
//                 // return what new object will look like
//                 Rolename: doctor.rolename,
//                 isactive: doctor.isactive,
//                 muserID: doctor.muserid,
//                 Accestype: doctor.accesstype,
//                 Modulename: doctor.modulename.split(',')
//               }
//             })

//             //in order to built slidenav we are extracting and building single unique stack of elements
//             var joctors = doctors.map(function (doctor) {
//               return doctor.Modulename
//             })

//             var jyn = joctors.toString().split(',')
//             var jyn = jyn.filter(function (item, i, ar) {
//               return ar.indexOf(item) === i
//             })

//             doctors[0].slidenav = jyn

//             resolve(doctors)
//           }
//           //callback(null, logiblock);
//         })
//         .catch(err => {
//           console.error('error running query', err)
//           //res.json(err)
//         })
//     })
//   }
// }
// module.exports = fastifyPlugin(baseDecorator)


const models = require('../models')
const connections = require('./db')
const superadmin = require('./superadmin.json')
const fastifyPlugin = require('fastify-plugin')


async function baseDecorator (fastify, options) {

  /*
   * Verify JWT and return decoded payload.
   *
   * Kept as a helper because other application code may use it.
   */
  let jwtverify = function (token) {
    return new Promise(function (resolve, reject) {

      fastify.jwt.verify(token, function (err, decoded) {

        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }

      })
    })
  }


  /*
   * ============================================================
   * AUTHENTICATE
   * ============================================================
   *
   * SECURITY FIX: CVE-001
   *
   * The previous implementation only verified that the JWT signature
   * was valid.
   *
   * That was unsafe because /getToken allowed an unauthenticated
   * attacker to obtain a server-signed JWT containing attacker-controlled
   * authorization information.
   *
   * This implementation:
   *
   * 1. Requires x-access-token.
   * 2. Cryptographically verifies the JWT.
   * 3. Requires a valid subject (muserID).
   * 4. Verifies that the user actually exists.
   * 5. Rebuilds authorization/RBAC information from the database.
   * 6. Does NOT trust authorization claims supplied inside the JWT.
   *
   * This means a JWT claim such as:
   *
   *   { muserID: 999999, Modulename: ["employees"] }
   *
   * cannot independently grant access.
   */
  fastify.decorate('authenticate', async function (request, reply) {

    try {

      const token = request.headers['x-access-token']

      /*
       * Token is mandatory.
       */
      if (
        !token ||
        typeof token !== 'string' ||
        !token.trim()
      ) {
        return reply
          .code(401)
          .send({
            status: 'fail',
            msgstatus: 'Authentication Is required, Token Missing'
          })
      }


      /*
       * Verify JWT signature and registered JWT validation rules.
       */
      let decoded

      try {

        decoded = await jwtverify(token)

      } catch (err) {

        return reply
          .code(401)
          .send({
            status: 'fail',
            msgstatus: 'Invalid or expired authentication token'
          })
      }


      /*
       * The access token generated by the fixed /getToken endpoint
       * contains the authenticated user ID in `sub`.
       *
       * Do not trust arbitrary authorization information contained
       * inside `base`.
       */
      if (
        !decoded ||
        decoded.sub === undefined ||
        decoded.sub === null ||
        String(decoded.sub).trim() === ''
      ) {
        return reply
          .code(401)
          .send({
            status: 'fail',
            msgstatus: 'Invalid authentication subject'
          })
      }


      /*
       * Only integer user IDs are accepted.
       */
      const userId = Number(decoded.sub)

      if (!Number.isSafeInteger(userId) || userId <= 0) {

        return reply
          .code(401)
          .send({
            status: 'fail',
            msgstatus: 'Invalid authentication subject'
          })
      }


      /*
       * Verify that the authenticated user still exists.
       *
       * This prevents a token containing an arbitrary/removed user ID
       * from becoming an authentication credential.
       */
      const user = await models.muser.findOne({
        where: {
          muserid: userId
        },
        attributes: [
          'email',
          'username',
          'muserid'
        ]
      })


      if (!user) {

        return reply
          .code(401)
          .send({
            status: 'fail',
            msgstatus: 'Authenticated user does not exist'
          })
      }


      /*
       * Rebuild authorization data from the database.
       *
       * NEVER use decoded.base as the authoritative RBAC source.
       *
       * The token merely identifies the user.
       * Current authorization is obtained from rbac(userId).
       */
      const trustedRBAC = await rbac(userId)


      if (
        !Array.isArray(trustedRBAC) ||
        trustedRBAC.length === 0
      ) {

        return reply
          .code(403)
          .send({
            status: 'fail',
            msgstatus: 'User has no active authorization'
          })
      }


      /*
       * Store only trusted, server-derived authentication information.
       *
       * Existing application code expects request.decoded.base,
       * therefore preserve that structure.
       */
      request.decoded = {
        base: trustedRBAC,
        sub: String(userId),
        tokenType: 'access'
      }


      return true

    } catch (err) {

      fastify.log.error(err)

      return reply
        .code(401)
        .send({
          status: 'fail',
          msgstatus: 'Authentication failed'
        })
    }
  })


  /*
   * ============================================================
   * SESSION AUTHENTICATION
   * ============================================================
   */
  fastify.decorate('isSession', async function (request, reply) {

    try {

      let token = request.session.get('userLoggedInfor')

      if (token) {

        try {

          let decoded = await jwtverify(token)

          /*
           * A session token must contain a valid subject.
           */
          if (
            !decoded ||
            decoded.sub === undefined ||
            decoded.sub === null
          ) {
            request.session.delete()
            return reply.redirect('/login')
          }


          const userId = Number(decoded.sub)

          if (!Number.isSafeInteger(userId) || userId <= 0) {
            request.session.delete()
            return reply.redirect('/login')
          }


          /*
           * Verify the user still exists.
           */
          const user = await models.muser.findOne({
            where: {
              muserid: userId
            },
            attributes: [
              'email',
              'username',
              'muserid'
            ]
          })


          if (!user) {
            request.session.delete()
            return reply.redirect('/login')
          }


          /*
           * Rebuild current RBAC information from the database.
           */
          const trustedRBAC = await rbac(userId)

          if (
            !Array.isArray(trustedRBAC) ||
            trustedRBAC.length === 0
          ) {
            request.session.delete()
            return reply.redirect('/login')
          }


          /*
           * Store only trusted server-derived authorization data.
           */
          request.decoded = {
            base: trustedRBAC,
            sub: String(userId),
            tokenType: 'session'
          }


          request.session.set(
            'decodeduserLoggedInfor',
            request.decoded
          )


          return true

        } catch (err) {

          request.session.delete()
          return reply.redirect('/login')
        }

      } else {

        request.session.set(
          'intendedredirect',
          request.url
        )

        return reply.redirect('/login')
      }

    } catch (err) {

      fastify.log.error(err)

      return reply.redirect('/login')
    }
  })


  /*
   * ============================================================
   * LOGIN
   * ============================================================
   */
  fastify.decorate(
    'islogin',
    async function (
      request,
      reply,
      basestate = {
        successRedirect: '/employees',
        failureRedirect: '/login'
      }
    ) {

      try {

        const user = await models.muser.findOne({
          where: {
            username: request.body.username,
            password: request.body.password
          },
          attributes: [
            'email',
            'username',
            'muserid'
          ]
        })


        if (!user) {

          return reply.send({
            status: 'fail',
            msgstatus: 'Invalid Username/Password'
          })

        }


        /*
         * Generate authorization data from the database.
         */
        const data = await rbac(user.dataValues.muserid)


        if (
          !Array.isArray(data) ||
          data.length === 0
        ) {

          return reply.send({
            status: 'fail',
            msgstatus: 'User is not authorized'
          })
        }


        /*
         * SECURITY FIX:
         *
         * Put only the user identity in the JWT.
         *
         * Authorization is rebuilt by authenticate()/isSession()
         * from the database.
         */
        const ObjLoggedinfo = {
          sub: String(user.dataValues.muserid),
          tokenType: 'session'
        }


        const token = fastify.jwt.sign(
          ObjLoggedinfo,
          {
            expiresIn: '1h'
          }
        )


        request.session.set(
          'userLoggedInfor',
          token
        )


        /*
         * Keep trusted RBAC information in the server-side session.
         */
        request.session.set(
          'decodeduserLoggedInfor',
          {
            base: data,
            sub: String(user.dataValues.muserid),
            tokenType: 'session'
          }
        )


        if (request.session.get('intendedredirect')) {

          request.session.set(
            'redirectURL',
            request.session.get('intendedredirect')
          )

        } else {

          request.session.set(
            'redirectURL',
            basestate.successRedirect || '/employees'
          )

        }


        return

      } catch (err) {

        fastify.log.error(err)

        return reply.send({
          status: 'no login'
        })

      }

    }
  )


  /*
   * ============================================================
   * PAYLOAD SECURITY
   * ============================================================
   */
  fastify.decorate('isPayLoadSecure', async function (request, reply) {

    var re = /ALTER|alter|CREATE|create|DELETE|delete|DROP|drop|EXECUTE|execute|INSERT|insert|MERGE|merge|select|SELECT|update|UPDATE|UNION|union/

    let vali = new RegExp(re)

    if (!request.body.searchparam.includes("NA")) {

      if (vali.test(JSON.stringify(request.body.searchparam))) {

        return reply.code(403).send({
          status: "SQL injection detected - Bad Request"
        })

      }

    }

    return

  })


  /*
   * ============================================================
   * MODULE ACCESS
   * ============================================================
   */
  fastify.decorate('isModuleAccess', async function (request, reply) {

    let baseurlar = request.raw.url.split('/')

    /*
     * Prefer the trusted authorization information established by
     * authenticate()/isSession().
     */
    let decodedUser = request.decoded ||
      request.session.get('decodeduserLoggedInfor')

    let fileusers = decodedUser?.base


    if (fileusers !== undefined) {

      fileusers = fileusers.map(function (doctor) {

        return (
          doctor.Modulename
            .toString()
            .split(',')
            .indexOf(baseurlar[1]) > -1
        )

      })


      if (fileusers.toString().indexOf('true') > -1) {

        return

      } else {

        request.session.set(
          'statusMessage',
          'you are not authorized to view that module'
        )

        return reply.redirect('/login')

      }

    } else {

      request.session.set(
        'statusMessage',
        'Session expire Please re login'
      )

      return reply.redirect('/login')

    }

  })


  /*
   * ============================================================
   * RBAC
   * ============================================================
   */
  let rbac = function (id) {

    return new Promise((resolve, reject) => {

      var sqlstatement = ''

      if (id == 1 || id == 2) {

        sqlstatement =
          `select array_agg(DISTINCT Mname) Modulename 
          from 
          ( 
          select Mname 
          from modname limit 100 offset 0 
          ) as a`

      } else {

        sqlstatement =
          `select ROLEID as RoleID,Rolename, isactive ,muserid,
           string_agg(distinct ModID::text,',') as ModID, 
           string_agg(distinct Modulename,',')as Modulename, 
           string_agg(distinct Accestype,',') as accesstype , 
           string_agg(distinct mroleID::text,',') as mroleID from 
           ( 
           select ur.muserid,r.mroleid,r.recordstate as isactive,
           rl.roleid AS ROLEID,n.modnameID as modID,
           n.Mname as Modulename,rl.rolename as Rolename,
           r.accesstype as Accestype
           from mrole r
           left join modname n on r.modulename::int=n.modnameid
           left join role rl on r.rolename::int=rl.roleid
           join userrolemapping ur on ur.muserid=${id}
           )
           as a GROUP BY ROLEID,Rolename,isactive,muserid`

      }


      connections
        .query(sqlstatement)
        .then(result => {

          var projects = result.rows

          if (id == 1 || id == 2) {

            var tempsuperadmin = superadmin

            if (projects.length <= 1) {

              tempsuperadmin[0].slidenav =
                tempsuperadmin[0].Modulename
                  .toString()
                  .split(',')

              tempsuperadmin =
                tempsuperadmin.filter(function (doctor) {
                  return doctor.muserID == id
                })

              resolve(tempsuperadmin)

            } else {

              tempsuperadmin[0].slidenav =
                projects[0].modulename

              tempsuperadmin[0].Modulename =
                projects[0].modulename.toString()

              resolve(tempsuperadmin)
            }

          } else {

            var doctors = projects.map(function (doctor) {

              return {

                Rolename: doctor.rolename,
                isactive: doctor.isactive,
                muserID: doctor.muserid,
                Accestype: doctor.accesstype,
                Modulename: doctor.modulename.split(',')
              }

            })


            /*
             * Do not allow an inactive RBAC mapping to become
             * authorization.
             */
            doctors = doctors.filter(function (doctor) {
              return doctor.isactive !== false
            })


            if (doctors.length === 0) {
              resolve([])
              return
            }


            var joctors = doctors.map(function (doctor) {
              return doctor.Modulename
            })


            var jyn = joctors.toString().split(',')

            var jyn = jyn.filter(function (item, i, ar) {
              return ar.indexOf(item) === i
            })


            doctors[0].slidenav = jyn

            resolve(doctors)
          }

        })
        .catch(err => {

          console.error('error running query', err)

          reject(err)

        })

    })

  }

}

module.exports = fastifyPlugin(baseDecorator)



