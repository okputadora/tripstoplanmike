Eventful.js is responsbile collecting event information
from the ventful api.

The general structure is as follows:
1. build all of our queries by looping through the cities, datewindows,
   and interests. We need a query for each possible combination of city,
   window and interest.

2. take those queries and map them into an array of promises that make
   ajax requests

3. wait for all of the promises to be fullfilled and then save the results.

// global variables
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
var api_key = 'qmFPcpp4ZnChQdF5';
var vacations = [];
// get the data from local storage
var cities = JSON.parse(localStorage.cities);
var dateRanges = JSON.parse(localStorage.eventfulRanges);
var interests = JSON.parse(localStorage.interests);

// display loading messages until the ajax requests are resolved
var loadingMessages = ["Your results are being calculated...",
  "finding events that match your interests...", "haggling with the airlines...",
  "looking for a hotel","optimizing the best vacation"];
var index = 0;
$("#loadingMessages");
setInterval(function(){
  $("#loadingMessages").html(loadingMessages[index]);
  index++;
}, 3000);

// 1. build the query URLs
var queryUrls = [];
cities.forEach(function(city){
  dateRanges.forEach(function(dateRange){
    interests.forEach(function(interest){
      var api_url = 'http://api.eventful.com/json/events/search?app_key='+ api_key+
      '&keywords='+interest.interestName +
      '&category='+interest.category +
      '&location='+ city.cityName +
      '&date='+ dateRange.startDate+"00-"+dateRange.endDate + '00';
      var request_url = cors_api_url + api_url;
      queryUrls.push({
        city: city,
        dateRange: dateRange,
        interest: interest,
        request_url: request_url
      });
    })
  })
})

// 2. map the query urls to promises that make ajax requests
var ajaxPromises = queryUrls.map(function(queryInfo){
  return (
    new Promise(function(resolve, reject){
      $.ajax({
        url: queryInfo.request_url,
      })
      // strangely our response is coming in as an error,
      // this may be due to our CORS workaround
      .error(function(error) {
        // we'll have to do our own error handling
        response = JSON.parse(error.responseText);
        // if this query yielded some events, grab the event info
        if (response.events){
          var parsedResults = response.events.event.map(function(event){
            return ({
              title: event.title,
              city: event.city_name,
              state: event.region_name,
              description: event.description,
              venue: event.venue_name,
              venueAddress: event.venue_address,
              venueUrl: event.venue_url,
              lat: event.latitude,
              lon: event.longitude,
              startTime: event.start_time
            })
          })
          resolve({
            city: queryInfo.city.cityName,
            dateRange: queryInfo.dateRange,
            interest: queryInfo.interest,
            events:parsedResults
          })
          return
        }
        reject(error)
      })
      .done(function(data){
        console.log(data)
      })
    })
  )
})


Promise.all(ajaxPromises).then(function(values){
  localStorage.setItem("eventList", JSON.stringify(values))
   $("#loader").remove()
}).catch(function(error){
  console.log(error)
})


//
// appendCity()
// // build a request URL from the data
// function appendCity(){
//   console.log("vacations")
//   console.log(vacations)
//   // remove one city from the list
//   city = cities.shift()
//   // create a new vacation object and add the city to it
//   var vacation = {
//     city: city,
//     dateWindows: []
//   }
//   // it will be necessary to keep track of how many times we call appendDates
//   // because when we add interests to that specific date range we need to reference
//   // its position in the array of date windows
//   var dateIndex = 0
//   appendDates(vacation, dateIndex, function(){
//     console.log("vacations")
//     console.log(vacations)
//     // add the vacation to the list of possible vacations
//     vacations.push(vacation)
//     // if there are more cities repeat the process
//     if (cities.length !== 0){
//       // reset the dateRanges.
//       // to get the recursive functions to terminate we've been removing
//       // items from these lists...now we need to reset them because we're
//       // creating a new vacation object
//       dateRanges = JSON.parse(localStorage.eventfulRanges)
//       interests = JSON.parse(localStorage.interests)
//       appendCity()
//     }
//     else {
//       localStorage.setItem("vacations", JSON.stringify(vacations))
//       // remove loading window
//       $("#loader").remove()
//     }
//   })
// }
// function appendDates(vacation, dateIndex, callback){
//   // remove a datewindow from the list and add it to an object
//   // that will also store interests associated with that date (& city)
//   var window = dateRanges.shift()
//   var dateWindow = {
//     startDate: window.startDate,
//     endDate: window.endDate,
//     interests: []
//   }
//   // add it to the vacation object
//   vacation.dateWindows.push(dateWindow)
//   // pass the vacation  object off to appendInterests
//   appendInterests(vacation, dateIndex, function(){
//     // if theres more dateWindows repeat the process
//     if (dateRanges.length !== 0){
//       dateIndex += 1
//       // reset the interests
//       interests = JSON.parse(localStorage.interests)
//       appendDates(vacation, dateIndex, callback)
//     }
//     else{
//       callback()
//     }
//   })
// }
// function appendInterests(vacation, dateIndex, callback){
//   var interest = interests.shift()
//   interest = {
//     interestName: interest.interestName,
//     interestCategory: interest.category,
//     events: []
//   }
//   // get events from API
//   var api_url = 'http://api.eventful.com/json/events/search?app_key='+ api_key+
//   '&keywords='+interest.interestName +
//   '&category='+interest.category +
//   '&location='+ vacation.city.cityName +
//   '&date='+ vacation.dateWindows[dateIndex].startDate+"00-"+vacation.dateWindows[dateIndex].endDate + '00';
//   var request_url = cors_api_url + api_url;
//   $.ajax({
//     url: request_url,
//   })
//   .error(function(error) {
//     // we'll have to do our own error handling
//     response = JSON.parse(error.responseText)
//     if (response.events){
//       var parsedResults = response.events.event.map(function(event){
//         return ({
//           title: event.title,
//           city: event.city_name,
//           state: event.region_name,
//           description: event.description,
//           venue: event.venue_name,
//           venueAddress: event.venue_address,
//           venueUrl: event.venue_url,
//           lat: event.latitude,
//           lon: event.longitude,
//           startTime: event.start_time
//         })
//       })
//       // add the results to our interes object
//       interest.events = parsedResults
//       // and add our interest object to our vacation object
//       vacation.dateWindows[dateIndex].interests.push(interest)
//     }
//     if (interests.length !== 0){
//       appendInterests(vacation, dateIndex, callback)
//     }
//     else {callback()}
//   })
//   .done(function(data){
//   })
// }
