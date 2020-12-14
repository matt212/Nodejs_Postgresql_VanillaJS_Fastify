let baseSchema = require('../../utils/misc/baseSchemaConfig')
let insertUpdateSchema = {
  first_name: {
    type: 'string',
    allOf: baseSchema.commonConfig
  },
  last_name: {
    type: 'string',
    allOf: baseSchema.commonConfig
  },
  gender: {
    type: 'string',
    allOf:  [{ transform: ['trim'] }, { minLength: 1 },{ maxLength: 2}],
  },
  birth_date: {
    type: 'string',
    allOf: [{ transform: ['trim'] }, { minLength: 1 },{ maxLength: 30}],
    format: 'date-time',
  },
  recordstate: {
    type: 'boolean',
    allOf: [{ transform: ['trim'] }, { minLength: 1 },{ maxLength: 4}]
  }
}
const insertSchema = {
  type: 'object',
  required: ['first_name', 'last_name', 'gender', 'birth_date', 'recordstate'],
  properties: insertUpdateSchema
}
const updateSchema = {
  type: 'object',
  required: [
    'first_name',
    'last_name',
    'gender',
    'birth_date',
    'recordstate',
    'employeesid'
  ],
  properties: insertUpdateSchema,
  employeesid: {
    type: 'number',
    allOf: baseSchema.commonConfig
  }
}

const insertLoadSchema = {
  body: insertSchema,
  headers: baseSchema.headersJsonSchema
}
const updateLoadSchema = {
  body: updateSchema,
  headers: baseSchema.headersJsonSchema
}

module.exports = {
  searchLoadSchema: baseSchema.searchLoadSchema,
  insertLoadSchema: insertLoadSchema,
  updateLoadSchema: updateLoadSchema,
  searchGroupbyJsonSchema: baseSchema.searchGroupbyJsonSchema,
  searchPivotJsonSchema: baseSchema.searchPivotJsonSchema
}
