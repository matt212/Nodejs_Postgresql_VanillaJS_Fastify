let baseSchema = require('../../utils/misc/baseSchemaConfig')
let insertUpdateSchema = {
  placeholder1
  recordstate: {
    type: 'boolean',
    allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 4 }]
  }
}
let baseupdatefunction = {
  insertUpdateSchema,
  placeholder4: {
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
  required: placeholder2,
  properties: insertUpdateSchema
}
const updateSchema = {
  type: 'object',
  required: placeholder3,
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
  insertBulkLoadSchema:insertBulkSchema,
  searchGroupbyJsonSchema: baseSchema.searchGroupbyJsonSchema,
  searchPivotJsonSchema: baseSchema.searchPivotJsonSchema
}
