let selectArr = []
let basesearchobj = {}
let basesearchar = new Array()
let basesearcharconsolidated = new Array()

let basedataset = {}
let base = {
  appkey: location.hostname + (location.port ? ':' + location.port : ''),
  config: {
    headers: {
      'x-access-token': customToken
    }
  },
  timeinternprimary: 'Month',
  timeinternsecondary: 'Month',
  XpageSize: 40,
  Xpageno: 0,
  YpageSize: 20,
  Ypageno: 0,
  pivotinternload: true,
  searchtype: 'NoFilter',
  //for Muti control access data for EDIT AND update across use interimdatapayload child object of base
  interimdatapayload: {}
}
let ajaxurl = {
  auth: '/getToken'
}

let ajaxbase = {
  postauth: base.config
}