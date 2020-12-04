yaml = require('js-yaml');
fs = require('fs');
modname = "inventory"
// Get document, or throw exception on error
try {
    fs.readFile('./docs/emp.yaml', 'utf8', function (err, contents) {
        var doc = yaml.safeLoad(contents);


        //let peopleArray = Object.keys(doc).map(i => doc[i])
        let peopleArrayString = JSON.parse(JSON.stringify(doc).replace(/employees/g, modname))
        doc = peopleArrayString
        var red = [ { "type": "string", "fieldname": "name", "example": "sample text" }, { "type": "boolean", "fieldname": "isactive", "example": true }, { "type": "integer", "fieldname": "age", "format": "int64", "example": true }, { "type": "string", "fieldname": "date", "example": "sample text" } ]

        var internObj = red.map(function (doctor) {
            var keyname = doctor.fieldname
            delete doctor.fieldname;
            return {
                [keyname]: doctor
            };
        });



        //convert array to js 

        var newObj = internObj.reduce((a, b) => Object.assign(a, b), {})



        doc.paths = peopleArrayString.paths
        doc.definitions[modname]["properties"] = newObj;

        doc.definitions[modname + "Id"] = peopleArrayString.definitions[modname + "Id"]
        fs.writeFile("./docs/" + modname + ".yaml", yaml.safeDump(doc), function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(data)
            }
        });

    });

} catch (e) {
    console.log(e);
}



