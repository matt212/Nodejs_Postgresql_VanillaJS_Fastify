let currentmodulename = "employees";
let currentmoduleid = "employeesid"

let currentModmrole = "modname"
let currentModName = "mname"
let currentModmroleid = "modnameid"
let baseurlobj = {
    getpaginatesearchtypeurl: '/' + currentmodulename + '/api/searchtype/',
    getpaginatesearchtypeCounturl: '/' + currentmodulename + '/api/searchtypeCount/',
    createdata: '/' + currentmodulename + '/api/create/',
    updatedata: '/' + currentmodulename + '/api/update/',
    exceldata: '/' + currentmodulename + '/api/exportexcel/',
    uploaddata: '/' + currentmodulename + '/api/uploadcontent/',
    getpaginatesearchtypegroupby: '/' + currentmodulename + '/api/searchtypegroupby/',
    pivotresult: '/' + currentmodulename + '/api/pivotresult/',
    getcurrentModmrolegroupby: '/' + currentModmrole + '/api/searchtypegroupby/'
}

let basefunction = function () {
    return {
        mroleMultiKeysLoad: function (keys) {
            //keys="gender"
            base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
            return this
                .getcurrentModmrolegroupby(base)
                .then(function (argument) {
                    return argument
                })
        },
        //groupBySets 
        employeesMultiKeysLoad: function (keys) {
            //keys="gender"
            base.datapayload = baseloadsegments.basePopulateMultiControls(keys)
            return this
                .getpaginatesearchtypegroupby(base)
                .then(function (argument) {
                    return argument
                })
        },
        getpaginatesearchtype: function (base) {
            ajaxbase.payload = base.datapayload
            ajaxbase.url = baseurlobj.getpaginatesearchtypeurl;
            $("a[href$='revenue-chart']").tab('show');
            //$("#trloader").show()
            //$("#basetable tbody").slideUp("slow").hide();

            $('table').addClass('loading')
            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                console.log(typeof argument)
                ajaxbase.response = argument;
                ajaxbase[currentmodulename] = argument
                /*$("#trloader").hide()
                $("#basetable tbody").slideDown("slow").show();*/
                $('table').removeClass('loading')

                return argument;
            })

        },
        getpaginatesearchtypeCount: function (base) {
            ajaxbase.payload = base.datapayload
            ajaxbase.url = baseurlobj.getpaginatesearchtypeCounturl;
            $('#dvpaginationsections').addClass('loading')
            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                $('#dvpaginationsections').removeClass('loading')
                return argument;
            })

        },
        getpaginatesearchtypegroupby: function (base) {


            ajaxbase.payload = base.datapayload
            ajaxbase.url = baseurlobj.getpaginatesearchtypegroupby;
            $('.fieldsfilterbar').addClass('loading')
            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                ajaxbase.response = argument;
                $('.fieldsfilterbar').removeClass('loading')
                return argument;
            })

        },
        insert: function (base) {


            ajaxbase.payload = base.datapayload
            ajaxbase.url = baseurlobj.createdata;

            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                ajaxbase.response = argument;
                return argument;
            })

        },
        update: function (base) {


            ajaxbase.payload = base.datapayload
            ajaxbase.url = baseurlobj.updatedata;

            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                ajaxbase.response = argument;
                return argument;
            })

        },
        exportexcel: function (base) {



            ajaxbase.url = baseurlobj.exceldata;
            ajaxbase.payload = base.datapayload;
            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                ajaxbase.response = argument;
                return argument;
            })

        },
        getpivotreport: function (base) {


            $("#dvloader").show()


            ajaxbase.url = baseurlobj.pivotresult;
            ajaxbase.payload = base.datapayload;
            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                ajaxbase.response = argument;

                $("#dvloader").hide()

                return argument;
            })

        },
        getcurrentModmrolegroupby: function (base) {
            ajaxbase.payload = base.datapayload
            ajaxbase.url = baseurlobj.getcurrentModmrolegroupby;
            return ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                ajaxbase.response = argument;
                return argument;
            })
        },

    }
}

basefunction().mroleMultiKeysLoad(currentModName).then(function (data) {
    console.log(data.rows)
    var killzone = data.rows
    killzone.forEach((element, index) => {

        
    })
});
//  let radioModular=function(data)
//  {
//   re=`<div class="checkbox tablechk">`
//   data.forEach((element, index) => {
//   re+=`<label>
//   <input type="radio" name="cltrlRadio${currentmodname}" id="cltrlRadio${currentmodname}${index}" value="option1" checked="">${element}
//   <span class="radio-material">
//   </span> 
//   </label>`       
//   });

//   re+=`</div>`
//  }
let basemod_modal = {
    afterhtmlpopulate: function () {

    }
    , customClearControl: function () {
    }
}