const pinoInspector = require("pino-inspector");
const path = require("path");

const fastify = require("fastify")({
  logger: { prettyPrint: true, level: "debug", prettifier: pinoInspector },
  ajv: {
    plugins: [[require("ajv-keywords"), ["transform"]]],
  },
});
fastify.register(require("fastify-multipart"));

fastify.register(
  require("fastify-compress"),
  { global: false },
  { encodings: ["gzip"] }
);

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

fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "../") + "/public",
  // optional: default '/'
});

fastify.register(require("fastify-secure-session"), {
  secret: "averylogphrasebiggerthanfortytwochars",
  salt: "mq9hDxBVDbspDR6n",
  cookie: {
    path: "/",
    // options for setCookie, see https://github.com/fastify/fastify-cookie
  },
});
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
fastify.listen(3011, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`App Server listening on port ${address}`);
});
fastify.register(require("fastify-socket.io"), {
  // put your options here
});
// //using express for only swagger panel
var express = require("express");
var Swaggerapp = express();
const swaggerSpec = require("./configuration/swagger");
const swaggerUi = require("swagger-ui-express");
Swaggerapp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
Swaggerapp.listen(3012, function () {
  console.log("Swagger Server listening on  http://localhost:3012/api-docs/");
});
