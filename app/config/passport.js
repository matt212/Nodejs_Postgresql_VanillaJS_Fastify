// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
/*var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;*/


var models = require('../models');
var connections = require('./db');
var superadmin = require('./superadmin.json');
/*var alasql=require('alasql.min.js');*/

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {

        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {

        done(null, user);

    });

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

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, username, password, done) {

            if (username)
                username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            //process.nextTick(function() {



            models.muser.findOne({
                where: { username: username, password: password },
                attributes: ['email', 'username', 'muserid'],
            }).then(function (user) {
console.log(user);
                if (user == undefined) {

                    return done(null, false, req.flash('loginMessage', 'Invalid Username/Password'));
                } else {

                    rbac(user.dataValues.muserid).then(function (data) {
                        return done(null, data);
                    })

                }

                //}
            }).catch(function (error) {
                console.log(error)
                return done(null, false, req.flash('loginMessage', 'Invalid Username/Password'));

                // ERROR function - there's either sql error OR there is no result!
            });
            //});

        }));

    /*// =========================================================================
    // LOCAL LOGIN WITH VERIFY==================================================
    // =========================================================================
    passport.use('local-loginverify', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done,$routeParams) {
        console.log(req.params.email);
        console.log(req.params.pwd);
        var email = req.params.email;
        if (email)
            useremail = email; // Use lower-case e-mails to avoid case-sensitive e-mail matching
            password = req.params.pwd;
        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  useremail }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Invalid Username/Password'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Invalid Username/Password'));

                if(user.status == 'Locked')
                    return done(null, false, req.flash('loginMessage', 'User is Locked.Please Contact Administrator'));
                // all is well, return user
                else{
                                    // set last login time on successful login
                                    user.stats.dateLastLogin = new Date();
                                    userService.updateById(user._id, user);

                                    return done(null, user);
                                }
                            });
        });

    }));*/

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    /* passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser                 = new User();

                        newUser.local.email         = email;
                        newUser.local.password      = newUser.generateHash(password);
                        newUser.name.first          = req.body.firstname;
                        newUser.name.last           = req.body.lastname;
                        newUser.email               = email;
                                                newUser.organization                = "CSC";
                                                newUser.association                 = "employee";
                        newUser.stats.dateCreated   = Date.now();
                        newUser.stats.dateLastLogin = Date.now();

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            emailController.newUserAdd(newUser);

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null,user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));
*/
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    /* passport.use(new FacebookStrategy({

         clientID        : configAuth.facebookAuth.clientID,
         clientSecret    : configAuth.facebookAuth.clientSecret,
         callbackURL     : configAuth.facebookAuth.callbackURL,
         profileFields   : ['id', 'name', 'email'],
         passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

     },
     function(req, token, refreshToken, profile, done) {

         // asynchronous
         process.nextTick(function() {

             // check if the user is already logged in
             if (!req.user) {

                 User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                     if (err)
                         return done(err);

                     if (user) {

                         // if there is a user id already but no token (user was linked at one point and then removed)
                         if (!user.facebook.token) {
                             user.facebook.token = token;
                             user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                             user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                             user.save(function(err) {
                                 if (err)
                                     return done(err);

                                 return done(null, user);
                             });
                         }

                         return done(null, user); // user found, return that user
                     } else {
                         // if there is no user, create them
                         var newUser            = new User();

                         newUser.facebook.id    = profile.id;
                         newUser.facebook.token = token;
                         newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                         newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                         newUser.save(function(err) {
                             if (err)
                                 return done(err);

                             return done(null, newUser);
                         });
                     }
                 });

             } else {
                 // user already exists and is logged in, we have to link accounts
                 var user            = req.user; // pull the user out of the session

                 user.facebook.id    = profile.id;
                 user.facebook.token = token;
                 user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                 user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                 user.save(function(err) {
                     if (err)
                         return done(err);

                     return done(null, user);
                 });

             }
         });

     }));*/

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    /*  passport.use(new TwitterStrategy({

          consumerKey     : configAuth.twitterAuth.consumerKey,
          consumerSecret  : configAuth.twitterAuth.consumerSecret,
          callbackURL     : configAuth.twitterAuth.callbackURL,
          passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

      },
      function(req, token, tokenSecret, profile, done) {

          // asynchronous
          process.nextTick(function() {

              // check if the user is already logged in
              if (!req.user) {

                  User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                      if (err)
                          return done(err);

                      if (user) {
                          // if there is a user id already but no token (user was linked at one point and then removed)
                          if (!user.twitter.token) {
                              user.twitter.token       = token;
                              user.twitter.username    = profile.username;
                              user.twitter.displayName = profile.displayName;

                              user.save(function(err) {
                                  if (err)
                                      return done(err);

                                  return done(null, user);
                              });
                          }

                          return done(null, user); // user found, return that user
                      } else {
                          // if there is no user, create them
                          var newUser                 = new User();

                          newUser.twitter.id          = profile.id;
                          newUser.twitter.token       = token;
                          newUser.twitter.username    = profile.username;
                          newUser.twitter.displayName = profile.displayName;

                          newUser.save(function(err) {
                              if (err)
                                  return done(err);

                              return done(null, newUser);
                          });
                      }
                  });

              } else {
                  // user already exists and is logged in, we have to link accounts
                  var user                 = req.user; // pull the user out of the session

                  user.twitter.id          = profile.id;
                  user.twitter.token       = token;
                  user.twitter.username    = profile.username;
                  user.twitter.displayName = profile.displayName;

                  user.save(function(err) {
                      if (err)
                          return done(err);

                      return done(null, user);
                  });
              }

          });

      }));*/

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    /*passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            user.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });

            }

        });

    }));*/

};