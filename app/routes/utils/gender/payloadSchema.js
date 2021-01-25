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
  genderid: {
    type: 'integer',
    minimum: 1
  }
}

const insertSchema = {
  type: 'object',
  required: [
    "name",
    "recordstate"
  ],
  properties: insertUpdateSchema
}
const updateSchema = {
  type: 'object',
  required: [
    "name",
    "recordstate",
    "genderid"
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
  searchGroupbyJsonSchema: baseSchema.searchGroupbyJsonSchema,
  searchPivotJsonSchema: baseSchema.searchPivotJsonSchema
}