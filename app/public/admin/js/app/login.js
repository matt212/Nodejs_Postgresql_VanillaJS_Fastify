
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