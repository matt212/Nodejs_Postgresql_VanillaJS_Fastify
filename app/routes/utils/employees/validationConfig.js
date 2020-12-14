let validationmap = [
  {
    inputname: 'first_name',
    fieldtypename: 'STRING',
    fieldvalidatename: 'string',
    fieldmaxlength: '80'
  },
  {
    inputname: 'last_name',
    fieldtypename: 'STRING',
    fieldvalidatename: 'string',
    fieldmaxlength: '80'
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
    fieldmaxlength: '10'
  }
]
let applyfields = ['first_name', 'last_name', 'gender', 'birth_date']

module.exports = { applyfields, validationmap }
