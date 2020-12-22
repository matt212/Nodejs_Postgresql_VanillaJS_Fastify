let baseSchema = require('../../utils/misc/baseSchemaConfig')
let insertUpdateSchema = {
  accesstype: {
    type: 'string',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 2 }]
  },
  rolename: {
    type: 'integer',
    minimum: 1,
    maximum: 2147483648
  },
  modulename: {
    type: 'integer',
    minimum: 1,
    maximum: 2147483648
  },
  recordstate: {
    type: 'boolean',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 4 }]
  }
}
let baseupdatefunction = {
  insertUpdateSchema,
  mroleid: {
    type: 'integer',
    minimum: 1
  }
}

const insertSchema = {
  type: 'object',
  required: ['rolename', 'modulename', 'accesstype', 'recordstate'],
  properties: insertUpdateSchema
}
const updateSchema = {
  type: 'object',
  required: ['rolename', 'modulename', 'accesstype', 'recordstate', 'mroleid'],
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
