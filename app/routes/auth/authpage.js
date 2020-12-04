//routes rules for pages with login
const jwt = require("jsonwebtoken");

const baseglot = {
  validateAccesstoken: function (req, res, next) {
    let token =
      req.body.token  || req.headers["x-access-token"];

    if (token != undefined) {
      // decode token
      if (token) {
        // verifies secret and checks exp
        jwt.verify(token, req.app.get("superSecret"), function (err, decoded) {
          if (err) {
            return res.json({
              success: false,
              message: "Failed to authenticate token."
            });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        });
      } else {
        // if there is no token
        // return an error
        return res.status(403).send({
          success: false,
          message: "No token provided."
        });
      }
    } else {
      if (req.isAuthenticated()) {
        return next();
      } else {
        // console.log(req)
        console.log(req.route.path == "/");
        if (req.route.path == "/") {
          res.cookie("redirectUrl", req.baseUrl);
          res.redirect("/login");
        } else {
          res
            .status(401)
            .json({ status: "Token expired please issue new one" });
        }

        /*res.redirect('/login');*/
        //res.json("access token required for this request");
      }
    }
  },
  isauth: function (req, res, next) {
    // this.name is "Michel Thomas"
    let baseurlar = req.originalUrl.split("/");

    let fileusers = req.user;

    console.log(fileusers);
    //check if module/page  exists in db
    if (fileusers != undefined) {
      fileusers = fileusers.map(function (doctor) {
        return (
          doctor.Modulename.toString()
            .split(",")
            .indexOf(baseurlar[1]) > -1
        );
      });

      let ispageexists;
      if (fileusers.toString().indexOf("true") > -1) {
        return next();
        ispageexists = true;
      } else {
        //not authorize for this module
        ispageexists = false;
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
      //throw 404 page not found
    }
  }
};

/*var isauth = function(req, res, next) {


    var baseurlar = req.originalUrl.split("/");



    var fileusers = req.user;

    console.log(fileusers);
    //check if module/page  exists in db
    if (fileusers != undefined) {
        var fileusers = fileusers.map(function(doctor) {
            return doctor.Modulename.toString().split(',').indexOf(baseurlar[1]) > -1

        });

        var ispageexists
        if (fileusers.toString().indexOf("true") > -1) {
            return next();
            ispageexists = true;
        } else {
            //not authorize for this module
            ispageexists = false;
            res.redirect('/login');
        }

    } else {
        res.redirect('/login');
        //throw 404 page not found
    }

}


var validateAccesstoken = function(req, res, next) {

    var token = req.body.token || req.param('token') || req.headers['x-access-token'];



    if (token != undefined) {

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            })

        }
    } else {


        if (req.isAuthenticated()) {
            return next();
        } else {
            
            res.redirect('/login');
        }


    }



}*/
module.exports = baseglot;
