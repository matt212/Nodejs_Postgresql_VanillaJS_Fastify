const baseSchema = require('../../utils/misc/baseSchemaConfig');

const properties = {
  accesstype: {
    type: 'string',
    transform: ['trim'],
    minLength: 1,
    maxLength: 2
  },

  roleid: {
    type: 'integer',
    minimum: 1,
    maximum: 2147483647
  },

  modnameid: {
    type: 'integer',
    minimum: 1,
    maximum: 2147483647
  },

  recordstate: {
    type: 'boolean'
  }
};

const required = [
  'roleid',
  'modnameid',
  'accesstype',
  'recordstate'
];

const insertSchema = {
  type: 'object',
  properties,
  required
};

const updateSchema = {
  type: 'object',
  properties: {
    ...properties,
    mroleid: {
      type: 'integer',
      minimum: 1,
      maximum: 2147483647
    }
  },
  required: [...required, 'mroleid']
};

const insertBulkSchema = {
  body: {
    type: 'object',
    properties: {
      payset: {
        type: 'array',
        items: insertSchema
      }
    },
    required: ['payset']
  },
  headers: baseSchema.headersJsonSchema
};

module.exports = {
  searchLoadSchema: baseSchema.searchLoadSchema,

  insertLoadSchema: {
    body: insertSchema,
    headers: baseSchema.headersJsonSchema
  },

  updateLoadSchema: {
    body: updateSchema,
    headers: baseSchema.headersJsonSchema
  },

  insertBulkLoadSchema: insertBulkSchema,

  searchGroupbyJsonSchema: baseSchema.searchGroupbyJsonSchema,

  searchPivotJsonSchema: baseSchema.searchPivotJsonSchema
};