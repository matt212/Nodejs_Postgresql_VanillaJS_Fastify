const connections = require('../config/db');
const models = require('../models');
const Promise = require('bluebird');

const QueryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
const Json2csvTransform = require('json2csv').Transform;
const fs = require('fs'); 
/*stream transformation*/





var jsonintern=Object.keys(models.employees.attributes)

jsonintern.remove('updated_date').remove('created_date').remove('recordstate').remove('employeesid');
var internobj={}
internobj.csvfilename='red'
internobj.fieldsdownload=jsonintern
internobj.intersql = 'select '+jsonintern.toString()+' from employees limit 100000 offset 100000';

streamingexportexcel(internobj).then(function(data) {
console.log(data)
});

function streamingexportexcel(internobj)
{

return new Promise(function(resolve, reject) {

const fields = internobj.fieldsdownload;
const opts = { fields };
const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' };
const json2csv = new Json2csvTransform(opts, transformOpts);
const outputPath=__dirname.replace("routes", "/") + '/public/'+internobj.csvfilename+'.csv'
const output = fs.createWriteStream(outputPath, { encoding: 'utf8' });
 
/*end region */

var stream = new QueryStream(internobj.intersql, [], {highWaterMark: 16384})
  stream.on('end', function () {
    // console.log('stream end')
     stream.close();
     stream.destroy();
    resolve("streaming completed")
  })
  connections.query(stream)

 stream.pipe(JSONStream.stringify()).pipe(json2csv).pipe(output)
//pipe 1,000,000 rows to stdout without blowing up your memory usage
//pipe(process.stdout)
})
}