var beautify = require("js-beautify").js;
var html_beautify = require("js-beautify").html_beautify;
var Promise = require("bluebird");

(http = require("http")),
  (fs = require("fs")),
  (util = require("util")),
  (Busboy = require("busboy"));
(os = require("os")), (path = require("path")), (csv = require("fast-csv"));
crypto = require("crypto");
var d = new Date();

var serverdat = { name: d.toString() };

const { spawn } = require("child_process");

let pgcreateDb = function () {
  return new Promise((resolve, reject) => {
    try {
      const fs = require("fs");
      const child_process = require("child_process");

      var spawn_process_cmd = "yarn applychangesDB";
      child_process.exec(spawn_process_cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);

          reject(error);
        }
        resolve({ stdout: stdout });
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    } catch (err) {
      reject(err);
    }
  });
};
let addbaseRoutes = function (arr, keys, vals) {
  arr = JSON.parse(arr);
  if (arr.filter((item) => item.val == vals).length == 0) {
    arr.push({ val: vals, key: keys });
  }
  return arr;
};
let baseSchemaBuilder = function (fieldname) {
  var interims = "";
  fieldname.forEach(function (a) {
    if (a.fieldtypename == "STRING") {
      interims =
        interims +
        `${a.inputname}: {
    type: 'string',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: ${a.fieldmaxlength} }]
  },`;
    } else if (a.fieldtypename == "INTEGER") {
      interims =
        interims +
        `${a.inputname}: {
      type: 'integer',
      minimum: 1,
      maximum:2147483648
    },`;
    } else if (a.fieldtypename == "BIGINT") {
      interims =
        interims +
        `${a.inputname}: {
      type: 'integer',
      minimum: 1,
      maximum:9223372036854775808
    },`;
    } else if (a.fieldtypename == "DATE") {
      interims =
        interims +
        `${a.inputname}: {
    type: 'string',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: ${a.fieldmaxlength} }],
    format: 'date-time'`;
    }
  });
  return interims;
};
async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    var models = require("../../../models/");

    var baseOBj = [];
    Object.keys(models).forEach(function (data) {
      if (data != "sequelize" && data != "Sequelize") {
        baseOBj.push({
          mod: data,
          attr: Object.keys(models[data].tableAttributes),
        });
      }
    });

    reply.view(`base_scaffolding.ejs`, { mod: JSON.stringify(baseOBj) });
  });

  fastify.post("/jedha", (request, reply) => {
    var req = {};
    req.body = request.body;
    var mainapp = req.body;

    applymodel(mainapp)
      .then(applyApp)
      .then(applyroutes)
      .then(applyserverValidationConfig)
      .then(applyserverschemaValidator)
      .then(applyMochaChaiTestCases)
      .then(swaggerdocs)
      .then(applyMultiControls)
      .then(applyhtml)
      .then(packageJsonUpdate)
      .then(superadminUpdate)
      .then(SqlConstructMulti)
      .then(function (data) {
        reply.send({
          a: "run  yarn applychangesDB ",
          b: `run yarn ${mainapp[0].datapayloadModulename}Eval`,
        });
      })
      .catch((e) => {
        reply.send(e);
      });
  });
}
function packageJsonUpdate(mainapp) {
  return new Promise((resolve, reject) => {
    //var appsgenerator = fs.readFileSync('../../../../package.json', 'utf8')
    var appsgenerator = require("../../../../package.json");

    let interappsgenerator = appsgenerator;
    var modname = mainapp[0].datapayloadModulename;
    var o = {};
    o[
      modname + "Eval"
    ] = `mocha ./app/utils/test/${modname}-test.spec.js --timeout 10000 --exit`;

    Object.assign(interappsgenerator.scripts, o);

    fs.writeFile(
      "../../package.json",
      beautify(JSON.stringify(interappsgenerator), { indent_size: 2 }),
      function (err, data) {
        console.log(err);
        console.log(data);
        if (err) {
          reject(err);
        }
        resolve(mainapp);
      }
    );
  });
}
function superadminUpdate(mainapp) {
  return new Promise((resolve, reject) => {
    //var appsgenerator = fs.readFileSync('../../../../package.json', 'utf8')
    var appsgenerator = require("../../../config/superadmin.json");

    let interappsgenerator = appsgenerator;
    var modname = mainapp[0].datapayloadModulename;

    var interim = interappsgenerator[0].Modulename.split(",");
    interim.push(modname);

    interappsgenerator[0].Modulename = interim.join(",");
    interappsgenerator[1].Modulename = interim.join(",");

    fs.writeFile(
      "../config/superadmin.json",
      beautify(JSON.stringify(interappsgenerator), { indent_size: 2 }),
      function (err, data) {
        console.log(err);
        console.log(data);
        if (err) {
          reject(err);
        }
        resolve(mainapp);
      }
    );
  });
}
function applyMochaChaiTestCases(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var r2 = mainapp[0].server_client.filter(
        (r1) => r1.inputtype != "textbox"
      );
      var appsgenerator = " ";
      console.log("((((((((((mocha))))))))))");
      console.log(r2.length);
      if (r2.length >= 1) {
        appsgenerator = fs.readFileSync(
          "../ref/tests/Employees-test-referential.spec.js",
          "utf8"
        );
      } else {
        appsgenerator = fs.readFileSync(
          "../ref/tests/Employees-test.spec.js",
          "utf8"
        );
      }
      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      );
      fs.writeFile(
        "../utils/test/" + mainapp[0].datapayloadModulename + "-test.spec.js",
        beautify(appsgenerator, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

function applyserverschemaValidator(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync(
        "../ref/routes/utils/payloadSchema.js",
        "utf8"
      );
      var filename = mainapp[0].server_client;
      var applyFields = filename.map(function (doctor) {
        return doctor.inputname;
      });
      applyFields.push("recordstate");
      appsgenerator = appsgenerator.replace(
        "placeholder2",
        JSON.stringify(applyFields, null, 2)
      );
      var applyFields2 = baseSchemaBuilder(filename);
      filename = JSON.stringify(filename, null, 2).replace(
        /\"([^(\")"]+)\":/g,
        "$1:"
      );

      var applyFields1 = applyFields;
      applyFields1.push(mainapp[0].datapayloadModulename + "id");

      appsgenerator = appsgenerator.replace(
        "placeholder3",
        JSON.stringify(applyFields1, null, 2)
      );
      appsgenerator = appsgenerator.replace(
        "placeholder4",
        mainapp[0].datapayloadModulename + "id"
      );
      appsgenerator = appsgenerator.replace("placeholder1", applyFields2);
      var dir = "../routes/utils/" + mainapp[0].datapayloadModulename;
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, function (err, data) {
          fs.writeFile(
            "../routes/utils/" +
              mainapp[0].datapayloadModulename +
              "/payloadSchema.js",
            beautify(appsgenerator, { indent_size: 2 }),
            "utf8",
            function (err, data) {
              resolve(mainapp);
            }
          );
        });
      } else {
        fs.writeFile(
          "../routes/utils/" +
            mainapp[0].datapayloadModulename +
            "/payloadSchema.js",
          beautify(appsgenerator, { indent_size: 2 }),
          "utf8",
          function (err, data) {
            console.log(err);
            resolve(mainapp);
          }
        );
      }
    } catch (err) {
      reject(err);
    }
  });
}

function createdb(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var baseobj = {};
      baseobj.mname = mainapp[0].datapayloadModulename.toString().trim();
      var models = require("../../../models/");
      //models.sequelize.sync().then(function () {
      models.modname
        .create(baseobj)
        .then(function () {
          resolve(mainapp);
        })
        .catch((e) => {
          reject(e);
        });

      //});
    } catch (err) {
      reject(err);
    }
  });
}
var checkboxEditPopulate = function (redlime) {
  var r1 = "";
  redlime.forEach(function (dt) {
    if (dt.inputtype == "checkbox") {
      r1 = r1 + `current${dt.inputtypemod}.data[data.key]=intern`;
    }
  });
  return r1;
};
var radioEditPopulate = function (redlime) {
  var r1 = "";
  redlime.forEach(function (dt) {
    if (dt.inputtype == "radio") {
      r1 = r1 + `current${dt.inputtypemod}.data=data.val`;
    }
  });
  return r1;
};
var checkboxmultiInitControl = function (redlime) {
  var r1 = "";
  redlime.forEach(function (dt) {
    if (dt.inputtype == "checkbox") {
      if (dt.childcontent != undefined) {
        r1 =
          r1 +
          (r1 != "" ? "else " : " ") +
          `if (element.inputtype == "checkbox" && element.inputtypemod==current${dt.inputtypemod}.name) {
          ${dt.inputname}content.forEach((elem, index) => {
        
        internhtmlcontent = internhtmlcontent + htmlPopulateCustomControl.multiCheckBoxPopulate(elem,current${dt.inputtypemod})
      })
      $('#overlaycontent').append(htmlPopulateCustomControl.multiCheckboxPopulatePrimary(current${dt.inputtypemod},internhtmlcontent))
  }`;
      } else {
        r1 =
          r1 +
          (r1 != "" ? "else " : " ") +
          `if (element.inputtype == "checkbox" && element.inputtypemod==current${dt.inputtypemod}.name) {
          var internhtmlcontent=" "
    basefunction().${dt.inputtypemod}MultiKeysLoad(current${dt.inputtypemod}.text).then(function (data) {
      data.rows.forEach((elem, index) => {
        
        internhtmlcontent = internhtmlcontent + htmlPopulateCustomControl.multiCheckBoxPopulate(elem,current${dt.inputtypemod})
      })
      $('#overlaycontent').append(htmlPopulateCustomControl.multiCheckboxPopulatePrimary(current${dt.inputtypemod},internhtmlcontent))
      
    });
  }`;
      }
    }
  });
  return r1;
};
var radiomultiInitControl = function (redlime) {
  var r1 = "";
  redlime.forEach(function (dt) {
    if (dt.inputtype == "radio") {
      console.log("heree");
      if (dt.childcontent != undefined) {
        r1 =
          r1 +
          (r1 != "" ? "else " : " ") +
          `if (element.inputtype == "radio" && element.inputtypemod==current${dt.inputtypemod}.name) {
          ${dt.inputname}content.forEach((elem, index) => {
        internhtmlcontent = internhtmlcontent + htmlPopulateCustomControl.customRadioPopulate(elem,current${dt.inputtypemod})
      })
      $('#overlaycontent').append(htmlPopulateCustomControl.customRadioPopulatePrimary(current${dt.inputtypemod},internhtmlcontent))
    
  }`;
      } else {
        console.log(r1 != "" ? "else " : " ");
        r1 =
          r1 +
          (r1 != "" ? "else " : " ") +
          `if (element.inputtype == "radio" && element.inputtypemod==current${dt.inputtypemod}.name) {
            var internhtmlcontent=""
      basefunction().${dt.inputtypemod}MultiKeysLoad(current${dt.inputtypemod}.text).then(function (data) {
        data.rows.forEach((elem, index) => {
          internhtmlcontent = internhtmlcontent + htmlPopulateCustomControl.customRadioPopulate(elem,current${dt.inputtypemod})
        })
        $('#overlaycontent').append(htmlPopulateCustomControl.customRadioPopulatePrimary(current${dt.inputtypemod},internhtmlcontent))
      });
    }`;
      }
    }
  });
  return r1;
};
var multiSelectControl = function (redlime) {
  var r1 = "";
  var baseContent = `let basemultiselectaccess = {
    multiselectmodular: function (arg) {
      var multiselectconfig = {
        selectevent: '#in' + arg.fieldname,
        fieldkey: arg.fieldkey,
        selecttype: arg.selecttype,
        selecttype: arg.selecttype,
        placeholder: arg.fieldname,
        remotefunc: this['remotefunc' + arg.fieldname]
      }
  
      
      multiselectfunc[arg.fieldname] = new multisel(multiselectconfig, function (
        data
      ) {
        multiselects[arg.secondaryKey] = data
        reqopsValidate.formvalidation(
          $(\`#overlaycontent [data-key='\${arg.secondaryKey}']\`)
        )
        validationListener()
      })
      multiselectfunc[arg.fieldname].init()
    },
    multiSelectCommon: function (data) {
      var arin = []
      var intern = {}
      intern[data.fieldname] = data.fieldval
      arin.push(intern)
      intern = {}
      var internbase = basemultiselectaccess.htmlpopulatemodnamefilterparam(arin)
      return internbase
    },
    multiSelectCommonResponse: function (data, argument) {
      var internfield = Object.keys(argument.rows[0])
      var sets = argument.rows.map(function (doctor) {
        return {
          // return what new object will look like
          key: data.fieldname,
          text: doctor[internfield[0]],
          val: doctor[internfield[1]]
        }
      })
      return sets
    },
    htmlpopulatemodnamefilterparam: function (internar) {
      var filtparam = {}
      filtparam.pageno = 0
      filtparam.pageSize = 20
      filtparam.searchtype = 'Columnwise'
      filtparam.searchparam = internar
      filtparam.searchparammetafilter = []
      filtparam.ispaginate = true
      filtparam.disableDate = true
      base.datapayload = filtparam
  
      return base
    },
    htmlpopulatemrolefilterparam: function (internar) {
      var filtparam = {}
      filtparam.modulename = internar.mname
      filtparam.rolename = internar.roleid
      base.datapayload = filtparam
  
      return base
    },
    htmlpopulatemodular: function (fieldname) {
      return htmlPopulateCustomControl.genericddlPopulate(fieldname)
    },`;

  redlime.forEach(function (dt) {
    if (
      (dt.inputtype == "multiselect" || dt.inputtype == "singleselect") &&
      dt.childcontent == undefined
    ) {
      baseContent =
        baseContent +
        `\n remotefunc${dt.inputtextval}: function (data) {
  return new Promise(function (resolve, reject) {
    basefunction()
      .getcurrentMod${dt.inputParent}groupby(
        basemultiselectaccess.multiSelectCommon(data)
      )
      .then(function (argument) {
        var sets = argument.rows

        if (sets[0] != undefined) {
          resolve(
            basemultiselectaccess.multiSelectCommonResponse(data, argument)
          )
        }
      })
  })
},`;
    } else if (dt.inputtype == "multiselect" && dt.childcontent != undefined) {
      baseContent =
        baseContent +
        `remotefunc${dt.inputtextval}: function (data) {
        return new Promise(function (resolve, reject) {
          resolve(${dt.inputtextval}content)
        })
      },`;
    }
  });
  baseContent = baseContent + `}`;
  return baseContent;
};
var interfaceMultiControl = function (redlime) {
  var r1 = "";
  redlime.forEach(function (dt) {
    if (
      (dt.inputtype == "multiselect" || dt.inputtype == "singleselect") &&
      dt.childcontent == undefined
    ) {
      r1 =
        r1 +
        `getcurrentMod${dt.inputParent}groupby: \`/\${current${dt.inputParent}}/api/searchtypegroupbyId/\`,`;
    } else if (dt.inputtype == "radio" || dt.inputtype == "checkbox") {
      r1 =
        r1 +
        `getcurrentMod${dt.inputParent}groupby: \`/\${current${dt.inputParent}.name}/api/searchtypegroupbyId/\`,`;
    }
  });
  return r1;
};
var interfacelevel1MultiControl = function (redlime) {
  var r1 = "";
  redlime.forEach(function (dt) {
    if (dt.inputtype != "textbox" && dt.childcontent == undefined) {
      r1 =
        r1 +
        `
      getcurrentMod${dt.inputParent}groupby: function(base) {
        ajaxbase.payload = base.datapayload
        ajaxbase.url = baseurlobj.getcurrentMod${dt.inputParent}groupby;
        return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
            ajaxbase.response = argument;
            return argument;
        })
      },`;
    }
  });
  return r1;
};
var radioMultiControl = function (redlime) {
  var r1 = "";
  redlime.forEach(function (dt) {
    if (dt.inputtype == "radio") {
      r1 =
        r1 +
        `on${dt.inputtypemod}Control: function (data) {
    var key = $(data).data().key;
    var val = $(data).data().val;
   if ($(data)[0].checked) {
    current${dt.inputtypemod}.data={[key]:val}
   }
   else {
     delete current${dt.inputtypemod}.data[key]
   }
},`;
    }
  });
  return r1;
};
var checkboxMultiControl = function (redlime) {
  var r1 = "";
  redlime.forEach(function (dt) {
    if (dt.inputtype == "checkbox") {
      r1 =
        r1 +
        `on${dt.inputtypemod}Control: function (data) {
    var key = $(data).data().key;
    var val = $(data).data().val;
    if ($(data)[0].checked) {
      current${dt.inputtypemod}.data[key] = [...current${dt.inputtypemod}.data[key], ...[val]]
    }
    else {
      current${dt.inputtypemod}.data[key] = current${dt.inputtypemod}.data[key].filter(item => (isNaN(parseInt(item))?item:parseInt(item)) !== val)
    }
    reqopsValidate.formvalidation(data);
     validationListener()
},`;
    }
  });
  return r1;
};
let multiInsertCodeforCheckbox = function (redlime, mod) {
  var r1 = `let updateIds; 
  if(ajaxbase.isedit)
   {
    updateIds=arg.datapayload[currentmoduleid].split(',')
    delete arg.datapayload[currentmoduleid]
   }
  let internim={ datapayload:{ ...arg.datapayload`;
  var r2 = `return htmlPopulateCustomControl.genericMultiControlpayload(
    base,
    internim,
    updateIds,
    currentmoduleid
  ) 
  `;
  redlime.forEach(function (dt) {
    if (dt.inputtype == "checkbox" || dt.inputtype == "radio") {
      r1 = r1 + `,...current${dt.inputtypemod}.data `;
    } else if (dt.inputtype == "multiselect") {
      if (r1.includes("multiselects")) {
      } else {
        r1 = r1 + `,...multiselects`;
      }
    }
  });
  r1 = r1 + `}}`;

  return r1 + r2;
};

let multiClearCode = function (validationmap, mod) {
  let isMultiControl = validationmap.map((a) => a.inputtype);

  var conditions = ["multiselect", "singleselect", "checkbox", "radio"];
  var test2 = conditions.some((el) => isMultiControl.includes(el));
  var r2 = "";
  if (test2) {
    validationmap.forEach(function (dt) {
      if (dt.inputtype == "radio" || dt.inputtype == "checkbox") {
        r2 = r2 + `\n current${dt.inputtypemod}.data.${dt.inputtypeID}=[]`;
      }
    });
    var conditions = ["multiselect", "singleselect"];
    var test21 = conditions.some((el) => isMultiControl.includes(el));
    console.log("why" + test21);
    if (test21) {
      r2 = r2 + "\n multiselects={}";
    }
    return r2;
  } else {
    return "";
  }
};

let multiInsertCode = function (validationmap, mod) {
  let isMultiControl = validationmap.map((a) => a.inputtype);

  var conditions = ["multiselect", "singleselect", "checkbox"];
  var test2 = conditions.some((el) => isMultiControl.includes(el));
  if (test2) {
    return multiInsertCodeforCheckbox(validationmap, mod);
  } else {
    var r1 = ` return { datapayload:{ ...arg.datapayload`;
    validationmap.forEach(function (dt) {
      if (dt.inputtype == "radio") {
        r1 = r1 + `,...current${dt.inputtypemod}.data `;
      }
    });
    r1 = r1 + "}\n}";
    return r1;
  }
};
/*
let multiInsertCode = function (redlime) {
  var isMulti = `return { ...arg.datapayload`
  var r1 = `return { datapayload:{ ...arg.datapayload`
  var r2 = `{
    var isactivearrayobj = {
      recordstate: base.interimdatapayload.recordstate
    }
    //flatting multiselects objects
    var temp = Object.fromEntries(
      Object.entries(multiselects).map(([k, v]) => [
        k,
        datatransformutils.flat(v)
      ])
    )
    let b = { ...temp, ...isactivearrayobj }
    //apply cartesion for multiselects objects
    var interns = datatransformutils.getCartesian(b)
    let o = {
      payset: interns,
      delObj: {
        ${redlime[0].inputtypeID}: interns[0].${redlime[0].inputtypeID}
      }
    }
    base.datapayload = o
    return base
  }`
  redlime.forEach(function (dt) {
    if (dt.inputtype == 'radio' ) {
      r1 = r1 + `,...current${dt.inputtypemod}.data `
      isMulti = false
    } else if (
      dt.inputtype == 'singleselect' ||
      dt.inputtype == 'multiselect'
    ) {
      isMulti = true
    }
  })
  r1 = r1 + `}}`

  return isMulti === true ? r2 : r1
}*/

var StaticMulitSelectDataInitControl = function (redlime) {
  var r1 = "";
  var r2 = "";
  redlime.forEach(function (dt) {
    if (
      dt.inputtype == "multiselect" ||
      dt.inputtype == "singleselect" ||
      dt.inputtype == "radio" ||
      dt.inputtype == "checkbox"
    ) {
      if (dt.childcontent != undefined) {
        var ar1 = [];

        dt.childcontent.forEach(function (dts) {
          if (dt.inputtype == "radio" || dt.inputtype == "checkbox") {
            var o = {};
            o[dt.inputname + "id"] = dts.val;
            o[`name`] = dts.text;
            o.key = dt.inputname;
            ar1.push(o);
          } else {
            var o = {};
            o.text = dts.text;
            o.val = dts.val;
            o.key = dt.inputname;
            ar1.push(o);
          }
        });

        if (dt.inputtype == "radio" || dt.inputtype == "checkbox") {
          r1 =
            r1 + `let ${dt.inputname}content =${JSON.stringify(ar1, null, 4)}`;
        } else {
          r1 =
            r1 + `let ${dt.inputname}content =${JSON.stringify(ar1, null, 4)}`;
        }
      }
    }
  });
  return r1;
};
let baseinitControl = function (redlime) {
  var r1 = " ";
  var isMulti = "";
  redlime.forEach(function (dt) {
    if (dt.inputtype == "radio" || dt.inputtype == "checkbox") {
      if (dt.childcontent != undefined) {
        r1 =
          r1 +
          `let current${dt.inputtypemod}={
        name:"${dt.inputtypemod}",
        id:"${dt.inputtypeID}id",
        text:"name",
        data:{"${dt.inputtypeID}id":[]}
      };`;
      } else {
        r1 =
          r1 +
          `let current${dt.inputtypemod}={
        name:"${dt.inputtypemod}",
        id:"${dt.inputname}",
        text:"${dt.inputtextval}",
        data:{"${dt.inputname}":[]}
      };`;
      }

      //${dt.inputtype == 'checkbox' ? `data:{"${dt.inputtypeID}":[]}` : ' '}
    } else if (
      dt.inputtype == "multiselect" ||
      dt.inputtype == "singleselect"
    ) {
      isMulti = true;
      if (dt.childcontent == undefined) {
        r1 = r1 + `let current${dt.inputParent} = '${dt.inputParent}'`;
      }
    }
  });
  var multival = `let multiselects = {}
  let multiselectfunc = {}`;
  return isMulti === true ? r1 + "\n" + multival : r1;
};
function applyMultiControls(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync(
        "../ref/public/admin/js/app/app_employees.js",
        "utf8"
      );
      var appsgenerator1 = fs.readFileSync(
        "../ref/public/admin/js/app/app_employees-client.js",
        "utf8"
      );
      appsgenerator1 = appsgenerator1.replace(
        "//insertpayloadData",
        "\n " +
          multiInsertCode(
            mainapp[0].server_client,
            mainapp[0].datapayloadModulename
          )
      );
      appsgenerator1 = appsgenerator1.replace(
        "//clearControls",
        "\n " +
          multiClearCode(
            mainapp[0].server_client,
            mainapp[0].datapayloadModulename
          )
      );
      appsgenerator = appsgenerator.replace(
        "//insertpayloadData",
        "\n " +
          multiInsertCode(
            mainapp[0].server_client,
            mainapp[0].datapayloadModulename
          )
      );
      appsgenerator = appsgenerator.replace(
        "//clearControls",
        "\n " +
          multiClearCode(
            mainapp[0].server_client,
            mainapp[0].datapayloadModulename
          )
      );
      var based = mainapp[0].server_client;
      // based = based.filter(function (doctor) {
      //   return doctor.inputtype != "textbox"; // if truthy then keep item
      // });

      if (based.length >= 1) {
        var baseMod = baseinitControl(mainapp[0].server_client);
        //definition
        var currentInitialization =
          "getcurrentMod{modulename}groupby: '/' + current{modulename.name} + '/api/searchtypegroupbyId/',";
        //initialization
        var interfaceinit = interfaceMultiControl(mainapp[0].server_client);
        var implementationinit = interfacelevel1MultiControl(
          mainapp[0].server_client
        );

        //implementation
        var currentImplementation = `
    getcurrentMod{modulename}groupby: function(base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getcurrentMod{modulename}groupby;
      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
          ajaxbase.response = argument;
          return argument;
      })
    },`;
        var onchkscaffolding =
          radioMultiControl(mainapp[0].server_client) +
          "  " +
          checkboxMultiControl(mainapp[0].server_client) +
          ` onMultiControlChk:function(data){
  },`;
        var baseOffLoad = `let validationListener=function()
        {
         var sel = $('#overlaycontent input:text[data-form-type], input:checkbox[data-form-type], div[data-form-type]').length;
         
         if (sel <= 0) {
           $('#btnmodalsub').prop('disabled', false)
         } else {
           $('#btnmodalsub').prop('disabled', true)
         }
        }
        //multiSelectInit6
    $(function () {
    basemod_modal.modalpopulate()
    //multiSelectInit7
    $('#overlaycontent input[type="text"], input[type="checkbox"]').on("keydown keyup change", function () {
      validationListener()
    })
  })`;

        var c = "";
        var d = "";
        var e = "";

        //{ ...arg.datapayload, ...current{Modname}.data }

        mainapp[0].server_client.forEach((element) => {
          //server_client.forEach(element => {

          //if (element.inputtype != "textbox") {
          onchkscaffolding = onchkscaffolding.replace(
            /{Modname}/g,
            element.inputtypemod
          );
          multiControlsScripts = multiControlsScripts.replace(
            "//onchkcapture",
            "\n " + onchkscaffolding
          );
          multiControlsScripts = multiControlsScripts.replace(
            "//editCheckbox",
            "\n " + checkboxEditPopulate(mainapp[0].server_client)
          );
          multiControlsScripts = multiControlsScripts.replace(
            "//editRadio",
            "\n " + radioEditPopulate(mainapp[0].server_client)
          );

          baseMod = baseMod.replace(/{Modname}/g, element.inputtypemod);
          baseMod = baseMod.replace(/{name}/g, element.inputtypemod);
          baseMod = baseMod.replace(/{id}/g, element.inputtypeID);
          baseMod = baseMod.replace(/{text}/g, element.inputtypeVal);

          multiControlsScripts = multiControlsScripts.replace(
            "//checkboxCode",
            "\n " + checkboxmultiInitControl(mainapp[0].server_client)
          );
          multiControlsScripts = multiControlsScripts.replace(
            "//radioCode",
            "\n " + radiomultiInitControl(mainapp[0].server_client)
          );
          if (element.inputtype == "multiselect") {
            multiControlsScripts = multiControlsScripts.replace(
              "//multiSelectInit8",
              "\n " +
                `if (element.inputtype == 'multiselect') {
                  htmlcontent += basemultiselectaccess.htmlpopulatemodular(element)
                } `
            );
            multiControlsScripts = multiControlsScripts.replace(
              "//multiSelectInit4",
              "\n " +
                `datatransformutils.editMultiSelect({
                  multiselectfunc,
                  validationmap,
                  content: interncontent
                })
                $("[data-attribute='multiSelect']").removeAttr('data-form-type')`
            );
            multiControlsScripts = multiControlsScripts.replace(
              "//multiSelectInit5",
              "\n " +
                `populatemodularddl: function () {
                  validationmap.forEach(function (data) {
                    if (data.inputtype == 'multiselect') {
                      var p = {}
                      p.fieldname = data.inputtextval
                      p.fieldkey = data.inputtextval
                      p.secondaryKey = data.inputname
                      p.selecttype = data.selecttype
                      basemultiselectaccess.multiselectmodular(p)
                    }
                  })
                }`
            );
            multiControlsScripts = multiControlsScripts.replace(
              "//multiSelectInit9",
              "\n " + ``
            );
            baseOffLoad = baseOffLoad.replace(
              "//multiSelectInit6",
              "\n " + multiSelectControl(mainapp[0].server_client)
            );

            baseOffLoad = baseOffLoad.replace(
              "//multiSelectInit7",
              "\n " + `basemod_modal.populatemodularddl()`
            );
          }
          let isMultiControl1 = mainapp[0].server_client.map(
            (a) => a.inputtype
          );

          //.includes('multiselect', 'singleselect')
          var conditions = ["multiselect", "singleselect", "radio", "checkbox"];
          var test2 = conditions.some((el) => isMultiControl1.includes(el));
          console.log(test2);
          if (test2) {
            multiControlsScripts = multiControlsScripts.replace(
              "//txtelse",
              "\n " + "else"
            );
          }
          if (
            checkboxmultiInitControl(mainapp[0].server_client) !== "" &&
            radiomultiInitControl(mainapp[0].server_client) !== ""
          ) {
            console.log("---------------------herer");
            multiControlsScripts = multiControlsScripts.replace(
              "//rchkelse",
              "\n " + "else"
            );
          }
          if (
            (checkboxmultiInitControl(mainapp[0].server_client) !== "" ||
              radiomultiInitControl(mainapp[0].server_client) !== "") &&
            element.inputtype == "multiselect"
          ) {
            multiControlsScripts = multiControlsScripts.replace(
              "//multiselectelse",
              "\n " + "else"
            );
          }

          appsgenerator = appsgenerator.replace(
            "//definition",
            "\n " + baseMod
          );
          appsgenerator1 = appsgenerator1.replace(
            "//definition",
            "\n " + baseMod
          );
          if (c == "") {
            c = currentInitialization.replace(
              /{modulename}/g,
              element.inputtypemod
            );
            d = currentImplementation.replace(
              /{modulename}/g,
              element.inputtypemod
            );
            e =
              element.childcontent == undefined
                ? groupbyControlsPopulate(element.inputtypemod)
                : " ";
          } else {
            c =
              c +
              "\n" +
              currentInitialization.replace(
                /{modulename}/g,
                element.inputtypemod
              );
            d =
              d +
              "\n" +
              currentImplementation.replace(
                /{modulename}/g,
                element.inputtypemod
              );
            e =
              e +
              "\n" +
              (element.childcontent == undefined
                ? groupbyControlsPopulate(element.inputtypemod)
                : " ");
          }
        });
        if (c != "") {
          appsgenerator = appsgenerator.replace(/definition/g, "\n" + baseMod);
          appsgenerator1 = appsgenerator1.replace(
            /definition/g,
            "\n" + baseMod
          );
          appsgenerator = appsgenerator.replace(
            /initialization/g,
            "\n" + interfaceinit
          );
          appsgenerator1 = appsgenerator1.replace(
            /initialization/g,
            "\n" + interfaceinit
          );
          appsgenerator = appsgenerator.replace(
            /implementation/g,
            "\n" + implementationinit
          );
          appsgenerator1 = appsgenerator1.replace(
            /implementation/g,
            "\n" + implementationinit
          );
          appsgenerator = appsgenerator.replace(/groupBySets/g, "\n" + e);
          appsgenerator1 = appsgenerator1.replace(/groupBySets/g, "\n" + e);
          appsgenerator = appsgenerator.replace(
            /baseOffLoad/g,
            "\n" + baseOffLoad
          );
          appsgenerator1 = appsgenerator1.replace(
            /baseOffLoad/g,
            "\n" + baseOffLoad
          );
          var replaces = `afterhtmlpopulate: function(){}`;

          appsgenerator = appsgenerator.replace(
            replaces,
            "\n" + beautify(multiControlsScripts, { indent_size: 2 })
          );
          let internmultiControlsScripts = multiControlsScripts;
          internmultiControlsScripts = internmultiControlsScripts.replace(
            "//clientbasedJS",
            `let btncode = \` <button type="button" id="btnmodalsub" class="btn btn-primary" disabled="true"
          onclick="javascript:reqops.btnSubmit();">Save changes</button>\`;
         $("#overlaycontent").append(htmlcontent + btncode);`
          );

          let ph1 = internmultiControlsScripts
            .split("//editStart")[1]
            .split("//editEnd")[0];

          internmultiControlsScripts = internmultiControlsScripts.replace(
            ph1,
            ""
          );

          internmultiControlsScripts = internmultiControlsScripts.replace(
            `var chkcontent=htmlPopulateCustomControl.genericCheckboxHtml(currentmoduleid);$("#overlaycontent").append(htmlcontent + chkcontent);`,
            ""
          );
          internmultiControlsScripts = internmultiControlsScripts.replace(
            `$('#basetable tbody tr td:last-child').attr('onclick', 'javascript:basemod_modal.ontdedit(this)')`,
            ""
          );
          internmultiControlsScripts = internmultiControlsScripts.replace(
            `$('#basetable tbody tr td:nth-child(1) input:checkbox').attr('onclick', 'javascript:basemod_modal.tablechkbox(this)')`,
            ""
          );

          appsgenerator1 = appsgenerator1.replace(
            replaces,
            "\n" + beautify(internmultiControlsScripts, { indent_size: 2 })
          );

          appsgenerator = appsgenerator.replace(
            /StaticMulitSelectData/g,
            "\n" +
              beautify(
                StaticMulitSelectDataInitControl(mainapp[0].server_client),
                { indent_size: 2 }
              )
          );
          appsgenerator1 = appsgenerator1.replace(
            /StaticMulitSelectData/g,
            "\n" +
              beautify(
                StaticMulitSelectDataInitControl(mainapp[0].server_client),
                { indent_size: 2 }
              )
          );

          mainapp[0].server_client.forEach(function (dt) {
            if (
              dt.inputtype == "multiselect" ||
              dt.inputtype == "singleselect" ||
              dt.inputtype == "checkbox"
            ) {
              //if (dt.childcontent != undefined) {
              appsgenerator = appsgenerator.replace(
                "createdata: `/${currentmodulename}/api/create/`",
                "createdata: `/${currentmodulename}/api/bulkCreate/`\n,singleCreatedata: `/${currentmodulename}/api/create/`"
              );
              appsgenerator1 = appsgenerator1.replace(
                "createdata: `/${currentmodulename}/api/create/`",
                "createdata: `/${currentmodulename}/api/bulkCreate/`\n,singleCreatedata: `/${currentmodulename}/api/create/`"
              );
              appsgenerator = appsgenerator.replace(
                "//SingleCreate",
                `singleInsert: function(base) {
                ajaxbase.payload = base.datapayload
                ajaxbase.url = baseurlobj.singleCreatedata;
                return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                  ajaxbase.response = argument;
                  return argument;
                })
              },`
              );
              appsgenerator1 = appsgenerator1.replace(
                "//SingleCreate",
                `singleInsert: function(base) {
                ajaxbase.payload = base.datapayload
                ajaxbase.url = baseurlobj.singleCreatedata;
                return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                  ajaxbase.response = argument;
                  return argument;
                })
              },`
              );
              //updateRecord
              appsgenerator = appsgenerator.replace(
                `ajaxbase.payload = basemod_modal.payloadformat(base).datapayload;ajaxbase.url = baseurlobj.updatedata;return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {ajaxbase.response = argument;return argument;})`,
                ""
              );
              appsgenerator1 = appsgenerator1.replace(
                `ajaxbase.payload = basemod_modal.payloadformat(base).datapayload;ajaxbase.url = baseurlobj.updatedata;return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {ajaxbase.response = argument;return argument;})`,
                ""
              );
              appsgenerator = appsgenerator.replace(
                "//updateRecord",
                "\n" +
                  beautify(
                    `return Promise.mapSeries(basemod_modal.payloadformat(base).datapayload,function(dt)
                    {
                     ajaxbase.payload = dt
                     ajaxbase.url = baseurlobj.updatedata;
                     return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                       ajaxbase.response = argument;
                       return argument;
                     })
                    }).then(a => {
                      console.log(a)
                      return a
                    })`,
                    { indent_size: 2 }
                  )
              );
              // } else {
              // }
            }
          });
          appsgenerator = appsgenerator.replace(
            /updateRecord/g,
            "\n" +
              beautify(
                `ajaxbase.payload = basemod_modal.payloadformat(base).datapayload;ajaxbase.url = baseurlobj.updatedata;return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {ajaxbase.response = argument;return argument;})`,
                { indent_size: 2 }
              )
          );
        }
      }

      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      );
      appsgenerator1 = appsgenerator1.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      );

      fs.writeFile(
        "../public/admin/js/app/app_" +
          mainapp[0].datapayloadModulename +
          ".js",
        beautify(appsgenerator, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp);
        }
      );
      fs.writeFile(
        "../public/admin/js/app/app_" +
          mainapp[0].datapayloadModulename +
          "_client.js",
        beautify(appsgenerator1, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
function applyclientJS(mainapp) {
  return new Promise((resolve, reject) => {
    var appsgenerator = fs.readFileSync(
      "../ref/public/admin/js/app/app_employees.js",
      "utf8"
    );
    appsgenerator = appsgenerator.replace(
      /employees/g,
      mainapp[0].datapayloadModulename
    );
    fs.writeFile(
      "../public/admin/js/app/app_" + mainapp[0].datapayloadModulename + ".js",
      beautify(appsgenerator, { indent_size: 2 }),
      function (err, data) {
        resolve(mainapp);
      }
    );
  });
}
/* multi control part in process */
let groupbyControlsPopulate = function (modname) {
  if (modname != undefined) {
    let groupbyControlsPopulate = `employeesMultiKeysLoad:function(keys)
    {
        //keys="gender"
       base.datapayload=baseloadsegments.basePopulateMultiControls(keys)
       return this
       .getpaginatesearchtypegroupby(base)
       .then(function (argument) {
           return argument
       })
    },`;
    groupbyControlsPopulate = groupbyControlsPopulate.replace(
      "employees",
      modname
    );
    groupbyControlsPopulate = groupbyControlsPopulate.replace(
      `getpaginatesearchtypegroupby`,
      `getcurrentMod${modname}groupby`
    );
    return groupbyControlsPopulate;
  } else {
    return "";
  }
};

var multiControlsScripts = `
  modalpopulate: function() {
    var interset = [...validationmap]
    var redlime=new Array(Math.ceil(interset.length / 2)).fill().map(_ => interset.splice(0, 2))
    $("#overlaycontent").empty();
    var htmlcontent = "";
    var internhtmlcontent="";
    redlime.forEach(function(item) {

        htmlcontent += \`<div class=\"row\">\`
        item.forEach(function(element) {
          //multiSelectInit8
          //multiselectelse   
          //radioCode
             //rchkelse   
             //checkboxCode
             //txtelse 
             {
                htmlcontent += htmlPopulateCustomControl.textBoxPopulateSecondary(element);
            }

        })

        htmlcontent += \`</div>\`
    })
//clientbasedJS 
    var chkcontent=htmlPopulateCustomControl.genericCheckboxHtml(currentmoduleid);$("#overlaycontent").append(htmlcontent + chkcontent);
},
//onchkcapture
baseCheckbox:htmlPopulateCustomControl.genericCheckboxHtmlPrimary()
  ,
  //multiSelectInit9
     afterhtmlpopulate: function() {
         $('#basetable tbody tr td:last-child').attr('onclick', 'javascript:basemod_modal.ontdedit(this)')
         $('#basetable tbody tr td:nth-child(1) input:checkbox').attr('onclick', 'javascript:basemod_modal.tablechkbox(this)')
         //$("a[href='#sales-chart'").hide()
     },
     //editStart
     ontdedit: function(arg) {

         var armodid = $(arg).attr('data-tbledit-type')
         ajaxbase.isedit = true;
         var interncontent = ajaxbase[currentmodulename].rows;

         interncontent = interncontent.filter(function(doctor) {
             return doctor[currentmoduleid] == armodid;
         })
         base.editrecord = interncontent;
         $('#cltrl' + currentmoduleid).val(armodid);
         var formatresponse = this.baseResponseformat(
          validationmap,
          interncontent[0]
        )
         //multiSelectInit4
         formatresponse.forEach(function(data) {

             if (data.inputtype == "textbox") {
                 $("#cltrl" + data.key).val(data.val)
                 $("#cltrl" + data.key).removeAttr('data-form-type');
             }
             else if (data.inputtype == "radio") {
              $(\`#overlaycontent .form-group.overlaytxtalign.col-md-5 .custom-control.custom-radio  [data-val="\${data.val}"]\`).prop("checked", true)
              //editRadio
             }
               else if (data.inputtype == "checkbox") {
                $('*[data-attribute="checkboxMulti"]').removeAttr('data-form-type');
              $(\`#overlaycontent .checkbox.tablechk [type="checkbox"]\`).each(function (index) {
                $(this).attr("checked", false)
              })
              var intern = data.val.includes(',') ? data.val.split(',') : [data.val]
              intern.forEach(function (dr) {
                
                $(\`#overlaycontent .form-group.overlaytxtalign.col-md-5 .custom-control.custom-checkbox  [data-val='\${dr}']\`).prop("checked", true)
                
              })
              //editCheckbox
             }
         })
         //active comma denominator
         //console.log(interncontent[0].recordstate)
         htmlPopulateCustomControl.genericRecordState(interncontent,base)
         
     },
     //editEnd
     tablechkbox: function(arg) {},
     baseResponseformat: function (validationmap, dt) {
      return validationmap.map(function (dr) {
        return {
          key: dr.inputname,
          val: dt[dr.inputname],
          inputtype: dr.inputtype
        }
      })
    },
     //multiSelectInit5
     
     `;

function applyhtml(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      let isMultiControl = mainapp[0].server_client.map((a) => a.inputtype);
      //.includes('multiselect', 'singleselect')
      var conditions = ["multiselect", "singleselect"];
      var test2 = conditions.some((el) => isMultiControl.includes(el));
      var appsgenerator = "";
      var appsgeneratorClient = "";
      if (test2) {
        appsgenerator = fs.readFileSync(
          "../ref/views/employees/employees-multiselect.ejs",
          "utf8"
        );
        appsgeneratorClient = fs.readFileSync(
          "../ref/views/employees/employees_client.ejs",
          "utf8"
        );
      } else {
        appsgenerator = fs.readFileSync(
          "../ref/views/employees/employees.ejs",
          "utf8"
        );
        appsgeneratorClient = fs.readFileSync(
          "../ref/views/employees/employees_client.ejs",
          "utf8"
        );
      }
      appsgeneratorClient = appsgeneratorClient.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      );
      appsgeneratorClient = appsgeneratorClient.replace(
        "//baseValidationMap",
        beautify(JSON.stringify(mainapp[0].server_client), { indent_size: 2 })
      );
      let isMultiControl3 = mainapp[0].server_client.map((a) => a.inputtype);
      var conditions = ["multiselect", "singleselect", "checkbox", "radio"];
      var test2 = conditions.some((el) => isMultiControl3.includes(el));
      if (test2) {
        var conditions1 = ["multiselect", "singleselect"];
        var test3 = conditions1.some((el) => isMultiControl3.includes(el));
        if (test3) {
          appsgeneratorClient = appsgeneratorClient.replace(
            "<!--Multiselect calls-->",
            `<!-- Multiselect .js -->
        <link rel="stylesheet" href="../../vdashboard/dist/css/multiselect.css" />
        <script src="../../vdashboard/plugins/multiselect/multiselect.js"></script>
        <!-- end here -->`
          );
        }
        appsgeneratorClient = appsgeneratorClient.replace(
          "<!--Ajax calls-->",
          `<script>let customToken="<%= sessiontoken %>";</script>
          <script src="../../admin/js/app/customInit.js"></script>
          <script src="../../admin/js/app/pageLoad.js"></script>
          <script src="../../admin/js/app/ajaxUtils.js"></script>
          `
        );
      }

      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      );

      var dir = "../views/" + mainapp[0].datapayloadModulename;
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, function (err, data) {
          fs.writeFile(
            dir + "/" + mainapp[0].datapayloadModulename + ".ejs",
            html_beautify(appsgenerator, { indent_size: 2 }),
            function (err, data) {
              resolve(mainapp);
            }
          );
          fs.writeFile(
            dir + "/" + mainapp[0].datapayloadModulename + "_client.ejs",
            html_beautify(appsgeneratorClient, { indent_size: 2 }),
            function (err, data) {
              resolve(mainapp);
            }
          );
        });
      } else {
        fs.writeFile(
          dir + "/" + mainapp[0].datapayloadModulename + ".ejs",
          html_beautify(appsgenerator, { indent_size: 2 }),
          function (err, data) {
            resolve(mainapp);
          }
        );
        fs.writeFile(
          dir + "/" + mainapp[0].datapayloadModulename + "_client.ejs",
          html_beautify(appsgeneratorClient, { indent_size: 2 }),
          function (err, data) {
            resolve(mainapp);
          }
        );
      }
    } catch (err) {
      reject(err);
    }
  });
}
function applyroutes(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync("../config/baseRoute.json", "utf8");

      appsgenerator = addbaseRoutes(
        appsgenerator,
        mainapp[0].datapayloadModulename,
        mainapp[0].datapayloadModulename
      );
      fs.writeFile(
        "../config/baseRoute.json",
        beautify(JSON.stringify(appsgenerator), { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
let SqlConstructMulti = function (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      let defaultmod = mainapp[0].datapayloadModulename;
      let validationmap = mainapp[0].server_client;
      let isMultiControl = mainapp[0].server_client.map((a) => a.inputtype);

      var conditions = ["multiselect", "singleselect", "checkbox", "radio"];
      var test2 = conditions.some((el) => isMultiControl.includes(el));
      if (test2) {
        let selectparam = validationmap.map(function (dt) {
          var parentintern =
            dt.childcontent == undefined ? dt.inputParent : "a";
          if (dt.inputtype == "textbox") {
            return `a.${dt.inputname} as ${dt.inputname}`;
          } else if (dt.inputtype == "checkbox" || dt.inputtype == "radio") {
            return `${parentintern}.${dt.inputname} as ${dt.inputname}, 
            ${parentintern}.${dt.inputtextval} as ${dt.inputCustomMapping}`;
          } else {
            return `${parentintern}.${dt.inputname} as ${dt.inputname}, 
            ${parentintern}.${dt.inputtextval} as ${dt.inputCustomMapping},
            ${parentintern}.${dt.inputtextval} as ${dt.inputtextval}`;
          }
        });
        var p1 = `select a.${defaultmod}id, a.recordstate,`;
        //console.log(selectparam.join(",").split(","))
        var bases = [
          ...new Set(
            selectparam
              .join(",")
              .split(",")
              .map((string) => string.trim())
          ),
        ];
        var consolidatedSelect = p1 + bases.join(",\n");
        var basetable = `from ${defaultmod}  as a`;
        let joinparam = validationmap.map(function (dt) {
          var parentintern =
            dt.childcontent == undefined ? dt.inputParent : undefined;
          if (parentintern != undefined) {
            return `\n left join ${dt.inputParent}  
      on a.${dt.inputname}::int=${dt.inputParent}.${dt.inputname}`;
          }
        });
        let getgroupbyval = function () {
          let interns = validationmap.filter(
            (dt) => dt.inputisPrimary == true
          )[0];

          if (interns != undefined) {
            var r1 = `string_agg(distinct ${interns.inputname}::text,',') as ${defaultmod}id,`;
            var r2 = `group by ${interns.inputname} ,${interns.inputCustomMapping} ,recordstate`;
            return { r1, r2 };
          }
        };
        let getTextgroupbyval = function (defaultmod) {
          let interns = validationmap.filter(
            (dt) => dt.inputtype == "textbox"
          )[0];

          if (interns != undefined) {
            var r1 = `group by  ${interns.inputname}`;
            return { r1 };
          }
        };

        var consolidatedSecondary =
          basetable + joinparam.join("") + "\n where a.recordstate=true";

        consolidatedSelectPrimary1 =
          consolidatedSelect + "\n" + consolidatedSecondary;
        console.log(consolidatedSelectPrimary1);
        let selectSecondaryjoinparam = validationmap.map(function (dt) {
          if (dt.inputtype == "textbox") {
            return `\n 
            ${dt.inputname}`;
          } else if (dt.inputtype == "checkbox" || dt.inputtype == "radio") {
            return `\n 
string_agg(distinct ${dt.inputCustomMapping},',')as ${dt.inputCustomMapping}|
string_agg(distinct ${dt.inputname}::text,',')as ${dt.inputname}`;
          } else {
            return `\n string_agg(distinct ${dt.inputCustomMapping},',')as ${dt.inputCustomMapping}|
string_agg(distinct ${dt.inputtextval},',')as ${dt.inputtextval}|
string_agg(distinct ${dt.inputname}::text,',')as ${dt.inputname}`;
          }
        });
        baseSelect1 = function (defaultmod) {
          let red = validationmap.filter((dt) => dt.inputtype == "textbox");
          console.log(red);
          if (red.length >= 0) {
            return `string_agg(distinct ${defaultmod}id::text,',')as ${defaultmod}id,`;
          } else {
            return " ";
          }
        };

        var consolidatedSelectPrimary = `select ${baseSelect1(defaultmod)}
${getgroupbyval() === undefined ? " " : getgroupbyval().r1}
${[
  ...new Set(
    selectSecondaryjoinparam
      .join("|")
      .split("|")
      .map((string) => string.trim())
  ),
].join(",\n")} , recordstate from `;
        console.log(consolidatedSelectPrimary);

        //var collate=consolidatedSelectPrimary+consolidatedSelectPrimary1
        var o = {};
        o.name = defaultmod;
        o.a1 = consolidatedSelectPrimary;
        o.a2 = consolidatedSelectPrimary1;
        let basefact = function (o) {
          var interns = `let ${o.name} = {
  basesqlscrp: {
    a:
      \`${o.a2}\`
  },
  basesearchtype: function (tunnel) {
    return (
      \`${o.a1}\` +
      '( ' +
      this.basesqlscrp.a +
      ' ' +
      tunnel.arg.daterange +
      ' ) as a where a.recordstate=true  ' +
      tunnel.arg.selector +
      tunnel.arg.consolidatesearch +
      '${
        getgroupbyval() === undefined
          ? getTextgroupbyval(defaultmod).r1 + ", recordstate"
          : getgroupbyval().r2
      }'
    )
  },
  searchType: function (tunnel) {
    return this.basesearchtype(tunnel) + base.paginationset(tunnel)
  },
  searchTypeCount: function (tunnel) {
    return (
      'select  count(*) as count  ' +
      'from ' +
      '( ' +
      this.basesqlscrp.a +
      ' ' +
      tunnel.arg.daterange +
      
      ' ) as a where a.recordstate=true  ' +
      tunnel.arg.selector +
      tunnel.arg.consolidatesearch +
      '${
        getgroupbyval() === undefined
          ? getTextgroupbyval(defaultmod).r1 + ", recordstate"
          : getgroupbyval().r2
      }'
    )
  },
  searchTypeCountExplain: function (tunnel) {
    return (
      'Explain select  * ' +
      'from ' +
      '( ' +
      this.basesqlscrp.a +
      ' ' +
      tunnel.arg.daterange +
      tunnel.arg.selector +
      ' ) as a ' +
      tunnel.arg.consolidatesearch +
      '${
        getgroupbyval() === undefined
          ? getTextgroupbyval(defaultmod).r1 + ", recordstate"
          : getgroupbyval().r2
      }'
    )
  },
  searchtypegroupby: function (tunnel) {
    return (
      'select  a.' +
      tunnel.tempDep.searchkey +
      ' , ' +
      tunnel.tempDep.searchparamkey +
      '  from (' +
      this.basesqlscrp.a +
      ') as a where  ' +
      tunnel.tempDep.selector +
      ' ' +
      tunnel.tempDep.colmetafilter +
      ' group by ' +
      tunnel.tempDep.searchkey +
      ' ,' +
      tunnel.tempDep.searchparamkey +
      '  ORDER BY ' +
      tunnel.tempDep.searchkey +
      ' ' +
      tunnel.tempDep.sortcolumnorder +
      '  limit 20'
    )
  },
  searchTypeFilter: function (tunnel) {
    return this.basesearchtype(tunnel)
  },
  searchTypeFilterProgressBar: function (tunnel) {
    return 'EXPLAIN (ANALYSE,FORMAT JSON)   ' + this.basesearchtype(tunnel)
  },
  SqlPivot: function (tunnel) {
    return (
      'select ' +
      tunnel.arg1.resultsetselect +
      " from (select coalesce(yaxis, 'total') as yaxis , " +
      tunnel.arg1.resultsetinternrollup +
      ' from (select yaxis , ' +
      tunnel.arg1.resultsetinternrollup +
      ' from (SELECT * ' +
      'FROM   crosstab(' +
      "'select  " +
      tunnel.tempDep.baseYaxisparam +
      ',' +
      tunnel.tempDep.baseXaxisparam +
      ',count(*)::int as cnt   from  ' +
      ' (' +
      this.basesqlscrp.a +
      ' and ' +
      tunnel.tempDep.dynamicquerydaterange +
      '  ' +
      tunnel.tempDep.selectordynamic +
      '  ' +
      tunnel.tempDep.consolidatesearchdynamic +
      ') as a  ' +
      "  group by Xaxis, Yaxis  order by  1,2 asc '," +
      " 'select " +
      tunnel.tempDep.baseXaxisparam +
      ' from ' +
      ' (' +
      this.basesqlscrp.a +
      '  and  ' +
      tunnel.tempDep.dynamicquerydaterange +
      '  ' +
      tunnel.tempDep.selectordynamic +
      '  ' +
      tunnel.tempDep.consolidatesearchdynamic +
      ') as a  ' +
      ' group by Xaxis   order by 1 limit ' +
      tunnel.tempDep.XpageSize +
      ' offset ' +
      tunnel.tempDep.Xnext_offset +
      "')" +
      'AS orders(' +
      'Yaxis text,' +
      tunnel.arg1.resultsetintern +
      ') ) as Xaxisderived group by yaxis limit ' +
      tunnel.tempDep.YpageSize +
      ' offset ' +
      tunnel.tempDep.Ynext_offset +
      ') as a group by  rollup(yaxis) ) as a'
    )
  },
  sqlstatementsprimaryPivot: function (tunnel) {
    return (
      'select count(*) as totalyaxiscnt from (select  ' +
      tunnel.tempDep.baseYaxisparamprimary +
      ' from (' +
      this.basesqlscrp.a +
      '   ' +
      tunnel.tempDep.daterange +
      '  ' +
      tunnel.tempDep.selector +
      '  ' +
      tunnel.tempDep.consolidatesearch +
      ') as a ' +
      ' group by Yaxis ) as Yaxisderived'
    )
  },
  sqlstatementsecondaryPivot: function (tunnel) {
    return (
      'select count(*) as totalxaxiscnt from (select  ' +
      tunnel.tempDep.baseXaxisparamprimary +
      ' from (' +
      this.basesqlscrp.a +
      '   ' +
      tunnel.tempDep.daterange +
      '  ' +
      tunnel.tempDep.selector +
      '  ' +
      tunnel.tempDep.consolidatesearch +
      ') as a   ' +
      '  group by Xaxis ) as Xaxisderived'
    )
  },
  sqlstatepivotcol: function (tunnel) {
    return (
      'select ' +
      tunnel.tempDep.baseXaxisparamprimary +
      ' from ' +
      ' (' +
      this.basesqlscrp.a +
      '  ' +
      tunnel.tempDep.daterange +
      '  ' +
      tunnel.tempDep.selector +
      '  ' +
      tunnel.tempDep.consolidatesearch +
      ') as a ' +
      ' group by Xaxis  order by 1 limit ' +
      tunnel.tempDep.XpageSize +
      ' offset ' +
      tunnel.tempDep.Xnext_offset +
      ';'
    )
  }
}`;
          return interns;
        };
        var appsgenerator = fs.readFileSync(
          "../routes/utils/sqlConstruct.js",
          "utf8"
        );
        appsgenerator = appsgenerator.replace(
          "//newMultiControlSqlConstruct",
          basefact(o) + "\n//newMultiControlSqlConstruct"
        );
        appsgenerator = appsgenerator.replace(
          "//exportobj",
          `,${mainapp[0].datapayloadModulename}:${mainapp[0].datapayloadModulename}\n //exportobj`
        );

        fs.writeFile(
          "../routes/utils/sqlConstruct.js",
          beautify(appsgenerator, { indent_size: 2 }),
          function (err, data) {
            resolve(mainapp);
          }
        );
      } else {
        resolve(mainapp);
      }
    } catch (err) {
      reject(err);
    }
  });
};

function applyApp(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync("../ref/routes/employees.js", "utf8");
      let isMultiControl = mainapp[0].server_client.map((a) => a.inputtype);

      var conditions = ["multiselect", "singleselect", "checkbox", "radio"];
      var test2 = conditions.some((el) => isMultiControl.includes(el));
      if (test2) {
        appsgenerator = appsgenerator.replace(
          "base",
          mainapp[0].datapayloadModulename
        );
      }

      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      );
      fs.writeFile(
        "../routes/" + mainapp[0].datapayloadModulename + ".js",
        beautify(appsgenerator, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
function applymodel(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync("../ref/models/employees.js", "utf8");
      var basetemplate = "";
      mainapp[0].server_client.forEach((element) => {
        if (basetemplate == "") {
          basetemplate =
            element.inputname +
            ": {type: DataTypes." +
            element.fieldtypename +
            " , allowNull: true }";
        } else {
          basetemplate =
            basetemplate +
            "," +
            element.inputname +
            ": {type: DataTypes." +
            element.fieldtypename +
            " , allowNull: true }";
        }
      });
      basetemplate =
        basetemplate +
        "," +
        mainapp[0].datapayloadModulename +
        "id: {" +
        "type: DataTypes.INTEGER," +
        "allowNull: false," +
        "primaryKey: true," +
        "autoIncrement: true }";
      appsgenerator = appsgenerator.replace(/plotcolumns/g, basetemplate);
      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      );
      fs.writeFile(
        "../models/" + mainapp[0].datapayloadModulename + ".js",
        beautify(appsgenerator, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
function applyserverValidationConfig(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync(
        "../ref/routes/utils/validationConfig.js",
        "utf8"
      );
      var filename = mainapp[0].server_client;
      var applyFields = filename.map(function (doctor) {
        return doctor.inputCustomMapping;
      });

      filename = JSON.stringify(filename, null, 2).replace(
        /\"([^(\")"]+)\":/g,
        "$1:"
      );
      applyFields = JSON.stringify(applyFields, null, 2);
      appsgenerator = appsgenerator.replace("applyfieldsMap", applyFields);
      appsgenerator = appsgenerator.replace("validationmapMap", filename);
      var dir = "../routes/utils/" + mainapp[0].datapayloadModulename;
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, function (err, data) {
          fs.writeFile(
            "../routes/utils/" +
              mainapp[0].datapayloadModulename +
              "/validationConfig.js",
            beautify(appsgenerator, { indent_size: 2 }),
            "utf8",
            function (err, data) {
              console.log(err);
              resolve(mainapp);
            }
          );
        });
      } else {
        fs.writeFile(
          "../routes/utils/" +
            mainapp[0].datapayloadModulename +
            "/validationConfig.js",
          beautify(appsgenerator, { indent_size: 2 }),
          "utf8",
          function (err, data) {
            console.log(err);
            resolve(mainapp);
          }
        );
      }
    } catch (err) {
      reject(err);
    }
  });
}

function swaggerdocs(mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var yaml = require("js-yaml");
      var fs = require("fs");
      modname = mainapp[0].datapayloadModulename;
      // Get document, or throw exception on error
      try {
        fs.readFile("../utils/docs/emp.yaml", "utf8", function (err, contents) {
          var doc = yaml.safeLoad(contents);

          //let peopleArray = Object.keys(doc).map(i => doc[i])
          let peopleArrayString = JSON.parse(
            JSON.stringify(doc).replace(/employees/g, modname)
          );
          doc = peopleArrayString;
          var red = mainapp[0].swagger;

          var internObj = red.map(function (doctor) {
            var keyname = doctor.fieldname;
            delete doctor.fieldname;
            return {
              [keyname]: doctor,
            };
          });

          //convert array to js

          var newObj = internObj.reduce((a, b) => Object.assign(a, b), {});

          doc.paths = peopleArrayString.paths;
          doc.definitions[modname]["properties"] = newObj;

          doc.definitions[modname + "Id"] =
            peopleArrayString.definitions[modname + "Id"];
          fs.writeFile(
            "../utils/docs/" + modname + ".yaml",
            yaml.safeDump(doc),
            function (err, data) {
              if (err) {
                console.log(err);
              } else {
                resolve(mainapp);
              }
            }
          );
        });
      } catch (e) {
        reject(err);
      }
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = routes;
