let validationmap = [
  {
    inputtype: "multiselect",
    inputname: "roleid",
    inputtextval: "rolename",
    inputplaceholder: "Rolename",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80"
  },
  {
    inputtype: "multiselect",
    inputtextval: "username",
    inputname: "muserid",
    inputplaceholder: "username",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80"
  }
];
let applyfields = ["rolename", "username"];

module.exports = { applyfields, validationmap };