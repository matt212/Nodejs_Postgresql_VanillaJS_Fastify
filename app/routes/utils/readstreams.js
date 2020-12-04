const fs = require('fs');
var csv = require("fast-csv");
const models = require('../models');
const path = require('path');
const JSONStream = require('JSONStream');
const Promise = require('bluebird');
const connections = require('../config/db');
const QueryStream = require('pg-query-stream')
const csvSplitStream = require('csv-split-stream');
var through2 = require('through2');
var copyFrom = require('pg-copy-streams').from;


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


var arg = 'employees_0.csv'

var Consolidatefilename = '';



var getapplocation = path.dirname(process.mainModule.filename).replace('routes', '') + "/public/uploadcontent";

var saveTo = path.join(getapplocation, arg);

function getattributesfields() {
    var jsonintern = Object.keys(models.employees.attributes)
    console.log(jsonintern)
    jsonintern.removear('updated_date').removear('created_date').removear('recordstate').removear('employeesid');
    return jsonintern
}

var internobj = {}
internobj.saveTo = saveTo.toString()
internobj.getapplocation = getapplocation.toString()
console.time("dbsave");
function splitcsvs(argument) {

    return new Promise(function(resolve, reject) {
        csvSplitStream.split(
                fs.createReadStream(argument.saveTo), {
                    lineLimit: 100000
                },
                (index) => fs.createWriteStream(argument.getapplocation + `/output-${index}.csv`)
            )
            .then(csvSplitResponse => {
                console.log('csvSplitStream succeeded.', csvSplitResponse);
                argument.totalChunks = csvSplitResponse.totalChunks
                resolve(argument)
                // outputs: {
                //  "totalChunks": 350,
                //  "options": {
                //    "delimiter": "\n",
                //    "lineLimit": "10000"
                //  }
                // }
            }).catch(csvSplitError => {
                console.log('csvSplitStream failed!', csvSplitError);
                reject(csvSplitError)
            });
    })
}
splitcsvs(internobj).then(function(data) {


    datasetar = [...Array(data.totalChunks).keys()];

    Promise.mapSeries(datasetar, dumpdataset).then(function(a) {

        console.log("all process completed!")
        console.timeEnd("dbsave");
    })

})

/*dumpdataset(saveTo).then(function(data) {

    console.log(data)
})*/



function dumpdataset(argument) {
    
    return new Promise(function(resolve, reject) {
        var redlime = new Array()
        /*non chunks*/
        //var streamobj = fs.createReadStream(argument);
        var getapplocation = path.dirname(process.mainModule.filename).replace('routes', '') + "/public/uploadcontent";
        var csvfilepath = getapplocation + '/output-' + argument + '.csv';


        var streamobj = fs.createReadStream(csvfilepath);
        var interval_id = null;
        csv
            .fromStream(streamobj, {
                headers: true
            })

            .on("data", function(data) {

                redlime.push(Object.values(data));


            })
            .on("end", function() {

                streamobj.destroy();
                streamobj.close();
               
                streambulkinsert(redlime)
                    .then(function(a) {

                        fs.unlinkSync(csvfilepath);
                        resolve(a)

                    }).error(function(e) {
                        console.log("**********error")
                        console.log(e)
                        reject(e)
                    });



            })
            .on('error', function(error) {

                console.log(error);
                reject(error)

            });
    })
}





function streambulkinsert(data) {
    return new Promise(function(resolve, reject) {

        connections.connect(function(err, client, done) {
            var sqlcopysyntax = 'COPY employees(' + getattributesfields().toString() + ') FROM STDIN ';


            var stream = client.query(copyFrom(sqlcopysyntax))

            var started = false;
            var internmap = through2.obj(function(arr, enc, cb) {

                var rowText = (started ? '\n' : '') + arr.join('\t');
                started = true;

                cb(null, rowText);
            })

            data.forEach(function(r) {

                internmap.write(r);
            })
            //  stream.end(); 
            internmap.end();



            internmap.pipe(stream)



            stream.on('finish', function() {


            })
            stream.on('error', function(err) {
                console.log(err)
                //stream.close();
                //stream.destroy();

                console.log("here man2")
                reject(0);

            })


            internmap.on('finish', function() {
                // stream.close();

                //internmap.close();
                internmap.destroy();


                // internmap.close();
                done();
                console.log("internmap man2")

                resolve(0);


            })


            internmap.on('error', function(err) {
                internmap.destroy();
                //internmap.close();
                console.log(err)
                reject(0);
            })


        })
    })
}