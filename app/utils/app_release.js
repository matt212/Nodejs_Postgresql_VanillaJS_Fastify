//const pinoInspector = require("pino-inspector");
const path = require("path");
const fastify = require("fastify")({
  //logger: { prettyPrint: true, level: "debug", prettifier: pinoInspector },
  connectionTimeout:20000,
  ajv: {
    plugins: [[require("ajv-keywords"), ["transform"]]],
  },
});
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

fastify.register(
  require("fastify-compress"),
  { global: false },
  { encodings: ["gzip"] }
);

  
  fastify.register(require("fastify-static"), {

    root: path.join(__dirname, "../") + "/public-release",
    // prefix:'/public',
  });

fastify.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
  root: path.join(__dirname, "../views"),
});
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
fastify.addHook('preHandler', (request, reply, next) => {
  
    request.session.releaseEnv = "public-release";
  
  next();
})
fastify.register(require("../../app/config/baseAuth"));
fastify.register(require("../routes/customauth"), { prefix: "/" });
fastify.register(require("../routes/utils/misc/jynerso"), {
  prefix: "/black-squadron",
});
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
fastify.register(require("fastify-socket.io"), {
  // put your options here
});
