
const models = require('../models');
const connections = require('./db');
const superadmin = require('./superadmin.json')
const fastifyPlugin = require('fastify-plugin')
async function baseDecorator(fastify, options) {

  let jwtverify = function (token) {
    return new Promise(function (resolve, reject) {
      fastify.jwt.verify(token, function (err, decoded) {
        if (err) {
          reject(err)
        } else {
          // if everything is good, save to request for use in other routes
          resolve(decoded);

        }
      })
    })
  }

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      let token = request.headers["x-access-token"];

      if (token) {
        await fastify.jwt.verify(token, function (err, decoded) {
          if (err) {
            
            reply.send({status:"fail", 'msgstatus': err});
          } else {
            console.log("passed")
            // if everything is good, save to request for use in other routes
            request.decoded = decoded;
            return true
          }
        });
      }
      else {
        reply.send("Authentication Is required, Token Missing")
      }
    } catch (err) {
      reply.send(err)
    }
  })
  fastify.decorate("isSession", async function (request, reply) {
    try {
      let token = request.session.get('userLoggedInfor');

      if (token) {
        await fastify.jwt.verify(token, function (err, decoded) {
          if (err) {
            reply.redirect('/login');
          } else {
            // if everything is good, save to request for use in other routes
            request.decoded = decoded;
            request.session.set('decodeduserLoggedInfor', decoded)
            return true;
          }
        });
      }
      else {
        
        request.session.set('intendedredirect', request.url)
        reply.redirect('/login');
      }
    } catch (err) {
      reply.send(err)
    }
  })
  fastify.decorate("islogin", async function (request, reply, done, basestate = { successRedirect: '/employees', failureRedirect: '/login' }) {
    try {

      return models.muser.findOne({
        where: { username: request.body.username, password: request.body.password },
        attributes: ['email', 'username', 'muserid'],
      }).then(function (user) {

        if (user == undefined) {
          
          reply.send({status:"fail", 'msgstatus': 'Invalid Username/Password' });
          return false;
        } else {

          rbac(user.dataValues.muserid).then(function (data) {
            
            var ObjLoggedinfo = {}
            ObjLoggedinfo.base = data;
            var token = fastify.jwt.sign(ObjLoggedinfo);
            request.session.set('userLoggedInfor', token)
            if(request.session.get('intendedredirect'))
            {
              request.session.set('redirectURL', request.session.get('intendedredirect'))  
            }
            else
            {
              request.session.set('redirectURL', basestate.successRedirect)
            }
            
            
            done()
            //set cookie and data here
          })

        }
      })
    }
    catch (err) {
      reply.send({ status: "no login" })
    }
  })

  let rbac = function (id) {
    return new Promise((resolve, reject) => {
      var sqlstatement;
      if (id == 1) {

        sqlstatement = 'select array_agg(DISTINCT Mname) Modulename ' + 'from ' + '( ' + 'select Mname ' + 'from modname limit 100 offset 0 ' + ') as a';
      } else {
        //sqlstatement = 'set @_total = 0;  call shitgotdeep.utils(' + id + ', 1, @_total); select @_total;';


        sqlstatement = 'select   ROLEID as RoleID,Rolename,  isactive ,muserid,' +
          ' string_agg(distinct ModID::text,\',\') as ModID,' +
          ' string_agg(distinct Modulename,\',\')as Modulename,' +
          ' string_agg(distinct Accestype,\',\') as accesstype ,' +
          ' string_agg(distinct mroleID::text,\',\') as mroleID from' +
          ' (' +
          ' select ur.muserid,r.mroleid, r.recordstate as isactive,rl.roleid AS ROLEID,n.modnameID as modID, n.Mname as Modulename,rl.rolename as Rolename, r.accesstype as Accestype' +
          ' from mrole r' +
          ' left join modname n on r.modulename::int=n.modnameid' +
          ' left join role rl on r.rolename::int=rl.roleid' +
          ' join userrolemapping ur on ur.muserid=' + id + ')' +
          ' as a  GROUP BY ROLEID,Rolename,isactive,muserid';


      }


      connections.query(sqlstatement)
        .then((result) => {

          var projects = result.rows

          if (id == 1) {
            //console.log(superadmin);

            var tempsuperadmin = superadmin

            if (projects.length <= 1) {

              tempsuperadmin[0].slidenav = tempsuperadmin[0].Modulename.toString().split(',')

              resolve(tempsuperadmin);
            } else {
              tempsuperadmin[0].slidenav = projects[0].modulename
              tempsuperadmin[0].Modulename = projects[0].modulename.toString();
              resolve(tempsuperadmin);
            }

          } else {


            var doctors = projects.map(function (doctor) {
              return { // return what new object will look like
                Rolename: doctor.rolename,
                isactive: doctor.isactive,
                muserID: doctor.muserid,
                Accestype: doctor.accesstype,
                Modulename: doctor.modulename.split(","),
              };
            });


            //in order to built slidenav we are extracting and building single unique stack of elements
            var joctors = doctors.map(function (doctor) {
              return doctor.Modulename
            });

            var jyn = joctors.toString().split(',');
            var jyn = jyn.filter(function (item, i, ar) {
              return ar.indexOf(item) === i;
            });

            doctors[0].slidenav = jyn

            resolve(doctors);




          }
          //callback(null, logiblock);

        })
        .catch((err) => {
          console.error('error running query', err);
          //res.json(err)
        });
    })

  }
}
module.exports =fastifyPlugin(baseDecorator)