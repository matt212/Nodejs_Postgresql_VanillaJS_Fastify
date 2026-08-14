const genSpecs = require('./Generic.spec.js');

const l1 = genSpecs.metaTestcaseGen('employees');

if (!l1) {
  throw new Error('metaTestcaseGen("employees") returned undefined');
}

if (!l1.a) {
  throw new Error(
    'metaTestcaseGen("employees") returned undefined testbase'
  );
}

if (!l1.b) {
  throw new Error(
    'metaTestcaseGen("employees") returned undefined validationConfig'
  );
}

let testbase = l1.a;
const validationConfig = l1.b;
const evalModulename = 'employees';


// ============================================================
// HELPER
// ============================================================

function cloneTestbase() {
  return structuredClone(testbase);
}

function normalizeDateValue(value) {
  if (
    value !== null &&
    value !== undefined &&
    typeof value === 'string' &&
    !isNaN(Date.parse(value))
  ) {
    return value.split('T')[0];
  }

  return value;
}

function normalizeSearchValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (
    typeof value === 'string' &&
    !isNaN(Date.parse(value))
  ) {
    return value.split('T')[0];
  }

  return String(value).trim();
}


// ============================================================
// BEGIN TESTS
// ============================================================

describe('Begin Tests', function () {

  // ==========================================================
  // DATABASE INITIALIZATION
  // ==========================================================

  before(async function () {

    const data =
      await genSpecs.PrimarytestInit(testbase);

    console.log(
      '***** Multi Records are inserted successfully *****'
    );

    testbase = data;
  });


  // ==========================================================
  // DATABASE CLEANUP
  // ==========================================================

  after(async function () {

    if (!testbase) {
      return;
    }

    await genSpecs.dataCleanUp(testbase);
  });


  // ==========================================================
  // 1. SCHEMA REMOVAL VALIDATION
  // ==========================================================

  describe(
    '****************Schema Removal Validation Test Cases****************',
    function () {

      testbase.schemaValValidatorPayload.forEach(
        function (entry) {

          it(
            `For insert Operation test case By Removing ${entry.key} from payload to Evaluate if schema validator is throwing field specific error or not`,
            async function () {

              const localTestbase =
                cloneTestbase();

              const payload =
                genSpecs
                  .consolidatedPayload()
                  .payload1(
                    localTestbase,
                    entry,
                    evalModulename
                  );

              const data =
                await genSpecs.genericApiPost(payload);

              data.body.statusCode
                .should.equal(400);

              data.body.error
                .should.equal('Bad Request');

              data.body.message
                .should.equal(
                  `body must have required property '${entry.key}'`
                );
            }
          );
        }
      );
    }
  );


  // ==========================================================
  // 2. SCHEMA BLANK / EMPTY VALIDATION
  // ==========================================================

  describe(
    '****************Schema Blank/Empty Validation Test Cases****************',
    function () {

      testbase.schemaValValidatorPayloadBlank.forEach(
        function (entry) {

          it(
            `For insert Operation test case By assigning ${entry.key} as blank/empty from payload to Evaluate if schema validator is throwing field specific error or not`,
            async function () {

              const localTestbase =
                cloneTestbase();

              const payload =
                genSpecs
                  .consolidatedPayload()
                  .payload1(
                    localTestbase,
                    entry,
                    evalModulename
                  );

              const data =
                await genSpecs.genericApiPost(payload);

              data.body.error
                .should.equal('Bad Request');

              const validationMap =
                validationConfig.validationmap;

              let fieldtype = '';

              if (
                validationMap[0]
                  .hasOwnProperty('inputtextval')
              ) {

                const field =
                  validationMap.find(
                    o => o.inputtextval === entry.key
                  );

                fieldtype =
                  field?.fieldvalidatename;

              } else {

                const field =
                  validationMap.find(
                    o => o.inputname === entry.key
                  );

                fieldtype =
                  field?.fieldvalidatename;
              }


              if (fieldtype === 'boolean') {

                data.body.message.should.equal(
                  `body/${entry.key} must be boolean`
                );

              } else if (fieldtype === 'date') {

                data.body.message.should.equal(
                  `body/${entry.key} must NOT have fewer than 1 characters`
                );

              } else if (fieldtype === 'number') {

                data.body.message.should.equal(
                  `body/${entry.key} must be integer`
                );

              } else if (fieldtype === 'email') {

                data.body.message.should.equal(
                  `body/${entry.key} must match format "email"`
                );

              } else {

                data.body.message.should.equal(
                  `body/${entry.key} must NOT have fewer than 1 characters`
                );
              }
            }
          );
        }
      );
    }
  );


  // ==========================================================
  // 3. SCHEMA MAX LENGTH VALIDATION
  // ==========================================================

  describe(
    '****************Schema MaxLenght Validation Test Cases****************',
    function () {

      testbase.schemaValValidatorPayloadMaxLenght.forEach(
        function (entry) {

          it(
            `For insert Operation test case By assigning ${entry.key} as maxLenght of fields value from payload to Evaluate if schema validator is throwing field specific error or not`,
            async function () {

              const localTestbase =
                cloneTestbase();

              const payload =
                genSpecs
                  .consolidatedPayload()
                  .payload1(
                    localTestbase,
                    entry,
                    evalModulename
                  );

              const data =
                await genSpecs.genericApiPost(payload);

              const validationMap =
                validationConfig.validationmap;

              let fieldtype;

              if (
                validationMap[0]
                  .hasOwnProperty('inputtextval')
              ) {

                fieldtype =
                  validationMap.find(
                    o => o.inputtextval === entry.key
                  );

              } else {

                fieldtype =
                  validationMap.find(
                    o => o.inputname === entry.key
                  );
              }

              if (!fieldtype) {
                throw new Error(
                  `Validation configuration not found for ${entry.key}`
                );
              }


              if (
                fieldtype.fieldtypename === 'boolean'
              ) {

                data.body.message.should.equal(
                  `body/${entry.key} must be boolean`
                );

              } else if (
                fieldtype.fieldtypename === 'DATE'
              ) {

                data.body.message.should.equal(
                  `body/${entry.key} must match format "date"`
                );

              } else if (
                fieldtype.fieldtypename === 'INTEGER'
              ) {

                data.body.message.should.equal(
                  `body/${entry.key} should be <= ${parseInt(
                    ('' + 1).padEnd(
                      fieldtype.fieldmaxlength,
                      '0'
                    )
                  )
                  }`
                );

              } else if (
                fieldtype.fieldtypename === 'BIGINT'
              ) {

                data.body.message.should.equal(
                  `body/${entry.key} must be <= 9223372036854776000`
                );

              } else if (
                fieldtype.fieldtypename.toLowerCase() !==
                fieldtype.fieldvalidatename
              ) {

                if (
                  fieldtype.fieldvalidatename === 'number'
                ) {

                  data.body.message.should.equal(
                    `body/${entry.key} must be <= 2147483648`
                  );
                }

              } else {

                data.body.message.should.equal(
                  `body/${entry.key} must NOT have more than ${fieldtype.fieldmaxlength} characters`
                );
              }
            }
          );
        }
      );
    }
  );


  // ==========================================================
  // 4. VALID RECORD INSERTION
  // ==========================================================

  describe(
    '****************Valid Record Insertion Validation Test Cases****************',
    function () {

      it(
        `For insert Operation test cases By passing as valid fields in the payload to Evaluate if we are getting valid return field`,
        async function () {

          const payload =
            genSpecs
              .consolidatedPayload()
              .payload2(
                testbase,
                evalModulename,
                validationConfig
              );

          const data =
            await genSpecs.genericApiPost(payload);

          data.body.Message
            .should.equal(
              'Record Successfully Inserted'
            );

          genSpecs
            .expect(data.body.createdId)
            .to.be.a('number');

          testbase.InsertID =
            data.body.createdId;
        }
      );
    }
  );


  // ==========================================================
  // 5. INVALID RECORD UPDATION
  // ==========================================================

  describe(
    '****************Invalid Record Updation by Schema Removal Validation Test Cases****************',
    function () {

      it(
        `For Update Operation test cases By passing as removing UpdatedID in the payload to Evaluate if we are getting valid return field`,
        async function () {

          const payload =
            genSpecs
              .consolidatedPayload()
              .payload3(
                cloneTestbase(),
                evalModulename
              );

          const data =
            await genSpecs.genericApiPost(payload);

          data.body.error
            .should.equal('Bad Request');

          data.body.message
            .should.equal(
              `body must have required property '${evalModulename}id'`
            );
        }
      );
    }
  );


  describe(
    '****************Invalid Record Updation by Schema NaN Validation Test Cases****************',
    function () {

      it(
        `For Update Operation test cases By passing as UpdatedID as NaN in the payload to Evaluate if we are getting valid return field`,
        async function () {

          const payload =
            genSpecs
              .consolidatedPayload()
              .payload4(
                cloneTestbase(),
                evalModulename
              );

          const data =
            await genSpecs.genericApiPost(payload);

          data.body.error
            .should.equal('Bad Request');

          data.body.message
            .should.equal(
              `body/${evalModulename}id must be >= 1`
            );
        }
      );
    }
  );


  describe(
    '****************Invalid Record Updation by Schema undefined Validation Test Cases****************',
    function () {

      it(
        `For Update Operation test cases By passing as UpdatedID as undefined in the payload to Evaluate if we are getting valid return field`,
        async function () {

          const payload =
            genSpecs
              .consolidatedPayload()
              .payload5(
                cloneTestbase(),
                evalModulename
              );

          const data =
            await genSpecs.genericApiPost(payload);

          data.body.error
            .should.equal('Bad Request');

          data.body.message
            .should.equal(
              `body must have required property '${evalModulename}id'`
            );
        }
      );
    }
  );


  describe(
    '****************Valid Record Updation Validation Test Cases****************',
    function () {

      it(
        `For Update Operation test cases By passing as UpdatedID as valid value in the payload to Evaluate if we are getting valid return field`,
        async function () {

          const payload =
            genSpecs
              .consolidatedPayload()
              .payload6(
                cloneTestbase(),
                evalModulename
              );

          const data =
            await genSpecs.genericApiPost(payload);

          genSpecs
            .expect(
              data.body[1][
              `${evalModulename}id`
              ]
            )
            .to.equal(testbase.InsertID);
        }
      );
    }
  );


  // ==========================================================
  // 6. PARENT PAYLOAD / DATE VALIDATION
  // ==========================================================

  describe(
    '****************Parent Payload Validation Test Cases****************',
    function () {

      describe(
        '****************Dates SearchParam Validation Test Cases****************',
        function () {

          it(
            `without date filter payload`,
            async function () {

              const payload =
                genSpecs
                  .consolidatedPayload()
                  .payload7(
                    cloneTestbase(),
                    evalModulename
                  );

              const data =
                await genSpecs.genericApiPost(payload);

              data.body.status
                .split(':')[1]
                .trim()
                .should.equal(
                  `body must have required property 'datecolsearch'`
                );
            }
          );


          it(
            `date filter startdate Nan payload`,
            async function () {

              const payload =
                genSpecs
                  .consolidatedPayload()
                  .payload8(
                    cloneTestbase(),
                    evalModulename
                  );

              const data =
                await genSpecs.genericApiPost(payload);

              data.body.error
                .should.equal('Bad Request');

              data.body.message
                .should.equal(
                  `body must have required property 'datecolsearch'`
                );
            }
          );


          it(
            `date filter enddate Nan payload`,
            async function () {

              const payload =
                genSpecs
                  .consolidatedPayload()
                  .payload9(
                    cloneTestbase(),
                    evalModulename
                  );

              const data =
                await genSpecs.genericApiPost(payload);

              data.body.error
                .should.equal('Bad Request');

              data.body.message
                .should.equal(
                  `body must have required property 'datecolsearch'`
                );
            }
          );


          it(
            `date filter startdate Undefined payload`,
            async function () {

              const payload =
                genSpecs
                  .consolidatedPayload()
                  .payload10(
                    cloneTestbase(),
                    evalModulename
                  );

              const data =
                await genSpecs.genericApiPost(payload);

              data.body.error
                .should.equal('Bad Request');

              data.body.message
                .should.equal(
                  `body must have required property 'datecolsearch'`
                );
            }
          );


          it(
            `date filter enddate Undefined payload`,
            async function () {

              const payload =
                genSpecs
                  .consolidatedPayload()
                  .payload11(
                    cloneTestbase(),
                    evalModulename
                  );

              const data =
                await genSpecs.genericApiPost(payload);

              data.body.error
                .should.equal('Bad Request');

              data.body.message
                .should.equal(
                  `body must have required property 'datecolsearch'`
                );
            }
          );
        }
      );


      // ========================================================
      // PARAMETER VALIDATION
      // ========================================================

      describe(
        '****************Payload Param Validation Test Cases****************',
        function () {

          it(
            `filter with pageSize as NaN payload`,
            async function () {

              const data =
                await genSpecs.genericApiPost(
                  genSpecs
                    .consolidatedPayload()
                    .payload12(
                      cloneTestbase(),
                      evalModulename
                    )
                );

              data.body.message.should.equal(
                `body/pageSize must be >= 1`
              );
            }
          );


          it(
            `filter with pageSize as undefined payload`,
            async function () {

              const data =
                await genSpecs.genericApiPost(
                  genSpecs
                    .consolidatedPayload()
                    .payload13(
                      cloneTestbase(),
                      evalModulename
                    )
                );

              data.body.message.should.equal(
                `body must have required property 'pageSize'`
              );
            }
          );


          it(
            `filter with pageno as undefined payload`,
            async function () {

              const data =
                await genSpecs.genericApiPost(
                  genSpecs
                    .consolidatedPayload()
                    .payload14(
                      cloneTestbase(),
                      evalModulename
                    )
                );

              data.body.message.should.equal(
                `body must have required property 'pageno'`
              );
            }
          );


          it(
            `filter with datecolsearch as NaN payload`,
            async function () {

              const data =
                await genSpecs.genericApiPost(
                  genSpecs
                    .consolidatedPayload()
                    .payload15(
                      cloneTestbase(),
                      evalModulename
                    )
                );

              data.body.message.should.equal(
                `body/datecolsearch must NOT have fewer than 1 characters`
              );
            }
          );


          it(
            `filter with datecolsearch as undefined payload`,
            async function () {

              const data =
                await genSpecs.genericApiPost(
                  genSpecs
                    .consolidatedPayload()
                    .payload16(
                      cloneTestbase(),
                      evalModulename
                    )
                );

              data.body.message.should.equal(
                `body must have required property 'datecolsearch'`
              );
            }
          );


          it(
            `filter with sortcolumn as NaN payload`,
            async function () {

              const data =
                await genSpecs.genericApiPost(
                  genSpecs
                    .consolidatedPayload()
                    .payload24(
                      cloneTestbase(),
                      evalModulename
                    )
                );

              data.body.message.should.equal(
                `body/sortcolumn must NOT have fewer than 1 characters`
              );
            }
          );


          it(
            `filter with sortcolumnorder as NaN payload`,
            async function () {

              const data =
                await genSpecs.genericApiPost(
                  genSpecs
                    .consolidatedPayload()
                    .payload25(
                      cloneTestbase(),
                      evalModulename
                    )
                );

              data.body.message.should.equal(
                `body/sortcolumnorder must NOT have fewer than 1 characters`
              );
            }
          );
        }
      );
    }
  );


  // ==========================================================
  // 7. SORTING VALIDATION
  // ==========================================================

  describe(
  '****************Sorting Validation Test Cases****************',
  function () {
    
    const fields = Object.keys(
      testbase.schemaBaseValidatorPayloadAr[0]
    );

    fields.forEach(function (entry) {

      // ==========================================================
      // ASCENDING
      // ==========================================================

      it(
        `Sorting ${entry} Ascending`,
        async function () {

          const localTestbase =
            structuredClone(testbase);
console.log('localTestbase----', localTestbase);
          const payload =
            genSpecs
              .consolidatedPayload()
              .payload26(
                localTestbase,
                entry,
                evalModulename
              );

          const data =
            await genSpecs.genericApiPost(payload);

          // ------------------------------------------------------
          // Create EXPECTED dataset
          // ------------------------------------------------------

          const expectedData = [
            ...structuredClone(
              testbase.schemaBaseValidatorPayloadAr
            ),
            structuredClone(
              testbase.schemaBaseValidatorPayload
            ),
            structuredClone(testbase.multiControlDataSet)
          ];

          // Sort ONLY the known test dataset
          expectedData.sort(
            genSpecs.sortArBy(
              entry,
              'asc'
            )
          );

          const expected =
            expectedData[0][entry];

          // First record returned by API
          const actual =
            data.body.rows[0][entry];

          // ------------------------------------------------------
          // DEBUG
          // ------------------------------------------------------

          console.log('\n======================================');
          console.log(`ASC SORTING FIELD: ${entry}`);
          console.log('EXPECTED:', expected);
          console.log('ACTUAL:', actual);
          console.log(
            'EXPECTED DATASET:',
            expectedData.map(row => row[entry])
          );
          console.log('expectedData----', testbase.schemaBaseValidatorPayloadAr, testbase.schemaBaseValidatorPayload);
          console.log('======================================\n');

          // ------------------------------------------------------
          // Compare EXPECTED DATASET vs API
          // ------------------------------------------------------

          if (
            !isNaN(Date.parse(expected))
          ) {

            genSpecs
              .expect(
                actual.split('T')[0]
              )
              .to.equal(
                expected.split('T')[0]
              );

          } else {

            genSpecs
              .expect(actual)
              .to.equal(expected);
          }
        }
      );


      // ==========================================================
      // DESCENDING
      // ==========================================================

      it(
        `Sorting ${entry} Descending`,
        async function () {

          const localTestbase =
            structuredClone(testbase);

          const payload =
            genSpecs
              .consolidatedPayload()
              .payload27(
                localTestbase,
                entry,
                evalModulename
              );

          const data =
            await genSpecs.genericApiPost(payload);

          // ------------------------------------------------------
          // Create EXPECTED dataset
          // ------------------------------------------------------

          const expectedData = [
            ...structuredClone(
              testbase.schemaBaseValidatorPayloadAr
            ),
            structuredClone(
              testbase.schemaBaseValidatorPayload
            ),
            structuredClone(testbase.multiControlDataSet)
          ];

          // Sort ONLY the known test dataset
          expectedData.sort(
            genSpecs.sortArBy(
              entry,
              'desc'
            )
          );

          const expected =
            expectedData[0][entry];

          // First record returned by API
          const actual =
            data.body.rows[0][entry];

          // ------------------------------------------------------
          // DEBUG
          // ------------------------------------------------------

          console.log('\n======================================');
          console.log(`DESC SORTING FIELD: ${entry}`);
          console.log('EXPECTED:', expected);
          console.log('ACTUAL:', actual);
          console.log(
            'EXPECTED DATASET:',
            expectedData.map(row => row[entry])
          );
           console.log('expectedData----', testbase.schemaBaseValidatorPayloadAr, testbase.schemaBaseValidatorPayload);
          console.log('======================================\n');

          // ------------------------------------------------------
          // Compare EXPECTED DATASET vs API
          // ------------------------------------------------------

          if (
            !isNaN(Date.parse(expected))
          ) {

            genSpecs
              .expect(
                actual.split('T')[0]
              )
              .to.equal(
                expected.split('T')[0]
              );

          } else {

            genSpecs
              .expect(actual)
              .to.equal(expected);
          }
        }
      );

    });
  }
);


  // ==========================================================
  // 8. SEARCH SINGLE / SINGLE COLUMN
  // ==========================================================

  describe(
    '****************Search Features Single/SingleColumn Test Cases****************',
    function () {

      Object.keys(
        testbase.schemaBaseValidatorPayload
      ).forEach(function (entry) {

        it(
          `Searching for ${entry} and getting expected single recordset`,
          async function () {

            const payload =
              genSpecs
                .consolidatedPayload()
                .payload17(
                  cloneTestbase(),
                  entry,
                  evalModulename,
                  validationConfig
                );

            const data =
              await genSpecs.genericApiPost(payload);

            const expected =
              testbase
                .schemaBaseValidatorPayload[entry];

            const actual =
              data.body.rows[0][entry];


            if (
              genSpecs.customIsNumeric(expected)
            ) {

              genSpecs
                .expect(parseInt(actual))
                .to.equal(parseInt(expected));

            } else {

              const dateField =
                validationConfig
                  .validationmap
                  .filter(
                    o =>
                      o.fieldvalidatename === 'date' &&
                      o.inputname === entry
                  );

              if (dateField.length > 0) {

                genSpecs
                  .expect(
                    new Date(actual)
                      .toLocaleDateString('en-ca')
                  )
                  .to.equal(expected);

              } else {

                genSpecs
                  .expect(actual)
                  .to.equal(expected);
              }
            }
          }
        );
      });
    }
  );


  // ==========================================================
  // 9. SEARCH MULTI / SINGLE COLUMN
  // ==========================================================

  describe(
    '****************Search Features Multi/SingleColumn Test Cases****************',
    function () {

      Object.keys(
        testbase.schemaBaseValidatorPayload
      ).forEach(function (entry) {

        it(
          `Searching ${entry} should return expected multi-record result`,
          async function () {

            const payload =
              genSpecs
                .consolidatedPayload()
                .payload18(
                  cloneTestbase(),
                  entry,
                  evalModulename,
                  validationConfig
                );

            const data =
              await genSpecs.genericApiPost(payload);

            const searchResult =
              data.body.rows || [];


            const firstValue =
              testbase
                .schemaBaseValidatorPayloadAr[0][entry];

            const secondValue =
              testbase
                .schemaBaseValidatorPayloadAr[1][entry];


            const normalizedFirst =
              normalizeSearchValue(firstValue);

            const normalizedSecond =
              normalizeSearchValue(secondValue);


            const firstSet =
              searchResult.filter(
                row =>
                  normalizeSearchValue(row[entry]) ===
                  normalizedFirst
              );


            const secondSet =
              searchResult.filter(
                row =>
                  normalizeSearchValue(row[entry]) ===
                  normalizedSecond
              );


            genSpecs
              .expect(firstSet.length)
              .to.be.gte(1);

            genSpecs
              .expect(secondSet.length)
              .to.be.gte(1);
          }
        );
      });
    }
  );


  // ==========================================================
  // 10. SEARCH MULTI / MULTI COLUMN
  // ==========================================================

  describe(
    '****************Search Features Multi/MultiColumn Test Cases****************',
    function () {

      Object.keys(
        testbase.schemaBaseValidatorPayload
      ).forEach(function (entry) {

        it(
          `Searching ${entry} and getting expected Multi recordset`,
          async function () {

            if (entry === 'recordstate') {
              return;
            }

            const payload =
              genSpecs
                .consolidatedPayload()
                .payload19(
                  cloneTestbase(),
                  entry,
                  evalModulename,
                  validationConfig
                );

            const data =
              await genSpecs.genericApiPost(payload);

            genSpecs
              .expect(
                data.body.rows.length
              )
              .to.be.gte(1);
          }
        );
      });
    }
  );


  // ==========================================================
  // 11. CONSOLIDATED SEARCH
  // ==========================================================

  describe(
    '****************Consolidated ResultSet Search Test Cases****************',
    function () {

      it(
        `Consolidated ResultSet Search working as expected`,
        async function () {

          const payload =
            genSpecs
              .consolidatedPayload()
              .payload20(
                cloneTestbase(),
                evalModulename,
                validationConfig
              );

          const data =
            await genSpecs.genericApiPost(payload);

          genSpecs
            .expect(
              data.body.rows.length
            )
            .to.be.gte(1);
        }
      );
    }
  );


  it(
    `Consolidated ResultSet Search param as undefined working as expected`,
    async function () {

      const payload =
        genSpecs
          .consolidatedPayload()
          .payload21(
            cloneTestbase(),
            evalModulename
          );

      const data =
        await genSpecs.genericApiPost(payload);

      data.body.message
        .should.equal(
          `body must have required property 'basesearcharconsolidated'`
        );
    }
  );


  // ==========================================================
  // 12. UNDEFINED SEARCH PARAMETER VALUES
  // ==========================================================

  describe(
    '****************undefined Searchparam values Test Cases****************',
    function () {

      Object.keys(
        testbase.schemaBaseValidatorPayload
      ).forEach(function (entry) {

        it(
          `evaluating for ${entry} and getting expected custom reject Error`,
          async function () {

            const payload =
              genSpecs
                .consolidatedPayload()
                .payload22(
                  cloneTestbase(),
                  entry,
                  evalModulename,
                  validationConfig
                );

            const data =
              await genSpecs.genericApiPost(payload);


            if (
              data.body.statusCode === undefined
            ) {

              const interim =
                data.body.status.trim();

              interim.should.equal(
                `${entry} is undefined`
              );

            } else {

              data.body.message
                .should.equal(
                  `body/daterange must have required property 'startdate'`
                );
            }
          }
        );
      });
    }
  );


  // ==========================================================
  // 13. UNDEFINED SEARCH PARAMETER KEY
  // ==========================================================

  describe(
    '****************undefined Searchparam Key Test Cases****************',
    function () {

      Object.keys(
        testbase.schemaBaseValidatorPayload
      ).forEach(function (entry) {

        it(
          `evaluating for ${entry} and getting expected custom reject Error`,
          async function () {

            const payload =
              genSpecs
                .consolidatedPayload()
                .payload23(
                  cloneTestbase(),
                  entry,
                  evalModulename,
                  validationConfig
                );

            const data =
              await genSpecs.genericApiPost(payload);


            if (
              data.body.statusCode === undefined &&
              testbase.schemaBaseValidatorPayload[entry] !== undefined
            ) {

              const interim =
                data.body.status.trim();

              interim.should.equal(
                `key of ${testbase.schemaBaseValidatorPayload[entry]} is undefined`
              );

            } else if (
              testbase.schemaBaseValidatorPayload[entry] === undefined
            ) {

              data.body.status
                .should.equal(
                  `key of  is undefined`
                );

            } else {

              data.body.message
                .should.equal(
                  `body/daterange must have required property 'startdate'`
                );
            }
          }
        );
      });
    }
  );


  // ==========================================================
  // 14. PIVOT VALIDATION
  // ==========================================================

  describe(
    '****************undefined Pivot Test Cases****************',
    function () {

      it(
        `filter with XpageSize as undefined payload`,
        async function () {

          const data =
            await genSpecs.genericApiPost(
              genSpecs
                .consolidatedPayload()
                .payload28(
                  cloneTestbase(),
                  evalModulename
                )
            );

          data.body.message
            .should.equal(
              `body must have required property 'XpageSize'`
            );
        }
      );


      it(
        `filter with Xpageno as undefined payload`,
        async function () {

          const data =
            await genSpecs.genericApiPost(
              genSpecs
                .consolidatedPayload()
                .payload29(
                  cloneTestbase(),
                  evalModulename
                )
            );

          data.body.message
            .should.equal(
              `body must have required property 'Xpageno'`
            );
        }
      );


      it(
        `filter with YpageSize as undefined payload`,
        async function () {

          const data =
            await genSpecs.genericApiPost(
              genSpecs
                .consolidatedPayload()
                .payload30(
                  cloneTestbase(),
                  evalModulename
                )
            );

          data.body.message
            .should.equal(
              `body must have required property 'YpageSize'`
            );
        }
      );


      it(
        `filter with Ypageno as undefined payload`,
        async function () {

          const data =
            await genSpecs.genericApiPost(
              genSpecs
                .consolidatedPayload()
                .payload31(
                  cloneTestbase(),
                  evalModulename
                )
            );

          data.body.message
            .should.equal(
              `body must have required property 'Ypageno'`
            );
        }
      );
    }
  );

});