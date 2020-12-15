let validationmap = [
  {
    inputname: 'first_name',
    fieldtypename: 'STRING',
    fieldvalidatename: 'string',
    fieldmaxlength: '45'
  },
  {
    inputname: 'last_name',
    fieldtypename: 'STRING',
    fieldvalidatename: 'string',
    fieldmaxlength: '45'
  },
  {
    inputname: 'gender',
    fieldtypename: 'STRING',
    fieldvalidatename: 'string',
    fieldmaxlength: '1'
  },
  {
    inputname: 'birth_date',
    fieldtypename: 'DATE',
    fieldvalidatename: 'date',
    fieldmaxlength: '30'
  }
]
let applyfields = ['first_name', 'last_name', 'gender', 'birth_date']

module.exports = { applyfields, validationmap }
