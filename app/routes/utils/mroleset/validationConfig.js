let validationmap = [{
    inputtype: "textbox",
    inputCustomMapping: "name",
    inputname: "name",
    inputplaceholder: "",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80",
    inputisPrimary: false
  },
  {
    inputtype: "radio",
    inputtypemod: "gender",
    inputtypeVal: "name",
    inputtypeID: "genderid",
    inputParent: "gender",
    inputCustomMapping: "gendername",
    inputname: "genderid",
    inputtextval: "name",
    inputplaceholder: "",
    fieldtypename: "INTEGER",
    fieldvalidatename: "number",
    fieldmaxlength: "80",
    inputisPrimary: false
  },
  {
    inputtype: "multiselect",
    inputtypemod: "role",
    inputtypeVal: "rolename",
    inputtypeID: "roleid",
    inputParent: "role",
    inputCustomMapping: "rolename",
    inputname: "roleid",
    selecttype: "multiselect",
    inputtextval: "rolename",
    inputplaceholder: "",
    fieldtypename: "INTEGER",
    fieldvalidatename: "number",
    fieldmaxlength: "80",
    inputisPrimary: false
  },
  {
    inputtype: "multiselect",
    inputtypemod: "modname",
    inputtypeVal: "mname",
    inputtypeID: "modnameid",
    inputParent: "modname",
    inputCustomMapping: "modulename",
    inputname: "modnameid",
    selecttype: "singleselect",
    inputtextval: "mname",
    inputplaceholder: "",
    fieldtypename: "INTEGER",
    fieldvalidatename: "number",
    fieldmaxlength: "80",
    inputisPrimary: false
  }
];
let applyfields = [
  "name",
  "gendername",
  "rolename",
  "modulename"
];
module.exports = {
  applyfields,
  validationmap
};