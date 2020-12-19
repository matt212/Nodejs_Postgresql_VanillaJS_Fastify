const autocannon = require('autocannon')
var redlime={
	"searchparam": ["NA"],
	"daterange": {
		"startdate": "1982-12-30",
		"enddate": "2019-01-29"
	},
	"colsearch": "createdAt",
	"datecolsearch": "birth_date",
	"pageno": 0,
  "pageSize": 20,
  "searchtype": 'NoFilter'
}
const instance = autocannon({
    url: 'http://localhost:3011/employees/api/load/',
    connections: 100, 
     pipelining: 10, 
    duration: 50, 
    method:"POST",
    debug:true,
    headers: {"Content-Type": "application/json", 'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYXNlIjoibG9jYWxob3N0OjMwMTEiLCJpYXQiOjE2MDg0MDU0ODB9.n8CU3Gz5DmwSrm2wWTjQmTU3Xals6vWbMVG3bk9hyLs'},
    body: JSON.stringify(redlime),
  }, (err, result) => {
    console.log("----------Error-----------");
      console.log(err);
    if (err != null) return; // or do some error handling
    handleResults(result);
 })
instance.on('done', handleResults)



instance.on('response', handleResponse)
function handleResults(data)
{
    
    // console.log("--------------------------")
    // //console.log(data)
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
   //console.log(JSON.parse(client.resData[0].body));
  // console.log(`Got response with code ${statusCode} in ${responseTime} milliseconds`)
   //console.log(`response: ${resBytes.toString()}`)
  
    //update the body or headers
    
  }
//autocannon.track(instance)
autocannon.track(instance, {renderResultsTable: true, renderLatencyTable: true, renderProgressBar: true})
