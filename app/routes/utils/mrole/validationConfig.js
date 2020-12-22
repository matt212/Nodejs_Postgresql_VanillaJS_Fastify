let validationmap = [
  {
    inputtype: "multiselect",
    inputname: "rolename",
    inputtextval: "rolename",
    inputplaceholder: "Role",
    fieldtypename: "STRING",
    fieldvalidatename: "number",
    fieldmaxlength: "80"
  },
  {
    inputtype: "multiselect",
    inputname: "mname",
    inputtextval: "modulename",
    inputplaceholder: "Module",
    fieldtypename: "STRING",
    fieldvalidatename: "number",
    fieldmaxlength: "80"
  },
  {
    inputtype: "multiselect",
    inputtextval: "accesstype",
    inputname: "accesstype",
    inputplaceholder: "accesstype",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "2"
  }
];
let applyfields = ["rolename", "modulename", "accesstype"];

module.exports = { applyfields, validationmap };