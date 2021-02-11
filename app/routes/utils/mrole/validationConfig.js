let validationmap = [
  {
    inputtype: 'multiselect',
    inputname: 'roleid',
    inputtextval: 'rolename',
    inputCustomMapping: 'rolename',
    inputParent: 'role',
    inputplaceholder: 'Rolename',
    selecttype: 'single',
    fieldtypename: 'STRING',
    fieldvalidatename: 'number',
    fieldmaxlength: '80'
  },
  {
    inputtype: 'multiselect',
    inputname: 'modnameid',
    inputtextval: 'mname',
    selecttype: 'multi',
    inputCustomMapping: 'modulename',
    inputParent: 'modname',
    inputplaceholder: 'Module',
    fieldtypename: 'STRING',
    fieldvalidatename: 'number',
    fieldmaxlength: '80'
  },
  {
    inputtype: 'multiselect',
    inputtextval: 'accesstype',
    inputname: 'accesstype',
    inputCustomMapping: 'accesstype',
    inputplaceholder: 'accesstype',
    fieldtypename: 'STRING',
    fieldvalidatename: 'string',
    fieldmaxlength: '2',
    childcontent: [{
      val: "VO",
      text: "ViewOnly"
    },
    {
      val: "AA",
      text: "AllAccess"
    }
  ]

  }
]
let applyfields = ['rolename', 'modulename', 'accesstype']

module.exports = { applyfields, validationmap }
