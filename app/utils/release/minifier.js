const minify = require('@node-minify/core');
const cleanCSS = require('@node-minify/clean-css');

var promise = minify({
  compressor: cleanCSS,
  input: ['../../public/vdashboard/dist/css/*.css'],
  output: '../../public/release/one.css'
});

promise.then(function(min) {
  console.log("minify done !");
});