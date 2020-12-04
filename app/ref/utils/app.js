var express = require("express");

var path = require("path");

var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var cons = require("consolidate");
var compression = require("compression");
var routes = require("../routes/index");
var jwt = require("jsonwebtoken");
var config = require("../config/config.json"); // get our config file

/*routeprimary*/

var employees = require("../routes/employees");
var modname = require("../routes/modname");
var muser = require("../routes/muser");
var role = require("../routes/role");
var mrole = require("../routes/mrole");
var userrole = require("../routes/userrole");

/* IN ORDER TO AVOID MAX_ALLOWED ERROR 
GOTO C:\ProgramData\MySQL\MySQL Server 5.7
1. OPEN MY.INI FILE
2. CHANGE MAX_ALLOWED VARIABLE TO 100 m
3. restart mysql services
 */

var passport = require("passport");
var flash = require("connect-flash");

var app = express();
//-templates

// view engine setup

app.set("views", path.join(__dirname, '../') + "/views");
app.use(flash());
app.engine("html", cons.swig);
//.renderFile

app.set("view engine", "html");
app.set("superSecret", config.secret);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
require("../config/passport")(passport); // pass passport for configuration

app.use((req, res, next) => {
  bodyParser.json({})(req, res, err => {
    if (err) {
      res.json({ status: "json error syntax" });
      return;
    } else {
      next();
    }
  });
});
app.use(bodyParser.urlencoded({ extended: true }));
/*app.use(bodyParser.urlencoded({
    extended: false
}));*/
app.use(cookieParser()); /*' }));


*/ //app.use(express.static(path.join(__dirname, 'public')));

/*
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({ verify: rawBodySaver }));

app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/ app.use(
  compression({
    threshold: 0,
    filter: function () {
      return true;
    }
  })
);

var swStats = require("swagger-stats");
var apiSpec = require("../swagger/swagger.json");
app.use(swStats.getMiddleware({ swaggerSpec: apiSpec }));

app.use(
  express.static(path.join(path.join(__dirname, '../'), "public"), {
    maxAge: "2h",
    etag: false
  })
);

app.use(
  session({
    secret: "<mysecret>",
    saveUninitialized: true,
    resave: true,
    cookie: {
      secure: false,
      maxAge: 4 * 60 * 60 * 1000
    }
  })
);
var cors = require("cors");
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.post("/authenticate/", function (req, res) {
  var buildin = req.body.appkey;
  //console.log(req.headers.host + "---" + buildin);

  if (req.headers.host == buildin) {
    var options = {
      expiresIn: "1h"
    };

    var red = new Object();
    red.base = buildin;
    var token = jwt.sign(
      red,
      app.get("superSecret"),
      options
      /*{
                     expiresIn: 86400 // expires in 24 hours
                   }*/
    );

    res.json({
      success: true,
      message: "Enjoy your token!",
      token: token
    });
  } else {
    return res.status(403).send({
      success: false,
      message: "not authorized"
    });
  }
});

require("../routes/auth/authRoutes")(app, passport);
app.use("/login", routes);
app.use("/", routes);

app.use("/employees", employees);
app.use("/modname", modname);
app.use("/muser", muser);
app.use("/role", role);
app.use("/mrole", mrole);
app.use("/userrolemapping", userrole);

/*routesecondary*/

var jynerso = require("../routes/utils/misc/jynerso");
app.use("/jynerso", jynerso);

app.get("/listing", function (req, res) {
  //res.sendFile(path.join(__dirname + '/views/mainscreen/mainscreen.html'));

  res.render(path.join(__dirname + "/views/mainscreen/mainscreen.html"), {
    title: req.user
  });
});
app.get("/sca", function (req, res) {
  //res.sendFile(path.join(__dirname + '/views/mainscreen/mainscreen.html'));

  res.render(
    path.join(path.join(__dirname, '../') + "/public/components/base_scaffolding.html"),
    {
      title: req.user
    }
  );
});
app.get("/meh", function (req, res) {
  //res.sendFile(path.join(__dirname + '/views/mainscreen/mainscreen.html'));

  res.render(path.join(__dirname + "/public/components/meh.html"), {
    title: req.user
  });
});

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require('./configuration/swagger')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//app.use(function(req, res, next) {
//res.redirect('/login');
//res.render(path.join(__dirname + '/views/error.html'));
/* if (req.url.match(/^\/(css|js|img|font)\/.+/)) {
        res.setHeader('Cache-Control', 'public, max-age=3600')
    }*/

//res.redirect('/statuspages/error.html');
//})

app.disable('x-powered-by');

/*models.sequelize.sync({alter:true}).then(function() {*/
app.set("port", process.env.PORT || 3009);
var server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + server.address().port);

});
//});
var io = require("socket.io")(server)
// app.use(function(req, res, next) {
//   console.log('handling request for: ' + req.url);
//   next();
// });
app.io = io;
io.on('end', function () {
  io.disconnect(0);
});
module.exports = app;
