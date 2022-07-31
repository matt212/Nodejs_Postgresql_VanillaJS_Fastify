const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
//const fastify = require('fastify')();
const port = 3012;

const path = require("path");
const fastify = require("fastify")({
  //logger: { prettyPrint: true, level: "debug", prettifier: pinoInspector },
  ajv: {
    plugins: [[require("ajv-keywords"), ["transform"]]],
  },
});


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  
//const pinoInspector = require("pino-inspector");

fastify.register(require("@fastify/multipart"));

fastify.register(
  require("fastify-compress"),
  { global: false },
  { encodings: ["gzip"] }
);

if (process.argv[2] == "dev") {
  fastify.register(require("fastify-static"), {

    root: path.join(__dirname, "../") + "/public",
    // prefix:'/public',
  });
} else if (process.argv[2] == "prod") {
  fastify.register(require("fastify-static"), {

    root: path.join(__dirname, "../") + "/public-release",
    // prefix:'/public',
  });
}
else {
  fastify.register(require("fastify-static"), {

    root: path.join(__dirname, "../") + "/public",
    // prefix:'/public',
  });
}
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
  if (process.argv[2] == "dev") {
    request.session.releaseEnv = "public";
  } else {
    request.session.releaseEnv = "public-release";
  }
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
fastify.listen(port, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`App Server listening on port ${address}`);
  console.log(`Fastify "Hello World" listening on port ${port}, PID: ${process.pid}`);
});
fastify.register(require("fastify-socket.io"), {
  // put your options here
});





}