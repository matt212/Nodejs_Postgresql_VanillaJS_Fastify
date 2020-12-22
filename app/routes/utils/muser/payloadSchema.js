let baseSchema = require('../../utils/misc/baseSchemaConfig')
let insertUpdateSchema = {
  username: {
    type: 'string',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 80 }]
  },
  password: {
    type: 'string',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 80 }]
  },
  email: {
    type: 'string',
    format: 'email',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 80 }]
  },
  recordstate: {
    type: 'boolean',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 4 }]
  }
}
let baseupdatefunction = {
  insertUpdateSchema,
  muserid: {
    type: 'integer',
    minimum: 1
  }
}

const insertSchema = {
  type: 'object',
  required: ['username', 'password', 'email', 'recordstate'],
  properties: insertUpdateSchema
}
const updateSchema = {
  type: 'object',
  required: ['username', 'password', 'email', 'recordstate', 'muserid'],
  properties: baseupdatefunction
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
