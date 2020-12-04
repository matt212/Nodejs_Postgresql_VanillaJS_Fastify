let multiselect = {
   
    srchparams: function() {
       base.searchtype = "Columnwise"
            base.datapayload = preloadpayload();


            basefunction().getpaginatesearchtype(base).then(function(data) {
                htmlpopulatetable(data);
                bootpagination(data);

                if ($("#dvreportcontainer").hasClass('collapsed-box')) {

                    $("#rptwidget").click();
                }
            })
    },
    searchbarautocomplete: function(base) {
            let internobj = {}
            let internar = []
            let fieldval = $(baseobj).val()
            let fieldname = $(baseobj).data('multipleselect-autocomplete')
            baseobj.position = fieldname;
            internobj[fieldname] = fieldval.toLowerCase();
            let internbasearh = []
            internar.push(internobj)

            if (basesearchar.length > 0) {

                /*check if current search element and discard from metafilter */
                internbasearh.push(basesearchar)


                internbasearh = removeJsonAttrs(internbasearh[0], [fieldname])


                internbasearh = (Object.keys(internbasearh[0]).length == 0 ? [] : internbasearh);
                /*end region*/
            }

            filterparam.pageno = 0
            filterparam.pageSize = 20
            filterparam.searchtype = "Columnwise"
            filterparam.searchparam = internar;
            filterparam.searchparammetafilter = internbasearh
            filterparam.ispaginate = true
            base.datapayload = filterparam

            var internbasesearchar = basesearchar;

            basefunction().getpaginatesearchtypegroupby(base).then(function(argument) {

                $("#dv_" + baseobj.position + "").html("");
                $("#dv_" + baseobj.position + "").show();




                let internset = argument.rows

                /*remove already selected items from select object !*/
                if (internbasesearchar.length > 0) {
                    var toRem = internbasesearchar.map(function(a) {
                        return a[Object.keys(a)]
                    })[0]

                    internset = internset.filter((el) => !toRem.includes(el[Object.keys(el)].toLowerCase()));

                }
                /*end region*/



                let redlime = "";
                internset.forEach(function(obj) {
                    redlime += "<div><a class=\"highlightselect\" href='javascript:multiselect.onsearchtext(\"" + Object.keys(obj) + "\",\"" + obj[Object.keys(obj)].toLowerCase() + "\");'>" + obj[Object.keys(obj)] + "  </a></div>";
                });

                //console.log("#dv_" + baseobj.position + "");
                var cssfirst = "<span class=\"select2-dropdown select2-dropdown--above\" dir=\"ltr\" style=\"width: 825px;\">";
                $("#dv_" + baseobj.position + "").html(redlime);

            }).catch(function onError(err) {
                console.log(err);
            });
           
        },
        onsearchtext: function(key, val) {
            $("#dv_" + key).html(" ");
            $("#dv_" + key).hide();
            $("#cltrl_filter_" + key).val('');
            this.assignsearchparams(key, val);

            $("#cltrl_filter_chips_" + key).append("<div class=\"selectchips\"><span ID=\"cltrl_filter_span_" + key + "\" onclick='javascript:multiselect.removefilterdiv(this,\"" + key + "\", \"" + val + "\");' class=\"select2choiceremove\" role=\"presentation\">×</span>" + val.capitalize() + "</div>")
            
        },
        assignsearchparams: function(key, val) {
            var internar = []
            if (isNaN(val)) {
                val = val.toLowerCase()
                internar.push(val)
            } else {

                internar.push(val)
            }


            /* UPDATE */
            if (basesearchar.filter(function(e) { return e[key] != undefined }).length > 0) {
                var interncon = basesearchar
                interncon = interncon.filter(function(e) { return e[key] != undefined }).map(function(doctor) {
                    return {
                        [key]: doctor[key].concat(val)
                    }
                })
                this.updateNameById(basesearchar, key, interncon[0][key]);
            } else {
                /* ADD */
                basesearchobj[key] = internar
                basesearchar.push(basesearchobj);
                basesearchobj = {}
            }
           
        },
        removefilterdiv: function(argument, key, val) {
            $(arguments).parent().remove()

            var interncon = basesearchar
            interncon = interncon.filter(function(e) { return e[key] != undefined }).map(function(doctor) {
                return {
                    [key]: doctor[key].remByVal(val)
                }
            })

            this.updateNameById(basesearchar, key, interncon[0][key]);

            if (interncon[0][key].length <= 0) {
                basesearchar = removeJsonAttrs(basesearchar, [key]);

            }
            basesearchar = basesearchar.filter(value => Object.keys(value).length !== 0);
           
        },
        fieldfilters: function(key, val) {
            if ($(arg).children().hasClass('fa-plus')) {
                $(".fieldsfilterbar").slideToggle(300)
                $(arg).children().removeClass('fa-plus').addClass('fa-minus')
            } else {
                $(".fieldsfilterbar").slideToggle(300)
                $(arg).children().removeClass('fa-minus').addClass('fa-plus')
            }
            
        },
        updateNameById: function(obj, id, value) {

            Object.keys(obj).some(function(key) {

                if (obj[key][id] != undefined) {
                    obj[key][id] = value;
                    return true;
                }

                return true;

            })
        }

}



