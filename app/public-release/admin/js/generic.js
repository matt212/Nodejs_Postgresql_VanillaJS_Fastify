var usrobj={};
var basear=[];

{% for key in title %}

usrobj.Rolename="{{key.Rolename }}"
usrobj.isactive="{{key.isactive }}"
usrobj.muserID="{{key.muserID }}"
usrobj.Accestype="{{key.Accestype }}"
usrobj.Modulename="{{key.Modulename }}"
basear.push(usrobj)
usrobj={}
{% endfor %}

console.log(basear);
var bsr=window.location.href;
console.log(bsr.substr(bsr.lastIndexOf('/') + 1))
var replaycheck=bsr.substr(bsr.lastIndexOf('/') + 1)


 
var doctors = basear.filter(function(s) {
   return s.Modulename.indexOf(replaycheck) !== -1; 
}).map(function(s) {
    return { // return what new object will look like
         Accestype:s.Accestype,
    };
});

console.log(doctors[0].Accestype);
if(doctors[0].Accestype!="VO")
{
accesibility();
}




//
function  accesibility() {
  //falbackcode
  //$("table").find("th:last-child, td:last-child").remove();
    trying();
console.log("herereer")

}
function  trying() {
  var table = document.getElementById("" + tablename + ""),
    rows = table.rows;
console.log(rows[0].cells.length)
for (var i = 0; i < rows[0].cells.length; i++) {
    var str = rows[0].cells[i].innerHTML;
    if (str.search("modify") != -1) {
        for (var j = 0; j < rows.length; j++) {
            rows[j].deleteCell(i);
        }
    }
}
}
