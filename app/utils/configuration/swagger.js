const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    title: 'REST API for my Nodejs Postgres VanillaJS ', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'Below one can find Different Modules with its respective list of APIs and its request and response structure', // short description of the app
  },
  host: 'localhost:3011', // the host or url of the app
  basePath: '/', // the basepath of your endpoint
  hiddenTag: 'X-HIDDEN',
  exposeRoute: true,
  routePrefix: '/api-doc'
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./docs/**/*.yaml'],
};

// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);