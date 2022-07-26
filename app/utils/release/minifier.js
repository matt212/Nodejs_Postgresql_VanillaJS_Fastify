const minify = require('@node-minify/core');
const cleanCSS = require('@node-minify/clean-css');
const uglifyES = require('@node-minify/uglify-es');

var promiseCSS = minify({
  compressor: cleanCSS,
  input: ['../../public/vdashboard/dist/css/*.css'],
  output: '../../public/release/one.css'
});

var promiseJS = minify({
  compressor: uglifyES ,
  options: {
    mangle: true, // pass false to skip mangling names.
    output: {}, // pass an object if you wish to specify additional output options. The defaults are optimized for best compression.
    compress: true // pass false to skip compressing entirely. Pass an object to specify custom compressor options.
  },
  input: ['../../public/admin/js/app/basereporting/*.js'],
  output: '../../public/release/consolidated-custom.js'
});

promiseCSS.then(function(min) {
  console.log("CSS minify done !");
});
promiseJS.then(function(min) {
  console.log("JS minify done !");
});