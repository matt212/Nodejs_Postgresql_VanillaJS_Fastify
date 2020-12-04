/*var constants					= require('../scripts/constants');
var logger 						= require(constants.paths.scripts + '/logger');
var util 							= require(constants.paths.scripts + '/util');
var assetBuilder 			= require(constants.paths.scripts + '/assetBuilder');
var menuBuilder 			= require(constants.paths.scripts + '/menuBuilder');*/

module.exports = function (app, passport) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  /*    app.get('/', function(req, res) {
console.log(req.isAuthenticated());
      if (!req.isAuthenticated()){


        res.redirect('/admin/login');
			} else 
            {
                 res.redirect('/admin');
				//renderHome(req, res);
      }
    });
*/
  // Token SECTION =========================
  /* app.get('/token', isLoggedIn, function(req, res) {
      //console.log("Auth token: " + req.user.token.token);
      res.status(200).send(req.user);
    });*/

  /* app.get('/home', isLoggedIn, function(req, res) {
        renderHome(req, res);
    });*/

  /*function renderHome(req, res){
			res.locals.pageTitle = "Home";
			res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general,angular");
			res.locals.appAssets = assetBuilder.getAssets("appAssets", "general,home");
			if("desktop".compare(res.locals.device)){
				res.redirect(menuBuilder.getDefaultPage(req.user, 'web'));
			} else {
				res.redirect(menuBuilder.getDefaultPage(req.user, 'mobile'));
			}
		}*/

  /*app.get('/app', isLoggedIn, function(req, res) {
        res.locals.pageTitle = "App Info";
        res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general");
        res.locals.appAssets = assetBuilder.getAssets("appAssets", "general");
        res.render('app.ejs', {
        });
    });*/

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
  });
  /* app.get('/', function(req, res,next) {
      
       next();
    });*/
  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  /*      app.get('/login', function(req, res) {
					res.locals.pageTitle = "Login";
					res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general");
					res.locals.appAssets = assetBuilder.getAssets("appAssets", "general,login");
          res.render('login.ejs', {
						message: req.flash('loginMessage'),
						layout: 'layouts/public'
					});
        });*/

  // process the login form
  // app.post('/login', passport.authenticate('local-login',{
  //     successRedirect : '/employees', // redirect to the secure profile section
  //     failureRedirect : '/login', // redirect back to the signup page if there is an error
  //     failureFlash : true // allow flash messages
  // }));

  app.post(
    '/login',
    passport.authenticate('local-login', {
      failureRedirect: '/login',
    }), (req, res) => {
      if (req.cookies.redirectUrl != undefined) {
        res.redirect(req.cookies.redirectUrl);
      }
      else {
        res.redirect("/listing");
      }
    });

  // app.post("/login", function (req, res, next) {
  //   passport.authenticate("local-login", function (err, user, info) {
  //     if (err) {
  //       return next(err);
  //     }
  //     if (!user) {
  //       // *** Display message without using flash option
  //       // re-render the login form with a message
  //       return res.render('login/login', {
  //         message: req.flash('loginMessage').toString()
  //     });
  //       //return res.render('login/login', )
  //     }
  //     req.logIn(user, function (err) {
  //       if (err) {
  //         return next(err);
  //       }
  //       console.log(req.cookies.redirectUrl);
  //       if (req.cookies.redirectUrl != undefined) {
  //         return res.redirect(req.cookies.redirectUrl);
  //       }
  //       else {
  //         return res.redirect("/listing");
  //       }

  //     });
  //   })(req, res, next);
  // });


  app.post(
    "/accessToken",
    passport.authenticate("local-login", {
      successRedirect: "/accessTokenlisting", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // //process the login form
  // app.get('/login/:email/:pwd', passport.authenticate('local-login', {
  //     successRedirect : '/home', // redirect to the secure profile section
  //     failureRedirect : '/login', // redirect back to the signup page if there is an error
  //     failureFlash : true // allow flash messages
  // }));

  //         app.get('/login/:email/:pwd', function(req, res) {
  //           console.log(req.params.email);
  //           console.log(req.params.pwd);

  //           // res.redirect('/home');

  //         var querystring = require('querystring');
  //         var http = require('http');

  //         var data = querystring.stringify({
  //           email: req.params.email,
  //           password: req.params.pwd
  //       });

  //         var options = {
  //             host: 'localhost',
  //             port: 8080,
  //             path: '/login',
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/x-www-form-urlencoded',
  //                 'Content-Length': Buffer.byteLength(data)
  //             }
  //         };

  //         var req = http.request(options, function(res) {
  //             res.setEncoding('utf8');
  //             res.on('data', function (chunk) {
  //                 console.log("body: " + chunk);
  //             });
  //         });

  //         req.write(data);
  //         console.log(req.write(data));
  //         req.end();
  // });
  app.get("/login/:email/:pwd", function (req, res) {
    console.log(req.params.email);
    console.log(req.params.pwd);
    var request = require("request");
    request.post(
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        url: "http://localhost:8080/login/",
        form: { email: req.params.email, password: req.params.pwd }
      },
      function (error, response, body) {
        console.log(error);
        console.log(body);
        console.log(response);
      }
    );
  });
  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.locals.pageTitle = "SignUp";
    res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general");
    res.locals.appAssets = assetBuilder.getAssets("appAssets", "general");
    res.render("signup.ejs", {
      layout: "layouts/public",
      message: req.flash("signupMessage")
    });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );
};

// route middleware to ensure user is logged in
