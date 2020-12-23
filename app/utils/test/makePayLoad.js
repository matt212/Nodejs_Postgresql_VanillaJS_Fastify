function makeid (length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function validateEmail (email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
function genEmail () {
  var strValues = 'abcdefg12345'
  var strEmail = ''
  var strTmp
  for (var i = 0; i < 10; i++) {
    strTmp = strValues.charAt(Math.round(strValues.length * Math.random()))
    strEmail = strEmail + strTmp
  }
  strTmp = ''
  strEmail = strEmail + '@'
  for (var j = 0; j < 8; j++) {
    strTmp = strValues.charAt(Math.round(strValues.length * Math.random()))
    strEmail = strEmail + strTmp
  }
  strEmail = strEmail + '.com'
  return strEmail
}

function makeEmail () {
  var strValues = 'abcdefgh12345'
  var strEmail = ''
  var strTmp
  for (var i = 0; i < 10; i++) {
    strTmp = strValues.charAt(Math.round(strValues.length * Math.random()))
    strEmail = strEmail + strTmp
  }
  strTmp = ''
  strEmail = strEmail + '@'
  for (var j = 0; j < 8; j++) {
    strTmp = strValues.charAt(Math.round(strValues.length * Math.random()))
    strEmail = strEmail + strTmp
  }
  strEmail = strEmail + '.com'
  return strEmail
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
  //let apply = validationConfig.applyfields
  let apply = validationConfig.validationmap.map(function (doctor) {
    return doctor.inputname
  })
  let validationmap = validationConfig.validationmap
  let interimObj = {}

  apply.forEach(function (entry) {
    let doctors = validationmap.filter(function (doctor) {
      return doctor.inputname == entry // if truthy then keep item
    })[0]

    if (doctors != undefined) {
      if (
        doctors.fieldvalidatename == 'string' ||
        doctors.fieldvalidatename == 'passwordvalidation'
      ) {
        interimObj[doctors.inputname] = makeid(doctors.fieldmaxlength)
      }
      if (doctors.fieldvalidatename == 'number') {
        interimObj[doctors.inputname] = getRandomInt(1, doctors.fieldmaxlength)
      }
      if (doctors.fieldvalidatename == 'mobile') {
        interimObj[doctors.inputname] = Math.round(
          parseInt(makeidnumber(doctors.fieldmaxlength))
        )
      }
      if (doctors.fieldvalidatename == 'email') {
        interimObj[doctors.inputname] = genEmail()
      }
      if (doctors.fieldvalidatename == 'date') {
        interimObj[doctors.inputname] = getCurrentDate()
      }
      interimObj.recordstate = true
    }
  })
  return interimObj
}
let makepayloadControl = function (validationConfig) {
  //let apply = validationConfig.applyfields
  let apply = validationConfig.validationmap.map(function (doctor) {
    return doctor.inputname
  })
  let validationmap = validationConfig.validationmap
  let interimObj = {}

  apply.forEach(function (entry) {
    let doctors = validationmap.filter(function (doctor) {
      return doctor.inputname == entry // if truthy then keep item
    })[0]

    if (doctors != undefined) {
      if (
        doctors.fieldvalidatename == 'string' ||
        doctors.fieldvalidatename == 'passwordvalidation'
      ) {
        interimObj[doctors.inputname] = makeid(doctors.fieldmaxlength)
      }
      if (doctors.fieldvalidatename == 'number') {
        interimObj[doctors.inputname] = getRandomInt(1, doctors.fieldmaxlength)
      }
      if (doctors.fieldvalidatename == 'mobile') {
        interimObj[doctors.inputname] = Math.round(
          parseInt(makeidnumber(doctors.fieldmaxlength))
        )
      }
      if (doctors.fieldvalidatename == 'email') {
        interimObj[doctors.inputname] = genEmail()
      }
      if (doctors.fieldvalidatename == 'date') {
        interimObj[doctors.inputname] = getCurrentDate()
      }
      interimObj.recordstate = true
    }
  })
  return interimObj
}

let makeMaxlenghtpayload = function (interncontent, entry) {
  let interim
  if (
    typeof interncontent[entry] == 'string' ||
    typeof interncontent[entry] == 'boolean'
  ) {
    if (validateEmail(interncontent[entry])) {
      interim = makeid(1000) + interncontent[entry]
    } else {
      interim = interncontent[entry] + 'AA'
    }
  }
  if (typeof interncontent[entry] == 'number') {
    interim = interncontent[entry].toString() + 1000000000000000
    
  }

  return interim
}

module.exports = { makepayload, makeMaxlenghtpayload,makepayloadControl }
