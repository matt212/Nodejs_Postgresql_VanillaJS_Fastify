let validationmap = [
  {
    inputtype: "textbox",
    inputname: "username",
    inputplaceholder: "User Name",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80"
  },
  {
    inputtype: "textbox",
    inputname: "password",
    inputplaceholder: "Pass word",
    fieldtypename: "STRING",
    fieldvalidatename: "passwordvalidation",
    fieldmaxlength: "80"
  },
  {
    inputtype: "textbox",
    inputname: "email",
    inputplaceholder: "email",
    fieldtypename: "STRING",
    fieldvalidatename: "email",
    fieldmaxlength: "80"
  }
];
let applyfields = ["username", "password", "email"];

module.exports = { applyfields, validationmap };