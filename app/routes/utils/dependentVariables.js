const express = require("express");
let models = require("../../models");
let sqlConstruct = require("./sqlConstruct");
let connections = require("../../config/db");
let authfunctions = require("../auth/authpage");
let cacheMiddleware = require("../utils/memcache");
let redisMiddleware = require("../utils/redisMemcache");
let Promises = require("bluebird");
let crypto = require("crypto");
let Queue = require("better-queue");
let copyFrom = require("pg-copy-streams").from;
/*let json2xls = require('json2xls');*/
let async = require("async").parallel;

(fs = require("fs")), (path = require("path"));

let mod = {};

let assignVariables = modObj => {
  mod = modObj;
};

let searchparampayload = req => {
  let SqlString = require("sqlstring");
  let base = {};
  promise = new Promise((resolve, reject) => {
    let reqcontent =
      req.rawBody != undefined ? JSON.parse(req.rawBody) : req.body;

    //let reqcontent=JSON.parse(req.rawBody)

    var searchparam = reqcontent.searchparam;
    var columns = reqcontent.colsearch;
    var number_of_items = reqcontent.pageno;
    var pageSize = reqcontent.pageSize;
    var ispaginate = reqcontent.ispaginate;
    var datecolsearch = reqcontent.datecolsearch;
    var consolidatesearchparam = reqcontent.basesearcharconsolidated;
    var consolidatesearch = "";
    var startdate;
    var enddate;
    if (req.body.daterange != undefined) {
      startdate = reqcontent.daterange.startdate + " 00:00:00";
      enddate = reqcontent.daterange.enddate + "  24:00:00";
    }
    var searchtype = reqcontent.searchtype;
    var sortcolumn = reqcontent.sortcolumn;
    var sortcolumnorder = reqcontent.sortcolumnorder;

    var daterange = "1=1";
    if (startdate != undefined && enddate != undefined) {
      //daterange = "DATE(a.createdAt) between (\'" + startdate + "\') and (\'" + enddate + "\')  ";
      daterange =
        "" +
        "a." +
        datecolsearch +
        " >= '" +
        startdate +
        "' AND " +
        "a." +
        datecolsearch +
        " <='" +
        enddate +
        "'";
    }

    if (
      reqcontent.sortcolumnorder == undefined &&
      reqcontent.sortcolumn == undefined
    ) {
      sortcolumn = mod.id;
      sortcolumnorder = "desc";
    }
    if (req.body.sortcolumn == 1) {
      sortcolumn = mod.id;
    }

    var selector = "";
    var consolidatesearchparams = "";
    if (searchtype == "Columnwise") {
      if (searchparam.constructor === Array) {
        var interns = searchparam;

        interns.forEach((item, index) => {
          //console.log(item[Object.keys(item)]+"--"+Object.keys(item))
          var searchvalue = item[Object.keys(item)[0]];
          var searchkey = Object.keys(item)[0];
          var isBaseArray= item.isArray 
          
          //var result = (typeof searchvalue === 'number');

          var coltype = "";
          var stringtype = "";
          if (!searchvalue.some(isNaN)) {
            coltype = "";
            stringtype = "";
          } else {
            coltype = "lower";
            stringtype = "'";
          }

          
          if (selector == "") {
            
            if (isBaseArray) {
              console.log("arrays")
              console.log(searchvalue)
              //ARRAY[5,7] && modnameid;
              selector =
                "and ARRAY [" +
                SqlString.format(searchvalue) +
                "] && " +
                "" +
                SqlString.format(searchkey) +
                "";
              console.log(selector)

            }
            else {
              console.log("here")
              //selector = "and " + SqlString.format(searchkey) + " LIKE " + "'%" + SqlString.format(searchvalue) + "%'";
              selector =
                "and " +
                coltype +
                "(a." +
                SqlString.format(searchkey) +
                ") IN " +
                "(" +
                stringtype +
                SqlString.format(
                  searchvalue.join("" + stringtype + "," + stringtype + "")
                ) +
                "" +
                stringtype +
                ")";
              consolidatesearchparams =
                "(" + SqlString.format(searchvalue).join(" & ") + ")";
            }

          } else {
            consolidatesearchparams =
              consolidatesearchparams + " & " + SqlString.format(searchvalue);
            //selector = selector + " and  " + SqlString.format(searchkey) + " LIKE " + "'%" + SqlString.format(searchvalue) + "%'";
            if (isBaseArray) {
              console.log("arrays")
              console.log(searchvalue)
              //ARRAY[5,7] && modnameid;
              selector = selector +
                "and  ARRAY [" +
                SqlString.format(searchvalue) +
                "] && " +
                "" +
                SqlString.format(searchkey) +
                "";

            }
            else {
              selector =
                selector +
                " and  " +
                coltype +
                "(a." +
                SqlString.format(searchkey) +
                ") IN " +
                "(" +
                stringtype +
                SqlString.format(
                  searchvalue.join("" + stringtype + "," + stringtype + "")
                ) +
                "" +
                stringtype +
                ")";
            }

          }

          // finale.push(obj)
        });
      }
      /*comment this for legacy search !*/
      /* selector = "";
             console.log(consolidatesearchparams)
             consolidatesearch = 'and weighted_tsv @@ to_tsquery(\'' + consolidatesearchparams + '\')'*/
      /*end region*/
    } else if (searchtype == "consolidatesearch") {
      //*traditional search*//
      consolidatesearch =
        "and " +
        consolidatesearchparam[0].consolidatecol.join("||' '||") +
        " LIKE '%" +
        consolidatesearchparam[0].consolidatecolval +
        "%'";
      /*without vector column*/
      //consolidatesearch='and to_tsvector("'+consolidatesearchparam[0].consolidatecol.join("\"||' '||\"")+'") @@ to_tsquery(\''+consolidatesearchparam[0].consolidatecolval+'\:\*\')'
      /*with vector column*/
      //consolidatesearch='and weighted_tsv @@ to_tsquery(\''+consolidatesearchparam[0].consolidatecolval+'\:\*\')'
    }
    var next_offset = pageSize * number_of_items;

    base.daterange = daterange;
    base.selector = selector;
    base.sortcolumn = sortcolumn;
    base.sortcolumnorder = sortcolumnorder;
    base.pageSize = pageSize;
    base.next_offset = next_offset;
    base.ispaginate = ispaginate;
    base.searchtype = searchtype;
    base.consolidatesearch = consolidatesearch;
    
    console.log(base.selector)
    resolve(base);
  });
  return promise.catch(function (error) {
    throw (error);
  });
};
let pivottransformation = dataset => {
  let internbase = {};
  ("use strict");
  return new Promise((resolve, reject) => {
    var doctors = dataset;
    //refractor subtotal
    var totaldoc = doctors
      .filter(o => {
        return o.yaxis.indexOf("|") != -1;
      })
      .map(doctor => {
        return {
          axis: doctor.xaxis,
          totalcnt: doctor.cnt
        };
      });
    //flatten subtotal

    internbase.totaldoc = totaldoc;

    //remove subtotal
    var doctors = doctors.filter(o => {
      return o.yaxis.indexOf("|") == -1;
    });
    var doctors = doctors.filter(o => {
      return o.yaxis.indexOf("Subtotal") == -1;
    });

    let unique = [...new Set(doctors.map(item => item.yaxis))];

    var internset = [];

    for (var attributename in unique) {
      var foundItem = doctors.filter(
        item => item.yaxis == unique[attributename]
      );
      // console.log(foundItem);
      var foundItems = foundItem.map(doctor => {
        var o = {};
        o[doctor.xaxis] = doctor.cnt;
        return o;
      });

      var rightwingfoundItem = _.extend.apply(_, foundItems);
      rightwingfoundItem.base = unique[attributename];

      internset.push(rightwingfoundItem);
    }

    resolve(internset);
  });
};
let datadump = data => {
  return new Promise((resolve, reject) => {
    models[mod.Name]
      .bulkCreate(data)
      .then(response => {
        //res.redirect('/users');
        /* var resp = new Object();
             resp.par =response;*/
        resolve(response);
      })
      .catch(error => {
        reject(0);
      });
  });
};

let dumpdataset = argument => {
  var csv = require("fast-csv");
  return new Promise((resolve, reject) => {
    var redlime = new Array();
    var streamobj = fs.createReadStream(argument.saveTo);
    var interval_id = null;
    csv
      .fromStream(streamobj, {
        headers: true
      })

      .on("data", data => {
        redlime.push(Object.values(data));
      })
      .on("end", () => {
        streamobj.destroy();
        streamobj.close();

        streambulkinsert(redlime)
          // datadump(redlime)
          .then(a => {
            redlime.length = 0;
            resolve(a);
          })
          .error(e => { });
      })
      .on("error", error => {
        console.log(error);
        resp.status = error;
        res.json(resp);
      });
  });
};
let getattributesfields = () => {
  var jsonintern = Object.keys(models[mod.Name].tableAttributes);

  jsonintern
    .removear("updated_date")
    .removear("created_date")
    .removear("recordstate")
    .removear(mod.id);
  return jsonintern;
};

let streambulkinsert = data => {
  let through2 = require("through2");
  let copyFrom = require("pg-copy-streams").from;
  var totalcount = data.length;
  return new Promise((resolve, reject) => {
    connections.connect((err, client, done) => {
      var sqlcopysyntax =
        "COPY " +
        mod.Name +
        "(" +
        getattributesfields().toString() +
        ") FROM STDIN ";

      var stream = client.query(copyFrom(sqlcopysyntax));

      var started = false;
      var internmap = through2.obj((arr, enc, cb) => {
        var rowText = (started ? "\n" : "") + arr.join("\t");
        started = true;

        cb(null, rowText);
      });

      data.forEach(r => {
        internmap.write(r);
      });
      //  stream.end();
      internmap.end();

      internmap.pipe(stream);

      stream.on("finish", () => {
        data.length = 0;
      });
      stream.on("error", err => {
        //stream.close();
        //stream.destroy();

        reject(0);
      });

      internmap.on("finish", () => {
        // stream.close();

        //internmap.close();
        internmap.destroy();
        data.length = 0;
        done();
        // internmap.close();

        resolve(totalcount);
      });

      internmap.on("error", err => {
        internmap.destroy();
        //internmap.close();

        reject(0);
      });
    });
  });
};

let paramsSearchTypeGroupBy = req => {
  let SqlString = require("sqlstring");
  var searchparam = req.body.searchparam;
  var searchparammetafilter = req.body.searchparammetafilter;
  var searchparamkey = req.body.searchparamkey;
  var columns = req.body.colsearch;
  var number_of_items = req.body.pageno;
  var pageSize = req.body.pageSize;
  var startdate;
  var enddate;
  if (req.body.daterange != undefined) {
    startdate = req.body.daterange.startdate + " 00:00:00";
    enddate = req.body.daterange.enddate + "  24:00:00";
  }
  var searchtype = req.body.searchtype;
  var sortcolumn = req.body.sortcolumn;
  var sortcolumnorder = req.body.sortcolumnorder;
  var datecolsearch = req.body.datecolsearch;

  /*console.log(searchparam);
  console.log(columns);
  console.log(number_of_items)
  console.log(pageSize)
  console.log(startdate)
  console.log(enddate)*/
  var daterange = "1=1";
  if (startdate != undefined && enddate != undefined) {
    //daterange = "DATE(a.createdAt) between (\'" + startdate + "\') and (\'" + enddate + "\')  ";
    //daterange = "created_at >= '" + startdate + "' AND created_at <='" + enddate + "'";
    daterange =
      "" +
      datecolsearch +
      " >= '" +
      startdate +
      "' AND " +
      datecolsearch +
      " <= '" +
      enddate +
      "'";
  }

  if (
    req.body.sortcolumnorder == undefined &&
    req.body.sortcolumn == undefined
  ) {
    sortcolumn = mod.id;
    sortcolumnorder = "desc";
  }
  if (req.body.sortcolumn == 1) {
    sortcolumn = mod.id;
  }
  /*    console.log(columns);
  console.log(words);*/

  //emp_no, '', salary
  var selector = "";
  var colmetafilter = "";
  var searchkey;
  if (searchtype == "Columnwise") {
    if (searchparam.constructor === Array) {
      var interns = searchparam;
      var internsearchparammetafilter = searchparammetafilter;

      interns.forEach((item, index) => {
        //console.log(item[Object.keys(item)]+"--"+Object.keys(item))
        var searchvalue = item[Object.keys(item)];
        searchkey = Object.keys(item)[0];
        var coltype = "";
        var stringtype = "";
        var stringCasting="";
        console.log(searchvalue);
        if(isNaN(searchvalue))
        {
          coltype = "lower";
          stringtype = "'";
        }
        else
        {
          coltype = "";
          stringtype = "";
          stringCasting=" ::TEXT"
        }
        
        var obj;
        if (selector == "") {
          
          if (searchvalue.constructor === Array) {
            console.log("arrays")
            console.log(searchvalue)
            //ARRAY[5,7] && modnameid;
            selector =
              "ARRAY [" +
              SqlString.format(searchvalue) +
              "] && " +
              "" +
              SqlString.format(searchkey) +
              "";

          }
          else
          {
            selector =
            `${coltype}( ` +
            SqlString.format(searchkey) +`${stringCasting}`+
            " ) LIKE " +
            "'" +
            SqlString.format(searchvalue) +
            "%'";
          }
        } else {
          if (searchvalue.constructor === Array) {
            console.log("arrays")
            console.log(searchvalue)
            //ARRAY[5,7] && modnameid;
            selector = selector +
              "ARRAY [" +
              SqlString.format(searchvalue) +
              "] && " +
              "" +
              SqlString.format(searchkey) +
              "";
            console.log(selector)

          }
          else
          {
            selector =
            selector +
            `${coltype}(` +
            SqlString.format(searchkey) +`${stringCasting}`+
            ") LIKE " +
            "'" +
            SqlString.format(searchvalue) +
            "%'";
          }
          
        }

        // finale.push(obj)
      });
      //remove `!` to include multi column filter for each other !
      if (Object.keys(internsearchparammetafilter).length > 0) {
        internsearchparammetafilter.forEach((item, index) => {
          //console.log(item[Object.keys(item)]+"--"+Object.keys(item))
          var searchvalue = item[Object.keys(item)];
          var searchkey = Object.keys(item)[0];

          var coltype = "";
          var stringtype = "";
          if (!searchvalue.some(isNaN)) {
            coltype = "";
            stringtype = "";
          } else {
            coltype = "lower";
            stringtype = "'";
          }

          var obj;
          if (selector == "") {
            colmetafilter =
              "and " +
              coltype +
              "(a." +
              SqlString.format(searchkey) +
              ") IN " +
              "(" +
              stringtype +
              SqlString.format(
                searchvalue.join("" + stringtype + "," + stringtype + "")
              ) +
              "" +
              stringtype +
              ")";
          } else {
            colmetafilter =
              colmetafilter +
              " and  " +
              coltype +
              "(" +
              SqlString.format(searchkey) +
              ") IN " +
              "(" +
              stringtype +
              SqlString.format(
                searchvalue.join("" + stringtype + "," + stringtype + "")
              ) +
              "" +
              stringtype +
              ")";
          }

          // finale.push(obj)
        });
      }
    }
  } else if (searchtype == "consolidatesearch") {
    //*traditional search*//
    consolidatesearch =
      "and " +
      consolidatesearchparam[0].consolidatecol.join("||' '||") +
      " LIKE '%" +
      consolidatesearchparam[0].consolidatecolval +
      "%'";
    /*without vector column*/
    //consolidatesearch='and to_tsvector("'+consolidatesearchparam[0].consolidatecol.join("\"||' '||\"")+'") @@ to_tsquery(\''+consolidatesearchparam[0].consolidatecolval+'\:\*\')'
    /*with vector column*/
    //consolidatesearch='and weighted_tsv @@ to_tsquery(\''+consolidatesearchparam[0].consolidatecolval+'\:\*\')'
  }
  return {
    searchkey: searchkey,
    selector: selector,
    colmetafilter: colmetafilter,
    sortcolumnorder: sortcolumnorder,
    searchparamkey: searchparamkey
  };
};
let pivotTransform = req => {
  let SqlString = require("sqlstring");
  var searchparam = req.body.searchparam;
  var columns = req.body.colsearch;
  var Xnumber_of_items = req.body.Xpageno;
  var XpageSize = req.body.XpageSize;
  var Ynumber_of_items = req.body.Ypageno;
  var YpageSize = req.body.YpageSize;
  var Ynext_offset = YpageSize * Ynumber_of_items;
  var Xnext_offset = XpageSize * Xnumber_of_items;
  var datecolsearch = req.body.datecolsearch;
  var consolidatesearchparam = req.body.basesearcharconsolidated;

  var pivotparamYaxis;
  var pivotparamXaxis;
  var consolidatesearch = "";
  var consolidatesearchdynamic = "";
  var timeinternprimary = "";
  var timeinternsecondary = "";
  var baseYaxisparam = "";
  var baseXaxisparam = "";
  var baseXaxisparamprimary = "";
  var baseYaxisparamprimary = "";
  if (
    req.body.pivotparamXaxis != undefined &&
    req.body.pivotparamYaxis != undefined
  ) {
    pivotparamYaxis = req.body.pivotparamYaxis;
    pivotparamXaxis = req.body.pivotparamXaxis;
  }
  if (
    req.body.timeinternprimary != undefined &&
    req.body.timeinternprimary != ""
  ) {
    timeinternprimary = req.body.timeinternprimary;
    baseYaxisparam =
      "to_char(" +
      pivotparamYaxis +
      " ,''" +
      timeinternprimary +
      "'') as Yaxis";
    baseYaxisparamprimary =
      "to_char(" + pivotparamYaxis + " ,'" + timeinternprimary + "') as Yaxis";
  } else {
    baseYaxisparam = pivotparamYaxis + " as Yaxis";
    baseYaxisparamprimary = baseYaxisparam;
  }
  if (
    req.body.timeinternsecondary != undefined &&
    req.body.timeinternsecondary != ""
  ) {
    timeinternsecondary = req.body.timeinternsecondary;
    baseXaxisparam =
      "to_char(" +
      pivotparamXaxis +
      " ,''" +
      timeinternsecondary +
      "'') as Xaxis";
    baseXaxisparamprimary =
      "to_char(" +
      pivotparamXaxis +
      " ,'" +
      timeinternsecondary +
      "') as Xaxis";
  } else {
    baseXaxisparam = pivotparamXaxis + " as Xaxis";
    baseXaxisparamprimary = baseXaxisparam;
  }

  var startdate;
  var enddate;
  if (req.body.daterange != undefined) {
    startdate = req.body.daterange.startdate + " 00:00:00";
    enddate = req.body.daterange.enddate + "  24:00:00";
  }
  var searchtype = req.body.searchtype;
  var sortcolumn = req.body.sortcolumn;
  var sortcolumnorder = req.body.sortcolumnorder;

  var sqlstatepivot;

  var daterange = "1=1";
  var dynamicquerdatrange = "1=1";
  if (startdate != undefined && enddate != undefined) {
    //for sql based pivot
    //daterange = "DATE(createdAt) between ('" + startdate + "') and ('" + enddate + "')  ";

    daterange =
      "a." +
      datecolsearch +
      " >= '" +
      startdate +
      "' AND a." +
      datecolsearch +
      " <= '" +
      enddate +
      "'";
    dynamicquerydaterange =
      "a." +
      datecolsearch +
      " >= ''" +
      startdate +
      "'' AND a." +
      datecolsearch +
      " <= ''" +
      enddate +
      "''";
  }

  if (
    req.body.sortcolumnorder == undefined &&
    req.body.sortcolumn == undefined
  ) {
    sortcolumn = mod.id;
    sortcolumnorder = "desc";
  }
  if (req.body.sortcolumn == 1) {
    sortcolumn = mod.id;
  }

  /*    console.log(columns);
    console.log(words);*/

  //emp_no, '', salary
  var selector = "";
  var selectordynamic = "";
  if (searchtype == "Columnwise") {
    if (searchparam.constructor === Array) {
      var interns = searchparam;

      interns.forEach((item, index) => {
        //console.log(item[Object.keys(item)]+"--"+Object.keys(item))

        var searchvalue = item[Object.keys(item)];
        var searchkey = Object.keys(item)[0];
        //var result = (typeof searchvalue === 'number');

        var coltype = "";
        var stringtype = "";
        var dynamicstringtype = "";
        if (!searchvalue.some(isNaN)) {
          coltype = "";
          stringtype = "";
          dynamicstringtype = "";
        } else {
          coltype = "lower";
          stringtype = "'";
          dynamicstringtype = "''";
        }

        var obj;
        //for nodejs based pivot
        if (selector == "") {
          //selector = "and " + SqlString.format(searchkey) + " LIKE " + "'%" + SqlString.format(searchvalue) + "%'";
          selector =
            "and " +
            coltype +
            "(a." +
            SqlString.format(searchkey) +
            ") IN " +
            "(" +
            stringtype +
            SqlString.format(
              searchvalue.join("" + stringtype + "," + stringtype + "")
            ) +
            "" +
            stringtype +
            ")";
        } else {
          //selector = selector + " and  " + SqlString.format(searchkey) + " LIKE " + "'%" + SqlString.format(searchvalue) + "%'";
          selector =
            selector +
            " and  " +
            coltype +
            "(" +
            SqlString.format(searchkey) +
            ") IN " +
            "(" +
            stringtype +
            SqlString.format(
              searchvalue.join("" + stringtype + "," + stringtype + "")
            ) +
            "" +
            stringtype +
            ")";
        }

        if (selectordynamic == "") {
          selectordynamic =
            "and " +
            coltype +
            "(" +
            SqlString.format(searchkey) +
            ") IN " +
            "(" +
            dynamicstringtype +
            SqlString.format(
              searchvalue.join(
                "" + dynamicstringtype + "," + dynamicstringtype + ""
              )
            ) +
            "" +
            dynamicstringtype +
            ")";
        } else {
          selectordynamic =
            selectordynamic +
            " and  " +
            coltype +
            "(" +
            SqlString.format(searchkey) +
            ") IN " +
            "(" +
            dynamicstringtype +
            SqlString.format(
              searchvalue.join(
                "" + dynamicstringtype + "," + dynamicstringtype + ""
              )
            ) +
            "" +
            dynamicstringtype +
            ")";
        }

        //for sql based pivot
        /*if (selectordynamic == "") {
                    selectordynamic = "and " + SqlString.format(searchkey) + " LIKE " + "''%" + SqlString.format(searchvalue) + "%''";
                } else {
                    selectordynamic = selectordynamic + " and  " + SqlString.format(searchkey) + " LIKE " + "''%" + SqlString.format(searchvalue) + "%''";
                }*/
      });
    }
  } else if (searchtype == "consolidatesearch") {
    //*traditional search*//
    consolidatesearch =
      "and " +
      consolidatesearchparam[0].consolidatecol.join("||' '||") +
      " LIKE '%" +
      consolidatesearchparam[0].consolidatecolval +
      "%'";
    consolidatesearchdynamic =
      "and " +
      consolidatesearchparam[0].consolidatecol.join("||'' ''||") +
      " LIKE ''%" +
      consolidatesearchparam[0].consolidatecolval +
      "%''";
    /*without vector column*/
    //consolidatesearch='and to_tsvector("'+consolidatesearchparam[0].consolidatecol.join("\"||' '||\"")+'") @@ to_tsquery(\''+consolidatesearchparam[0].consolidatecolval+'\:\*\')'
    /*with vector column*/
    //consolidatesearch='and weighted_tsv @@ to_tsquery(\''+consolidatesearchparam[0].consolidatecolval+'\:\*\')'
  }
  return {
    baseYaxisparamprimary: baseYaxisparamprimary,
    daterange: daterange,
    selector: selector,
    consolidatesearch: consolidatesearch,
    baseXaxisparamprimary: baseXaxisparamprimary,
    XpageSize: XpageSize,
    Xnext_offset: Xnext_offset,
    dynamicquerydaterange: dynamicquerydaterange,
    selectordynamic: selectordynamic,
    consolidatesearchdynamic: consolidatesearchdynamic,
    YpageSize: YpageSize,
    Ynext_offset: Ynext_offset,
    baseXaxisparam: baseXaxisparam,
    baseYaxisparam: baseYaxisparam
  };
};
let MemoryUsage = () => {
  console.log(
    `*************************************Memory usage**************************************************************`
  );
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
  const usedTotal = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `The script uses approximately ${Math.round(usedTotal * 100) / 100} MB`
  );
  console.log(
    `***************************************************************************************************`
  );
};
/*var circle = require('./modularcsvimport.js');*/

let getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const currentTime =
    "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
  return `${year}${month}${day}` + `${currentTime}`;
};
let pageRender = (req, res, validationConfig) => {
  const d = new Date();
  const serverdat = {
    name: d.toString()
  };

  res.render("" + mod.Name + "/" + mod.Name + "", {
    title: req.user,
    serverdate: serverdat,
    modelattribute: Object.keys(models[mod.Name].tableAttributes),
    validationmap: JSON.stringify(datatransformutils.removeJsonAttrs(validationConfig.validationmap, ["fieldtypename"])),
    applyfields: JSON.stringify(validationConfig.applyfields)
  });
};

let searchtype = (req, res, a) => {
   return promise = new Promise((resolve, reject) => {
     
   
    searchparampayload(req).then(arg => {

    var fieldnames = Object.keys(models[mod.Name].tableAttributes).toString();

    let sqlConstructParams = {
      fieldnames,
      arg,
      mod
    };

    //searchtypeExplain(res, sqlConstructParams, a)
    /* do not delete function since it fallback to Conventional count*/
    searchtypeConventional(res, sqlConstructParams, a).then(arg => {
       resolve(arg)
     })
    //caching only count since delete of records in any b2b apps is meh !
    //searchtypeConventionalCache(res, sqlConstructParams, a, req.body)
  })
  .catch(function (error) {
    console.log(error)
    return error
  });
})
};
let searchtypePerf = (req, res, a) => {

  searchparampayload(req).then(arg => {
    var fieldnames = Object.keys(models[mod.Name].tableAttributes).toString();
    let sqlConstructParams = {
      fieldnames,
      arg,
      mod
    };

    searchtypeConventionalCache(res, sqlConstructParams, a, req.body)
  }).catch(function (error) {
    res.json(error)
  });
};
let searchtypeExplain = (res, sqlConstructParams, a) => {

  let sqlstatementsprimary = sqlConstruct[a.type][a.sqlScriptRow](
    sqlConstructParams
  );

  let sqlstatementsecondary = sqlConstruct[a.type][a.searchTypeCountExplain](
    sqlConstructParams
  );
  var internset = {};
  async(
    {
      rows: callback => {
        connections
          .query(sqlstatementsprimary)
          .then(result => {
            //console.log('number:', res.rows[0].number);

            internset.rows = result.rows;

            callback(null, internset.rows);
          })
          .catch(err => {
            console.log(err)
            connections.release()

          });
      },
      count: callback => {
        connections
          .query(sqlstatementsecondary)
          .then(result => {
            //console.log('number:', res.rows[0].number);

            var rwlenght = result.rows[0]["QUERY PLAN"].split("rows");

            var rowscount = rwlenght[rwlenght.length - 1]
              .split("=")[1]
              .split(" ")[0];
            internset.count = rowscount;
            callback(null, internset.count);
          })
          .catch(err => {
            connections.release()
            console.log(err)
          });
      }
    },
    (err, results) => {
      if (err) {
        res.json(err);
      }
      res.json(results);
    }
  );
};
let searchtypeConventionalCache = (res, sqlConstructParams, a, arg) => {


  let sqlstatementsprimary = sqlConstruct[a.type][a.sqlScriptRow](
    sqlConstructParams
  );

  let sqlstatementsecondary = sqlConstruct[a.type][a.sqlScriptCount](
    sqlConstructParams
  );

  var internset = {};
  async(
    {
      rows: callback => {
        connections
          .pgQueryStream(sqlstatementsprimary)
          .then(result => {
            //console.log('number:', res.rows[0].number);

            internset.rows = result.rows;

            callback(null, internset.rows);
          })
          .catch(err => {
            console.log(err)
            connections.release()

          });
      },
      count: callback => {

        let key = mod.Name + "-" + JSON.stringify(arg)
        isCacheCount(key, sqlstatementsecondary).then(function (data) {
          internset.count = data;
          callback(null, internset.count);
        })
      }
    },
    (err, results) => {
      if (err) {
        res.json(err);
      }
      res.json(results);
    }
  );
};
let searchtypeConventional = (res, sqlConstructParams, a) => {
   return promise = new Promise((resolve, reject) => {
    
  
  let sqlstatementsprimary = sqlConstruct[a.type][a.sqlScriptRow](
    sqlConstructParams
  );

  let sqlstatementsecondary = sqlConstruct[a.type][a.sqlScriptCount](
    sqlConstructParams
  );


  var internset = {};
  async(
    {
      rows: callback => {
        connections
          .query(sqlstatementsprimary)
          .then(result => {
            //console.log('number:', res.rows[0].number);

            internset.rows = result.rows;

            callback(null, internset.rows);
          })
          .catch(err => {
            console.log(err)
            connections.release()

          });
      },
      count: callback => {

        connections
          .query(sqlstatementsecondary)
          .then(result => {

            if (result.rowCount > 0) {
              internset.count = result.rows[0].count;
              callback(null, internset.count);
            }
            else {

              callback(null, 0);
            }

          })
          .catch(err => {
            connections.release()
            console.log(err)
          });

      }
    },
    (err, results) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      
      resolve(results);
    });
  })
};
let getCount = (sqlstatementsecondary) => {
  return new Promise((resolve, reject) => {
    connections
      .pgQueryStream(sqlstatementsecondary)
      .then(result => {

        resolve(result.rows[0].count);
      })
      .catch(err => {
        connections.release()

        reject(err)
      });
  })
}
let isCacheCount = (key, sqlstatementsecondary) => {
  return new Promise((resolve, reject) => {
    redisMiddleware.redisCount(key, true).then(function (data) {
      if (data.iscache === true) {
        resolve(data.val)
      }
      else {
        getCount(sqlstatementsecondary).then(function (count) {

          redisMiddleware.redisCount(key, count).then(function (data) {
            resolve(count)
          })
        })
      }
    })
  })
}
let searchtypegroupbyId = (req, res, a) => {
  let tempDep = paramsSearchTypeGroupBy(req);
  let sqlConstructParams = {
    tempDep,
    mod
  };

  var sqlstatementsprimary = sqlConstruct[a.type][a.searchtypegroupbyId](
    sqlConstructParams
  );

  connections
    .query(sqlstatementsprimary)
    .then(result => {
      res.json({ rows: result.rows });
    })
    .catch(err => {
      res.json(err);
    });
};
let SearchTypeGroupBy = (req, res, a) => {
  let tempDep = paramsSearchTypeGroupBy(req);
  let sqlConstructParams = {
    tempDep,
    mod
  };

  var sqlstatementsprimary = sqlConstruct[a.type][a.searchtypegroupby](
    sqlConstructParams
  );

  connections
    .query(sqlstatementsprimary)
    .then(result => {
      res.json({ rows: result.rows });
    })
    .catch(err => {
      res.json(err);
    });
};
let bulkCreate = (req, res) => {
  var lime = req.body;
  models[mod.Name]
    .bulkCreate(lime)
    .then(function (x) {
      //res.redirect('/users');

      res.json(x);
    })
    .catch(function (e) {
      res.json(e);
    });
};

let createRecord = (req, res) => {
  var resp = new Object();

  let lime = req.rawBody != undefined ? JSON.parse(req.rawBody) : req.body;

  models[mod.Name].create(lime).then(
    x => {
      res.json({ createdId: x[mod.id] });
    },
    err => {
      console.log(err)
      res.status(412);
      resp.par = err;
      res.json(resp);
    }
  );
};

let QueryStream = require("pg-query-stream");
let JSONStream = require("JSONStream");
let Json2csvTransform = require("json2csv").Transform;
let exportExcel = (req, res, a) => {

  var baseobj = {};
  baseobj.ref = req.app.io;

  searchparampayload(req).then(arg => {
    arg.ref = baseobj.ref;

    //if (arg.ispaginate) {
    var fieldnames = Object.keys(models[mod.Name].tableAttributes).toString();
    let sqlConstructParams = {
      fieldnames,
      arg,
      mod
    };


    arg.sqlFilterCount = sqlConstruct[a.type][
      a.sqlScriptCount
    ](sqlConstructParams);
    arg.searchTypeFilter = sqlConstruct[a.type][
      a.searchTypeFilter
    ](sqlConstructParams);
    arg.searchTypeFilterProgressBar = sqlConstruct[a.type][
      a.searchTypeFilterProgressBar
    ](sqlConstructParams);
    arg.mod = mod;
    qelasticbeta.push(arg, jobcompletedelasticindexedbeta);

    res.json("done");
  });

};
let jobcompletedelasticindexedbeta = argument => {


  argument.ref.emit("newsdownload", argument.resp);
};
var qelasticbeta = new Queue((objs, cb) => {
  exportdataset(objs).then(data => {
    objs.resp = data;
    cb(objs);
  });
});
var base = {};

let exportdataset = argument => {
  base.argument = argument;
  return new Promise((resolve, reject) => {
    var datasetar = [...Array(10).keys()];
    var sqlstatementsprimary = base.argument.sqlFilterCount;

    connections.query(sqlstatementsprimary).then(result => {

      if (result.rows[0] != undefined) {
        var getrows = result.rows[0].count;


        if (getrows.toString().length <= 5) {
          datasetar = [...Array(1).keys()];
          base.firstnum = getrows;
        } else {
          base.firstnum = getrows / 10;
        }

        Promises.mapSeries(datasetar, fdone).then(a => {
          resolve(a);
        });
      } else {
        reject(result);
      }
    });
  });
};

let fdone = val => {

  return new Promise((resolve, reject) => {
    var pageSize = val;
    var number_of_items = base.firstnum;
    var next_offset = pageSize * number_of_items;
    var red = {};
    red.number_of_items = Math.round(number_of_items);
    red.next_offset = Math.round(next_offset);
    //red.filenames = mod.Name + "_" + val;
    red.filenames = mod.Name + "-" + getDateString();

    dataprogressbarsets(red)
      .then(args => {
        var intersql =
          base.argument.searchTypeFilter +
          " limit " +
          red.number_of_items +
          " offset " +
          red.next_offset;
        let validationConfig = require("./" +
          mod.Name +
          "/validationConfig.js");
        var jsonintern = validationConfig.applyfields;
        //var jsonintern    = Object.keys(models[mod.Name].tableAttributes);

        jsonintern
          .removear("updated_date")
          .removear("created_date")
          .removear("recordstate")
          .removear(mod.id);

        var internobj = {};
        internobj.csvfilename = red.filenames;
        internobj.fieldsdownload = jsonintern;
        internobj.intersql = intersql;

        streamingexportexcel(internobj).then(data => {
          base.argument.ref.emit(
            "newsdownloadsets",
            data.csvfilename + ".csv"
          );

          resolve(data.csvfilename + ".csv");
        });
        /* connections.query(intersql)
                 .then((result) => {

                     var doctors = result.rows;

                     var xls = json2xls(doctors);
                     doctors="";
                     fs.writeFileSync(__dirname.replace("routes", "/") + '/public/' + red.filenames + '.xlsx', xls, 'binary');
                      xls="";
                    
                    base.argument.ref.emit('newsdownloadsets', red.filenames + ".xlsx");
                     resolve(red.filenames + ".xlsx")
                 })*/
      })
      .catch(err => {
        // something bad happened
        // process and error, but resolve a fullfilled Promise!

        console.log(err);
      });
  });
};

let dataprogressbarsets = args => {

  return new Promise((resolve, reject) => {
    // var sqlstatementspr = " EXPLAIN ANALYSE select * from employees limit " + args.number_of_items + " offset " + args.next_offset;

    var sqlstatementspr =
      base.argument.searchTypeFilterProgressBar +
      " limit " +
      args.number_of_items +
      " offset " +
      args.next_offset;

    connections
      .query(sqlstatementspr)
      .then(result => {



        // var getro = result.rows[3]["QUERY PLAN"]
        //   .split(":")[1]
        //   .replace("ms", "");
        var internset = {};
        internset.filenames = args.filenames;
        internset.count = result.rows[0]["QUERY PLAN"]["Execution Time"];

        base.argument.ref.emit("newsdownloadsetprogressstats", internset);
        resolve(internset);

      })
      .catch(e => {
        // can address the error here and recover from it, from getItemsAsync rejects or returns a falsey value
        throw e; // Need to rethrow unless we actually recovered, just like in the synchronous version
      });
  });
};
let streamingexportexcel = internobj => {
  return new Promise((resolve, reject) => {
    const fields = internobj.fieldsdownload;
    const opts = { fields };
    const transformOpts = { highWaterMark: 16384, encoding: "utf-8" };
    const json2csv = new Json2csvTransform(opts, transformOpts);
    const outputpath =
      __dirname.replace("routes", "/").replace("utils", "/") +
      "/public/exportCsv/" +
      internobj.csvfilename +
      ".csv";

    const output = fs.createWriteStream(outputpath, {
      encoding: "utf8"
    });

    /*end region */

    var stream = new QueryStream(internobj.intersql, [], {
      highWaterMark: 16384
    });
    stream.on("end", () => {
      // console.log('stream end')
      
      stream.destroy();
      resolve(internobj);
      connections.release()
    });
    connections.query(stream);

    stream
      .pipe(JSONStream.stringify())
      .pipe(json2csv)
      .pipe(output);
    //pipe 1,000,000 rows to stdout without blowing up your memory usage
    //pipe(process.stdout)
  });
};


let uploadContent = (req, res) => {

  var cryptoname = crypto.randomBytes(16).toString("hex");

  var fil;
  let Busboy = require('busboy');
  var Busboys = new Busboy({
    headers: req.headers
  });
  Busboys.on("file", (fieldname, file, filename, encoding, mimetype) => {
    //process.mainModule.filename

    var getextension = filename.substring(filename.lastIndexOf(".") + 1);
    var Consolidatefilename = cryptoname + "." + getextension;

    fil = Consolidatefilename;

    var dest = path.join(path.join(__dirname, '../') + "../../app/public/uploadContent/" + Consolidatefilename);
    file.pipe(fs.createWriteStream(dest));
  });
  Busboys.on("finish", () => {
    //res.writeHead(200, { 'Connection': 'close' });

    //res.end("That's all folks!"+fil);
    let qelastic = new Queue((objs, cb) => {
      /*non chunk version*/

      directstreambulkinsert(objs).then(data => {
        /*circle.dynamcatdata(objs).then((data)=> {*/

        redisMiddleware.redisDel(mod.Name).then(function (data) {

          objs.resp = data;
          cb(objs);

        })
      });
    });
    let directstreambulkinsert = obj => {
      return new Promise((resolve, reject) => {
        connections.connect((err, client, done) => {

          var sqlcopysyntax =
            "COPY " +
            mod.Name +
            "(" +
            getattributesfields().toString() +
            ") FROM STDIN WITH (FORMAT CSV, HEADER,  DELIMITER ',') ";
          var stream = client.query(copyFrom(sqlcopysyntax));
          console.log(sqlcopysyntax)
          var fileStream = fs.createReadStream(obj.saveTo);
          fileStream.on("error", data => {
            done();
            reject(data)
          });
          fileStream
            .pipe(stream)
            .on("error", data => {
              client.release()
            })
            .on('end', data => {

              client.release()
              resolve("Data inserted !");
            })
        });
      });
    };

    let jobcompletedelasticindexed = argument => {
      //console.log(argument.resp.length)


      argument.ref.emit("news", argument.resp);
      //   redisMiddleware.redisDel(mod.Name).then(function (data) {
      // })

    };
    let readexcel = function (arg) {
      // body...

      var getapplocation = path.dirname(process.mainModule.filename) + "/public/uploadContent";
      var dest = path.join(path.join(__dirname, '../') + "../../app/public/uploadContent/" + arg);
      var saveTo = path.join(getapplocation, arg);

      var baseobj = {};
      baseobj.ref = req.app.io;
      baseobj.saveTo = dest;
      baseobj.mod = mod;
      qelastic.push(baseobj, jobcompletedelasticindexed);

      res.json("done");
    };
    readexcel(fil);
  });
  return req.pipe(Busboys);
};

let updateRecord = (req, res) => {
  let lime = req.rawBody != undefined ? JSON.parse(req.rawBody) : req.body;

  models[mod.Name]
    .update(
      lime,
      {
        where: {
          [mod.id]: lime[mod.id]
        }
      } /* where criteria */
    )
    .then(affectedRows => {
      res.json(affectedRows);
    });
};
let deleteRecord = (req, res) => {
  models[mod.Name]
    .update(
      {
        recordstate: false
      },
      {
        where: {
          [mod.id]: req.body[mod.id]
        }
      }
    )
    .then(affectedRows => {
      res.json(affectedRows);
    });
};
let pivotResult = (req, res, a) => {
  let async = require("async");
  let tempDep = pivotTransform(req);
  // Use c as a connection
  var internset = {};
  let sqlConstructParams = {
    tempDep,
    mod
  };
  sqlstatementsprimary = sqlConstruct[a.type][a.sqlstatementsprimaryPivot](
    sqlConstructParams
  );

  sqlstatementsecondary = sqlConstruct[a.type][a.sqlstatementsecondaryPivot](
    sqlConstructParams
  );

  var sqlstatepivotcol = "";


  sqlstatepivot = "";

  sqlstatepivotcol = sqlConstruct[a.type][a.sqlstatepivotcol](
    sqlConstructParams
  );


  async.parallel(
    {
      Ycount: callback => {
        try {
          connections
            .query(sqlstatementsprimary)
            .then(result => {
              //console.log('number:', result.rows);

              internset.Ycount = result.rows[0].totalyaxiscnt;
              var ycount = result.rows[0].totalyaxiscnt;

              callback(null, ycount);
            })
            .catch(err => {
              res.json(err);
            });
        } finally {
        }
      },
      Xcount: callback => {
        connections
          .query(sqlstatementsecondary)
          .then(result => {
            //console.log('number:', res.rows[0].number);
            // console.log('number:', result.rows);

            internset.Xcount = result.rows[0].totalxaxiscnt;
            var Xcount = result.rows[0].totalxaxiscnt;
            callback(null, Xcount);
          })
          .catch(err => {
            res.json(err);
          });
      }
    },
    (err, results) => {
      //console.log(results);

      internset.Xcount = results.Xcount;
      internset.Ycount = results.Ycount;

      var interasyncset = {};
      var rollupinternobj = {};

      try {
        async.waterfall(
          [
            callback => {
              connections
                .query(sqlstatepivotcol)
                .then(result => {
                  var logiblock = result.rows;
                  var logiblockrollup = result.rows;

                  var foundItemsrollup = logiblockrollup.map(doctor => {
                    return (
                      'COALESCE(sum("' +
                      doctor.xaxis.replace(/\ /g, "") +
                      '"),0) AS "' +
                      doctor.xaxis.replace(/\ /g, "") +
                      '"'
                    );
                  });

                  rollupinternobj.resultsetinternrollup = foundItemsrollup.toString();

                  var foundItems = logiblock.map(doctor => {
                    return '  "' + doctor.xaxis.replace(/\ /g, "") + '" int';
                  });

                  rollupinternobj.resultsetintern = foundItems.toString();
                  /* subtotal horizontal*/
                  colset = logiblock.map(doctor => {
                    return '"' + doctor.xaxis.replace(/\ /g, "") + '"';
                  });
                  var subtotal = "(" + colset.join("+") + ") as subtotal";
                  var selectclause = "yaxis," + colset.join(",");

                  rollupinternobj.resultsetselect =
                    subtotal + "," + selectclause;

                  callback(null, rollupinternobj);
                })
                .catch(err => {
                  res.json(err);
                });
            },
            (arg1, callback) => {
              // console.log(arg1);
              let sqlConstructParams = {
                tempDep,
                arg1,
                mod
              };
              sqlstatepivot = sqlConstruct[a.type][a.SqlPivot](
                sqlConstructParams
              );

              connections
                .query(sqlstatepivot)
                .then(result => {
                  var logiblock = result.rows;

                  callback(null, logiblock);
                })
                .catch(err => {
                  res.json(err);
                });
            }
          ],
          (err, result) => {
            internset.rows = result;


            res.json(internset);
            // result now equals 'done'
          }
        );
      } finally {
      }
    }
  );
};
Array.prototype.arrayRemove = function (value) {

  return this.filter(function (ele) {
    return ele != value;
  });

}
Array.prototype.removear = function () {
  var what,
    a = arguments,
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

let routeUrls = {
  create: "/api/create",
  exportexcel: "/api/exportexcel",
  uploadcontent: "/api/uploadcontent",
  update: "/api/update",
  searchtype: ["/api/load", "/api/searchtype"],
  searchtypegroupby: "/api/searchtypegroupby",
  searchtypegroupbyId: "/api/searchtypegroupbyId",
  delete: "/api/delete",
  pivotresult: "/api/pivotresult",
  bulkCreate: "/api/bulkCreate"
};
// models.userrolemapping.sync({alter: true}).then(function() {
// }).catch(e => {
//     console.log(e)
// })
let datatransformutils = {
  findAndRemove: function (array, property, value) {
    array.forEach(function (result, index) {
      if (result[property] === value) {
        //Remove from array
        array.splice(index, 1);
      }
    });
  },
  rename: function (obj, oldName, newName) {
    if (!obj.hasOwnProperty(oldName)) {
      return false;
    }

    obj[newName] = obj[oldName];
    delete obj[oldName];
    return true;
  },
  removeJsonAttrs: function (json, attrs) {
    return JSON.parse(
      JSON.stringify(json, function (k, v) {
        return attrs.indexOf(k) !== -1 ? undefined : v;
      })
    );
  },
  isNumberKey: function (evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  },
  getminusincrement: function (a, b) {
    var ars = [];
    var N = parseInt(a - b);
    var ar = [...Array(N).keys()];
    ar.forEach(function (element) {
      ars.push(parseInt((a -= 1)));
    });
    return ars;
  },
  addArrayinJson: function (filterparam, key, val) {
    var a = []
    a.push(val)
    var o = {}
    o[key] = a
    var filt = filterparam.filter(function (dr) {
      return Object.keys(dr).find(x => x == key)
    }
    )
    if (filt.length > 0) {
      filterparam = filt.map(function (dr) {
        dr[key].push(val)
        return dr
      })
    }
    else {
      filterparam.push(o)
    }

    return filterparam
  }
};
let baseUtilsRoutes = {
  sqlScriptRow: "searchType",
  sqlScriptCount: "searchTypeCount",
  searchTypeCountExplain: "searchTypeCountExplain",
  searchtypegroupby: "searchtypegroupby",
  searchtypegroupbyId: "searchtypegroupbyId",
  searchTypeFilter: "searchTypeFilter",
  searchTypeFilterProgressBar: "searchTypeFilterProgressBar",
  sqlstatementsprimaryPivot: "sqlstatementsprimaryPivot",
  sqlstatementsecondaryPivot: "sqlstatementsecondaryPivot",
  sqlstatepivotcol: "sqlstatepivotcol",
  SqlPivot: "SqlPivot"
};
module.exports = {
  baseUtilsRoutes,
  routeUrls,
  MemoryUsage,
  express,
  authfunctions,
  models,
  cacheMiddleware,
  redisMiddleware,
  searchparampayload,
  paramsSearchTypeGroupBy,
  pivotTransform,
  assignVariables,
  bulkCreate,
  pivotResult,
  deleteRecord,
  updateRecord,
  uploadContent,
  exportExcel,
  createRecord,
  SearchTypeGroupBy,
  searchtypegroupbyId,
  searchtype,
  searchtypePerf,
  pageRender
};
