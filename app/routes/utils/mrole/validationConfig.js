let validationmap = [
  {
    inputtype: "textbox",
    inputtextval: "rolename",
    inputname: "roleid",
    inputplaceholder: "Role",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80"
  },
  {
    inputtype: "multiselect",
    inputname: "mname",
    inputtextval: "modulename",
    inputplaceholder: "Module",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80"
  },
  {
    inputtype: "multiselect",
    inputtextval: "accesstype",
    inputname: "accesstype",
    inputplaceholder: "accesstype",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80"
  }
];
let applyfields = ["rolename", "modulename", "accesstype"];

module.exports = { applyfields, validationmap };