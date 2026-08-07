const path = require("path");

/* Fastify initialization */
const fastify = require("fastify")({
  logger: true,
  ajv: {
    customOptions: {
      strict: false
    },
    plugins: [
      require("ajv-keywords")
    ]
  }
});


/* Socket.IO decorator placeholder */
fastify.decorate("io", null);


/* Content Security Policy */
const helmet = require("@fastify/helmet");

fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        "'unsafe-inline'"
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-hashes'",
        "'unsafe-eval'",
        "*.cloudflare.com",
        "*.highcharts.com"
      ],
      styleSrc: [
        "'self'",
        "fonts.googleapis.com",
        "'unsafe-inline'"
      ],
      scriptSrcAttr: [
        "'unsafe-inline'"
      ],
      imgSrc: [
        "'self'"
      ],
      fontSrc: [
        "'self'",
        "data:"
      ]
    }
  }
});


/* Multipart */
fastify.register(require("@fastify/multipart"));


/* Compression */
fastify.register(
  require("@fastify/compress"),
  {
    global: false,
    encodings: ["gzip"]
  }
);


/* Static files */
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "../public")
});


/* EJS Views */
fastify.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs")
  },
  root: path.join(__dirname, "../views")
});


/* CORS */
fastify.register(require("@fastify/cors"));


/* JWT */
fastify.register(require("@fastify/jwt"), {
  secret: "supersecret",
  expiresIn: "1h"
});


/* Secure Session */
fastify.register(require("@fastify/secure-session"), {
  secret: Buffer.from(
    "f4e97164dff7c9a9db4188364b3bd336e8898feb7338d5fe4d7f77913668f5a8",
    "hex"
  ),
  salt: "mq9hDxBVDbspDR6n",
  cookie: {
    path: "/"
  }
});


/* Global preHandler */
fastify.addHook(
  "preHandler",
  async (request, reply) => {
    request.session.releaseEnv = "public";
  }
);


/* Authentication */
fastify.register(
  require("../../app/config/baseAuth")
);


/* Login */
fastify.register(
  require("../routes/customauth"),
  {
    prefix: "/"
  }
);


/* Super Admin Routes */
fastify.register(
  require("../routes/utils/misc/jynerso"),
  {
    prefix: "/black-squadron"
  }
);


/* Dynamic Routes */
const baseroutes = require("../config/baseRoute");

baseroutes.forEach((dt) => {

  fastify.register(
    require(`../routes/${dt.val}`),
    {
      prefix: dt.key
    }
  );

});


/* Socket.IO */
const { Server } = require("socket.io");

const io = new Server(
  fastify.server,
  {
    cors: {
      origin: "*"
    }
  }
);


/*
  Do NOT use fastify.decorate("io", io)
  because it already exists.
*/
fastify.io = io;


io.on(
  "connection",
  (socket) => {

    console.log(
      "Client connected:",
      socket.id
    );

  }
);



/* Start Server */
const start = async () => {

  try {

    await fastify.listen({
      port: 3012,
      host: "0.0.0.0"
    });


    console.log(
      `App Server listening on ${fastify.server.address().port}`
    );


  } catch (err) {

    fastify.log.error(err);

    process.exit(1);

  }

};


start();