module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
   

    // PROFILE SECTION =========================
    

    // LOGOUT ==============================
    

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
     app.get('/login/:email/:pwd', function(req, res) {
            console.log(req.params.email);
            console.log(req.params.pwd);
            var request = require('request');
            request.post({
              headers: {'content-type' : 'application/x-www-form-urlencoded'},
              url:     'http://localhost:8080/login/',
              form:    { email: req.params.email,password:req.params.pwd }
            }, function(error, response, body){
              console.log(error);  
              console.log(body);
              console.log(response);
              
            });
        });
        // LOGIN ===============================
        // show the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

       

  
    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
       /* app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/',
                failureRedirect : '/meme'
            }));*/




};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
