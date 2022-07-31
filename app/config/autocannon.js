const autocannon = require('autocannon')
var count = 0
var customRequest = { "daterange": { "startdate": "1982-06-19", "enddate": "2022-07-19" }, "searchtype": "NoFilter", "datecolsearch": "created_date", "searchparam": ["NA"], "pageno": 0, "pageSize": 20 }
var customResponse = {"rows":[{"employeesid":20667909,"first_name":"joi","last_name":"baker","gender":"M","birth_date":"2020-01-02T00:00:00.000Z","recordstate":true,"created_date":"2020-12-06T09:17:39.413Z","updated_date":"2020-12-06T09:17:39.413Z"},{"employeesid":20667908,"first_name":"nick","last_name":"holden","gender":"F","birth_date":"2020-01-02T00:00:00.000Z","recordstate":true,"created_date":"2020-12-06T09:16:56.425Z","updated_date":"2020-12-06T09:16:56.425Z"},{"employeesid":20667907,"first_name":"Xinglin","last_name":"Morrin","gender":"F","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667906,"first_name":"Xinglin","last_name":"Morrin","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667905,"first_name":"Ortrud","last_name":"Binding","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667904,"first_name":"Gennady","last_name":"Thiran","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667903,"first_name":"Goh","last_name":"Demke","gender":"F","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667902,"first_name":"Taegyun","last_name":"Zschoche","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667901,"first_name":"Sugwoo","last_name":"Muniz","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667900,"first_name":"Haldun","last_name":"Peek","gender":"F","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667899,"first_name":"Tsz","last_name":"England","gender":"F","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667898,"first_name":"Gererd","last_name":"Plesums","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667897,"first_name":"Prasadram","last_name":"Dusink","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667896,"first_name":"Basem","last_name":"Ashish","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667895,"first_name":"Lenore","last_name":"Schieder","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667894,"first_name":"Francesca","last_name":"Covnot","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667893,"first_name":"Aiman","last_name":"Vecchi","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667892,"first_name":"Mechthild","last_name":"Luft","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667891,"first_name":"Goh","last_name":"Ermel","gender":"F","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"},{"employeesid":20667890,"first_name":"Dzung","last_name":"Candan","gender":"M","birth_date":"2018-01-11T18:30:00.000Z","recordstate":true,"created_date":"2019-02-28T16:38:09.849Z","updated_date":"2019-02-28T16:38:09.849Z"}]}
const instance = autocannon({
  url: 'http://localhost:3012/employees/api/searchtype/',
  amount: 10,
  connections: 10,
  pipelining: 1,
  //duration: 60,
  method: "POST",
  debug: true,
 
  headers: { "Content-Type": "application/json; charset=UTF-8", 'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTkxMjMxMTd9.xavjahsbNggTSDBu6Vmsxzz6olPMXHTPggkFForZqaU' },
  body: JSON.stringify(customRequest),
  expectBody: JSON.stringify(customResponse),
//  verifyBody: verifyBodyResponse,

}, (err, result) => {

  console.log(err);
  if (err != null) return; // or do some error handling
  handleResults(result);
})
instance.on('done', handleResults)


instance.on('response', handleResponse)
instance.on('verifyBody', verifyBodyResponse)

function verifyBodyResponse(client) {
  console.log(typeof client)
}


function handleResults(data) {

  // console.log("--------------------------")
  //console.log(data)
  // //console.log(data.url)
  console.log("errors :" + data.errors)
  console.log("timeouts : " + data.timeouts)
  console.log("non2xx :" + data["non2xx"])
  console.log("resets :" + data["resets"])
  console.log("3xx :" + data["3xx"])
  console.log("4xx :" + data["4xx"])
  console.log("2xx :" + data["2xx"])
  console.log("5xx :" + data["5xx"])

  // console.log("timeouts :"+data["timeouts"])

}
function handleResponse(client, statusCode, resBytes, responseTime) {


  //console.log(`Got response with code ${statusCode} in ${responseTime} milliseconds`)
  //console.log(`response: ${resBytes.toString()}`)

  //update the body or headers

}
//autocannon.track(instance)
autocannon.track(instance, { renderResultsTable: true, renderLatencyTable: true, renderProgressBar: true })
