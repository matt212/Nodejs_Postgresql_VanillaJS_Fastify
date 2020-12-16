let commonConfig = [
  { transform: ['trim'] },
  { minLength: 1 },
  { maxLength: 80 }
]
const searchLoadbodyJsonSchema = {
  type: 'object',
  required: [
    'searchparam',
    'daterange',
    'colsearch',
    'datecolsearch',
    'pageSize',
    'pageno'
  ],
  properties: {
    searchparam: {
      type: 'array',
      allOf: commonConfig
    },
    daterange: {
      type: 'object',
      properties: {
        startdate: { type: 'string', format: 'date', minimum: 1 },
        enddate: { type: 'string', format: 'date', minimum: 1 }
      },
      required: ['startdate', 'enddate'],
      allOf: commonConfig
    },
    colsearch: {
      type: 'string',
      allOf: commonConfig
    },
    datecolsearch: {
      type: 'string',
      allOf: commonConfig
    },
    pageSize: {
      type: 'integer',
      minimum: 1,
      maximum: 100
    },
    pageno: {
      type: 'integer',
      minimum: 0,
    }
  }
}

const searchPivotbodyJsonSchema = {
  type: 'object',
  required: [
    'searchparam',
    'daterange',
    'colsearch',
    'datecolsearch',
    'pageSize',
    'pageno',
    'pivotparamXaxis',
    'pivotparamYaxis',
    'timeinternprimary',
    'timeinternsecondary',
    'XpageSize',
    'Xpageno',
    'YpageSize',
    'Ypageno'
  ],
  properties: {
    searchparam: {
      type: 'array',
      allOf: commonConfig
    },
    daterange: {
      type: 'object'
    },
    colsearch: {
      type: 'string',
      allOf: commonConfig
    },
    datecolsearch: {
      type: 'string',
      allOf: commonConfig
    },
    pageSize: {
      type: 'number',
      allOf: commonConfig
    },
    pageno: {
      type: 'number',
      allOf: commonConfig
    },
    pivotparamXaxis: {
      type: 'string',
      allOf: commonConfig
    },
    pivotparamYaxis: {
      type: 'string',
      allOf: commonConfig
    },
    timeinternprimary: {
      type: 'string'
    },
    timeinternsecondary: {
      type: 'string'
    },
    XpageSize: {
      type: 'number',
      allOf: commonConfig
    },
    Xpageno: {
      type: 'number',
      allOf: commonConfig
    },
    YpageSize: {
      type: 'number',
      allOf: commonConfig
    },
    Ypageno: {
      type: 'number',
      allOf: commonConfig
    }
  }
}
const searchGroupbybodyJsonSchema = {
  type: 'object',
  required: [
    'searchparam',
    'daterange',
    'colsearch',
    'datecolsearch',
    'pageSize',
    'pageno',
    'searchparamkey',
    'searchtype'
  ],
  properties: {
    searchparam: {
      type: 'array',
      allOf: commonConfig
    },
    daterange: {
      type: 'object'
    },
    colsearch: {
      type: 'string',
      allOf: commonConfig
    },
    searchparamkey: {
      type: 'string',
      allOf: commonConfig
    },
    datecolsearch: {
      type: 'string',
      allOf: commonConfig
    },
    pageSize: {
      type: 'number',
      allOf: commonConfig
    },
    pageno: {
      type: 'number',
      allOf: commonConfig
    },
    searchtype: {
      type: 'string',
      allOf: commonConfig
    }
  }
}
const headersJsonSchema = {
  type: 'object',
  properties: {
    'x-access-token': {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    }
  },
  required: ['x-access-token']
}
const insertSchema = {
  type: 'object',
  required: ['first_name', 'last_name', 'gender', 'birth_date', 'recordstate'],
  properties: {
    first_name: {
      type: 'string',
      allOf: commonConfig
    },
    last_name: {
      type: 'string',
      allOf: commonConfig
    },
    gender: {
      type: 'string',
      allOf: commonConfig,
      enum: ['M', 'F']
    },
    birth_date: {
      type: 'string',
      allOf: commonConfig
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
      allOf: commonConfig
    },
    last_name: {
      type: 'string',
      allOf: commonConfig
    },
    gender: {
      type: 'string',
      allOf: commonConfig,
      enum: ['M', 'F']
    },
    birth_date: {
      type: 'string',
      allOf: commonConfig
    },
    recordstate: {
      type: 'boolean'
    },
    employeesid: {
      type: 'number',
      allOf: commonConfig
    }
  }
}

const searchLoadSchema = {
  body: searchLoadbodyJsonSchema,
  headers: headersJsonSchema
}
const searchGroupbyJsonSchema = {
  body: searchGroupbybodyJsonSchema,
  headers: headersJsonSchema
}
const searchPivotJsonSchema = {
  body: searchPivotbodyJsonSchema,
  headers: headersJsonSchema
}

module.exports = {
  commonConfig: commonConfig,
  searchLoadSchema: searchLoadSchema,
  searchGroupbyJsonSchema: searchGroupbyJsonSchema,
  searchPivotJsonSchema: searchPivotJsonSchema
}
