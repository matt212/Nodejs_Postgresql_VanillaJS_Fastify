const minify = require('@node-minify/core');
const cleanCSS = require('@node-minify/clean-css');
const uglifyES = require('@node-minify/uglify-es');
const htmlMinifier = require('@node-minify/html-minifier');

var promiseCSS = minify({
  compressor: cleanCSS,
  input: ['../../public/vdashboard/dist/css/*.css'],
  output: '../../public-release/release/one.css'
});

var promiseJS = minify({
  compressor: uglifyES,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/admin/js/app/basereporting/*.js'],
  output: '../../public-release/release/consolidated-custom.js'
});

var promiseEmpJS = minify({
  compressor: uglifyES,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/admin/js/app/app_employees.js'],
  output: '../../public-release/admin/js/app/app_employees.js'
});

var promiseHighchartJS = minify({
  compressor: uglifyES,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/vdashboard/plugins/highchart/highcharts.js', '../../public/vdashboard/plugins/highchart/highcharts-3d.js',
    '../../public/vdashboard/plugins/highchart/highcharts-more.js', '../../public/vdashboard/plugins/highchart/exporting.js',
    '../../public/vdashboard/plugins/highchart/export-data.js', '../../public/vdashboard/plugins/highchart/drilldown.js'],
  output: '../../public-release/vdashboard/plugins/highchart/highchart-consolidated.js'
});





var promiseHTMLpaginationrangesection = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/components/paginationrangesection.html'],
  output: '../../public-release/components/paginationrangesection.html'
});



var promiseHTMLheader = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public-release/components/headercontent.html', '../../public/components/loader.html'],
  output: '../../public-release/components/generic-Header.html'
});

var promiseHTMLsidebar = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/components/slidebar.html'],
  output: '../../public-release/components/slidebar.html'
});


var promiseHTMLpiechart = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/components/piechart.html'],
  output: '../../public-release/components/piechart.html'
});


var promiseHTMLbasechart = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/components/basechart.html'],
  output: '../../public-release/components/basechart.html'
});

var promiseHTML3dstack = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/components/3dstack.html'],
  output: '../../public-release/components/3dstack.html'
});

var promiseHTMLpivotradiobutton = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/components/radiobutton.html'],
  output: '../../public-release/components/radiobutton.html'
});
// var promiseHTMLreport = minify({
//   compressor: htmlMinifier ,
//   options: {
//     mangle: true, 
//     output: {}, 
//     compress: true 
//   },
//   input: ['../../public/components/report.html'],
//   output:'../../public-release/components/report.html'
// });


// var promiseHTMLcontrolReportbar = minify({
//   compressor: htmlMinifier ,
//   options: {
//     mangle: true, 
//     output: {}, 
//     compress: true 
//   },
//   input: ['../../public-release/components/controlbar.html'],
//   output:'../../public-release/components/controlReportBar.html'
// });

var promiseHTMLdatepicker = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/components/daterangepicker.html'],
  output: '../../public-release/components/daterangepicker.html'
});


var promiseHTMLmodal = minify({
  compressor: htmlMinifier,
  options: {
    mangle: true, 
    output: {}, 
    compress: true 
  },
  input: ['../../public/components/modal.html'],
  output: '../../public-release/components/modal.html'
});

promiseCSS.then(function (min) {
  console.log("CSS minify done !");
});
promiseJS.then(function (min) {
  console.log("JS minify done !");
});
promiseHTMLheader.then(function (min) {

  console.log("HTMLheader  minify done !");
});
promiseHTMLsidebar.then(function (min) {

  console.log("HTMLsidebar  minify done !");
});

promiseHTMLmodal.then(function (min) {

  console.log("HTMLmodal  minify done !");
});


promiseHTMLdatepicker.then(function (min) {

  console.log("HTMLdatepicker  minify done !");
});
promiseHTMLpiechart.then(function (min) {

  console.log("HTMLpiechart  minify done !");
});
promiseHTMLbasechart.then(function (min) {

  console.log("HTMLbasechart  minify done !");
});
promiseHTML3dstack.then(function (min) {

  console.log("HTML3dstack  minify done !");
});
promiseHTMLpivotradiobutton.then(function (min) {

  console.log("HTMLpivotradiobutton  minify done !");
});
// promiseHTMLreport.then(function(min) {

//   console.log("HTMLreport  minify done !");
// });
// promiseHTMLcontrolReportbar.then(function(min) {

//   console.log("HTMLcontrolReportbar  minify done !");
// });
promiseEmpJS.then(function (min) {

  console.log("EmpJS  minify done !");
});
promiseHighchartJS.then(function (min) {

  console.log("HighchartJS  minify done !");
});
