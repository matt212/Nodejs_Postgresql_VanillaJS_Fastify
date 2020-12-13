const Redis = require('ioredis')
const redisConfig = {
  port: 6379,
  host: '0.0.0.0'
}
const redis = new Redis(redisConfig)

//const redis = require("redis");

let redisDel = key => {
  return new Promise((resolve, reject) => {
    var stream = redis.scanStream({
      // only returns keys following the pattern of "key"
      match: key + '*',
      // returns approximately 100 elements per call
      count: 100
    })

    stream.on('data', function (resultKeys) {
      if (resultKeys.length) {
        redis.del(resultKeys).then(function (dt) {
          resolve()
        })
      }
    })
    stream.on('end', function (resultKeys) {
      resolve()
    })
  })
}

let redisMiddleware = (req, res, next) => {
  let key = '__fastify__' + req.url + JSON.stringify(req.body)

  redis.get(key, function (err, reply) {
    if (reply) {
      //console.log(reply)
      res.send(JSON.parse(reply))
      return
    } else {
      res.sendResponse = res.send
      res.send = body => {
        redis.set(key, JSON.stringify(body))
        redis.expire(key, 100)
        res.sendResponse(body)
      }
      next()
    }
  })
}
let redisCount = (keys, val) => {
  return new Promise((resolve, reject) => {
    redis.get(keys, function (err, reply) {
      if (reply) {
        //console.log(reply)

        resolve({ val: reply, iscache: true })
      } else {
        if (val === true) {
          resolve({ iscache: false })
        } else {
          redis.set(keys, val)
          redis.expire(keys, 9000)
          resolve({ iscache: false })
        }
      }
    })
  })
}
module.exports = { redisCount, redisMiddleware, redisDel }
