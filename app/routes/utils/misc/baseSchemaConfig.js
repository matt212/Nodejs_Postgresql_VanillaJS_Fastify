let commonConfig = [
  { transform: ['trim'] },
  { minLength: 1 },
  { maxLength: 80 }
]
const searchLoadbodyJsonSchema = {
  type: 'object',
  properties: {
    searchparam: {
      type: 'array',
      allOf: commonConfig
    },
    sortcolumn: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 60 }]
    },
    sortcolumnorder: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 60 }]
    },
    basesearcharconsolidated: {
      type: 'array',
      properties: {
        consolidatecol: {
          type: 'array',
          allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 10 }]
        },
        consolidatecolval: {
          type: 'string',
          allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 10 }]
        }
      },
      required: ['consolidatecol', 'consolidatecolval'],
      allOf: commonConfig
    },
    daterange: {
      type: 'object',
      properties: {
        startdate: {
          type: 'string',
          allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 10 }]
        },
        enddate: {
          type: 'string',
          allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 10 }]
        }
      },
      required: ['startdate', 'enddate'],
      allOf: commonConfig
    },
    datecolsearch: {
      type: 'string',
      allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 20 }]
    },
    pageSize: {
      type: 'integer',
      minimum: 1,
      maximum: 100
    },
    pageno: {
      type: 'integer',
      minimum: 0
    }
  },
  allOf: [
    {
      if: {
        properties: {
          disableDate: {
            enum: [true]
          }
        }
      },
      then: {
        required: ['searchparam', 'pageSize', 'pageno']
      },
      else: {
        required: [
          'searchparam',
          'pageSize',
          'pageno',
          'datecolsearch',
          'daterange'
        ]
      }
    },
    {
      if: {
        properties: {
          searchtype: {
            enum: ['consolidatesearch']
          }
        }
      },
      then: {
        required: [
          'searchparam',
          'pageSize',
          'pageno',
          'basesearcharconsolidated'
        ]
      },
      else: {
        required: ['searchparam', 'pageSize', 'pageno']
      }
    }
  ]
}

const searchPivotbodyJsonSchema = {
  type: 'object',
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
      allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 45 }]
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
    pageSize: {
      type: 'integer',
      minimum: 1,
      maximum: 100
    },
    pageno: {
      type: 'integer',
      minimum: 0
    },
    XpageSize: {
      type: 'integer',
      minimum: 0
    },
    Xpageno: {
      type: 'integer',
      minimum: 0
    },
    YpageSize: {
      type: 'integer',
      minimum: 0
    },
    Ypageno: {
      type: 'integer',
      minimum: 0
    }
  },
  allOf: [
    {
      if: {
        properties: {
          disableDate: {
            enum: [true]
          }
        }
      },
      then: {
        required: [
          'searchparam',
          'pageSize',
          'pageno',
          'pivotparamXaxis',
          'pivotparamYaxis',
          'XpageSize',
          'Xpageno',
          'YpageSize',
          'Ypageno'
        ]
      },
      else: {
        required: [
          'searchparam',
          'pageSize',
          'pageno',
          'datecolsearch',
          'daterange'
        ]
      }
    },
    {
      if: {
        properties: {
          searchtype: {
            enum: ['consolidatesearch']
          }
        }
      },
      then: {
        required: [
          'searchparam',
          'pageSize',
          'pageno',
          'basesearcharconsolidated'
        ]
      },
      else: {
        required: [
          'searchparam',
          'pageSize',
          'pageno',
          'pivotparamXaxis',
          'pivotparamYaxis',
          'XpageSize',
          'Xpageno',
          'YpageSize',
          'Ypageno'
        ]
      }
    }
  ]
}
const searchGroupbybodyJsonSchema = {
  type: 'object',
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
      allOf: [{ transform: ['trim'] }, { minLength: 1 }, { maxLength: 45 }]
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
  },
  allOf: [
    {
      if: {
        properties: {
          disableDate: {
            enum: [true]
          }
        }
      },
      then: {
        required: ['searchparam', 'pageSize', 'pageno']
      },
      else: {
        required: [
          'searchparam',
          'pageSize',
          'pageno',
          'datecolsearch',
          'daterange'
        ]
      }
    },
    {
      if: {
        properties: {
          searchtype: {
            enum: ['consolidatesearch']
          }
        }
      },
      then: {
        required: [
          'searchparam',
          'pageSize',
          'pageno',
          'basesearcharconsolidated'
        ]
      },
      else: {
        required: ['searchparam', 'pageSize', 'pageno']
      }
    }
  ]
  
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
