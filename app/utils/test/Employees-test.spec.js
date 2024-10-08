let genSpecs = require('./Generic.spec.js')
let l1 = genSpecs.metaTestcaseGen("employees");
testbase = l1.a
validationConfig = l1.b

describe('Begin Tests', function () {
  before(function (done) {
    genSpecs.PrimarytestInit(testbase).then(function (data) {
      console.log('*****Multi Records are inserted sucessfully*****')
      testbase = data
      done()
    })
  })
  after(function (done) {

    genSpecs.dataCleanUp(testbase).then(function () {
      done()
    })
  })

  describe('****************Schema Removal Validation Test Cases****************', function () {
    testbase.schemaValValidatorPayload.forEach(function (entry) {
      it(`For insert Operation test case By Removing ${entry.key} from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload1(testbase, entry, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.statusCode.should.equal(400)
          data.body.error.should.equal('Bad Request')

          data.body.message.should.equal(
            `body should have required property '${entry.key}'`
          )
        })
      })
    })
  })

  describe('****************Schema Blank/Empty Validation Test Cases****************', function () {
    testbase.schemaValValidatorPayloadBlank.forEach(function (entry) {
      it(`For insert Operation test case By assigning ${entry.key} as blank/empty from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload1(testbase, entry, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.error.should.equal('Bad Request')
          let fieldtype = ''
          

          if (
            validationConfig.validationmap[0].hasOwnProperty('inputtextval')
          ) {
            fieldtype = validationConfig.validationmap.filter(
              o => o.inputtextval == entry.key
            )[0].fieldvalidatename
          } else {
            fieldtype = validationConfig.validationmap.filter(
              o => o.inputname == entry.key
            )[0].fieldvalidatename
          }

          if (fieldtype == 'boolean') {
            data.body.message.should.equal(
              `body.${entry.key} should be boolean`
            )
          } else if (fieldtype == 'date') {
            data.body.message.should.equal(
              `body.${entry.key} should match format "date"`
            )
          } else if (fieldtype == 'number') {
            data.body.message.should.equal(
              `body.${entry.key} should be integer`
            )
          } else if (fieldtype == 'email') {
            data.body.message.should.equal(
              `body.${entry.key} should match format "email"`
            )
          } else {
            data.body.message.should.equal(
              `body.${entry.key} should NOT be shorter than 1 characters`
            )
          }
        })
      })
    })
  })

  describe('****************Schema MaxLenght Validation Test Cases****************', function () {
    testbase.schemaValValidatorPayloadMaxLenght.forEach(function (entry) {
      it(`For insert Operation test case By assigning ${entry.key} as maxLenght of fields value from payload to Evaluate  if schema validator is throwing field specific error or not `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload1(testbase, entry, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          
          if (
            validationConfig.validationmap[0].hasOwnProperty('inputtextval')
          ) {
            fieldtype = validationConfig.validationmap.filter(
              o => o.inputtextval == entry.key
            )[0]
          } else {
            fieldtype = validationConfig.validationmap.filter(
              o => o.inputname == entry.key
            )[0]
          }
          if (fieldtype.fieldtypename == 'boolean') {
            data.body.message.should.equal(
              `body.${entry.key} should be boolean`
            )
          } else if (fieldtype.fieldtypename == 'DATE') {
            data.body.message.should.equal(
              `body.${entry.key} should match format "date"`
            )
          } else if (fieldtype.fieldtypename == 'INTEGER') {
            data.body.message.should.equal(
              `body.${entry.key} should be <= ${parseInt((""+1).padEnd(fieldtype.fieldmaxlength, "0"))}`
            )
          } else if (fieldtype.fieldtypename == 'BIGINT') {
            data.body.message.should.equal(
              `body.${entry.key} should be <= 9223372036854776000`
            )
          } else if (
            fieldtype.fieldtypename.toLowerCase() != fieldtype.fieldvalidatename
          ) {
            if (fieldtype.fieldvalidatename == 'number') {
              data.body.message.should.equal(
                `body.${entry.key} should be <= 2147483648`
              )
            }
          } else {
            data.body.message.should.equal(
              `body.${entry.key} should NOT be longer than ${fieldtype.fieldmaxlength} characters`
            )
          }
        })
      })
    })
  })
  describe('****************Valid Record Insertion Validation Test Cases****************', function () {
    it(`For  insert Operation test cases By passing as valid fields in the  payload to Evaluate   if we are getting valid return field `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload2(testbase, evalModulename, validationConfig)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        data.body.Message.should.equal('Record SuccessFully Inserted')
        genSpecs.expect(data.body.createdId).to.be.a('number')
        testbase.InsertID = data.body.createdId
      })
    })
  })
  describe('****************Invalid Record Updation by Schema Removal Validation Test Cases****************', function () {
    it(`For  Update Operation test cases By passing as removing UpdatedID in the  payload to Evaluate   if we are getting valid return field `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload3(testbase, evalModulename)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        data.body.error.should.equal('Bad Request')
        data.body.message.should.equal(
          `body should have required property '${testbase.evalModulename}id'`
        )
      })
    })
  })
  describe('****************Invalid Record Updation by Schema NaN Validation Test Cases****************', function () {
    it(`For  Update Operation test cases By passing as  UpdatedID as NaN in the  payload to Evaluate   if we are getting valid return field `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload4(testbase, evalModulename)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        data.body.error.should.equal('Bad Request')
        data.body.message.should.equal(
          `body.${testbase.evalModulename}id should be >= 1`
        )
      })
    })
  })
  describe('****************Invalid Record Updation by Schema undefined Validation Test Cases****************', function () {
    it(`For  Update Operation test cases By passing as  UpdatedID as undefined in the  payload to Evaluate   if we are getting valid return field `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload5(testbase, evalModulename)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        data.body.error.should.equal('Bad Request')
        data.body.message.should.equal(
          `body should have required property '${testbase.evalModulename}id'`
        )
      })
    })
  })
  describe('****************Valid Record Updation Validation Test Cases****************', function () {
    it(`For  Update Operation test cases By passing as  UpdatedID as valid value in the  payload to Evaluate   if we are getting valid return field `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload6(testbase, evalModulename)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        genSpecs
          .expect(data.body[1][testbase.evalModulename + 'id'])
          .to.equal(testbase.InsertID)
      })
    })
  })
  describe('****************Parent Payload Validation Test Cases****************', function () {
    describe('****************Dates SearchParam Validation Test Cases****************', function () {
      it(`without date filter payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload7(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
         // genSpecs.expect(parseInt(data.body.count)).to.be.a('number')

          genSpecs
            .expect(data.body.rows.length)
            .to.be.lte(testbase.payload.pageSize)
        })
      })
      it(`date filter startdate Nan payload `, function () {
        //console.log(testbase)
        testbase = genSpecs
          .consolidatedPayload()
          .payload8(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.error.should.equal('Bad Request')
          data.body.message.should.equal(
            `body.daterange.startdate should NOT be shorter than 1 characters`
          )
        })
      })
      it(`date filter enddate Nan payload `, function () {
        //console.log(testbase)
        testbase = genSpecs
          .consolidatedPayload()
          .payload9(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.error.should.equal('Bad Request')
          data.body.message.should.equal(
            `body.daterange.enddate should NOT be shorter than 1 characters`
          )
        })
      })
      it(`date filter startdate Undefined payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload10(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.error.should.equal('Bad Request')
          data.body.message.should.equal(
            `body.daterange should have required property 'startdate'`
          )
        })
      })
      it(`date filter enddate Undefined payload `, function () {
        //console.log(testbase)
        testbase = genSpecs
          .consolidatedPayload()
          .payload11(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.error.should.equal('Bad Request')
          data.body.message.should.equal(
            `body.daterange should have required property 'enddate'`
          )
        })
      })
    })
    describe('****************Payload Param Validation Test Cases****************', function () {
      it(`filter with sortcolumn as NaN  payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload24(testbase, evalModulename)

        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.message.should.equal(
            `body.sortcolumn should NOT be shorter than 1 characters`
          )
        })
      })
      it(`filter with sortcolumnorder as NaN  payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload25(testbase, evalModulename)

        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.message.should.equal(
            `body.sortcolumnorder should NOT be shorter than 1 characters`
          )
        })
      })
      Object.keys(testbase.schemaBaseValidatorPayloadAr[0]).forEach(function (
        entry
      ) {
        it(`Sorting ${entry} Ascending and evaluating if it is should not be breaking`, function () {
          testbase = genSpecs
            .consolidatedPayload()
            .payload26(testbase, entry, evalModulename)
          //  console.log(testbase.payload)
          return genSpecs.genericApiPost(testbase).then(function (data) {
            //  let interimval = testbase.schemaBaseValidatorPayloadAr[0][entry]
            //    genSpecs.expect(data.body.rows[0][entry]).to.equal(interimval)
          })
        })
      })
      Object.keys(testbase.schemaBaseValidatorPayloadAr[0]).forEach(function (
        entry
      ) {
        it(`Sorting ${entry} Descending and evaluating if it is should not be breaking`, function () {
          testbase = genSpecs
            .consolidatedPayload()
            .payload27(testbase, entry, evalModulename)
          //  console.log(testbase.payload)
          return genSpecs.genericApiPost(testbase).then(function (data) {
            //  let interimval = testbase.schemaBaseValidatorPayloadAr[0][entry]
            //    genSpecs.expect(data.body.rows[0][entry]).to.equal(interimval)
          })
        })
      })
      it(`filter with pageSize as NaN  payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload12(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.message.should.equal(`body.pageSize should be >= 1`)
        })
      })
      it(`filter with pageSize as undefined  payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload13(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.message.should.equal(
            `body should have required property '.pageSize'`
          )
        })
      })
      it(`filter with pageno as undefined  payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload14(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.message.should.equal(
            `body should have required property \'.pageno\'`
          )
        })
      })
      it(`filter with datecolsearch as NaN  payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload15(testbase, evalModulename)

        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.message.should.equal(
            `body.datecolsearch should NOT be shorter than 1 characters`
          )
        })
      })
      it(`filter with datecolsearch as undefined  payload `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload16(testbase, evalModulename)
        return genSpecs.genericApiPost(testbase).then(function (data) {
          data.body.message.should.equal(
            `body should have required property '.datecolsearch'`
          )
        })
      })

      describe('****************Search Features Single/SingleColumn Test Cases****************', function () {
        Object.keys(testbase.schemaBaseValidatorPayload).forEach(function (
          entry
        ) {
          it(`Searching for ${entry} and getting expected single recordset `, function () {
            testbase = genSpecs
              .consolidatedPayload()
              .payload17(testbase, entry, evalModulename, validationConfig)
              
            return genSpecs.genericApiPost(testbase).then(function (data) {
              
              let interimval = testbase.schemaBaseValidatorPayload[entry]
              if (genSpecs.customIsNumeric(interimval)) {
                genSpecs
                  .expect(parseInt(data.body.rows[0][entry]))
                  .to.equal(parseInt(interimval))
              } else {
                let j = validationConfig.validationmap.filter(
                  o => o.fieldvalidatename == "date"
                ).filter(
                  o => o.inputname == entry
                )

                if (j.length > 0) {
                  var interimdate = new Date(data.body.rows[0][entry]);
                  
                  genSpecs.expect(interimdate.toLocaleDateString('en-ca')).to.equal(interimval)
                } else {
                  genSpecs.expect(data.body.rows[0][entry]).to.equal(interimval)
                }

              }
            })
          })
        })
      })
    })
  })

  describe('****************Search Features Multi/SingleColumn Test Cases****************', function () {
    Object.keys(testbase.schemaBaseValidatorPayload).forEach(function (entry) {
      it(`Searching for ${entry} and getting expected Multi recordset `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload18(testbase, entry, evalModulename, validationConfig)

        return genSpecs.genericApiPost(testbase).then(function (data) {
          var payloadCount = parseInt(
            testbase.schemaBaseValidatorPayloadAr.length
          )
          //genSpecs.expect(parseInt(data.body.count)).to.be.gte(payloadCount)
          var searchAssert = data.body.rows
          var firstSet = searchAssert.filter(
            word =>
              (word[entry] = testbase.schemaBaseValidatorPayloadAr[0][entry])
          )
          var secondSet = searchAssert.filter(
            word =>
              (word[entry] = testbase.schemaBaseValidatorPayloadAr[1][entry])
          )

          genSpecs.expect(parseInt(firstSet.length)).to.be.gte(payloadCount)

          genSpecs.expect(parseInt(secondSet.length)).to.be.gte(payloadCount)
        })
      })
    })
  })
  describe('****************Search Features Multi/MultiColumn Test Cases****************', function () {
    Object.keys(testbase.schemaBaseValidatorPayload).forEach(function (entry) {
      it(`Searching for ${entry} and getting expected Multi recordset `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload19(testbase, entry, evalModulename, validationConfig)

        return genSpecs.genericApiPost(testbase).then(function (data) {
          
          genSpecs.expect(parseInt(data.body.rows.length)).to.be.gte(1)
        })
      })
    })
  })

  describe('****************Consolidated Search Across all column except auto generated dates and boolean Test Cases****************', function () {
    it(`Consolidated ResultSet Search working as expected`, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload20(testbase, evalModulename, validationConfig)
      //file :dependentvariable line no :1116 parameter : console.log(sqlstatementsprimary) 
      
      return genSpecs.genericApiPost(testbase).then(function (data) {

        genSpecs.expect(parseInt(data.body.rows.length)).to.be.gte(1)
      })
    })
  })

  it(`Consolidated ResultSet Search param as undefined working as expected`, function () {
    testbase = genSpecs
      .consolidatedPayload()
      .payload21(testbase, evalModulename)

    return genSpecs.genericApiPost(testbase).then(function (data) {
      data.body.message.should.equal(
        `body should have required property \'.basesearcharconsolidated\'`
      )
    })
  })
  describe('****************undefined Searchparam values Test Cases****************', function () {
    Object.keys(testbase.schemaBaseValidatorPayload).forEach(function (entry) {
      it(`evaluating for ${entry} and getting expected custom reject Error `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload22(testbase, entry, evalModulename, validationConfig)

        return genSpecs.genericApiPost(testbase).then(function (data) {
          if (data.body.statusCode === undefined) {
            let interim=data.body.status.trim()
            interim.should.equal(`${entry} is undefined`)
          } else {
            data.body.message.should.equal(
              `body.daterange should have required property \'startdate\'`
            )
          }

          //
        })
      })
    })
  })
  describe('****************undefined Searchparam Key Test Cases****************', function () {
    Object.keys(testbase.schemaBaseValidatorPayload).forEach(function (entry) {
      it(`evaluating for ${entry} and getting expected custom reject Error `, function () {
        testbase = genSpecs
          .consolidatedPayload()
          .payload23(testbase, entry, evalModulename, validationConfig)

        return genSpecs.genericApiPost(testbase).then(function (data) {
          if (
            data.body.statusCode === undefined &&
            testbase.schemaBaseValidatorPayload[entry] != undefined
          ) {
            let interim=data.body.status.trim() 
            interim.should.equal(
              `key of ${testbase.schemaBaseValidatorPayload[entry]} is undefined`
            )
          } else if (testbase.schemaBaseValidatorPayload[entry] === undefined) {
            data.body.status.should.equal(`key of  is undefined`)
          } else {
            data.body.message.should.equal(
              `body.daterange should have required property \'startdate\'`
            )
          }

          //
        })
      })
    })
  })

  describe('****************undefined Pivot  Test Cases****************', function () {
    it(`filter with XpageSize as undefined  payload `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload28(testbase, evalModulename)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        //console.log(data.body);
        data.body.message.should.equal(
          `body should have required property \'.XpageSize\'`
        )
      })
    })
    it(`filter with Xpageno as undefined  payload `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload29(testbase, evalModulename)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        //console.log(data.body);
        data.body.message.should.equal(
          `body should have required property \'.Xpageno\'`
        )
      })
    })
    it(`filter with YpageSize as undefined  payload `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload30(testbase, evalModulename)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        //console.log(data.body);
        data.body.message.should.equal(
          `body should have required property \'.YpageSize\'`
        )
      })
    })
    it(`filter with Ypageno as undefined  payload `, function () {
      testbase = genSpecs
        .consolidatedPayload()
        .payload31(testbase, evalModulename)
      return genSpecs.genericApiPost(testbase).then(function (data) {
        //console.log(data.body);
        data.body.message.should.equal(
          `body should have required property \'.Ypageno\'`
        )
      })
    })
  })

})
