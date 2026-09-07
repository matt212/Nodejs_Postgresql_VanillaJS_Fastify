//var mysql = require('mysql');

/*var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: config.development.username,
    password: config.development.password,
    database: config.development.database
});
*/

//var mysql = require('mysql');
/*var mysql = require('mysql2');
var config = require('./config.json');
var connectionpool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: config.development.username,
    password: config.development.password,
    database: config.development.database,
    multipleStatements: true,
});

exports.getConnection = function(callback) {
    connectionpool.getConnection(callback);
};
*/

const pg = require('pg')
let through2 = require('through2')
var config = require('./config.json')
// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var connectionpool = {
  user: config.development.username, //env var: PGUSER
  database: config.development.database, //env var: PGDATABASE
  password: config.development.password, //env var: PGPASSWORD
  //host: config.development.host, // Server hosting the postgres database
  host: config.development.host, // Server hosting the postgres database
  port: config.development.port, //env var: PGPORT
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  multipleStatementResult: true,
  logging: false
}

//this initializes a connection pool
//it will keep idle connections open for 30 seconds
//and set a limit of maximum 10 idle clients
let pool = new pg.Pool(connectionpool)

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})
pool.on('remove', function (err) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  // console.error('client idle remove **************');
})
//export the query method for passing queries to the pool

const QueryStream = require('pg-query-stream')

module.exports.pgQueryStream = function (sql) {
  return new Promise((resolve, reject) => {
    var all = []
    pool.connect(function (err, client, done) {
      if (err) throw err
      const query = new QueryStream(sql)
      const stream = client.query(query)
      //release the client when the stream is finished
      stream.on('end', done)
      //stream.pipe(JSONStream.stringify()).pipe(process.stdout)

      stream
        .pipe(
          through2.obj({ objectMode: true }, function (chunk, enc, callback) {
            this.push(chunk)
            callback()
          })
        )
        .on('data', function (data) {
          all.push(data)
        })
        .on('end', function () {
          resolve({ rows: all })
        })
    })
  })
}

//pipe 1,000,000 rows to stdout without blowing up your memory usage

module.exports.query = function (sql) {

  return new Promise((resolve, reject) => {

    pool.connect(function (err, client, release) {

      if (err) {
        return reject(err)
      }

      client.query(sql, function (err, result) {

        if (err) {
          console.log(err)
          release(true)
          return reject(err)
        }

        release()
        return resolve(result)

      })
    })
  })
}
module.exports.queryParameterized = function (sql, customvalues) {

  return new Promise((resolve, reject) => {

    pool.connect(function (err, client, release) {

      if (err) {
        return reject(err)
      }

      client.query(sql, customvalues, function (err, result) {

        if (err) {
          console.log(err)
          release(true)
          return reject(err)
        }

        release()
        return resolve(result)

      })
    })
  })
}


// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function (callback) {
  return pool.connect(callback)
}

module.exports.release = function () {
  pool.end()
  pool = new pg.Pool(connectionpool)
  return true
}
const COUNT_CONCURRENCY = 20

let activeCountQueries = 0
const countQueue = []
const countStats = {
  requests: 0,
  errors: 0,
  activeMax: 0,
  queueMax: 0,
  queueWaitTotal: 0,
  dbExecutionTotal: 0,
  totalTimeTotal: 0,
  lastError: null
}
function processCountQueue() {
  while (
    activeCountQueries < COUNT_CONCURRENCY &&
    countQueue.length > 0
  ) {
    const item = countQueue.shift()

    activeCountQueries++

    countStats.requests++

    countStats.activeMax = Math.max(
      countStats.activeMax,
      activeCountQueries
    )

    countStats.queueMax = Math.max(
      countStats.queueMax,
      countQueue.length
    )

    const startedAt = Date.now()

    pool
      .query(item.sql, item.values)
      .then(result => {
        const finishedAt = Date.now()

        const metrics = {
          queueWaitMs: startedAt - item.queuedAt,
          dbExecutionMs: finishedAt - startedAt,
          totalMs: finishedAt - item.queuedAt
        }

        countStats.queueWaitTotal += metrics.queueWaitMs
countStats.dbExecutionTotal += metrics.dbExecutionMs
countStats.totalTimeTotal += metrics.totalMs

        item.resolve({
          result,
          metrics
        })
      })
      .catch(err => {
        countStats.errors++

        countStats.lastError = {
          message: err.message,
          timestamp: new Date().toISOString()
        }

        item.reject(err)
      })
      .finally(() => {
        activeCountQueries--
        processCountQueue()
      })
  }
}
module.exports.getCountStats = function () {
  return countStats
}
module.exports.countParameterized = function (sql, customvalues) {
  return new Promise((resolve, reject) => {

    const queuedAt = Date.now()

    countQueue.push({
      sql: sql,
      values: customvalues,
      resolve: resolve,
      reject: reject,
      queuedAt: queuedAt
    })

    processCountQueue()
  })
}
module.exports.getPoolStats = function () {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
    activeCounts: activeCountQueries,
    queuedCounts: countQueue.length
  }
}


const fs = require('fs')

module.exports.writeCountStats = function () {
  fs.mkdirSync('performance/reports', { recursive: true })
  const stats = module.exports.getCountStats()

  const report = {
    ...stats,
    avgQueueWaitMs: stats.requests
      ? Math.round(stats.queueWaitTotal / stats.requests)
      : 0,
    avgDbExecutionMs: stats.requests
      ? Math.round(stats.dbExecutionTotal / stats.requests)
      : 0,
    avgTotalTimeMs: stats.requests
      ? Math.round(stats.totalTimeTotal / stats.requests)
      : 0
  }

  fs.writeFileSync(
    'performance/reports/count-stats.json',
    JSON.stringify(report, null, 2)
  )
  
}