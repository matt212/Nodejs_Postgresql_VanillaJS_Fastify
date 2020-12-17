let testbase = {
  evalModulename: 'employees'
}
let genSpecs = require('./Generic.spec.js')
let validationConfig = require('../../routes/utils/' +
  testbase.evalModulename +
  '/validationConfig.js')
validationConfig.applyfields.push('recordstate')
var recordstateobj = {
  inputname: 'recordstate',
  fieldtypename: 'boolean',
  fieldvalidatename: 'boolean',
  fieldmaxlength: '4'
}
validationConfig.validationmap.push(recordstateobj)
/*for getting and passing to rest of tests fields and validationConfig*/
testbase.schemaBaseValidatorPayload = genSpecs.createModPayLoad(
  validationConfig
)
/*Generate multi insert payloads by passing second parameter as number recordset to generate*/
testbase.schemaBaseValidatorPayloadAr = genSpecs.genPayloadByNum(
  validationConfig,
  2
)

/*Schema validatior with removing one by ony fields*/
testbase.schemaValValidatorPayload = genSpecs.schemaValueValidatorPayload(
  validationConfig.applyfields,
  testbase.schemaBaseValidatorPayload
)
/*Schema validatior with blank fields one by ony fields*/
testbase.schemaValValidatorPayloadBlank = genSpecs.schemaValueValidatorPayloadBlank(
  validationConfig.applyfields,
  testbase.schemaBaseValidatorPayload
)
/*Schema validatior with Max  fields validations one by ony fields*/
testbase.schemaValValidatorPayloadMaxLenght = genSpecs.schemaValValidatorPayloadMaxLenght(
  validationConfig.applyfields,
  testbase.schemaBaseValidatorPayload
)

genSpecs.setevalModulename(testbase.evalModulename)
describe('Begin Tests', function () {
  // #1 should return home page
  before(function (done) {
    genSpecs
      .loginsuccess()
      .then(genSpecs.loadCurrentModule)
      .then(function (data) {
        testbase.token = data
        console.log(
          '****************login and loaded the module  successfully****************'
        )
        multiInsertforSearch().then(function (data) {
          console.log('---Deletes--')
          testbase.DelAr = data
          done()
        })
      })
  })
  let multiInsert = function (entry) {
    return new Promise((resolve, reject) => {
      testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
      testbase.responseCode = 200
      testbase.payload = entry
      genSpecs.genericApiPost(testbase).then(function (data) {
        data.body.createdId
        resolve(data.body.createdId)
      })
    })
  }
  let multiDel = function (DelAr) {
    var delObj = { [testbase.evalModulename + 'id']: DelAr }

    return new Promise((resolve, reject) => {
      testbase.apiUrl = '/' + evalModulename + genSpecs.dep.delete
      testbase.responseCode = 200
      testbase.payload = delObj
      genSpecs.genericApiPost(testbase).then(function (data) {
        resolve(data)
      })
    })
  }

  let multiInsertforSearch = function () {
    return new Promise((resolve, reject) => {
      genSpecs.Promises.mapSeries(
        testbase.schemaBaseValidatorPayloadAr,
        multiInsert
      ).then(a => {
        console.log('-------------------afte multi insert value')
        resolve(a)
      })
    })
  }
  let multiDelete = function (ar) {
    return new Promise((resolve, reject) => {
      genSpecs.Promises.mapSeries(ar, multiDel).then(a => {
        console.log('-------------------after delete insert value')
        //console.log(a)
        resolve(a)
      })
    })
  }

  after(function (done) {
    multiDelete(testbase.DelAr).then(function (data) {
      console.log('-----------data cleanUp--------')
      genSpecs.server.post('/logout').end(function (err, data) {
        if (err) return done(err)
        console.log('****************logout successfully****************')

        data.statusCode.should.equal(200)
        data.body.status.should.equal('success')
        data.body.redirect.should.equal('/login')
        done()
      })
    })
  })
  //success
  ///redirect login
  it('loads as expected conventionally', function (done) {
    testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[0]
    testbase.payload = genSpecs.loadModulePayLoad
    testbase.responseCode = 200

    genSpecs.genericApiPost(testbase).then(function (data) {
      // console.log(data.body.rows)
      done()
    })
  })
  // it('multi insert and multi Delete', function () {
  //   return multiInsertforSearch().then(multiDelete).then(function(data)
  //   {

  //   })
  // })

  // describe('****************Schema Removal Validation Test Cases****************', function () {
  //   testbase.schemaValValidatorPayload.forEach(function (entry) {
  //     it(`For insert Operation test case By Removing ${entry.key} from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
  //       testbase.responseCode = 400
  //       testbase.payload = entry.schemaContent
  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.statusCode.should.equal(400)
  //         data.body.error.should.equal('Bad Request')

  //         data.body.message.should.equal(
  //           `body should have required property '${entry.key}'`
  //         )
  //       })
  //     })
  //   })
  // })
  // describe('****************Schema Blank/Empty Validation Test Cases****************', function () {
  //   testbase.schemaValValidatorPayloadBlank.forEach(function (entry) {
  //     it(`For insert Operation test case By assigning ${entry.key} as blank/empty from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
  //       testbase.responseCode = 400
  //       testbase.payload = entry.schemaContent
  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.error.should.equal('Bad Request')

  //         let fieldtype = validationConfig.validationmap.filter(
  //           o => o.inputname == entry.key
  //         )[0].fieldtypename
  //         if (fieldtype == 'boolean') {
  //           data.body.message.should.equal(
  //             `body.${entry.key} should be boolean`
  //           )
  //         } else if (fieldtype == 'DATE') {
  //           data.body.message.should.equal(
  //             `body.${entry.key} should match format "date-time"`
  //           )
  //         } else {
  //           data.body.message.should.equal(
  //             `body.${entry.key} should NOT be shorter than 1 characters`
  //           )
  //         }
  //       })
  //     })
  //   })
  // })

  // describe('****************Schema MaxLenght Validation Test Cases****************', function () {
  //   testbase.schemaValValidatorPayloadMaxLenght.forEach(function (entry) {
  //     it(`For insert Operation test case By assigning ${entry.key} as maxLenght of fields value from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
  //       testbase.responseCode = 400
  //       testbase.payload = entry.schemaContent
  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         let fieldtype = validationConfig.validationmap.filter(
  //           o => o.inputname == entry.key
  //         )[0]
  //         if (fieldtype.fieldtypename == 'boolean') {
  //           data.body.message.should.equal(
  //             `body.${entry.key} should be boolean`
  //           )
  //         } else if (fieldtype.fieldtypename == 'DATE') {
  //           data.body.message.should.equal(
  //             `body.${entry.key} should match format "date-time"`
  //           )
  //         } else {
  //           data.body.message.should.equal(
  //             `body.${entry.key} should NOT be longer than ${fieldtype.fieldmaxlength} characters`
  //           )
  //         }
  //       })
  //     })
  //   })
  // })
  // describe(/**/ '****************Valid Record Insertion Validation Test Cases****************', function () {
  //   it(`For  insert Operation test cases By passing as valid fields in the  payload to Evaluate   if we are getting valid return field `, function () {
  //     testbase.apiUrl = '/' + evalModulename + genSpecs.dep.create
  //     testbase.responseCode = 200
  //     testbase.payload = testbase.schemaBaseValidatorPayload

  //     return genSpecs.genericApiPost(testbase).then(function (data) {
  //       data.body.Message.should.equal('Record SuccessFully Inserted')
  //       genSpecs.expect(data.body.createdId).to.be.a('number')
  //       testbase.InsertID = data.body.createdId
  //     })
  //   })
  // })
  // describe('****************Invalid Record Updation by Schema Removal Validation Test Cases****************', function () {
  //   it(`For  Update Operation test cases By passing as removing UpdatedID in the  payload to Evaluate   if we are getting valid return field `, function () {
  //     testbase.apiUrl = '/' + evalModulename + genSpecs.dep.update
  //     testbase.responseCode = 400
  //     testbase.payload = testbase.schemaBaseValidatorPayload

  //     return genSpecs.genericApiPost(testbase).then(function (data) {
  //       data.body.error.should.equal('Bad Request')
  //       data.body.message.should.equal(
  //         `body should have required property '${testbase.evalModulename}id'`
  //       )
  //     })
  //   })
  // })
  // describe('****************Invalid Record Updation by Schema NaN Validation Test Cases****************', function () {
  //   it(`For  Update Operation test cases By passing as  UpdatedID as NaN in the  payload to Evaluate   if we are getting valid return field `, function () {
  //     testbase.apiUrl = '/' + evalModulename + genSpecs.dep.update
  //     testbase.responseCode = 400
  //     testbase.schemaBaseValidatorPayload[testbase.evalModulename + 'id'] = NaN
  //     testbase.payload = testbase.schemaBaseValidatorPayload

  //     return genSpecs.genericApiPost(testbase).then(function (data) {
  //       data.body.error.should.equal('Bad Request')
  //       data.body.message.should.equal(
  //         `body.${testbase.evalModulename}id should be >= 1`
  //       )
  //     })
  //   })
  // })
  // describe('****************Invalid Record Updation by Schema undefined Validation Test Cases****************', function () {
  //   it(`For  Update Operation test cases By passing as  UpdatedID as undefined in the  payload to Evaluate   if we are getting valid return field `, function () {
  //     testbase.apiUrl = '/' + evalModulename + genSpecs.dep.update
  //     testbase.responseCode = 400
  //     testbase.schemaBaseValidatorPayload[
  //       testbase.evalModulename + 'id'
  //     ] = undefined
  //     testbase.payload = testbase.schemaBaseValidatorPayload

  //     return genSpecs.genericApiPost(testbase).then(function (data) {
  //       data.body.error.should.equal('Bad Request')
  //       data.body.message.should.equal(
  //         `body should have required property '${testbase.evalModulename}id'`
  //       )
  //     })
  //   })
  // })
  // describe('****************Valid Record Updation Validation Test Cases****************', function () {
  //   it(`For  Update Operation test cases By passing as  UpdatedID as valid value in the  payload to Evaluate   if we are getting valid return field `, function () {
  //     testbase.apiUrl = '/' + evalModulename + genSpecs.dep.update
  //     testbase.responseCode = 200
  //     testbase.schemaBaseValidatorPayload[testbase.evalModulename + 'id'] =
  //       testbase.InsertID
  //     testbase.payload = testbase.schemaBaseValidatorPayload

  //     return genSpecs.genericApiPost(testbase).then(function (data) {
  //       genSpecs
  //         .expect(data.body[1][testbase.evalModulename + 'id'])
  //         .to.equal(testbase.InsertID)
  //     })
  //   })
  // })
  // describe('****************Parent Payload Validation Test Cases****************', function () {
  //   describe('****************Dates SearchParam Validation Test Cases****************', function () {
  //     it(`without date filter payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.disableDate = true
  //       testbase.payload = o
  //       testbase.responseCode = 200

  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         genSpecs.expect(parseInt(data.body.count)).to.be.a('number')

  //         genSpecs
  //           .expect(data.body.rows.length)
  //           .to.be.lte(testbase.payload.pageSize)
  //       })
  //     })
  //     it(`date filter startdate Nan payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.daterange = {
  //         startdate: NaN,
  //         enddate: '2019-01-29'
  //       }
  //       o.disableDate = false
  //       testbase.payload = o
  //       testbase.responseCode = 400
  //       //console.log(testbase)
  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.error.should.equal('Bad Request')
  //         data.body.message.should.equal(
  //           `body.daterange.startdate should NOT be shorter than 1 characters`
  //         )
  //       })
  //     })
  //     it(`date filter enddate Nan payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.daterange = {
  //         startdate: '1982-01-29',
  //         enddate: NaN
  //       }
  //       o.disableDate = false
  //       testbase.payload = o
  //       testbase.responseCode = 400
  //       //console.log(testbase)
  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.error.should.equal('Bad Request')
  //         data.body.message.should.equal(
  //           `body.daterange.enddate should NOT be shorter than 1 characters`
  //         )
  //       })
  //     })
  //     it(`date filter startdate Undefined payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.daterange = {
  //         startdate: undefined,
  //         enddate: '1982-01-29'
  //       }
  //       o.disableDate = false
  //       testbase.payload = o
  //       testbase.responseCode = 400

  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.error.should.equal('Bad Request')
  //         data.body.message.should.equal(
  //           `body.daterange should have required property 'startdate'`
  //         )
  //       })
  //     })
  //     it(`date filter enddate Undefined payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.daterange = {
  //         startdate: '1982-01-29',
  //         enddate: undefined
  //       }
  //       o.disableDate = false
  //       testbase.payload = o
  //       testbase.responseCode = 400
  //       //console.log(testbase)
  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.error.should.equal('Bad Request')
  //         data.body.message.should.equal(
  //           `body.daterange should have required property 'enddate'`
  //         )
  //       })
  //     })
  //   })
  //   describe('****************Payload Param Validation Test Cases****************', function () {
  //     it(`filter with pageSize as NaN  payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.pageSize = NaN
  //       testbase.payload = o
  //       testbase.responseCode = 400
  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.message.should.equal(`body.pageSize should be >= 1`)
  //       })
  //     })
  //     it(`filter with pageSize as undefined  payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.pageSize = undefined
  //       testbase.payload = o
  //       testbase.responseCode = 400
  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.message.should.equal(
  //           `body should have required property '.pageSize'`
  //         )
  //       })
  //     })
  //     it(`filter with pageno as undefined  payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.pageno = undefined
  //       testbase.payload = o
  //       testbase.responseCode = 400

  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.message.should.equal(
  //           `body should have required property \'.pageno\'`
  //         )
  //       })
  //     })
  //     it(`filter with datecolsearch as NaN  payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.daterange = {
  //         startdate: '1982-01-29',
  //         enddate: '1982-01-29'
  //       }
  //       o.datecolsearch = NaN
  //       o.disableDate = false
  //       testbase.payload = o
  //       testbase.responseCode = 400

  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.message.should.equal(
  //           `body.datecolsearch should NOT be shorter than 1 characters`
  //         )
  //       })
  //     })
  //     it(`filter with datecolsearch as undefined  payload `, function () {
  //       testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //       var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))
  //       o.daterange = {
  //         startdate: '1982-01-29',
  //         enddate: '1982-01-29'
  //       }
  //       o.datecolsearch = undefined
  //       o.disableDate = false
  //       testbase.payload = o
  //       testbase.responseCode = 400

  //       return genSpecs.genericApiPost(testbase).then(function (data) {
  //         data.body.message.should.equal(
  //           `body should have required property '.datecolsearch'`
  //         )
  //       })
  //     })

  //     describe('****************Search Features Single/MultiColumn Test Cases****************', function () {
  //       Object.keys(testbase.schemaBaseValidatorPayload).forEach(function (
  //         entry
  //       ) {
  //         it(`Searching for ${entry} and getting expected single recordset `, function () {
  //           testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
  //           testbase.responseCode = 200
  //           var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))

  //           let fieldtype = validationConfig.validationmap.filter(
  //             o => o.inputname == entry
  //           )[0].fieldtypename

  //           if (fieldtype == 'DATE') {
  //             o.daterange = {
  //               startdate: new Date(
  //                 testbase.schemaBaseValidatorPayload[entry]
  //               ).toLocaleDateString(),
  //               enddate: new Date(
  //                 testbase.schemaBaseValidatorPayload[entry]
  //               ).toLocaleDateString()
  //             }
  //             o.datecolsearch = entry
  //             o.disableDate = false
  //           } else if (fieldtype == 'boolean') {
  //             o.searchparam = [
  //               {
  //                 [entry]: [testbase.schemaBaseValidatorPayload[entry]]
  //               }
  //             ]
  //             o.disableDate = true
  //             o.searchtype = 'Columnwise'
  //           } else {
  //             let interimval = testbase.schemaBaseValidatorPayload[entry]

  //             o.searchparam = [
  //               {
  //                 [entry]: [interimval.toLowerCase()]
  //               }
  //             ]
  //             o.disableDate = true
  //             o.searchtype = 'Columnwise'
  //           }

  //           testbase.payload = o

  //           return genSpecs.genericApiPost(testbase).then(function (data) {
  //             let interimval = testbase.schemaBaseValidatorPayload[entry]

  //             genSpecs.expect(data.body.rows[0][entry]).to.equal(interimval)
  //           })
  //         })
  //       })
  //     })

  // })
  // })

  describe('****************Search Features Multi/MultiColumn Test Cases****************', function () {
    Object.keys(testbase.schemaBaseValidatorPayload).forEach(function (entry) {
      it(`Searching for ${entry} and getting expected Multi recordset `, function () {
        testbase.apiUrl = '/' + evalModulename + genSpecs.dep.searchtype[1]
        testbase.responseCode = 200
        var o = JSON.parse(JSON.stringify(genSpecs.loadModulePayLoad))

        let fieldtype = validationConfig.validationmap.filter(
          o => o.inputname == entry
        )[0].fieldtypename

        if (fieldtype == 'DATE') {
          o.daterange = {
            startdate: new Date(
              testbase.schemaBaseValidatorPayloadAr[0][entry]
            ).toLocaleDateString(),
            enddate: new Date(
              testbase.schemaBaseValidatorPayloadAr[0][entry]
            ).toLocaleDateString()
          }
          o.datecolsearch = entry
          o.disableDate = false
        } else if (fieldtype == 'boolean') {
          o.searchparam = [
            {
              [entry]: [
                testbase.schemaBaseValidatorPayloadAr[0][entry],
                testbase.schemaBaseValidatorPayloadAr[1][entry]
              ]
            }
          ]
          o.disableDate = true
          o.searchtype = 'Columnwise'
        } else {
          let interimval1 = testbase.schemaBaseValidatorPayloadAr[0][entry]
          let interimval2 = testbase.schemaBaseValidatorPayloadAr[1][entry]
          o.searchparam = [
            {
              [entry]: [interimval1.toLowerCase(), interimval2.toLowerCase()]
            }
          ]
          o.disableDate = true
          o.searchtype = 'Columnwise'
        }
        testbase.payload = o
        return genSpecs.genericApiPost(testbase).then(function (data) {
          genSpecs
            .expect(parseInt(data.body.count))
            .to.be.gte(parseInt(testbase.schemaBaseValidatorPayloadAr.length))
          // let interimval = testbase.schemaBaseValidatorPayloadAr[0][entry]
          // genSpecs.expect(data.body.rows[0][entry]).to.equal(interimval)
        })
      })
    })
  })
})
