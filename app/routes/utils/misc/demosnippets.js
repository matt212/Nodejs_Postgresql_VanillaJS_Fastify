/*Api Endpoint for file Upload ,Read, Bulkinsert with Async Promise based condensed codeflow approach equipped with Queue structure
 and progress status provided by Socket.io integration */
router.post('/api/uploadcontent', function(req, res) {

    /*New object and npm module(Busboy) initialized with cryptography conventions */
    let resp = new Object();
    let cryptoname = crypto.randomBytes(16).toString("hex");
    let fil;
    let busboy = new Busboy({
        headers: req.headers
    });
    /* npm module(Busboy) trigger on file event  */
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        /*File save in progress*/
        let getextension = filename.substring(filename.lastIndexOf(".") + 1)
        let Consolidatefilename = cryptoname + "." + getextension;
        let getapplocation = path.dirname(Consolidatefilename) + "/public/uploadcontent";
        fil = Consolidatefilename
        let saveTo = path.join(getapplocation, Consolidatefilename);
        /*File saved using Node.js Streams*/
        file.pipe(fs.createWriteStream(saveTo));
    });
    /* npm module(Busboy)  trigger on finish event  */
    busboy.on('finish', function() {

        /*reinitializing same path base snippets to provide object properties to Queue and socket.io*/
        let getapplocation = path.dirname(process.mainModule.filename) + "/public/uploadcontent";
        let saveTo = path.join(getapplocation, fil);
        /*base refernece object used for socket.io property reference in Queue mechanism  */
        let baseobj = {}
        baseobj.ref = req.app.io
        baseobj.saveTo = saveTo;
        /* initializing Queue mechanism with parameters required processing object and callback event */
        qelastic.push(baseobj, jobcompleted);
        /* client is respond with file upload data processing in progress status in form of json response*/
        var baseresponse = {}
        baseresponse.msg = "file upload data processing in progress"
        res.json(baseresponse)

    });
    /* stream pipeing  npm module(Busboy) */
    return req.pipe(busboy);

});

/*Queue code snippet*/
var qelastic = new Queue(function(objs, cb) {

    /*Promise based condensed code workflow from provided Queue based param */
    dumpdataset(objs).then(function(data) {
        objs.resp = data;
        cb(objs)
    })

})
/* Async Promise  code snippet with resolve and reject mechansim for csv data transformation  */
function dumpdataset(argument) {
    /* initializing  Promise   */
    return new Promise(function(resolve, reject) {
        var interndataset = new Array()
        /* stream based approach to read csv content through npm module(fast-csv) parameter supplied from  Queue object  */
        var stream = fs.createReadStream(argument.saveTo);
        var interval_id = null;

        csv
            .fromStream(stream, {
                headers: true
            })
            /* stream based on data event and pushing resulted object  in interndataset(Array)  */
            .on("data", function(data) {

                interndataset.push(data);
            })
            /* stream based on end event and  dump data unto database through promise based function   */
            .on("end", function() {

                /*  interndataset(Array) passed to database insertion promised based fucntion   */
                datadump(interndataset)
                    .then(function(response) {
                        /*  successful resolve promise state */
                        resolve(response)
                    }).error(function(error) {
                        reject(error)
                    });



            })
            .on('error', function(error) {
                /*  any error while reading csv file with occur in reject promise state  */
                reject(error)

            });
    })
}

/* Async Promise  code snippet with resolve and reject mechansim for bulkinsert of transformed recordset*/
function datadump(data) {

    /* initializing  Promise   */
    return new Promise(function(resolve, reject) {
        models.employees.bulkCreate(data).then(function(response) {
            /*  successful resolve promise state */
            resolve(response);
        }).catch(function(error) {
            /*  any error while bulkinsertion in reject promise state  */
            reject(error);
        });
    })
}

/*Queue callback with socket.io notifcation */
function jobcompleted(argument) {
    /*socket io Object reference from Queue passed lenght total number of recordset bulkinserted */
    argument.ref.emit('news', argument.resp.length);
}