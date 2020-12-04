var MyModule = function(){};

MyModule.prototype.someFunction = function(params){
    var bsr=params.urls;


 return new Promise(function (resolve, reject){

    
  
var replaycheck=params.urls


 
var doctors = params.maindata.filter(function(s) {
   return s.Modulename.indexOf(replaycheck) !== -1; 
}).map(function(s) {
    return { // return what new object will look like
         Accestype:s.Accestype,
    };
});
console.log(replaycheck)
console.log(doctors[0].Accestype);
var allowaccess;
if(doctors[0].Accestype=="AA")
{

resolve(true);
}
else
{
	resolve(false);
}


      })
}





module.exports = MyModule;