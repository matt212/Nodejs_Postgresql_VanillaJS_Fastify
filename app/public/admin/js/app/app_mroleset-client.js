let currentgender = {
  name: "gender",
  id: "genderid",
  text: "name",
  data: {
    "genderid": []
  }
};
let validationListener = function() {
  var sel = $('.form-horizontal input:text[data-form-type], input:checkbox[data-form-type], div[data-form-type]').length;

  if (sel <= 0) {
    $('#btnmodalsub').prop('disabled', false)
  } else {
    $('#btnmodalsub').prop('disabled', true)
  }
}
let basemod_modal = {
  ongenderControl: function(data) {
    var key = $(data).data().key;
    var val = $(data).data().val;
    if ($(data)[0].checked) {
      currentgender.data = {
        [key]: val
      }
    } else {
      delete currentgender.data[key]
    }
  },
  modalpopulate: function () {
    var interset = validationmap;
    let redlime = new Array(Math.ceil(interset.length / 2))
      .fill()
      .map((_) => interset.splice(0, 2));
    $("#overlaycontent").empty();
    var htmlcontent = "";

    redlime.forEach(function (item) {
      htmlcontent += `<div class="row">`;
      item.forEach(function (element) {
        if (element.inputtype == "textbox") {
          htmlcontent += htmlPopulateCustomControl.textBoxPopulateSecondary(
            element
          );
        }
        else
        {
          if (element.inputtype == "radio" && element.inputtypemod == currentgender.name) {
            
            var internhtmlcontent = ""
            
            radioaccesstypecontent.forEach((elem, index) => {
                internhtmlcontent = internhtmlcontent + htmlPopulateCustomControl.customRadioPopulate(elem, currentgender)
              })
              console.log(internhtmlcontent)
              $('#overlaycontent').append(htmlPopulateCustomControl.customRadioPopulatePrimary(currentgender, internhtmlcontent))
            //for bootstrap 4.3.1 
            $("#overlaycontent .custom-control-input").removeClass('custom-control-input').addClass('form-check-label')
            //end here
              
          }
        }
      });

      htmlcontent += `</div>`;
    });
    let btncode = ` <button type="button" id="btnmodalsub" class="btn btn-primary" disabled="true"
     onclick="javascript:reqops.btnSubmit();">Save changes</button>`;
    $("#overlaycontent").append(htmlcontent + btncode);
  },
};

$(function () {
  basemod_modal.modalpopulate();
  $('#overlaycontent input[type="text"], input[type="checkbox"]').on(
    "keydown keyup change",
    function () {
      htmlPopulateCustomControl.validationListener();
    }
  );
});
let radioaccesstypecontent = [{
  [currentgender.id]: "vo",
  [currentgender.text]: "viewOnly",
  "key": "accesstype"
},
{
  [currentgender.id]: "aa",
  [currentgender.text]: "AllAccess",
  "key": "accesstype"
}
]
