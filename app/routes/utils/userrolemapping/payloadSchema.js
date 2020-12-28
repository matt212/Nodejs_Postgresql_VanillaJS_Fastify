let baseSchema = require('../../utils/misc/baseSchemaConfig')
let insertUpdateSchema = {
  roleid: {
    type: 'integer',
    minimum: 1,
    maximum: 2147483648
  },
  muserid: {
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
  required: ['roleid', 'muserid', 'recordstate'],
  properties: insertUpdateSchema
}
const updateSchema = {
  type: 'object',
  required: ['roleid', 'muserid', 'recordstate', 'userrolemappingid'],
  properties: baseupdatefunction
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
  insertBulkLoadSchema:insertBulkSchema,
  searchGroupbyJsonSchema: baseSchema.searchGroupbyJsonSchema,
  searchPivotJsonSchema: baseSchema.searchPivotJsonSchema
}
