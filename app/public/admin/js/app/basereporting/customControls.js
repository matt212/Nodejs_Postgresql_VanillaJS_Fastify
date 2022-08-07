let htmlPopulateCustomControl={
multiCheckBoxPopulate: function (elem, currentset) {
    return `<div class="custom-control custom-checkbox">
    <label><input type="checkbox" class="custom-control-input" id="cltrl${
      currentset.id
    }${elem[currentset.id]}" 
    onclick="javascript:basemod_modal.on${currentset.name}Control(this)" 
    data-key="${currentset.id}"j
    data-val="${elem[currentset.id]}"
    data-attribute="checkboxMulti"
    data-parentVal="${currentset.name}"       
    value="${elem[currentset.id]}">${elem[currentset.text]}
    </label></div>`
  },
  validationListener : function() {
    var sel = $('#overlaycontent input:text[data-form-type], input:checkbox[data-form-type], div[data-form-type]').length;
    //var sel=document.querySelectorAll("[data-form-type]").length
    console.log(sel)
    
    if (sel <= 0) {
      $('#btnmodalsub').prop('disabled', false)
    } else {
      $('#btnmodalsub').prop('disabled', true)
    }
  },
  multiCheckboxPopulatePrimary: function (currentset, internhtmlcontent) {
    return `<div class="form-group overlaytxtalign col-md-5" data-attribute="checkboxMulti"  data-form-type="true">
    <div class="col-sm-15">
           <label class="lblhide" id="lblmsg${currentset.id}">
           <i class="fa fa-bell-o"></i> Please select gender
           </label>${internhtmlcontent}</div>
           </div></div>`
  },
  genericCheckboxHtml: function (currentmoduleid) {
    return `<input type="hidden" name="${currentmoduleid}" value="0" id="cltrl${currentmoduleid}"> 
    <div class="form-group overlaytxtalign col-md-5"><div class="col-sm-offset-2 col-sm-15"><div><label><div class="checkbox tablechk">
   <label>
   <div class="col-sm-15">
                    <label class="lblhide" id="lblmsgrecordstate">
                    <i class="fa fa-bell-o"></i> Please select Active
                    </label>
   <input type="checkbox" id="cltrlrecordstate" data-attribute="checkbox" data-form-type="true" onclick="javascript:tableops.onchk(this)" value="true"><span class="checkbox-material"><span class="check"></span></span> Remember me
   <span class="checkbox-material">
   </div>
   </span> 
   </label>
   </div></label></div></div></div>`
  },
  genericCheckboxHtmlPrimary: function () {
    return `<div class="checkbox tablechk">
   <label>
   <input type="checkbox" id="cltrlrecordstate" data-form-type="true" data-attribute="radio"  onclick="javascript:tableops.onchk(this)" value=true> Remember me
   <span class="checkbox-material">
   </span> 
   </label>
   </div>`
  },
  genericRecordState: function (interncontent, base) {
    if (interncontent[0].recordstate) {
      $('#cltrlrecordstate').prop('checked', true)
      $('#cltrlrecordstate').val(true)
      base.datapayload.recordstate = true
      base.interimdatapayload.recordstate = true
      $('#cltrlrecordstate').removeAttr('data-form-type')
    } else {
      $('#cltrlrecordstate').prop('checked', false)
      $('#cltrlrecordstate').val(false)
      base.datapayload.recordstate = false
      base.interimdatapayload.recordstate = false
    }
    $('#btnbutton').click()
  },
  textBoxPopulateSecondary: function (element) {
    return `<div class="form-group overlaytxtalign col-md-5">
    <div class="col-sm-15">
    <label class="lblhide" id="lblmsg${element.inputname}">
    <i class="fa fa-bell-o"></i>  ${element.inputname} is required
    </label>
    <input type="text" data-key-type="${
      element.inputname
    }" data-attribute="${
      element.fieldvalidatename
    }" class="form-control" maxLength="${element.fieldmaxlength}"
    data-form-type="false" onkeyup="javascript:reqopsValidate.formvalidation(this)" id="cltrl${
      element.inputname
    }" placeholder="${element.inputplaceholder.capitalize()}">
    </div></div>`
  },
  genericddlPopulate:function(fieldname)
    {
      return `<div class="form-group col-sm-6"> 
      <div class="col-sm-15">
      <label class="lblhide" id="lblmsgddlddlmulti">
      <i class="fa fa-bell-o"></i> Please Select ${fieldname.inputCustomMapping} 
      </label>
      <div onkeyup="javascript:reqopsValidate.formvalidation(this)" data-attribute="multiSelect"
      data-key="${fieldname.inputname}" data-form-type="false" id="in${fieldname.inputtextval}"></div>
      </div></div>`
  
    },
    customRadioPopulate: function (elem, currentset) {
      return `<div class="custom-control custom-radio">
      <label><input type="radio" class="custom-control-input" id="cltrl${
        currentset.id
      }${elem[currentset.id]}" 
      onclick="javascript:basemod_modal.on${currentset.name}Control(this)" 
      data-key="${currentset.id}"
      name="customRadio${currentset.name}"
      data-val="${elem[currentset.id]}"  
      value="${elem[currentset.id]}">${elem[currentset.text]}
      </label></div>`
    },
    customRadioPopulatePrimary: function (currentset, internhtmlcontent) {
      return `<div class='form-group overlaytxtalign col-md-5' onclick="javascript:reqopsValidate.formvalidation(this)" data-attribute="radio" data-form-type="true">
      <div class="col-sm-15">
                    <label class="lblhide" id="lblmsg${currentset.id}">
                    <i class="fa fa-bell-o"></i> Please select gender
                    </label>
      ${internhtmlcontent}</div></div>`
    },
    genericMultiControlpayload: function (
      base,
      internim,
      updateIds,
      currentmoduleid
    ) {
      var isactivearrayobj = {
        recordstate: base.interimdatapayload.recordstate
      }
      //flatting multiselects objects
      var temp = Object.fromEntries(
        Object.entries(internim.datapayload).map(([k, v]) => [
          k,
          datatransformutils.flat(v)
        ])
      )
      let b = {
        ...temp,
        ...isactivearrayobj
      }
      //apply cartesion for multiselects objects
      var interns = datatransformutils.getCartesian(b)
      console.log(ajaxbase.isedit);
      if (ajaxbase.isedit) {
        console.log(updateIds)
        updateIds.forEach(function (dt, i) {
          if (interns[i] == undefined) {
            base.datapayload = {
              delObj: {
                [currentmoduleid]: dt
              }
            }
            basefunction()
              .deleterecord(base)
              .then(function (dt) {})
          } else {
            interns[i][currentmoduleid] = dt
          }
        })
        let a1 = interns
        a1.forEach(function (dt, i) {
          if (Object.keys(dt).includes(currentmoduleid)) {
          } else {
            base.datapayload = dt
            basefunction()
              .singleInsert(base)
              .then(function (dt) {})
            delete interns[i]
          }
        })
        base.datapayload = interns.filter(Boolean)
        return base
      } else {
        let o = {
          payset: interns
        }
        base.datapayload = o
        return base
      }
    }
}
String.prototype.capitalize = function () {
  return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
    return p1 + p2.toUpperCase()
  })
}