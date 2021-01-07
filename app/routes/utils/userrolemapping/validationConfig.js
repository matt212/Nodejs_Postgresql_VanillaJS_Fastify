let validationmap = [
  {
    inputtype: "multiselect",
    inputname: "roleid",
    inputtextval: "rolename",
    inputplaceholder: "Rolename",
    inputCustomMapping:"rolename",
    inputParent:"role",
    fieldtypename: "STRING",
    fieldvalidatename: "number",
    fieldmaxlength: "80"
  },
  {
    inputtype: "multiselect",
    inputname: "muserid",
    inputtextval: "username",
    inputCustomMapping:"username",
    inputParent:"muser",
    inputplaceholder: "username",
    fieldtypename: "STRING",
    fieldvalidatename: "number",
    fieldmaxlength: "80"
  }
];
let applyfields = ["rolename", "username"];

module.exports = { applyfields, validationmap };