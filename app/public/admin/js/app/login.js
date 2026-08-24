
 



// let ajaxurl = {
//     auth: "/getToken"
// };
// let base = {
//     appkey: location.hostname + (location.port ? ":" + location.port : ""),
//     config: {
//         headers: {
//             "x-access-token": "MwMDAiLCJpYXQiOjE0NzM2MTQ4MDgsImV4cCI6MTQ3MzYxODQwOH0"
//         }
//     },
// }
// let ajaxbase = {
//     postauth: base.config
// };
// let baseloadsegments = {
//     getapptoken: function (ajaxbase) {
        
//         //setting up url for api
//         ajaxbase.url = ajaxurl.auth;
//         ajaxbase.payload = base.appkey;

//         return new Promise(function (resolve, reject) {
//             //  console.log(ajaxutils);
//             ajaxutils
//                 .basepostmethod(ajaxbase)
//                 .then(baseloadsegments.setconfig)
//                 .then(function (argument) {
//                     resolve(argument);
//                 })
//                 .catch(function onError(err) {
//                     console.log(err);
//                 });
//         });
//     },
//     setconfig: function (data) {
//         return new Promise(function (resolve, reject) {
//             ajaxbase.postauth["headers"]["x-access-token"] = data.token;
//             resolve(ajaxbase);
//         });
//     }
// }

// $(window, document, undefined).ready(function () {
//     if (event.key === "Enter") {
//   // Cancel the default action, if needed
//   event.preventDefault();
//   // Trigger the button element with a click
//   document.getElementById("myBtn").click();
// }
//     $('input').blur(function () {
//       var $this = $(this);
//       if ($this.val())
//         $this.addClass('used');
//       else
//         $this.removeClass('used');
//     });

//     var $ripples = $('.ripples');

//     $ripples.on('click.Ripples', function (e) {

//       var $this = $(this);
//       var $offset = $this.parent().offset();
//       var $circle = $this.find('.ripplesCircle');

//       var x = e.pageX - $offset.left;
//       var y = e.pageY - $offset.top;

//       $circle.css({
//         top: y + 'px',
//         left: x + 'px'
//       });

//       $this.addClass('is-active');

//     });

//     $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function (e) {
//       $(this).removeClass('is-active');
//     });

//   });
//   $( document ).ready(function() {
//     var div = document.querySelector('div.btnsubmit');
//     ["click", "keypress"].forEach(ev=>{
//       div.addEventListener(ev, function(e){
//          if(ev=="click"){
//           validatelogin()//clicked
//          }
//          if(e.keyCode==13){
//           validatelogin()//enter key pressed
//          }
//       });
//     });
//     var error = "<%= statusMessage %>";          

// if(error!=null && error !="<%= statusMessage %>") 
// {  
// console.log(error);
// $("#dvmessages").show()
// $("#messageContent").html(error)
// }
//   })


//         function validatelogin() {

//           var txtname = $("#txtname").val()
//           console.log(txtname);
//           if (txtname != "" && txtname != undefined && txtname != null) {


//             baseloadsegments.getapptoken(ajaxbase).then(function () {

//               let content = {
//                 "username": $("#txtname").val(),
//                 "password": $("#txtpass").val()
//               };
//               base.datapayload = content
//               ajaxbase.payload = base.datapayload
//               ajaxbase.url = '/login';
//               ajaxutils.basepostmethod(ajaxbase).then(function (argument) {
//                 console.log(argument)
//                 if (argument.status == "success") {
//                   window.location.replace(argument.redirect);
//                 }
//                 else if (argument.status == "fail") 
//                 {
//                   $("#msg").html(argument.msgstatus)
//                 }
//               })
//             });
//           }
//           else {
//             console.log("Please enter valid username ")
//             return false
//           }
//         }





// let ajaxutils = {
//         basegetmethod: function (ajaxbase) {
//             //console.log(base.config);
//             return new Promise(function (resolve, reject) {
//                 $.ajax({
//                     url: ajaxbase.url,
//                     headers: ajaxbase.getauth,
//                     method: "GET",
//                     dataType: "json",

//                     success: function (data) {
//                         resolve(data);
//                     },
//                     error: function (xhr) {
//                         reject(xhr);
//                     }
//                 });
//             });
//         },
//         basepostmethod: function (ajaxbase) {
//             return new Promise(function (resolve, reject) {
//                 $.ajax({
//                     type: "POST",
//                     url: ajaxbase.url,
//                     headers: ajaxbase.postauth.headers,
//                     //contentType: "application/json",
//                     dataType: "json",
//                     contentType: "application/json; charset=UTF-8",
//                     data: JSON.stringify(ajaxbase.payload),
//                     success: function (data) {
//                         resolve(data);
//                         //console.log(data)
//                     },
//                     error: function (xhr) {
//                         console.log(xhr);
//                         reject(xhr);
//                     }
//                 });
//             });
//         },

//     };

/*
 * ============================================================
 * AUTHENTICATION CONFIGURATION
 * ============================================================
 *
 * SECURITY FIX: CVE-001
 *
 * The old implementation called:
 *
 *     POST /getToken
 *
 * before the user had authenticated and sent:
 *
 *     location.hostname + location.port
 *
 * as `appkey`.
 *
 * This was part of the vulnerable JWT minting flow.
 *
 * The login page no longer requests an access token.
 *
 * Authentication is now performed directly through:
 *
 *     POST /login
 *
 * The server creates the authenticated session after validating
 * the username/password.
 */

let ajaxurl = {
    login: "/login"
};


/*
 * No hardcoded JWT is stored in the browser.
 *
 * The previous code contained:
 *
 *     "x-access-token":
 *     "MwMDAiLCJpYXQiOjE0NzM2MTQ4MDgs..."
 *
 * That has been removed.
 *
 * JWT/session credentials must be issued by the server and must
 * never be hardcoded into client-side JavaScript.
 */
let base = {
    config: {
        headers: {}
    }
};


let ajaxbase = {
    postauth: {
        headers: {}
    }
};


/*
 * ============================================================
 * LOGIN
 * ============================================================
 */
function validatelogin() {

    let txtname = $("#txtname").val();
    let txtpass = $("#txtpass").val();


    /*
     * Validate username.
     */
    if (
        txtname === "" ||
        txtname === undefined ||
        txtname === null
    ) {

        console.log("Please enter valid username");

        $("#msg").html("Please enter valid username");

        return false;
    }


    /*
     * Validate password.
     */
    if (
        txtpass === "" ||
        txtpass === undefined ||
        txtpass === null
    ) {

        console.log("Please enter password");

        $("#msg").html("Please enter password");

        return false;
    }


    /*
     * SECURITY FIX:
     *
     * Do NOT call /getToken here.
     *
     * The user has not authenticated yet, so requesting an access
     * token at this point is both unnecessary and insecure.
     *
     * The /login endpoint authenticates the user and creates the
     * server-side authenticated session.
     */
    let content = {
        username: txtname,
        password: txtpass
    };


    ajaxbase.payload = content;
    ajaxbase.url = ajaxurl.login;


    ajaxutils
        .basepostmethod(ajaxbase)
        .then(function (argument) {

            console.log(argument);


            if (argument.status === "success") {

                /*
                 * The server has established the authenticated
                 * session. Redirect to the application.
                 */
                window.location.replace(argument.redirect);

            }
            else if (argument.status === "fail") {

                $("#msg").html(
                    argument.msgstatus || "Invalid Username/Password"
                );

            }
            else {

                $("#msg").html(
                    argument.msgstatus || "Unable to login"
                );

            }

        })
        .catch(function (xhr) {

            console.error("Login request failed", xhr);

            let message = "Unable to login. Please try again.";

            /*
             * Try to display a useful server-side error when
             * available.
             */
            if (
                xhr &&
                xhr.responseJSON &&
                xhr.responseJSON.msgstatus
            ) {
                message = xhr.responseJSON.msgstatus;
            }

            $("#msg").html(message);

        });


    return false;
}


/*
 * ============================================================
 * PAGE READY / UI HANDLERS
 * ============================================================
 */

$(window, document, undefined).ready(function () {

    /*
     * Enter key handling.
     *
     * The previous code referenced `event` without receiving
     * an event argument. Keep the handler explicit.
     */
    $(document).on("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            let button = document.getElementById("myBtn");

            if (button) {
                button.click();
            }
        }

    });


    /*
     * Floating-label input handling.
     */
    $('input').blur(function () {

        var $this = $(this);

        if ($this.val()) {
            $this.addClass('used');
        }
        else {
            $this.removeClass('used');
        }

    });


    /*
     * Ripple effect.
     */
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


    $ripples.on(
        'animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd',
        function (e) {

            $(this).removeClass('is-active');

        }
    );

});


$(document).ready(function () {

    /*
     * Login button handlers.
     */
    var div = document.querySelector('div.btnsubmit');


    if (div) {

        ["click", "keypress"].forEach(function (ev) {

            div.addEventListener(ev, function (e) {

                if (ev === "click") {

                    validatelogin();

                }


                if (
                    ev === "keypress" &&
                    (e.key === "Enter" || e.keyCode === 13)
                ) {

                    e.preventDefault();

                    validatelogin();

                }

            });

        });

    }


    /*
     * Display server-side session/status message.
     */
    var error = "<%= statusMessage %>";


    if (
        error != null &&
        error != "<%= statusMessage %>" &&
        error !== ""
    ) {

        console.log(error);

        $("#dvmessages").show();

        $("#messageContent").html(error);

    }

});


/*
 * ============================================================
 * AJAX UTILITIES
 * ============================================================
 */

let ajaxutils = {

    /*
     * GET request.
     */
    basegetmethod: function (ajaxbase) {

        return new Promise(function (resolve, reject) {

            $.ajax({

                url: ajaxbase.url,

                /*
                 * Only send headers explicitly supplied by the
                 * caller.
                 *
                 * No hardcoded JWT is added here.
                 */
                headers: ajaxbase.getauth || {},

                method: "GET",

                dataType: "json",

                success: function (data) {

                    resolve(data);

                },

                error: function (xhr) {

                    console.error(xhr);

                    reject(xhr);

                }

            });

        });

    },


    /*
     * POST request.
     */
    basepostmethod: function (ajaxbase) {

        return new Promise(function (resolve, reject) {

            $.ajax({

                type: "POST",

                url: ajaxbase.url,

                /*
                 * Do not automatically inject a JWT into every
                 * request.
                 *
                 * Authentication credentials are issued by the
                 * server and supplied only where required.
                 */
                headers:
                    ajaxbase.postauth &&
                    ajaxbase.postauth.headers
                        ? ajaxbase.postauth.headers
                        : {},

                dataType: "json",

                contentType: "application/json; charset=UTF-8",

                data: JSON.stringify(
                    ajaxbase.payload || {}
                ),

                success: function (data) {

                    resolve(data);

                },

                error: function (xhr) {

                    console.error(xhr);

                    reject(xhr);

                }

            });

        });

    }

};

