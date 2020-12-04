

var models = require('../models');
let connections = require("../config/db");
models.sequelize.sync().then(function () {
  console.log("Sync done")
  
})
// connections
//   .query('CREATE EXTENSION IF NOT EXISTS tablefunc')
//   .then(result => {
//   })