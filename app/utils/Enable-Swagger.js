//using express for only swagger panel
var express = require("express");
var Swaggerapp = express();
const swaggerSpec = require("./configuration/swagger");
const swaggerUi = require("swagger-ui-express");
Swaggerapp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
require('./app')
Swaggerapp.listen(3013, function () {
  console.log("Swagger Server listening on  http://localhost:3013/api-docs/");
});
