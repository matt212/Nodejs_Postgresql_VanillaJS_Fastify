let getDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const currentTime =
      "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
    return `${year}${month}${day}` + `${currentTime}`;
  };
let pgbaseDump = function () {
    //PGPASSWORD="abc123" pg_dump -h localhost -p 5432 -U postgres demodb > D:\backup.sql

    const fs = require('fs');
    const child_process = require('child_process');
    var spawn_process_cmd = 'PGPASSWORD=abc123  pg_dump -h localhost -p 5432 -U postgres  demodb > ./app/utils/dbDump/backup-'+getDateString()+'.dump'
    child_process.exec(spawn_process_cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            process.exit(1);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        process.exit(0);
    });

    

}
let pgRestore = function () {
    //PGPASSWORD="abc123" pg_dump -h localhost -p 5432 -U postgres demodb > D:\backup.sql

    //pg_dump --dbname=demodb://postgres:password@127.0.0.1:5432/mydatabase
    
    const fs = require('fs');
    const child_process = require('child_process');

    //var spawn_process_cmd = 'PGPASSWORD=abc123  psql -h localhost -p 5432 -U postgres -d demodb -f ./app/utils/dbDump/backup.dump'
    var spawn_process_cmd ='psql "dbname=\'demodb\' user=\'postgres\' password=\'abc123\' host=\'localhost\'"  -f ./app/utils/dbDump/backup.dump'
    child_process.exec(spawn_process_cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            process.exit(1);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        process.exit(0);
    });



}
let pgcreateDb = function () {

// var Promise = require('bluebird');
// var exec = require('child_process').execFile;

// function promiseFromChildProcess(child) {
//     return new Promise(function (resolve, reject) {
//         child.addListener("error", reject);
//         child.addListener("exit", resolve);
//     });
// }

// var child = exec('sh ./app/utils/dbDump/run_sql_commands.sh');

// promiseFromChildProcess(child).then(function (result) {
//     console.log('promise complete: ' + result);
// }, function (err) {
//     console.log('promise rejected: ' + err);
// });

// child.stdout.on('data', function (data) {
//     console.log('stdout: ' + data);
// });
// child.stderr.on('data', function (data) {
//     console.log('stderr: ' + data);
// });
// child.on('close', function (code) {
//     console.log('closing code: ' + code);
// });
    //PGPASSWORD="abc123" pg_dump -h localhost -p 5432 -U postgres demodb > D:\backup.sql

   const fs = require('fs');
  
    const child_process = require('child_process');

    var spawn_process_cmd = 'sh ./app/utils/dbDump/run_sql_commands.sh'
    

    child_process.exec(spawn_process_cmd, (error, stdout, stderr) => {
        
        if (error) {
            console.error(`exec error: ${error}`);
            process.exit(1);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        process.exit(0);
    });



}
let applychangesDB=function()
{
  var models = require("../../models/");
  models.sequelize.sync().then(function () {
    process.exit(0);
  })
}
module.exports = { pgRestore, pgbaseDump, pgcreateDb,applychangesDB }