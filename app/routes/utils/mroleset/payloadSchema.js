let baseSchema = require('../../utils/misc/baseSchemaConfig')
let insertUpdateSchema = {
  name: {
    type: 'string',
    allOf: [{
      transform: ['trim']
    }, {
      minLength: 1
    }, {
      maxLength: 80
    }]
  },
  genderid: {
    type: 'integer',
    minimum: 1,
    maximum: 2147483648
  },
  roleid: {
    type: 'integer',
    minimum: 1,
    maximum: 2147483648
  },
  modnameid: {
    type: 'integer',
    minimum: 1,
    maximum: 2147483648
  },
  recordstate: {
    type: 'boolean',
    allOf: [{
      transform: ['trim']
    }, {
      minLength: 1
    }, {
      maxLength: 4
    }]
  }
}
let baseupdatefunction = {
  insertUpdateSchema,
  mrolesetid: {
    type: 'integer',
    minimum: 1
  }
}
let insertUpdateBulkSchema = {
  payset: {
    type: 'array',
    items: insertUpdateSchema
  }
}
const insertBulkSchema = {
  body: insertUpdateBulkSchema,
  headers: baseSchema.headersJsonSchema
}
const insertSchema = {
  type: 'object',
  required: [
    "name",
    "genderid",
    "roleid",
    "modnameid",
    "recordstate"
  ],
  properties: insertUpdateSchema
}
const updateSchema = {
  type: 'object',
  required: [
    "name",
    "genderid",
    "roleid",
    "modnameid",
    "recordstate",
    "mrolesetid"
  ],
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
  insertBulkLoadSchema: insertBulkSchema,
  searchGroupbyJsonSchema: baseSchema.searchGroupbyJsonSchema,
  searchPivotJsonSchema: baseSchema.searchPivotJsonSchema
}