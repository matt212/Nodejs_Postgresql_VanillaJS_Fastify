// module.exports = function(app, passport) {

// // normal routes ===============================================================

//     // show the home page (will also have our login links)
   

//     // PROFILE SECTION =========================
    

//     // LOGOUT ==============================
    

// // =============================================================================
// // AUTHENTICATE (FIRST LOGIN) ==================================================
// // =============================================================================

//     // locally --------------------------------
//      app.get('/login/:email/:pwd', function(req, res) {
//             console.log(req.params.email);
//             console.log(req.params.pwd);
//             var request = require('request');
//             request.post({
//               headers: {'content-type' : 'application/x-www-form-urlencoded'},
//               url:     'http://localhost:8080/login/',
//               form:    { email: req.params.email,password:req.params.pwd }
//             }, function(error, response, body){
//               console.log(error);  
//               console.log(body);
//               console.log(response);
              
//             });
//         });
//         // LOGIN ===============================
//         // show the login form
//         app.post('/login', passport.authenticate('local-login', {
//             successRedirect : '/', // redirect to the secure profile section
//             failureRedirect : '/login', // redirect back to the signup page if there is an error
//             failureFlash : true // allow flash messages
//         }));

       

  
//     // google ---------------------------------

//         // send to google to do the authentication
//         app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

//         // the callback after google has authenticated the user
//         app.get('/auth/google/callback',
//             passport.authenticate('google', {
//                 successRedirect : '/',
//                 failureRedirect : '/'
//             }));


//     // google ---------------------------------

//         // send to google to do the authentication
//        /* app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

//         // the callback after google has authorized the user
//         app.get('/connect/google/callback',
//             passport.authorize('google', {
//                 successRedirect : '/',
//                 failureRedirect : '/meme'
//             }));*/




// };

// // route middleware to ensure user is logged in
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated())
//         return next();

//     res.redirect('/login');
// }

module.exports = function (app, passport) {

    // ============================================================
    // AUTHENTICATION ROUTES
    // ============================================================

    /*
     * SECURITY FIX:
     *
     * Removed:
     *
     *     GET /login/:email/:pwd
     *
     * Passwords must NEVER be supplied through URL parameters.
     *
     * URLs can be recorded in:
     * - browser history
     * - proxy logs
     * - web server logs
     * - load balancer logs
     * - monitoring systems
     * - analytics systems
     * - Referer headers
     *
     * Authentication credentials must be submitted in the POST body
     * over HTTPS.
     */


    // ============================================================
    // LOCAL LOGIN
    // ============================================================

    /*
     * Login credentials are accepted only through POST.
     *
     * passport.authenticate('local-login') is responsible for
     * validating the credentials.
     */
    app.post(
        '/login',
        passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );


    // ============================================================
    // GOOGLE LOGIN
    // ============================================================

    /*
     * Start Google authentication.
     */
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );


    /*
     * Google authentication callback.
     */
    app.get(
        '/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );


    // ============================================================
    // LOGOUT
    // ============================================================

    /*
     * Destroy the authenticated session.
     *
     * If your application already has a dedicated logout handler,
     * keep that implementation instead of duplicating it here.
     */
    app.get('/logout', function (req, res, next) {

        req.logout(function (err) {

            if (err) {
                return next(err);
            }

            /*
             * Destroy the session so the authenticated state cannot
             * be reused after logout.
             */
            if (req.session) {

                req.session.destroy(function (sessionErr) {

                    if (sessionErr) {
                        return next(sessionErr);
                    }

                    res.redirect('/login');

                });

            } else {

                res.redirect('/login');

            }

        });

    });


    // ============================================================
    // OPTIONAL PROTECTED PROFILE ROUTE EXAMPLE
    // ============================================================

    /*
     * Any route requiring Passport authentication should use
     * isLoggedIn middleware.
     *
     * Example:
     *
     * app.get('/profile', isLoggedIn, function (req, res) {
     *     res.render('profile', {
     *         user: req.user
     *     });
     * });
     */


    // ============================================================
    // DISABLED LEGACY GOOGLE CONNECT FLOW
    // ============================================================

    /*
     * The old /connect/google routes were already disabled.
     *
     * Keep them removed unless account-linking functionality is
     * explicitly required.
     */

};


// ================================================================
// AUTHENTICATION MIDDLEWARE
// ================================================================

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/login');
}