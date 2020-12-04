
var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {

   

    res.render('login/login', {
        message: req.flash('loginMessage').toString()
    });
});
router.get('/getAccessToken', function(req, res) {

    //console.log(req.flash('loginMessage').toString());

    res.render('login/accessToken', {
        message: req.flash('loginMessage').toString(),
        gigga: req.flash('loginMessage').toString(),      
    });
});
router.get('/accessTokenlisting', function(req, res) {

    //console.log(req.flash('loginMessage').toString());

    res.render('login/accessTokenlisting', {
        message: req.flash('loginMessage').toString(),
        gigga: req.flash('loginMessage').toString(),      
    });
});
 /* partials: {
            loader: './public/components/loader.html'
        }*/

module.exports = router;