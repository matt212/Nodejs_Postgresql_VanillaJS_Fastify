let basemod_modal = {
  modalpopulate: function() {
    var interset = validationmap
    let redlime=new Array(Math.ceil(interset.length / 2)).fill().map(_ => interset.splice(0, 2))
    $("#overlaycontent").empty();
    var htmlcontent = "";
   
    redlime.forEach(function(item) {

      htmlcontent += `<div class="row">`
      item.forEach(function(element) {

        if (element.inputtype == 'multiselect') {
          
        } else if (element.inputtype == "radio" && element.inputtypemod == currentgender.name) {
          var internhtmlcontent = ""
          
        }
        //rchkelse   
        else {
          htmlcontent += htmlPopulateCustomControl.textBoxPopulateSecondary(element);
        }

      })

      htmlcontent += `</div>`
    })

    
    $("#overlaycontent").html(htmlcontent);
  }
 }

 $(function () {
  basemod_modal.modalpopulate()
 })