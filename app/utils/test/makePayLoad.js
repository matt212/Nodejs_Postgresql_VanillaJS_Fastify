function makeid (length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
function makeidnumber (length) {
  var result = ''
  var characters = '0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
function getCurrentDate () {
  var now = new Date()

  var redlime = now.toISOString()
  return redlime
}

let makepayload = function (validationConfig) {
  let apply = validationConfig.applyfields
  let validationmap = validationConfig.validationmap
  let interimObj = {}

  apply.forEach(function (entry) {
    let doctors = validationmap.filter(function (doctor) {
      return doctor.inputname == entry // if truthy then keep item
    })[0]

    if (doctors != undefined) {
      if (doctors.fieldtypename == 'STRING') {
        interimObj[doctors.inputname] = makeid(doctors.fieldmaxlength)
      }
      if (
        doctors.fieldtypename == 'INTEGER' ||
        doctors.fieldtypename == 'BIGINT'
      ) {
        interimObj[doctors.inputname] = makeidnumber(doctors.fieldmaxlength)
      }
      if (doctors.fieldtypename == 'DATE') {
        interimObj[doctors.inputname] = getCurrentDate()
      }
      interimObj.recordstate = true
    }
  })
  return interimObj
}
module.exports = { makepayload }
