let validationmap = [
  {
    inputtype: "multiselect",
    inputname: "roleid",
    inputtextval: "rolename",
    inputCustomMapping:"rolename",
    inputplaceholder: "Rolename",
    fieldtypename: "STRING",
    fieldvalidatename: "number",
    fieldmaxlength: "80"
  },
  {
    inputtype: "multiselect",
    inputname: "modnameid",
    inputtextval: "mname",
    inputCustomMapping:"modulename",
    inputplaceholder: "Module",
    fieldtypename: "STRING",
    fieldvalidatename: "number",
    fieldmaxlength: "80"
  },
  {
    inputtype: "multiselect",
    inputtextval: "accesstype",
    inputname: "accesstype",
    inputCustomMapping:"accesstype",
    inputplaceholder: "accesstype",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "2"
  }
];
let applyfields = ["rolename", "modulename", "accesstype"];

module.exports = { applyfields, validationmap };