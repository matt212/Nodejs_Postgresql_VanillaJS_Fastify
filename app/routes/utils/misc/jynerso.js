var beautify = require('js-beautify').js
var html_beautify = require('js-beautify').html_beautify
var Promise = require('bluebird')

;(http = require('http')),
  (fs = require('fs')),
  (util = require('util')),
  (Busboy = require('busboy'))
;(os = require('os')), (path = require('path')), (csv = require('fast-csv'))
crypto = require('crypto')
var d = new Date()

var serverdat = { name: d.toString() }

const { spawn } = require('child_process')

let pgcreateDb = function () {
  return new Promise((resolve, reject) => {
    try {
      const fs = require('fs')
      const child_process = require('child_process')

      var spawn_process_cmd = 'yarn applychangesDB'
      child_process.exec(spawn_process_cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)

          reject(error)
        }
        resolve({ stdout: stdout })
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
      })
    } catch (err) {
      reject(err)
    }
  })
}
let addbaseRoutes = function (arr, keys, vals) {
  arr = JSON.parse(arr)
  if (arr.filter(item => item.val == vals).length == 0) {
    arr.push({ val: vals, key: keys })
  }
  return arr
}
let baseSchemaBuilder = function (fieldname) {
  var interims = ''
  fieldname.forEach(function (a) {
    if (a.fieldtypename == 'STRING') {
      interims =
        interims +
        `${a.inputname}: {
    type: 'string',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: ${a.fieldmaxlength} }]
  },`
    } else if (a.fieldtypename == 'INTEGER') {
      interims =
        interims +
        `${a.inputname}: {
      type: 'integer',
      minimum: 1,
      maximum:2147483648
    },`
    } else if (a.fieldtypename == 'BIGINT') {
      interims =
        interims +
        `${a.inputname}: {
      type: 'integer',
      minimum: 1,
      maximum:9223372036854775808
    },`
    } else if (a.fieldtypename == 'DATE') {
      interims =
        interims +
        `${a.inputname}: {
    type: 'string',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: ${a.fieldmaxlength} }],
    format: 'date-time'`
    }
  })
  return interims
}
async function routes (fastify, options) {
  fastify.get('/', async (request, reply) => {
    var models = require('../../../models/')

    var baseOBj = []
    Object.keys(models).forEach(function (data) {
      if (data != 'sequelize' && data != 'Sequelize') {
        baseOBj.push({
          mod: data,
          attr: Object.keys(models[data].tableAttributes)
        })
      }
    })

    reply.view(`base_scaffolding.ejs`, { mod: JSON.stringify(baseOBj) })
  })

  fastify.post('/jedha', (request, reply) => {
    var req = {}
    req.body = request.body
    var mainapp = req.body

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
      .then(function (data) {
        reply.send({
          a: 'run  yarn applychangesDB ',
          b: `run yarn ${mainapp[0].datapayloadModulename}Eval`
        })
      })
      .catch(e => {
        reply.send(e)
      })
  })
}
function packageJsonUpdate (mainapp) {
  return new Promise((resolve, reject) => {
    //var appsgenerator = fs.readFileSync('../../../../package.json', 'utf8')
    var appsgenerator = require('../../../../package.json')

    let interappsgenerator = appsgenerator
    var modname = mainapp[0].datapayloadModulename
    var o = {}
    o[
      modname + 'Eval'
    ] = `mocha ./app/utils/test/${modname}-test.spec.js --timeout 10000 --exit`

    Object.assign(interappsgenerator.scripts, o)

    fs.writeFile(
      '../../package.json',
      beautify(JSON.stringify(interappsgenerator), { indent_size: 2 }),
      function (err, data) {
        console.log(err)
        console.log(data)
        if (err) {
          reject(err)
        }
        resolve(mainapp)
      }
    )
  })
}
function superadminUpdate (mainapp) {
  return new Promise((resolve, reject) => {
    //var appsgenerator = fs.readFileSync('../../../../package.json', 'utf8')
    var appsgenerator = require('../../../config/superadmin.json')

    let interappsgenerator = appsgenerator
    var modname = mainapp[0].datapayloadModulename

    var interim = interappsgenerator[0].Modulename.split(',')
    interim.push(modname)

    interappsgenerator[0].Modulename = interim.join(',')
    interappsgenerator[1].Modulename = interim.join(',')

    fs.writeFile(
      '../config/superadmin.json',
      beautify(JSON.stringify(interappsgenerator), { indent_size: 2 }),
      function (err, data) {
        console.log(err)
        console.log(data)
        if (err) {
          reject(err)
        }
        resolve(mainapp)
      }
    )
  })
}
function applyMochaChaiTestCases (mainapp) {
  return new Promise((resolve, reject) => {
    try {

      var r2=(mainapp[0].server_client).filter((r1)=>r1.inputtype!="textbox")
      var appsgenerator=" "
      console.log("((((((((((mocha))))))))))");
      console.log(r2.length);
      if(r2.length>=1)
      {
        appsgenerator = fs.readFileSync(
          '../ref/tests/Employees-test-referential.spec.js',
          'utf8'
        )
      }
      else
      {
        appsgenerator = fs.readFileSync(
          '../ref/tests/Employees-test.spec.js',
          'utf8'
        ) 
      }
      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      )
      fs.writeFile(
        '../utils/test/' + mainapp[0].datapayloadModulename + '-test.spec.js',
        beautify(appsgenerator, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp)
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}

function applyserverschemaValidator (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync(
        '../ref/routes/utils/payloadSchema.js',
        'utf8'
      )
      var filename = mainapp[0].server_client
      var applyFields = filename.map(function (doctor) {
        return doctor.inputname
      })
      applyFields.push('recordstate')
      appsgenerator = appsgenerator.replace(
        'placeholder2',
        JSON.stringify(applyFields, null, 2)
      )
      var applyFields2 = baseSchemaBuilder(filename)
      filename = JSON.stringify(filename, null, 2).replace(
        /\"([^(\")"]+)\":/g,
        '$1:'
      )

      var applyFields1 = applyFields
      applyFields1.push(mainapp[0].datapayloadModulename + 'id')

      appsgenerator = appsgenerator.replace(
        'placeholder3',
        JSON.stringify(applyFields1, null, 2)
      )
      appsgenerator = appsgenerator.replace(
        'placeholder4',
        mainapp[0].datapayloadModulename + 'id'
      )
      appsgenerator = appsgenerator.replace('placeholder1', applyFields2)
      var dir = '../routes/utils/' + mainapp[0].datapayloadModulename
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, function (err, data) {
          fs.writeFile(
            '../routes/utils/' +
              mainapp[0].datapayloadModulename +
              '/payloadSchema.js',
            beautify(appsgenerator, { indent_size: 2 }),
            'utf8',
            function (err, data) {
              resolve(mainapp)
            }
          )
        })
      } else {
        fs.writeFile(
          '../routes/utils/' +
            mainapp[0].datapayloadModulename +
            '/payloadSchema.js',
          beautify(appsgenerator, { indent_size: 2 }),
          'utf8',
          function (err, data) {
            console.log(err)
            resolve(mainapp)
          }
        )
      }
    } catch (err) {
      reject(err)
    }
  })
}

function createdb (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var baseobj = {}
      baseobj.mname = mainapp[0].datapayloadModulename.toString().trim()
      var models = require('../../../models/')
      //models.sequelize.sync().then(function () {
      models.modname
        .create(baseobj)
        .then(function () {
          resolve(mainapp)
        })
        .catch(e => {
          reject(e)
        })

      //});
    } catch (err) {
      reject(err)
    }
  })
}
var checkboxEditPopulate = function (redlime) {
  var r1 = ''
  redlime.forEach(function (dt) {
    if (dt.inputtype == 'checkbox') {
      r1 =
        r1 +`current${dt.inputtypemod}.data[data.inputname]=data.vals`
    }
  })
  return r1;
}
var radioEditPopulate = function (redlime) {
  var r1 = ''
  redlime.forEach(function (dt) {
    if (dt.inputtype == 'radio') {
      r1 =
        r1 +`current${dt.inputtypemod}.data=data.vals`
    }
  })
  return r1;
}
var checkboxmultiInitControl = function (redlime) {
  var r1 = ''
  redlime.forEach(function (dt) {
    if (dt.inputtype == 'checkbox') {
      r1 =
        r1 +
        (r1 != '' ? 'else ' : ' ') +
        `if (element.inputtype == "checkbox" && element.inputtypemod==current${dt.inputtypemod}.name) {
          var internhtmlcontent=" "
    basefunction().${dt.inputtypemod}MultiKeysLoad(current${dt.inputtypemod}.text).then(function (data) {
      data.rows.forEach((elem, index) => {
        internhtmlcontent=internhtmlcontent+\`<div class="custom-control custom-checkbox">
        <label><input type="checkbox" class="custom-control-input" id="cltrl\${current${dt.inputtypemod}.id}\${elem[current${dt.inputtypemod}.id]}" 
        onclick="javascript:basemod_modal.on${dt.inputtypemod}Control(this)" 
        data-key="\${current${dt.inputtypemod}.id}"
        data-val="\${elem[current${dt.inputtypemod}.id]}"
        data-attribute="checkboxMulti"       
        value="\${elem[current${dt.inputtypemod}.id]}">\${elem[current${dt.inputtypemod}.text]}
        </label></div>\`
      })
      $('#overlaycontent').append(\`<div class="form-group" data-attribute="checkboxMulti"  data-form-type="true">
             <div class="col-sm-15">
                    <label class="lblhide" id="lblmsg\${current${dt.inputtypemod}.id}">
                    <i class="fa fa-bell-o"></i> Please select ${dt.inputtypemod}
                    </label>\${internhtmlcontent}</div>
                    </div></div>\`)
    });
  }`
    }
  })
  return r1
}
var radiomultiInitControl = function (redlime) {
  var r1 = ''
  redlime.forEach(function (dt) {
    if (dt.inputtype == 'radio') {
      r1 =
        r1 +
        (r1 != '' ? 'else ' : ' ') +
        `if (element.inputtype == "radio" && element.inputtypemod==current${dt.inputtypemod}.name) {
          var internhtmlcontent=""
    basefunction().${dt.inputtypemod}MultiKeysLoad(current${dt.inputtypemod}.text).then(function (data) {
      data.rows.forEach((elem, index) => {
        internhtmlcontent=internhtmlcontent+\`<div class="custom-control custom-radio">
        <label><input type="radio" class="custom-control-input" id="cltrl\${current${dt.inputtypemod}.id}\${elem[current${dt.inputtypemod}.id]}" 
        onclick="javascript:basemod_modal.on${dt.inputtypemod}Control(this)" 
        data-key="\${current${dt.inputtypemod}.id}"
        name="customRadio${dt.inputtypemod}"
        data-val="\${elem[current${dt.inputtypemod}.id]}"  
        value="\${elem[current${dt.inputtypemod}.id]}">\${elem[current${dt.inputtypemod}.text]}
        </label></div>\`
      })
      $('#overlaycontent').append(\`<div class='form-group' onclick="javascript:reqops.formvalidation(this)" data-attribute="radio" data-form-type="true">
      <div class="col-sm-15">
                    <label class="lblhide" id="lblmsg\${current${dt.inputtypemod}.id}">
                    <i class="fa fa-bell-o"></i> Please select ${dt.inputtypemod}
                    </label>
      \${internhtmlcontent}</div></div>\`)
    });
  }`
    }
  })
  return r1
}
var radioMultiControl = function (redlime) {
  var r1 = ''
  redlime.forEach(function (dt) {
    if (dt.inputtype == 'radio') {
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
},`
    }
  })
  return r1
}
var checkboxMultiControl = function (redlime) {
  var r1 = ''
  redlime.forEach(function (dt) {
    if (dt.inputtype == 'checkbox') {
      r1 =
        r1 +
        `on${dt.inputtypemod}Control: function (data) {
    var key = $(data).data().key;
    var val = $(data).data().val;
    if ($(data)[0].checked) {
      current${dt.inputtypemod}.data[key] = [...current${dt.inputtypemod}.data[key], ...[val]]
    }
    else {
      current${dt.inputtypemod}.data[key] = current${dt.inputtypemod}.data[key].filter(item => item !== val)
    }
    reqops.formvalidation(data);
     validationListener()
},`
    }
  })
  return r1
}

let multiInsertCode = function (redlime) {
  var r1 = `{ ...arg.datapayload`
  redlime.forEach(function (dt) {
    if (dt.inputtype != 'textbox') {
      r1 = r1 + `,...current${dt.inputtypemod}.data `
    }
  })
  r1 = r1 + `}`

  return r1
}

let baseinitControl = function (redlime) {
  var r1 = ' '
  redlime.forEach(function (dt) {
    if (dt.inputtype != 'textbox') {
      r1 =
        r1 +
        `let current${dt.inputtypemod}={
        name:"${dt.inputtypemod}",
        id:"${dt.inputtypeID}",
        text:"${dt.inputtypeVal}",
        ${dt.inputtype=="checkbox" ? `data:{"${dt.inputtypeID}":[]}` : " "}
      };`
    }
  })
  return r1
}
function applyMultiControls (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync(
        '../ref/public/admin/js/app/app_employees.js',
        'utf8'
      )
      var based = mainapp[0].server_client
      based = based.filter(function (doctor) {
        return doctor.inputtype != 'textbox' // if truthy then keep item
      })

      if (based.length >= 1) {
        var baseMod = baseinitControl(mainapp[0].server_client)
        //definition
        var currentInitialization =
          "getcurrentMod{modulename}groupby: '/' + current{modulename}.name + '/api/searchtypegroupbyId/',"
        //initialization

        //implementation
        var currentImplementation = `
    getcurrentMod{modulename}groupby: function(base) {
      ajaxbase.payload = base.datapayload
      ajaxbase.url = baseurlobj.getcurrentMod{modulename}groupby;
      return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
          ajaxbase.response = argument;
          return argument;
      })
    },`
        var onchkscaffolding =
          radioMultiControl(mainapp[0].server_client) +'  ' +checkboxMultiControl(mainapp[0].server_client)+` onMultiControlChk:function(data){
  },`
        var baseOffLoad = `let validationListener=function()
        {
         var sel = $('.form-horizontal input:text[data-form-type], input:checkbox[data-form-type], div[data-form-type]').length;
         
         if (sel <= 0) {
           $('#btnmodalsub').prop('disabled', false)
         } else {
           $('#btnmodalsub').prop('disabled', true)
         }
        }
    $(function () {
    basemod_modal.modalpopulate()
    $('.form-horizontal input[type="text"], input[type="checkbox"]').on("keydown keyup change", function () {
      validationListener()
    })
  })`
        
        

        var c = ''
        var d = ''
        var e = ''

        //{ ...arg.datapayload, ...current{Modname}.data }

        mainapp[0].server_client.forEach(element => {
          //server_client.forEach(element => {
          if (element.inputtype != 'textbox') {
            onchkscaffolding = onchkscaffolding.replace(
              /{Modname}/g,
              element.inputtypemod
            )
            multiControlsScripts = multiControlsScripts.replace(
              '//onchkcapture',
              '\n ' + onchkscaffolding
            )
            multiControlsScripts = multiControlsScripts.replace(
              '//editCheckbox',
              '\n ' + checkboxEditPopulate(mainapp[0].server_client)
            )
            multiControlsScripts = multiControlsScripts.replace(
              '//editRadio',
              '\n ' + radioEditPopulate(mainapp[0].server_client)
            )

            baseMod = baseMod.replace(/{Modname}/g, element.inputtypemod)
            baseMod = baseMod.replace(/{name}/g, element.inputtypemod)
            baseMod = baseMod.replace(/{id}/g, element.inputtypeID)
            baseMod = baseMod.replace(/{text}/g, element.inputtypeVal)
            
            

            multiControlsScripts = multiControlsScripts.replace(
              '//checkboxCode',
              '\n ' + checkboxmultiInitControl(mainapp[0].server_client)
            )
            multiControlsScripts = multiControlsScripts.replace(
              '//radioCode',
              '\n ' + radiomultiInitControl(mainapp[0].server_client)
            )
            if(checkboxmultiInitControl(mainapp[0].server_client)!==""&&radiomultiInitControl(mainapp[0].server_client)!=="")
            {
              console.log("---------------------herer")
              multiControlsScripts = multiControlsScripts.replace(
                '//rchkelse',
                '\n ' + 'else'
              )
            }
            
            multiControlsScripts = multiControlsScripts.replace(
              '//insertpayloadData',
              '\n ' + multiInsertCode(mainapp[0].server_client)
            )

            appsgenerator = appsgenerator.replace(
              '//definition',
              '\n ' + baseMod
            )
            if (c == '') {
              c = currentInitialization.replace(
                /{modulename}/g,
                element.inputtypemod
              )
              d = currentImplementation.replace(
                /{modulename}/g,
                element.inputtypemod
              )
              e = groupbyControlsPopulate(element.inputtypemod)
            } else {
              c =
                c +
                '\n' +
                currentInitialization.replace(
                  /{modulename}/g,
                  element.inputtypemod
                )
              d =
                d +
                '\n' +
                currentImplementation.replace(
                  /{modulename}/g,
                  element.inputtypemod
                )
              e = e + '\n' + groupbyControlsPopulate(element.inputtypemod)
            }
          }
        })
        if (c != '') {
          appsgenerator = appsgenerator.replace(/definition/g, '\n' + baseMod)
          appsgenerator = appsgenerator.replace(/initialization/g, '\n' + c)
          appsgenerator = appsgenerator.replace(/implementation/g, '\n' + d)
          appsgenerator = appsgenerator.replace(/groupBySets/g, '\n' + e)
          appsgenerator = appsgenerator.replace(
            /baseOffLoad/g,
            '\n' + baseOffLoad
          )
          var replaces = `let basemod_modal = {afterhtmlpopulate: function(){},payloadformat: function (arg) {return arg.datapayload}}`
          
          appsgenerator = appsgenerator.replace(
            replaces,
            '\n' + beautify(multiControlsScripts, { indent_size: 2 })
          )
        }
      }

      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      )
      fs.writeFile(
        '../public/admin/js/app/app_' +
          mainapp[0].datapayloadModulename +
          '.js',
        beautify(appsgenerator, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp)
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}
function applyclientJS (mainapp) {
  return new Promise((resolve, reject) => {
    var appsgenerator = fs.readFileSync(
      '../ref/public/admin/js/app/app_employees.js',
      'utf8'
    )
    appsgenerator = appsgenerator.replace(
      /employees/g,
      mainapp[0].datapayloadModulename
    )
    fs.writeFile(
      '../public/admin/js/app/app_' + mainapp[0].datapayloadModulename + '.js',
      beautify(appsgenerator, { indent_size: 2 }),
      function (err, data) {
        resolve(mainapp)
      }
    )
  })
}
/* multi control part in process */
let groupbyControlsPopulate = function (modname) {
  let groupbyControlsPopulate = `employeesMultiKeysLoad:function(keys)
  {
      //keys="gender"
     base.datapayload=baseloadsegments.basePopulateMultiControls(keys)
     return this
     .getpaginatesearchtypegroupby(base)
     .then(function (argument) {
         return argument
     })
  },`
  groupbyControlsPopulate = groupbyControlsPopulate.replace(
    'employees',
    modname
  )
  groupbyControlsPopulate = groupbyControlsPopulate.replace(
    `getpaginatesearchtypegroupby`,
    `getcurrentMod${modname}groupby`
  )
  return groupbyControlsPopulate
}

var multiControlsScripts = `let basemod_modal = {
  modalpopulate: function() {
    var interset = validationmap
    let redlime = doChunk(interset, 2)
    $("#overlaycontent").empty();
    var htmlcontent = "";
    var internhtmlcontent="";
    redlime.forEach(function(item) {

        htmlcontent += \`<div class=\"row\">\`
        item.forEach2(function(element) {
             //radioCode
             //rchkelse   
             //checkboxCode
             else {
                htmlcontent += \`<div class="form-group overlaytxtalign col-md-5">
                    <div class="col-sm-15">
                    <label class="lblhide" id="lblmsg\${element.inputname}">
                    <i class="fa fa-bell-o"></i>  \${element.inputname} is required
                    </label>
                    <input type="text" data-attribute="\${element.fieldvalidatename}" class="form-control" maxLength="\${element.fieldmaxlength}"
                    data-form-type="false" onkeyup="javascript:reqops.formvalidation(this)" id="cltrl\${element.inputname}" placeholder="\${element.inputplaceholder.capitalize()}">
                    </div></div>\`;
            }

        })

        htmlcontent += \`</div>\`
    })

    var chkcontent = \`<input type="hidden" name="\${currentmoduleid}" value="0" id="cltrl\${currentmoduleid}"> 
    <div class="form-group overlaytxtalign col-md-5"><div class="col-sm-offset-2 col-sm-15"><div><label><div class="checkbox tablechk">
   <label>
   <div class="col-sm-15">
                    <label class="lblhide" id="lblmsgrecordstate">
                    <i class="fa fa-bell-o"></i> Please select Active
                    </label>
   <input type="checkbox" id="cltrlrecordstate" data-attribute="checkbox" data-form-type="true" onclick="javascript:tableops.onchk(this)" value="true"><span class="checkbox-material"><span class="check"></span></span> Remember me
   <span class="checkbox-material">
   </div>
   </span> 
   </label>
   </div></label></div></div></div>\`;

    $("#overlaycontent").html(htmlcontent + chkcontent);
},
//onchkcapture
baseCheckbox:\`<div class="checkbox tablechk">
   <label>
   <input type="checkbox" id="cltrlrecordstate" onclick="javascript:tableops.onchk(this)" value=true> Remember me
   <span class="checkbox-material">
   </span> 
   </label>
   </div>\`
  ,
     afterhtmlpopulate: function() {
         $('#basetable tbody tr td:last-child').attr('onclick', 'javascript:basemod_modal.ontdedit(this)')
         $('#basetable tbody tr td:nth-child(1) input:checkbox').attr('onclick', 'javascript:basemod_modal.tablechkbox(this)')
         //$("a[href='#sales-chart'").hide()
     },
     payloadformat: function (arg) {
      return //insertpayloadData
    },
     ontdedit: function(arg) {

         var armodid = $(arg).attr('data-tbledit-type')
         ajaxbase.isedit = true;
         var interncontent = ajaxbase[currentmodulename].rows;

         interncontent = interncontent.filter(function(doctor) {
             return doctor[currentmoduleid] == armodid;
         })
         base.editrecord = interncontent;
         $('#cltrl' + currentmoduleid).val(armodid);
         var formatresponse = this.formatresponse(interncontent);

         formatresponse.forEach2(function(data) {

             if (data.inputtype == "textbox") {
                 $("#cltrl" + data.inputname).val(data.vals)
                 $("#cltrl" + data.inputname).removeAttr('data-form-type');
             }
             else if (data.inputtype == "radio") {
              $(\`#overlaycontent .form-group .custom-control.custom-radio  [data-val="\${data.vals}"]\`).prop("checked", true)
              //editRadio
             }
               else if (data.inputtype == "checkbox") {
              $(\`#overlaycontent .checkbox.tablechk [type="checkbox"]\`).each(function (index) {
                $(this).attr("checked", false)
              })
              data.vals.forEach(function (dr) {
                
                $(\`#overlaycontent .form-group .custom-control.custom-checkbox  [data-val='\${dr}']\`).prop("checked", true)
                
              })
              //editCheckbox
             }
         })
         //active comma denominator
         //console.log(interncontent[0].recordstate)
         if (interncontent[0].recordstate) {
             $('#cltrlrecordstate').prop('checked', true);
             $('#cltrlrecordstate').val(true);
             base.datapayload.recordstate = true
         } else {
             $('#cltrlrecordstate').prop('checked', false);
             $('#cltrlrecordstate').val(false);
             base.datapayload.recordstate = false
         }
         $("#btnbutton").click();
     },
     tablechkbox: function(arg) {},
     formatresponse: function(data) {

         var res = this.formatserverfieldmap(data)
        
         var result = equijoin(res, validationmap, "key", "inputname",
      ({
        vals
      }, {
        inputtype,
        inputname
      }) => ({
        inputtype,
        inputname,
        vals
      }));

         return result;
     },
     formatserverfieldmap: function(data) {

         var applyfield = applyfields;
         var res = data.map(function(data) {
             return applyfield.map(function(da) {

                 //var y = (data[da].indexOf(',') != -1 ? data[da].split(',') : data[da]);
                 var y = data[da]
                 return {
                     key: da,
                     vals: y
                 }
             })
         })[0]
         return res;
     },
     
 }`

function applyhtml (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync(
        '../ref/views/employees/employees.ejs',
        'utf8'
      )
      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      )

      var dir = '../views/' + mainapp[0].datapayloadModulename
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, function (err, data) {
          fs.writeFile(
            dir + '/' + mainapp[0].datapayloadModulename + '.ejs',
            html_beautify(appsgenerator, { indent_size: 2 }),
            function (err, data) {
              resolve(mainapp)
            }
          )
        })
      } else {
        fs.writeFile(
          dir + '/' + mainapp[0].datapayloadModulename + '.ejs',
          html_beautify(appsgenerator, { indent_size: 2 }),
          function (err, data) {
            resolve(mainapp)
          }
        )
      }
    } catch (err) {
      reject(err)
    }
  })
}
function applyroutes (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync('../config/baseRoute.json', 'utf8')

      appsgenerator = addbaseRoutes(
        appsgenerator,
        mainapp[0].datapayloadModulename,
        mainapp[0].datapayloadModulename
      )
      fs.writeFile(
        '../config/baseRoute.json',
        beautify(JSON.stringify(appsgenerator), { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp)
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}
function applyApp (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync('../ref/routes/employees.js', 'utf8')
      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      )
      fs.writeFile(
        '../routes/' + mainapp[0].datapayloadModulename + '.js',
        beautify(appsgenerator, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp)
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}
function applymodel (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync('../ref/models/employees.js', 'utf8')
      var basetemplate = ''
      mainapp[0].server_client.forEach(element => {
        if (basetemplate == '') {
          basetemplate =
            element.inputname +
            ': {type: DataTypes.' +
            element.fieldtypename +
            ' , allowNull: true }'
        } else {
          basetemplate =
            basetemplate +
            ',' +
            element.inputname +
            ': {type: DataTypes.' +
            element.fieldtypename +
            ' , allowNull: true }'
        }
      })
      basetemplate =
        basetemplate +
        ',' +
        mainapp[0].datapayloadModulename +
        'id: {' +
        'type: DataTypes.INTEGER,' +
        'allowNull: false,' +
        'primaryKey: true,' +
        'autoIncrement: true }'
      appsgenerator = appsgenerator.replace(/plotcolumns/g, basetemplate)
      appsgenerator = appsgenerator.replace(
        /employees/g,
        mainapp[0].datapayloadModulename
      )
      fs.writeFile(
        '../models/' + mainapp[0].datapayloadModulename + '.js',
        beautify(appsgenerator, { indent_size: 2 }),
        function (err, data) {
          resolve(mainapp)
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}
function applyserverValidationConfig (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var appsgenerator = fs.readFileSync(
        '../ref/routes/utils/validationConfig.js',
        'utf8'
      )
      var filename = mainapp[0].server_client
      var applyFields = filename.map(function (doctor) {
        return doctor.inputname
      })

      filename = JSON.stringify(filename, null, 2).replace(
        /\"([^(\")"]+)\":/g,
        '$1:'
      )
      applyFields = JSON.stringify(applyFields, null, 2)
      appsgenerator = appsgenerator.replace('applyfieldsMap', applyFields)
      appsgenerator = appsgenerator.replace('validationmapMap', filename)
      var dir = '../routes/utils/' + mainapp[0].datapayloadModulename
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, function (err, data) {
          fs.writeFile(
            '../routes/utils/' +
              mainapp[0].datapayloadModulename +
              '/validationConfig.js',
            beautify(appsgenerator, { indent_size: 2 }),
            'utf8',
            function (err, data) {
              console.log(err)
              resolve(mainapp)
            }
          )
        })
      } else {
        fs.writeFile(
          '../routes/utils/' +
            mainapp[0].datapayloadModulename +
            '/validationConfig.js',
          beautify(appsgenerator, { indent_size: 2 }),
          'utf8',
          function (err, data) {
            console.log(err)
            resolve(mainapp)
          }
        )
      }
    } catch (err) {
      reject(err)
    }
  })
}

function swaggerdocs (mainapp) {
  return new Promise((resolve, reject) => {
    try {
      var yaml = require('js-yaml')
      var fs = require('fs')
      modname = mainapp[0].datapayloadModulename
      // Get document, or throw exception on error
      try {
        fs.readFile('../utils/docs/emp.yaml', 'utf8', function (err, contents) {
          var doc = yaml.safeLoad(contents)

          //let peopleArray = Object.keys(doc).map(i => doc[i])
          let peopleArrayString = JSON.parse(
            JSON.stringify(doc).replace(/employees/g, modname)
          )
          doc = peopleArrayString
          var red = mainapp[0].swagger

          var internObj = red.map(function (doctor) {
            var keyname = doctor.fieldname
            delete doctor.fieldname
            return {
              [keyname]: doctor
            }
          })

          //convert array to js

          var newObj = internObj.reduce((a, b) => Object.assign(a, b), {})

          doc.paths = peopleArrayString.paths
          doc.definitions[modname]['properties'] = newObj

          doc.definitions[modname + 'Id'] =
            peopleArrayString.definitions[modname + 'Id']
          fs.writeFile(
            '../utils/docs/' + modname + '.yaml',
            yaml.safeDump(doc),
            function (err, data) {
              if (err) {
                console.log(err)
              } else {
                resolve(mainapp)
              }
            }
          )
        })
      } catch (e) {
        reject(err)
      }
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = routes
