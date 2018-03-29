//api key xmnsRKbacpmsh6ZB83cvLNMQc4LTp1Znb3fjsngAa5M9Bt400S
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
var api_key = 'qmFPcpp4ZnChQdF5';

var loadingMessages = ["Your results are being calculated...",
  "finding events that match your interests...",
  "optimizing the best vacation"]
index = 0
setInterval(function(){
  $("#loadingMessages").html(loadingMessages[index])
  index++
}, 3000);

  console.log("connected")
  // get the data from local storage
  var cities = JSON.parse(localStorage.cities)
  var dateRanges = JSON.parse(localStorage.eventfulRanges)
  var interests = JSON.parse(localStorage.interests)
  // build a request URL from the data
  var vacations = []
  appendCity()

  function appendCity(){
    // remove one city from the list
    city = cities.shift()
    // create a new vacation object and add the city to it
    var vacation = {
      city: city,
      dateWindows: []
    }
    // it will be necessary to keep track of how many times we call appendDates
    // because when we add interests to that specific date range we need to reference
    // its position in the array of date windows
    var dateIndex = 0
    appendDates(vacation, dateIndex, function(){
      // add the vacation to the list of possible vacations
      vacations.push(vacation)
      // if there are more cities repeat the process
      if (cities.length !== 0){
        // reset the dateRanges.
        // to get the recursive functions to terminate we've been removing
        // items from these lists...now we need to reset them because we're
        // creating a new vacation object
        dateRanges = JSON.parse(localStorage.eventfulRanges)
        interests = JSON.parse(localStorage.interests)
        appendCity()
      }
      else {
        console.log("===============END RESULT==============")
        localStorage.setItem("vacations", JSON.stringify(vacations))
        // remove loading window
        $("#loader").remove()
      }
    })
  }
  function appendDates(vacation, dateIndex, callback){
    console.log("appending dates")
    // remove a datewindow from the list and add it to an object
    // that will also store interests associated with that date (& city)
    var window = dateRanges.shift()
    var dateWindow = {
      startDate: window.startDate,
      endDate: window.endDate,
      interests: []
    }
    // add it to the vacation object
    vacation.dateWindows.push(dateWindow)
    // pass the vacation  object off to appendInterests
    appendInterests(vacation, dateIndex, function(){
      // if theres more dateWindows repeat the process
      if (dateRanges.length !== 0){
        dateIndex += 1
        // reset the interests
        interests = JSON.parse(localStorage.interests)
        appendDates(vacation, dateIndex, callback)
      }
      else{
        callback()
      }
    })
  }
  function appendInterests(vacation, dateIndex, callback){
    console.log("category:")
    var interest = interests.shift()
    console.log(interest.category)
    interest = {
      interestName: interest.interestName,
      interestCategory: interest.category,
      events: []
    }
    // get events from API
    console.log("VACATION")
    console.log(vacation)
    var api_url = 'http://api.eventful.com/json/events/search?app_key='+ api_key+
    '&keywords='+interest.interestName +
    '&category='+interest.category +
    '&location='+ vacation.city.cityName +
    '&date='+ vacation.dateWindows[dateIndex].startDate+"00-"+vacation.dateWindows[dateIndex].endDate + '00';
    var request_url = cors_api_url + api_url;
    $.ajax({
      url: request_url,
    })
    .error(function(error) {
      // we'll have to do our own error handling
      response = JSON.parse(error.responseText)
      if (response.events){
        console.log(response.events.event)
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
        // add the results to our interes object
        interest.events = parsedResults
        // and add our interest object to our vacation object
        vacation.dateWindows[dateIndex].interests.push(interest)
      }
      if (interests.length !== 0){
        appendInterests(vacation, dateIndex, callback)
      }
      else {callback()}
    })
    .done(function(data){
      console.log(data.responseText);
    })
  }


  // NOTE: The nested for loops below seem like they should work but AHHHH
  // remember the loops aren't going to pause until the ajax responses come in
  // they're going to just keep running and then we wont know wat to puch
  // var allEvents= []
  // cities.forEach(function(city){
  //   dateRanges.forEach(function(dateRange){
  //     interests.forEach(function(interest){
  //       console.log(city)
  //       console.log(dateRange)
  //       console.log(interest)
  //       var api_url = 'http://api.eventful.com/json/events/search?app_key='+ api_key+
  //       '&keywords='+interest.interestName +
  //       '&category='+interest.category +
  //       '&location='+ city.cityName +
  //       '&date='+ dateRange.startDate+"00-"+dateRange.endDate + '00';
  //       var request_url = cors_api_url + api_url;
  //       $.ajax({
  //         url: request_url,
  //       })
  //       .error(function(error) {
  //         // we'll have to do our own error handling
  //         response = JSON.parse(error.responseText)
  //         if (response.events){
  //           console.log(response.events.event)
  //           var parsedResults = response.events.event.map(function(event){
  //             return ({
  //               title: event.title,
  //               city: event.city_name,
  //               state: event.region_name,
  //               description: event.description,
  //               venue: event.venue_name,
  //               venueAddress: event.venue_address,
  //               venueUrl: event.venue_url,
  //               lat: event.latitude,
  //               lon: event.longitude,
  //               startTime: event.start_time,
  //               interest: interest.interestName,
  //               category: interest.category,
  //               dateWindow: dateRange,
  //             })
  //           })
  //           allEvents.push(parsedResults)
  //           if (allEvents.length = cities.length * dateRanges.length * interests.length){
  //             console.log(allEvents)
  //             $("#loader").remove()
  //           }
  //         }
  //       })
  //       .done(function(data){
  //         console.log(data.responseText);
  //       })
  //     })
  //   })
  // })
  //
