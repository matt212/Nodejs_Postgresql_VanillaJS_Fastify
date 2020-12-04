let models = require("../app/models");
var express = require("express");
var app = express();

app.get("/employees", (req, res) => {
  let mod = {
    Name: "employees",
    id: "employeesid"
  };
  
  let validationConfig = require("./routes/utils/" +
    mod.Name +
    "/validationConfig.js");
    const d = new Date();
    const serverdat = {
      name: d.toString()
    };
    res.render("" + mod.Name + "/" + mod.Name + "", {
      title: req.user,
      serverdate: serverdat,
      modelattribute: Object.keys(models[mod.Name].attributes),
      validationmap: JSON.stringify(validationConfig.validationmap),
      applyfields: JSON.stringify(validationConfig.applyfields)
    });
  MemoryUsage();
});
let MemoryUsage = () => {
  console.log(
    `*************************************Memory usage**************************************************************`
  );
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
  const usedTotal = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `The script uses approximately ${Math.round(usedTotal * 100) / 100} MB`
  );
  console.log(
    `***************************************************************************************************`
  );
};
var cons = require("consolidate");
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.engine("html", cons.swig);
app.set("port", process.env.PORT || 3009);
var io = require("socket.io").listen(1338);
var server = app.listen(app.get("port"), function() {
  console.log("Express server listening on port " + server.address().port);
});
app.io = io;
module.exports = app;