let multisel = function basemultiselect (selconfig, callback) {
  let me = {}
  me.identifier = selconfig.selectevent
  me.callbackfunc = callback
  me.remotefunc = selconfig.remotefunc
  me.internset = []
  me.internbasearh = []
  me.fieldname = selconfig.fieldkey
  me.placeholder = selconfig.placeholder
  me.fieldval = ''
  me.filterparam = {}
  me.internbasesearchar = []
  me.base = {}
  me.basesearchar = []
  me.selecttype = selconfig.selecttype
  ;(me.init = function () {
    this.$el = $('' + this.identifier + '')
    this.$el.addClass('spanmul')
    this.renderinputtag()
    this.$input = this.$el.find('input')
    this.appendautopopulate(this.$input)
    this.bindEvents()

    //do other important setup things
  }),
    (me.bindEvents = function () {
      this.clickscrolleventstoggle()
      this.$input.off()
      this.$input.on('input', this.addPerson.bind(this))
      this.$el.off()
      this.$el.on('keypress', this.dvkeyscroll.bind(this))
      this.$el.on('keyup', this.dvkeyscrollup.bind(this))
      this.$ul = this.$el.find('#dv_' + this.fieldname + ' ul')

      this.$ul.off()
      this.$ul.on('click', 'a.highlightselect', this.highlightPerson.bind(this))
      this.$divselrem = this.$el.find('div')
      this.$divselrem.off()
      this.$divselrem.on(
        'click',
        'div span.select2choiceremove',
        this.deletePerson.bind(this)
      )
    }),
    (me.clickscrolleventstoggle = function () {
      $(document).on('mouseenter', '.srchpara ul li', function (e) {
        $('.srchpara ul li').removeClass('active')
        $(this).addClass('active')
      })
    }),
    (me.dvkeyscroll = function (e) {
      if (e.which == 13) {
        //Enter key pressed
        //jquery
        $('.srchpara ul li.active a.highlightselect').click()
      }
    }),
    (me.dvkeyscrollup = function (e) {
      var $current = $('.srchpara ul li.active')

      var $next
      if (e.keyCode == 38) $next = $current.prev()
      if (e.keyCode == 40) $next = $current.next()
      //console.log($next)
      if ($next != undefined) {
        if ($next.length > 0) {
          //jquery
          $('.srchpara ul li').removeClass('active')
          $next.addClass('active')
        }
      }
    }),
    (me.addPerson = function () {
      internar = []
      internobj = {}
      // this.fieldname = this.$input.data('multipleselect-autocomplete')

      this.fieldval = this.$input.val()

      //internobj[this.fieldname] = this.fieldval.toString().toLowerCase();
      internobj[this.fieldname] = this.fieldval
      internar.push(internobj)
      this.payload()
      this.removefromlist()
      var objintern = {}
      objintern.fieldname = this.fieldname
      objintern.fieldval = this.fieldval

      let interims = Object.values(multiselects)
        .map(str => {
          return str[0][objintern.fieldname]
        })
        .filter(Boolean)[0]
      if (interims != undefined) {
        if (interims.length >= 1 && this.selecttype == 'single') {
        } else {
          this.remotefunc(objintern).then(this.responsetransform)
        }
      } else {
        this.remotefunc(objintern).then(this.responsetransform)
      }
    }),
    (me.deletePerson = function (event) {
      var removecontent = $(event.currentTarget)
      var key = $(removecontent).data('selKey')
      //var val = $(removecontent).data('selVals').toString().toLowerCase();
      var val = $(removecontent).data('selVals')
      this.removefilterdiv(removecontent, key, val)
      this.change(this.callbackfunc)
      this.$input.focus()
      //console.log(removecontent)
    }),
    (me.removefilterdiv = function (arg, key, val) {
      $(arg)
        .parent()
        .remove()

      var interncon = this.basesearchar
      interncon = interncon
        .filter(function (e) {
          return e[key] != undefined
        })
        .map(function (doctor) {
          return {
            [key]: doctor[key].remByVal(val)
          }
        })

      this.updateNameById(this.basesearchar, key, interncon[0][key])

      if (interncon[0][key].length <= 0) {
        this.basesearchar = datatransformutils.removeJsonAttrs(
          this.basesearchar,
          [key]
        )
      }
      this.basesearchar = this.basesearchar.filter(
        value => Object.keys(value).length !== 0
      )
    }),
    (me.highlightPerson = function (event) {
      var removecontent = $(event.target)
        .closest('li')
        .find('a')

      var key = $(removecontent).data('selKey')
      var val = $(removecontent).data('selVal')
      var vals = $(removecontent).data('selVals')

      this.onsearchtext(key, val, vals)
      this.$input.focus()
      this.change(this.callbackfunc)
    }),
    (me.onsearchtext = function (key, val, vals) {
      // $("#dv_" + key).remove();

      this.$el.find('#dv_' + key + ' ').html(' ')
      this.$el.find('#dv_' + key + ' ').hide()
      //$("#dv_" + key).html(" ");
      //$("#dv_" + key).hide();
      // \"" + val + "\"

      $('#cltrl_filter_' + key).val('')

      this.assignsearchparams(key, vals)
      var interntags = this.rendertags(key, val, vals)
      //jquery
      $('#cltrl_filter_chips_' + key).append(interntags)
    }),
    (me.rendertags = function (key, val, vals) {
      var divSpan = document.createElement('div')
      divSpan.setAttribute('class', 'selectchips')
      divSpan.textContent = val.capitalize()
      var closeSpan = document.createElement('span')
      closeSpan.setAttribute('class', 'select2choiceremove')
      closeSpan.setAttribute('id', 'cltrl_filter_span_' + key)
      closeSpan.setAttribute('data-sel-key', key)
      closeSpan.setAttribute('data-sel-val', val)
      closeSpan.setAttribute('data-sel-vals', vals)
      closeSpan.textContent = 'x'
      divSpan.appendChild(closeSpan)
      return divSpan
    }),
    (me.assignsearchparams = function (key, val) {
      var internar = []
      var basesearchobj = {}
      if (isNaN(val)) {
        //val = val.toString().toLowerCase()
        val = val
        internar.push(val)
      } else {
        internar.push(val)
      }

      //UPDATE
      if (
        this.basesearchar.filter(function (e) {
          return e[key] != undefined
        }).length > 0
      ) {
        var interncon = this.basesearchar
        interncon = interncon
          .filter(function (e) {
            return e[key] != undefined
          })
          .map(function (doctor) {
            return {
              [key]: doctor[key].concat(val)
            }
          })
        this.updateNameById(this.basesearchar, key, interncon[0][key])
      } else {
        // ADD
        basesearchobj[key] = internar
        this.basesearchar.push(basesearchobj)

        basesearchobj = {}
      }
    }),
    (me.updateNameById = function (obj, id, value) {
      Object.keys(obj).some(function (key) {
        if (obj[key][id] != undefined) {
          obj[key][id] = value
          return true
        }

        return true
      })
    }),
    (me.payload = function () {
      this.filterparam.pageno = 0
      this.filterparam.pageSize = 20
      this.filterparam.searchtype = 'Columnwise'
      this.filterparam.searchparam = internar
      this.filterparam.searchparammetafilter = this.internbasearh
      this.filterparam.ispaginate = true
      this.base.datapayload = this.filterparam
      this.internbasesearchar = this.basesearchar
    }),
    (me.renderinputtag = function () {
      var divSpaninput = document.createElement('input')
      divSpaninput.setAttribute('type', 'text')
      divSpaninput.setAttribute('class', 'form-control')
      divSpaninput.setAttribute('class', 'form-control-multiselect')
      var ids = 'cltrl_filter_' + this.fieldname
      divSpaninput.setAttribute('id', ids)
      divSpaninput.setAttribute('placeholder', this.placeholder.capitalize())
      this.$el.append(divSpaninput)
    }),
    (me.appendautopopulate = function (arg) {
      var internsid = 'cltrl_filter_chips_' + this.fieldname
      var internsdvid = 'dv_' + this.fieldname
      var divSpanchips = document.createElement('div')
      //srchpara
      divSpanchips.setAttribute('id', internsid)
      divSpanchips.setAttribute('class', 'sidebyside')
      var divSpansearch = document.createElement('div')
      divSpansearch.setAttribute('id', internsdvid)
      divSpansearch.setAttribute('class', 'srchpara')
      $(divSpansearch).insertAfter($(divSpanchips).insertBefore($(arg)))
    }),
    (me.removefromlist = function () {
      if (this.basesearchar.length > 0) {
        this.internbasearh.push(this.basesearchar)

        this.internbasearh = datatransformutils.removeJsonAttrs(
          this.internbasearh[0],
          [this.fieldname]
        )

        this.internbasearh =
          Object.keys(this.internbasearh[0]).length == 0
            ? []
            : this.internbasearh
      }
    }),
    (me.change = function (callback) {
      callback(this.basesearchar)
    }),
    (me.responsetransform = function (data) {
      var internset = me.removefromlistresp(data)

      me.divautopopulate(internset)
      me.bindEvents()
    }),
    (me.renderautopopulate = function (key, val, vals) {
      //var ultag = document.createElement("ul");
      var litag = document.createElement('li')
      var atag = document.createElement('a')
      atag.setAttribute('class', 'highlightselect')
      atag.setAttribute('data-sel-key', key)
      atag.setAttribute('data-sel-val', val)
      atag.setAttribute('data-sel-vals', vals)
      atag.textContent = val.capitalize()
      litag.appendChild(atag)
      //ultag.appendChild(atag)
      return litag
    }),
    (me.divautopopulate = function (internset) {
      var ultag = document.createElement('ul')
      internset.forEach(function (obj) {
        //var key=Object.keys(obj)
        //var val=obj[Object.keys(obj)]
        var key = obj.key
        var val = obj.text
        var vals = obj.val
        ultag.appendChild(me.renderautopopulate(key, val, vals))
      })
      $('#dv_' + me.fieldname + '').show()
      $('#dv_' + me.fieldname + '').html($(ultag))
      internset = ''
      $('.srchpara ul li')
        .eq(0)
        .addClass('active')
      return true
    }),
    (me.removefromlistresp = function (data) {
      this.internset = data

      //remove already selected items from select object !
      if (this.internbasesearchar.length > 0) {
        var toRem = this.internbasesearchar.map(function (a) {
          return a[Object.keys(a)]
        })[0]

        //this.internset = this.internset.filter((el) => !toRem.includes(el.val.toString().toLowerCase()));
        this.internset = this.internset.filter(el => !toRem.includes(el.val))
      }
      return this.internset
    }),
    (me.onremoteupate = function (editcontent) {
      editcontent.forEach(function (obj) {
        me.onsearchtext(obj.key, obj.text, obj.val)
      })
    }),
    (me.destroy = function (fieldname) {
      me.basesearchar = []
      $('#cltrl_filter_chips_' + fieldname).html(' ')
    })

  return me
}
