
 



let ajaxurl = {
    auth: "/getToken"
};
let base = {
    appkey: location.hostname + (location.port ? ":" + location.port : ""),
    config: {
        headers: {
            "x-access-token": "MwMDAiLCJpYXQiOjE0NzM2MTQ4MDgsImV4cCI6MTQ3MzYxODQwOH0"
        }
    },
}
let ajaxbase = {
    postauth: base.config
};
let baseloadsegments = {
    getapptoken: function (ajaxbase) {
        
        //setting up url for api
        ajaxbase.url = ajaxurl.auth;
        ajaxbase.payload = base.appkey;

        return new Promise(function (resolve, reject) {
            //  console.log(ajaxutils);
            ajaxutils
                .basepostmethod(ajaxbase)
                .then(baseloadsegments.setconfig)
                .then(function (argument) {
                    resolve(argument);
                })
                .catch(function onError(err) {
                    console.log(err);
                });
        });
    },
    setconfig: function (data) {
        return new Promise(function (resolve, reject) {
            ajaxbase.postauth["headers"]["x-access-token"] = data.token;
            resolve(ajaxbase);
        });
    }
}

$(window, document, undefined).ready(function () {
    if (event.key === "Enter") {
  // Cancel the default action, if needed
  event.preventDefault();
  // Trigger the button element with a click
  document.getElementById("myBtn").click();
}
    $('input').blur(function () {
      var $this = $(this);
      if ($this.val())
        $this.addClass('used');
      else
        $this.removeClass('used');
    });

    var $ripples = $('.ripples');

    $ripples.on('click.Ripples', function (e) {

      var $this = $(this);
      var $offset = $this.parent().offset();
      var $circle = $this.find('.ripplesCircle');

      var x = e.pageX - $offset.left;
      var y = e.pageY - $offset.top;

      $circle.css({
        top: y + 'px',
        left: x + 'px'
      });

      $this.addClass('is-active');

    });

    $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function (e) {
      $(this).removeClass('is-active');
    });

  });
  $( document ).ready(function() {
    var div = document.querySelector('div.btnsubmit');
    ["click", "keypress"].forEach(ev=>{
      div.addEventListener(ev, function(e){
         if(ev=="click"){
          validatelogin()//clicked
         }
         if(e.keyCode==13){
          validatelogin()//enter key pressed
         }
      });
    });
    var error = "<%= statusMessage %>";          

if(error!=null && error !="<%= statusMessage %>") 
{  
console.log(error);
$("#dvmessages").show()
$("#messageContent").html(error)
}
  })


        function validatelogin() {

          var txtname = $("#txtname").val()
          console.log(txtname);
          if (txtname != "" && txtname != undefined && txtname != null) {


            baseloadsegments.getapptoken(ajaxbase).then(function () {

              let content = {
                "username": $("#txtname").val(),
                "password": $("#txtpass").val()
              };
              base.datapayload = content
              ajaxbase.payload = base.datapayload
              ajaxbase.url = '/login';
              ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
                console.log(argument)
                if (argument.status == "success") {
                  window.location.replace(argument.redirect);
                }
                else if (argument.status == "fail") 
                {
                  $("#msg").html(argument.msgstatus)
                }
              })
            });
          }
          else {
            console.log("Please enter valid username ")
            return false
          }
        }





let ajaxutils = {
        basegetmethod: function (ajaxbase) {
            //console.log(base.config);
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: ajaxbase.url,
                    headers: ajaxbase.getauth,
                    method: "GET",
                    dataType: "json",

                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr) {
                        reject(xhr);
                    }
                });
            });
        },
        basepostmethod: function (ajaxbase) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: ajaxbase.url,
                    headers: ajaxbase.postauth.headers,
                    //contentType: "application/json",
                    dataType: "json",
                    contentType: "application/json; charset=UTF-8",
                    data: JSON.stringify(ajaxbase.payload),
                    success: function (data) {
                        resolve(data);
                        //console.log(data)
                    },
                    error: function (xhr) {
                        console.log(xhr);
                        reject(xhr);
                    }
                });
            });
        },

    };