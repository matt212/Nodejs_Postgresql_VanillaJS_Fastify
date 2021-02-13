let basemod_modal = {
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
      });

      htmlcontent += `</div>`;
    });
    let btncode = ` <button type="button" id="btnmodalsub" class="btn btn-primary" disabled="true"
     onclick="javascript:reqops.btnSubmit();">Save changes</button>`;
    $("#overlaycontent").html(htmlcontent + btncode);
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
