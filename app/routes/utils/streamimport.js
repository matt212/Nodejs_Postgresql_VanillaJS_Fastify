var fs = require('fs');
const Promise = require('bluebird');
const connections = require('../config/db');
var copyFrom = require('pg-copy-streams').from;
const models = require('../models');
const path = require('path');


var arg = 'employees_0.csv'

var Consolidatefilename = '';



var getapplocation = path.dirname(process.mainModule.filename).replace('routes', '') + "/public/uploadcontent";

var saveTo = path.join(getapplocation, arg);
console.time("dbsave");

 streambulkinsert(saveTo)
                    .then(function(a) {
                    	console.log(a);
                    })

function directstreambulkinsert(saveTo) {
    return new Promise(function(resolve, reject) {

        connections.connect(function(err, client, done) {

console.log(getattributesfields().toString())
            var sqlcopysyntax = 'COPY employees(' + getattributesfields().toString() + ') FROM STDIN WITH (FORMAT CSV, HEADER,  DELIMITER \',\') ';
            var stream = client.query(copyFrom(sqlcopysyntax))
             console.log(saveTo)
            var fileStream = fs.createReadStream(saveTo)
            fileStream.on('error', function(data)
            	{
            		console.log(data)
            	});
            fileStream.pipe(stream).on('finish', function()
            	{
            		done();
            		resolve("finish streaming ")
            		console.timeEnd("dbsave");
            		//stream.destroy()
            		
            		//fileStream.destroy()
            	}).on('error', function(data)
            	{
            		console.log(data)
            		
            		//stream.destroy()
            		
            		//fileStream.destroy()
            	});
        });


    })
}



function getattributesfields() {
    var jsonintern = Object.keys(models.employees.attributes)
    console.log(jsonintern)
    jsonintern.removear('updated_date').removear('created_date').removear('recordstate').removear('employeesid');
    return jsonintern
}
Array.prototype.removear = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};