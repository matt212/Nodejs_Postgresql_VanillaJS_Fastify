var baseSchema = require('../../utils/misc/baseSchemaConfig')

const insertSchema = {
  type: 'object',
  required: ['first_name', 'last_name', 'gender', 'birth_date', 'recordstate'],
  properties: {
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
      allOf: baseSchema.commonConfig,
      enum: ['M', 'F']
    },
    birth_date: {
      type: 'string',
      allOf: baseSchema.commonConfig
    },
    recordstate: {
      type: 'boolean'
    }
  }
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
  properties: {
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
      allOf: baseSchema.commonConfig,
      enum: ['M', 'F']
    },
    birth_date: {
      type: 'string',
      allOf: baseSchema.commonConfig
    },
    recordstate: {
      type: 'boolean'
    },
    employeesid: {
      type: 'number',
      allOf: baseSchema.commonConfig
    }
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
