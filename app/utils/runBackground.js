var pm2 = require('pm2');

pm2.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.start({
    script: './app.js',         // Script to be run
    exec_mode: 'fork',
    watch: true,        // Allows your app to be clustered
  }, function (err, apps) {
    pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
  });
});
module.exports = pm2;