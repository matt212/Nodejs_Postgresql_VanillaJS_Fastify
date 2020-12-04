// Code goes here
var base=new Object();







 function basegetmethod(ajaxbase) {
        //console.log(base.config);
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: ajaxbase.url,
                headers: ajaxbase.getauth,
                method: 'GET',
                dataType: 'json',

                success: function(data) {
                    resolve(data);
                },
                error: function(xhr) {
                    reject(xhr)
                }

            });
        });
    }


/*myApp.controller('OtherController', ['$scope', '$http', 'Todos', function($scope, $http, Todos) {
  //function OtherController($scope) {





}]);*/