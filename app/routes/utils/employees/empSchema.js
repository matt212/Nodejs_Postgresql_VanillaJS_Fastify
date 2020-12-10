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
      allOf: [{ transform: ['trim'] }, { minLength: 1 }],
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    daterange: {
      type: 'object',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    colsearch: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }],
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    datecolsearch: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }],
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    pageSize: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }],
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    pageno: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }],
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
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
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    daterange: {
      type: 'object'
    },
    colsearch: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    datecolsearch: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    pageSize: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    pageno: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    pivotparamXaxis: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    pivotparamYaxis: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    timeinternprimary: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    timeinternsecondary: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    XpageSize: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    Xpageno: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    YpageSize: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    Ypageno: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
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
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    daterange: {
      type: 'object'
    },
    colsearch: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    searchparamkey: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    datecolsearch: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    pageSize: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    pageno: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    searchtype: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    }
  }
}

const insertSchema = {
  type: 'object',
  required: ['first_name', 'last_name', 'gender', 'birth_date', 'recordstate'],
  properties: {
    first_name: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    last_name: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    gender: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }],
      enum: ['M', 'F']
    },
    birth_date: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
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
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    last_name: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    gender: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }],
      enum: ['M', 'F']
    },
    birth_date: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    },
    recordstate: {
      type: 'boolean'
    },
    employeesid: {
      type: 'number',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }]
    }
  }
}
const headersJsonSchema = {
  type: 'object',
  properties: {
    'x-access-token': { type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }] }
  },
  required: ['x-access-token']
}

const searchLoadSchema = {
  body: searchLoadbodyJsonSchema,
  headers: headersJsonSchema
}
const insertLoadSchema = {
  body: insertSchema,
  headers: headersJsonSchema
}
const updateLoadSchema = {
  body: updateSchema,
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
  searchLoadSchema: searchLoadSchema,
  insertLoadSchema: insertLoadSchema,
  updateLoadSchema: updateLoadSchema,
  searchGroupbyJsonSchema: searchGroupbyJsonSchema,
  searchPivotJsonSchema: searchPivotJsonSchema
}
