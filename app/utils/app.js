//const pinoInspector = require("pino-inspector");
const path = require("path");
/*fastify middleware*/
const fastify = require("fastify")({
  //logger: { prettyPrint: true, level: "debug", prettifier: pinoInspector },
  //connectionTimeout:20000,
  ajv: {
    plugins: [[require("ajv-keywords"), ["transform"]]],
  },
});
/* ContentSecurityPolicy */
const helmet = require('@fastify/helmet')
fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        "'unsafe-inline'",
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-hashes'",
        "'unsafe-eval'",
        "*.cloudflare.com",
        "*.highcharts.com"
      ],
      styleSrc: ["'self'", 'fonts.googleapis.com', "'unsafe-inline'"],
      //imgSrc: ["'self'", 'https://*.com'],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'"],
      fontSrc: ["'self'", 'https://*.com', 'data:']
    },
  }
})
fastify.register(require("@fastify/multipart"));
/*Gzip Compression for API*/
fastify.register(
  require("fastify-compress"),
  { global: false },
  { encodings: ["gzip"] }
);

/*static file routing*/
fastify.register(require("fastify-static"), {

  root: path.join(__dirname, "../") + "/public",
  // prefix:'/public',
});
/*Views for EJS template Render*/
fastify.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
  root: path.join(__dirname, "../views"),
});
/*Cors*/
fastify.register(require("fastify-cors"));
fastify.register(require("fastify-jwt"), {
  secret: "supersecret",
  expiresIn: "1h",
});
fastify.register(require("fastify-secure-session"), {
  secret: "averylogphrasebiggerthanfortytwochars",
  salt: "mq9hDxBVDbspDR6n",
  cookie: {
    path: "/",
    // options for setCookie, see https://github.com/fastify/fastify-cookie
  },
});
/*this is used for any preHandler activities currently setting for Dev and Prod Release */
fastify.addHook('preHandler', (request, reply, next) => {
  request.session.releaseEnv = "public";
  next();
})
/*Pre validation check for all routes */
fastify.register(require("../../app/config/baseAuth"));
/* login Module */
fastify.register(require("../routes/customauth"), { prefix: "/" });
/*SuperAdmin Routes*/
fastify.register(require("../routes/utils/misc/jynerso"), {
  prefix: "/black-squadron",
});
/*Dynamic Module Routes*/
let baseroutes = require("../config/baseRoute");
baseroutes.forEach(function (dt) {
  fastify.register(require(`../routes/${dt.val}`), { prefix: dt.key });
});
// Run the server!
fastify.listen(3012, function (err, address) {
  if (err) {
    // console.log(err)
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`App Server listening on port ${address}`);
});
/*Socket IO for download and upload Notification services*/
fastify.register(require("fastify-socket.io"), {});
