const bodyJsonSchema = {
  type: 'object',
  required: ['searchparam','daterange','colsearch','datecolsearch','pageSize','pageno'],
  properties: {
    searchparam: { type: 'string' },
    daterange: { type: 'object' },
    colsearch: { type: 'string' },
    datecolsearch: { type: 'string' },
    pageSize: { type: 'number' },
    pageno: { type: 'number' }
  }
}
const headersJsonSchema = {
  type: 'object',
  properties: {
    'x-access-token': { type: 'string' }
  },
  required: ['x-access-token']
}

const schema = {
  body: bodyJsonSchema,
  headers: headersJsonSchema
}

module.exports = schema;