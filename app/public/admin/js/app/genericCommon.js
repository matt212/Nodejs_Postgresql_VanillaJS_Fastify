let datatransformutils = {
    findAndRemove: function (array, property, value) {
      array.forEach(function (result, index) {
        if (result[property] === value) {
          //Remove from array
          array.splice(index, 1)
        }
      })
    },
    staticValsMapping: function (f, fielddate) {
      var re = validationmap
      var r1 = re.filter(dt => dt.inputtypemod == f)
  
      if (Array.isArray(r1) && r1.length) {
        if (r1[0].childcontent != undefined) {
          var r2 = fielddate.includes(',') ? fielddate.split(',') : fielddate
  
          var redlime = []
          if (Array.isArray(r2) && r2.length) {
            r2.forEach(function (dt) {
              redlime.push(
                r1[0].childcontent.filter(dt1 => dt1.val == dt)[0].text
              )
            })
            return redlime.join(',')
          } else {
            return r1[0].childcontent.filter(dt1 => dt1.val == r2)[0].text
          }
        }
      } else {
        return fielddate
      }
    },
    rename: function (obj, oldName, newName) {
      if (!obj.hasOwnProperty(oldName)) {
        return false
      }
  
      obj[newName] = obj[oldName]
      delete obj[oldName]
      return true
    },
    removeJsonAttrs: function (json, attrs) {
      return JSON.parse(
        JSON.stringify(json, function (k, v) {
          return attrs.indexOf(k) !== -1 ? undefined : v
        })
      )
    },
    getCartesian: function (object) {
      return Object.entries(object).reduce(
        (r, [k, v]) => {
          var temp = []
          r.forEach(s =>
            (Array.isArray(v) ? v : [v]).forEach(w =>
              (w && typeof w === 'object'
                ? datatransformutils.getCartesian(w)
                : [w]
              ).forEach(x => temp.push(Object.assign({}, s, { [k]: x })))
            )
          )
          return temp
        },
        [{}]
      )
    },
    flat: v =>
      v && typeof v === 'object'
        ? Object.values(v).flatMap(datatransformutils.flat)
        : v,
    getparentchildAR: function (r1) {
      var key = Object.keys(r1[0])[0]
      var o = {
        [key]: r1.map(a => a[key])
      }
      return o
    },
    isNumberKey: function (evt) {
      var charCode = evt.which ? evt.which : evt.keyCode
      if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
        return false
  
      return true
    },
    editMultiSelect: function (obj) {
      var a1 = obj.validationmap.filter(dt => dt.inputtype == 'multiselect')
      var res = obj.content.map(function (data) {
        return a1.map(function (da) {
          var inten = {}
  
          obj.multiselectfunc[da.inputtextval].destroy(da.inputtextval)
          if (data[da.inputCustomMapping].indexOf(',') != -1) {
            /**check and assign values to multiselect control */
            if (isNaN(parseInt(data[da.inputname].split(',')[0]))) {
              multiselects[da.inputname] = [
                {
                  [da.inputtextval]: data[da.inputname].split(',')
                }
              ]
            } else {
              multiselects[da.inputname] = [
                {
                  [da.inputtextval]: data[da.inputname].split(',').map(Number)
                }
              ]
            }
  
            /**end region */
            inten[da.inputtextval] = data[da.inputCustomMapping]
              .split(',')
              .map(function (dt, i) {
                return {
                  key: da.inputtextval,
                  text:
                    da.childcontent != undefined
                      ? datatransformutils.staticValsMapping(
                          da.inputCustomMapping,
                          dt
                        )
                      : dt,
                  vals: isNaN(parseInt(data[da.inputname].split(',')[i]))
                    ? data[da.inputname].split(',')[i]
                    : parseInt(data[da.inputname].split(',')[i])
                }
              })
          } else {
            if (isNaN(parseInt(data[da.inputname]))) {
              multiselects[da.inputname] = [
                {
                  [da.inputtextval]: [data[da.inputname]]
                }
              ]
            } else {
              multiselects[da.inputname] = [
                {
                  [da.inputtextval]: [parseInt(data[da.inputname])]
                }
              ]
            }
  
            inten[da.inputtextval] = {
              key: da.inputtextval,
              text:
                da.childcontent != undefined
                  ? datatransformutils.staticValsMapping(
                      da.inputCustomMapping,
                      data[da.inputCustomMapping]
                    )
                  : data[da.inputCustomMapping],
              vals: isNaN(parseInt(data[da.inputname]))
                ? data[da.inputname]
                : parseInt(data[da.inputname])
              //vals: y
            }
          }
  
          return inten
        })
      })[0]
  
      res.forEach(function (dat) {
        Object.values(dat).forEach(function (dt) {
          if (Array.isArray(dt)) {
            dt.forEach(function (dt1) {
              obj.multiselectfunc[Object.keys(dat)[0]].onsearchtext(dt1)
            })
          } else {
            obj.multiselectfunc[Object.keys(dat)[0]].onsearchtext(dt)
          }
        })
      })
    },
    getminusincrement: function (a, b) {
      var ars = []
      var N = parseInt(a - b)
      var ar = [...Array(N).keys()]
      ar.forEach(function (element) {
        ars.push(parseInt((a -= 1)))
      })
      return ars
    },
    addArrayinJson: function (filterparam, key, val) {
      var a = []
      a.push(val)
      var o = {}
      o[key] = a
      var filt = filterparam.filter(function (dr) {
        return Object.keys(dr).find(x => x == key)
      })
      if (filt.length > 0) {
        filterparam = filt.map(function (dr) {
          dr[key].push(val)
          return dr
        })
      } else {
        filterparam.push(o)
      }
  
      return filterparam
    }
  }
  const equijoin = (xs, ys, primary, foreign, sel) => {
    const ix = xs.reduce((ix, row) => ix.set(row[primary], row), new Map())
    return ys.map(row => sel(ix.get(row[foreign]), row))
  }
  if (!String.prototype.contains) {
    String.prototype.contains = function () {
      return String.prototype.indexOf.apply(this, arguments) !== -1
    }
  }
  Array.prototype.exclude = function (list) {
    return this.filter(function (el) {
      return list.indexOf(el) < 0
    })
  }
  Array.prototype.remove = function () {
    var what,
      a = arguments,
      L = a.length,
      ax
    while (L && this.length) {
      what = a[--L]
      while ((ax = this.indexOf(what)) !== -1) {
        this.splice(ax, 1)
      }
    }
    return this
  }
  
  Array.prototype.moveUp = function (value, by) {
    var index = this.indexOf(value),
      newPos = index - (by || 1)
  
    if (index === -1) throw new Error('Element not found in array')
  
    if (newPos < 0) newPos = 0
  
    this.splice(index, 1)
    this.splice(newPos, 0, value)
  }
  String.prototype.capitalize = function () {
    return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
      return p1 + p2.toUpperCase()
    })
  }
  Array.prototype.remByVal = function (val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === val) {
        this.splice(i, 1)
        i--
      }
    }
    return this
  }
  const doChunk = (list, size) =>
    list.reduce(
      (r, v) =>
        (!r.length || r[r.length - 1].length === size
          ? r.push([v])
          : r[r.length - 1].push(v)) && r,
      []
    )
  Array.prototype.forEach2 = function (a) {
    var l = this.length
    for (var i = 0; i < l; i++) a(this[i], i)
  }
  
  Array.prototype.map2 = function (a) {
    var l = this.length
    var array = new Array(l),
      i = 0
    for (; i < l; i++) {
      array[i] = a(this[i], i)
    }
    return array
  }
  $.fn.formToJSON = function () {
    var out = {}
  
    var cleanValue = function ($f) {
      var v = $f.val() || ''
      // clean values?
      return v
    }
  
    var pushValue = function (o, id, v) {
      if (o[id] != null) {
        if (!o[id].push) {
          o[id] = [o[id]]
        }
  
        if (v.includes('[')) {
          v = isNaN(parseInt(v)) ? v : parseInt(v)
          o[id].push(JSON.parse(v)[0])
        } else {
          o[id].push(v)
        }
      } else {
        if (v.includes('[')) {
          v = isNaN(parseInt(v)) ? v : parseInt(v)
          o[id] = JSON.parse(v)
        } else {
          o[id] = v
        }
      }
    }
  
    var pushLevel = function (o, list, v) {
      var id = list.shift()
      if (list.length == 0) {
        pushValue(o, id, v)
      } else {
        if (o[id] == null) {
          o[id] = {}
        }
        pushLevel(o[id], list, v)
      }
    }
  
    this.each(function (i, f) {
      var v = cleanValue($(f))
      var idList = f.id.replace(/:\d*/g, '').split('.')
  
      pushLevel(out, idList, v)
    })
    return out
  }
  RegExp.escape = function (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }
  /*end region */
  let cartesianProduct = function (arr) {
    return arr.reduce(
      function (a, b) {
        return a
          .map(function (x) {
            return b.map(function (y) {
              return x.concat(y)
            })
          })
          .reduce(function (a, b) {
            return a.concat(b)
          }, [])
      },
      [[]]
    )
  }
  