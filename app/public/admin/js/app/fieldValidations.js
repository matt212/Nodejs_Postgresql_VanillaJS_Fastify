/*field validation*/
let reqopsValidate={
    formvalidation: function (argument) {
    var fieldattr = $(argument).attr('data-attribute')

    var internset = {}
    internset.content = argument
    internset.contenttype = fieldattr

    baseobjvalidation.validationinterface(internset)
  }
}
var baseobjvalidation = {
    
    emailvalidation: function (argument) {
      validation = new RegExp(validations['email'][0])
      // validate the email value against the regular expression
  
      if (!validation.test(argument.value)) {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'control-label-format')
        $(argument).attr('data-form-type', 'true')
      } else {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'hide')
        $(argument).removeAttr('data-form-type')
      }
    },
    numbervalidation: function (argument) {
      validation = new RegExp(validations['number'][0])
      // validate the email value against the regular expression
  
      if (!validation.test(argument.value)) {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'control-label-format')
        $(argument).attr('data-form-type', 'true')
      } else {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'hide')
        $(argument).removeAttr('data-form-type')
      }
    },
    mobilevalidation: function (argument) {
      validation = new RegExp(validations['mobile'][0])
      // validate the email value against the regular expression
  
      if (!validation.test(argument.value)) {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'control-label-format')
        $(argument).attr('data-form-type', 'true')
      } else {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'hide')
        $(argument).removeAttr('data-form-type')
      }
    },
    passwordvalidation: function (argument) {
      validation = new RegExp(validations['password_set1'][0])
      // validate the email value against the regular expression
  
      if (!validation.test(argument.value)) {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'control-label-format')
  
        $(argument).attr('data-form-type', 'true')
      } else {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'hide')
        $(argument).removeAttr('data-form-type')
      }
    },
    textvalidation: function (argument) {
      validation = new RegExp(validations['string'][0])
      // validate the email value against the regular expression
  
      if (!validation.test(argument.value)) {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'control-label-format')
        $(argument).attr('data-form-type', 'true')
      } else {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'hide')
        $(argument).removeAttr('data-form-type')
      }
    },
    checkboxvalidation: function (argument) {
      if ($(argument).is(':checked')) {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'hide')
        $(argument).removeAttr('data-form-type')
      } else {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'control-label-format')
        $(argument).attr('data-form-type', 'true')
      }
    },
    checkboxvalidationMulti: function (argument) {
      if ($(argument).is(':checked')) {
        $(argument)
          .parents(':eq(2)')
          .find('.control-label-format')
          .attr('class', 'lblhide')
        $(argument)
          .parents(':eq(4)')
          .find(`.form-group`)
          .removeAttr('data-form-type')
      } else {
        if (this.checkboxvalidationSecondary(argument)) {
          $(argument)
            .parents(':eq(2)')
            .find('.lblhide')
            .attr('class', 'control-label-format')
          $(argument)
            .parents(':eq(4)')
            .find(`.form-group`)
            .attr('data-form-type', 'true')
        }
        //console.log([namesake].data[$(argument).attr("data-key")].length)
      }
    },
    checkboxvalidationSecondary: function (argument) {
      var namesake = `current${$(argument).attr('data-parentVal')}`
      var condt = eval(namesake).data[$(argument).attr('data-key')].length
  
      if (condt <= 0) {
        return true
      } else {
        return false
      }
    },
    radiovalidation: function (argument) {
      $(argument).removeAttr('data-form-type')
      validationListener()
    },
    genvalidation: function (argument) {
      if (argument.value == '') {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'hide')
        $(argument).removeAttr('data-form-type')
      } else {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'control-label-format')
        $(argument).attr('data-form-type', 'true')
      }
    },
    multiSelectValidation: function (argument) {
      var fieldattr = $(argument).attr('data-key')
  
      if (
        Array.isArray(multiselects[fieldattr]) &&
        multiselects[fieldattr].length
      ) {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'hide')
        $(argument).removeAttr('data-form-type')
      } else {
        $(argument)
          .parent()
          .find('label')
          .attr('class', 'control-label-format')
        $(argument).attr('data-form-type', 'true')
      }
    },
    validationinterface: function (internset) {
      switch (internset.contenttype) {
        case 'email':
          this.emailvalidation(internset.content)
          break
        case 'number':
          this.numbervalidation(internset.content)
          break
        case 'mobile':
          this.mobilevalidation(internset.content)
          break
        case 'string':
          this.textvalidation(internset.content)
          break
        case 'checkbox':
          this.checkboxvalidation(internset.content)
          break
        case 'checkboxMulti':
          this.checkboxvalidationMulti(internset.content)
          break
        case 'radio':
          this.radiovalidation(internset.content)
          break
        case 'passwordvalidation':
          this.passwordvalidation(internset.content)
          break
        case 'multiSelect':
          this.multiSelectValidation(internset.content)
          break
        default:
          this.genvalidation(internset.content)
      }
    }
  }