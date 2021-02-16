let currentmodulename = "employees";
let currentmoduleid = "employeesid"
//definition
let baseurlobj = {

    createdata: `/${currentmodulename}/api/create/`,

    //initialization
}
let basefunction = function() {
    return {
       //groupBySets 
       employeesMultiKeysLoad:function(keys)
        {
            //keys="gender"
           base.datapayload=baseloadsegments.basePopulateMultiControls(keys)
           return this
           .getpaginatesearchtypegroupby(base)
           .then(function (argument) {
               return argument
           })
        },
        
        insert: function(base) {


            ajaxbase.payload = basemod_modal.payloadformat(base).datapayload
            ajaxbase.url = baseurlobj.createdata;

            return ajaxutils.basepostmethod(ajaxbase).then(function(argument) {
                ajaxbase.response = argument;
                return argument;
            })

        },
        
        //SingleCreate
        
        
        //implementation

    }
}
//baseOffLoad
let basemod_modal = {afterhtmlpopulate: function(){},
customClearControl:function(){//clearControls
},
payloadformat: function (arg) {
    //insertpayloadData
}}
//StaticMulitSelectData