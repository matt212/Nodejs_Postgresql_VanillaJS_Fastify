const autocannon = require('autocannon')
var count=0
var redlime={"daterange":{"startdate":"1982-06-19","enddate":"2022-07-19"},"searchtype":"NoFilter","datecolsearch":"created_date","searchparam":["NA"],"pageno":0,"pageSize":20};

const instance = autocannon({
    url: 'http://localhost:3011/employees/api/searchtype/',
    connections: 10, 
    pipelining: 1, 
    duration: 60,
    
    
    method:"POST",
    debug:true,
    headers: {"Content-Type": "application/json", 'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTgyNjYwNDd9.-rURewao6iwOXP7AnE0BFdQVpafb3WSzNxlX8C-kS6k'},
    body: JSON.stringify(redlime),
    verifyBody: verifyBody,
  }, (err, result) => {
    console.log("----------Error-----------");
      console.log(err);
    if (err != null) return; // or do some error handling
    handleResults(result);
 })
instance.on('done', handleResults)


instance.on('response', handleResponse)
instance.on('verifyBody', verifyBody)
function verifyBody(data)
{
  //console.log(data)
  console.log("on track--------------------"+JSON.parse(data).count)
  return (JSON.parse(data).count==="2088290")
}
function handleResults(data)
{
    
    // console.log("--------------------------")
    //console.log(data)
    // //console.log(data.url)
    console.log("errors :"+data.errors)
    console.log("timeouts : "+data.timeouts)
    console.log("non2xx :"+data["non2xx"])
    console.log("resets :"+data["resets"])
    console.log("3xx :"+data["3xx"])
    console.log("4xx :"+ data["4xx"])
    console.log("2xx :" +data["2xx"])
    console.log("5xx :"+data["5xx"])
   
    // console.log("timeouts :"+data["timeouts"])
    
}
function handleResponse (client, statusCode, resBytes, responseTime) {
   
  
   //console.log(`Got response with code ${statusCode} in ${responseTime} milliseconds`)
   //console.log(`response: ${resBytes.toString()}`)
  
    //update the body or headers
    
  }
//autocannon.track(instance)
autocannon.track(instance, {renderResultsTable: true, renderLatencyTable: true, renderProgressBar: true})
