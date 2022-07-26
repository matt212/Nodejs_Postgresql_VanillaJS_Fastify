/*ajax api utils POST AND GET method*/
let ajaxutils = {
    basegetmethod: function (ajaxbase) {
      //console.log(base.config);
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: ajaxbase.url,
          headers: ajaxbase.getauth,
          method: 'GET',
          dataType: 'json',
  
          success: function (data) {
            resolve(data)
          },
          error: function (xhr) {
            reject(xhr)
          }
        })
      })
    },
    basepostmethod: function (ajaxbase) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          type: 'POST',
          url: ajaxbase.url,
          headers: ajaxbase.postauth.headers,
          //contentType: "application/json",
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify(ajaxbase.payload),
          success: function (data) {
            resolve(data)
            //console.log(data)
          },
          error: function (xhr) {
            console.log(xhr)
            reject(xhr)
          }
        })
      })
    },
    basepostmethodrawbody: function (ajaxbase) {
      return new Promise(function (resolve, reject) {
        $.ajax(ajaxbase.url, {
          headers: ajaxbase.postauth.headers,
          //{action:'x',params:['a','b','c']}
          type: 'POST',
          processData: false,
          data: JSON.stringify(ajaxbase.payload),
          contentType: 'multipart/form-data', //typically 'application/x-www-form-urlencoded', but the service you are calling may expect 'text/json'... check with the service to see what they expect as content-type in the HTTP header.
  
          /*
                            $.ajax({
  
                                type: "POST",
                                url: ajaxbase.url,
                                headers: ajaxbase.postauth.headers,
                                //contentType: "application/json",
                           
  
                                contentType: "application/json; charset=UTF-8",
                                
                                data: JSON.stringify(ajaxbase.payload),*/
          success: function (data) {
            resolve(data)
            //console.log(data)
          },
          error: function (xhr) {
            console.log(xhr)
            reject(xhr)
          }
        })
      })
    }
  }