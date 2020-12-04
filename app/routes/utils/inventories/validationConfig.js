let validationmap = [{
    inputtype: "textbox",
    inputname: "firstname",
    inputplaceholder: "meh",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80"
  },
  {
    inputtype: "textbox",
    inputname: "lastname",
    inputplaceholder: "last name",
    fieldtypename: "STRING",
    fieldvalidatename: "string",
    fieldmaxlength: "80"
  },
  {
    inputtype: "textbox",
    inputname: "age",
    inputplaceholder: "age",
    fieldtypename: "INTEGER",
    fieldvalidatename: "number",
    fieldmaxlength: "80"
  },
  {
    inputtype: "textbox",
    inputname: "phone",
    inputplaceholder: "mobile",
    fieldtypename: "BIGINT",
    fieldvalidatename: "mobile",
    fieldmaxlength: "80"
  },
  {
    inputtype: "checkbox",
    inputtypemod: "modname",
    inputtypeVal: "mname",
    inputtypeID: "modnameid",
    inputname: "modnameid",
    inputplaceholder: "Gender",
    fieldtypename: "ARRAY(DataTypes.INTEGER)",
    fieldvalidatename: "number",
    fieldmaxlength: "80"
  }
];
let applyfields = [
  "firstname",
  "lastname",
  "age",
  "phone",
  "modnameid"
];
module.exports = {
  applyfields,
  validationmap
};