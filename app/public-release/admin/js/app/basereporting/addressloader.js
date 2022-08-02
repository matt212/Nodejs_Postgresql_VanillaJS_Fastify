/*
readyState  Holds the status of the XMLHttpRequest. 
0: request not initialized 
1: server connection established
2: request received 
3: processing request 
4: request finished and response is ready*/


/*var oldXHR = window.XMLHttpRequest;

function newXHR() {
    var realXHR = new oldXHR();
    realXHR.addEventListener("readystatechange", function() {

            if (realXHR.readyState == 4 && realXHR.status == 200) {
              //  console.log(realXHR.responseURL);
                var meh = realXHR.responseURL;
                substring = "api";
                if (meh.indexOf(substring) !== -1) {
                    //Pace.restart();
                    
                }
            }

            }, false);
        return realXHR;
    }
    window.XMLHttpRequest = newXHR;
*/



window.paceOptions = {
    document: true, // disabled
    eventLag: true,
    restartOnPushState: true,
    restartOnRequestAfter: true,
    ajax: {
        trackMethods: [ 'POST','GET'],
        ignoreURLs: ['searchtype','pivotresult','login','exportexcel','create','update','socket.io']
    }

};


 /*   window.paceOptions = {
        document: true, // disabled
        eventLag: true,
        restartOnPushState: true,
        restartOnRequestAfter: true,
        ajax: {
            trackMethods: ['GET', 'POST', 'PUT', 'DELETE', 'REMOVE']
        }

    };*/