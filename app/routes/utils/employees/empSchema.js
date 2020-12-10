const searchLoadbodyJsonSchema = {
  type: 'object',
  required: ['searchparam','daterange','colsearch','datecolsearch','pageSize','pageno'],
  properties: {
    searchparam: { type: 'array' },
    daterange: { type: 'object' },
    colsearch: { type: 'string' },
    datecolsearch: { type: 'string' },
    pageSize: { type: 'number' },
    pageno: { type: 'number' }
  }
}

const insertSchema={
  type: 'object',
  required: ['first_name','last_name','gender','birth_date','recordstate'],
  properties: {
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    gender: { type: 'string',enum: ['M', 'F'] },
    birth_date: { type: 'string' },
    recordstate: { type: 'boolean' },
  }
}
const updateSchema={
  type: 'object',
  required: ['first_name','last_name','gender','birth_date','recordstate','employeesid'],
  properties: {
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    gender: { type: 'string',enum: ['M', 'F'] },
    birth_date: { type: 'string' },
    recordstate: { type: 'boolean' },
    employeesid:{type:'number'}
  }
}
const headersJsonSchema = {
  type: 'object',
  properties: {
    'x-access-token': { type: 'string' }
  },
  required: ['x-access-token']
}

const searchLoadSchema = {
  body: searchLoadbodyJsonSchema,
  headers: headersJsonSchema
}
const insertLoadSchema={
  body: insertSchema,
  headers: headersJsonSchema
}
const updateLoadSchema={
  body: updateSchema,
  headers: headersJsonSchema
}
module.exports = {searchLoadSchema:searchLoadSchema,insertLoadSchema:insertLoadSchema,updateLoadSchema:updateLoadSchema};