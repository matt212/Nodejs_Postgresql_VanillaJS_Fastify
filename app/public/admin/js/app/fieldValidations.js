let validations = {
  string: [/^[a-zA-Z ]+$/, "Please enter valid  name"],
  number: [/^[0-9]+$/, "Please enter valid number"],
  email: [
    /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    "Please enter a valid email address",
  ],
  mobile: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid mobile number"],
  password_set1: [
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    "Please enter Minimum eight characters, at least one letter and one number",
  ],
  password_set2: [
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
    "Please enter Minimum eight characters, at least one letter, one number and one special character",
  ],
  password_set3: [
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    "Please enter Minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
  ],
  password_set4: [
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/,
    "Please enter Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
  ],
  password_set4: [
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}/,
    "Please enter Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
  ],
  date: [
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    "Please enter valid date",
  ],
  alphaNumeric: [/^[a-z0-9]+$/i, "Please enter Valid Alpha numeric String"],
  showCSS: "control-label-format",
  hideCSS: "hide",
  hideCSSlbl: "lblhide",
};
/*field validation*/
let reqopsValidate = {
  formvalidation: function (argument) {
    var fieldattr = $(argument).attr("data-attribute");

    var internset = {};
    internset.content = argument;
    internset.contenttype = fieldattr;

    baseobjvalidation.validationinterface(internset);
  },
};
var baseobjvalidation = {
  emailvalidation: function (argument) {
    validation = new RegExp(validations["email"][0]);
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument).parent().find("label").attr("class", validations.showCSS);
      $(argument).attr("data-form-type", "true");
    } else {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    }
  },
  numbervalidation: function (argument) {
    validation = new RegExp(validations["number"][0]);
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument).parent().find("label").attr("class", validations.showCSS);
      $(argument).attr("data-form-type", "true");
    } else {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    }
  },
  mobilevalidation: function (argument) {
    validation = new RegExp(validations["mobile"][0]);
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument).parent().find("label").attr("class", validations.showCSS);
      $(argument).attr("data-form-type", "true");
    } else {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    }
  },
  passwordvalidation: function (argument) {
    validation = new RegExp(validations["password_set1"][0]);
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument).parent().find("label").attr("class", validations.showCSS);

      $(argument).attr("data-form-type", "true");
    } else {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    }
  },
  textvalidation: function (argument) {
    validation = new RegExp(validations["string"][0]);
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument).parent().find("label").attr("class", validations.showCSS);
      $(argument).attr("data-form-type", "true");
    } else {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    }
  },
  alphaNumericValidation: function (argument) {
    validation = new RegExp(validations["alphaNumeric"][0]);
    // validate the email value against the regular expression

    if (!validation.test(argument.value)) {
      $(argument).parent().find("label").attr("class", validations.showCSS);
      $(argument).attr("data-form-type", "true");
    } else {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    }
  },
  checkboxvalidation: function (argument) {
    if ($(argument).is(":checked")) {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    } else {
      $(argument).parent().find("label").attr("class", validations.showCSS);
      $(argument).attr("data-form-type", "true");
    }
  },
  checkboxvalidationMulti: function (argument) {
    if ($(argument).is(":checked")) {
      $(argument)
        .parents(":eq(2)")
        .find(`.${validations.showCSS}`)
        .attr("class", validations.hideCSSlbl);
      $(argument)
        .parents(":eq(4)")
        .find(`.form-group`)
        .removeAttr("data-form-type");
    } else {
      if (this.checkboxvalidationSecondary(argument)) {
        $(argument)
          .parents(":eq(2)")
          .find(`.${validations.hideCSSlbl}`)
          .attr("class", validations.showCSS);
        $(argument)
          .parents(":eq(4)")
          .find(`.form-group`)
          .attr("data-form-type", "true");
      }
      //console.log([namesake].data[$(argument).attr("data-key")].length)
    }
  },
  checkboxvalidationSecondary: function (argument) {
    var namesake = `current${$(argument).attr("data-parentVal")}`;
    var condt = eval(namesake).data[$(argument).attr("data-key")].length;

    if (condt <= 0) {
      return true;
    } else {
      return false;
    }
  },
  radiovalidation: function (argument) {
    $(argument).removeAttr("data-form-type");
    validationListener();
  },
  genvalidation: function (argument) {
    if (argument.value == "") {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    } else {
      $(argument).parent().find("label").attr("class", validations.showCSS);
      $(argument).attr("data-form-type", "true");
    }
  },
  multiSelectValidation: function (argument) {
    var fieldattr = $(argument).attr("data-key");

    if (
      Array.isArray(multiselects[fieldattr]) &&
      multiselects[fieldattr].length
    ) {
      $(argument).parent().find("label").attr("class", validations.hideCSS);
      $(argument).removeAttr("data-form-type");
    } else {
      $(argument).parent().find("label").attr("class", validations.showCSS);
      $(argument).attr("data-form-type", "true");
    }
  },
  validationinterface: function (internset) {
    switch (internset.contenttype) {
      case "email":
        this.emailvalidation(internset.content);
        break;
      case "number":
        this.numbervalidation(internset.content);
        break;
      case "mobile":
        this.mobilevalidation(internset.content);
        break;
      case "string":
        this.textvalidation(internset.content);
        break;
      case "alphaNumericValidation":
          this.alphaNumericValidation(internset.content);
          break;  
      case "checkbox":
        this.checkboxvalidation(internset.content);
        break;
      case "checkboxMulti":
        this.checkboxvalidationMulti(internset.content);
        break;
      case "radio":
        this.radiovalidation(internset.content);
        break;
      case "passwordvalidation":
        this.passwordvalidation(internset.content);
        break;
      case "multiSelect":
        this.multiSelectValidation(internset.content);
        break;
      default:
        this.genvalidation(internset.content);
    }
  },
};
