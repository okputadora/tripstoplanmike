
// this file is solely for looking up flights and hotels as soon
// the user enters their hometown and destinations
// output is stored in localStorage as localStorage.hotels
// and localStorage.flights
$(window).on("load", function () {
  var airportCodes = []
  var vacRoomHold = [];    /* holding spot for existing array elements from local Storage */
  var fares = []
  // search for flights and hotels once the users have enteres all of their cities.
  $("#dateBtn").on("click", function(){
    // set time out zero to ensure this function is run after the
    // function connected to the same click in application.js
    setTimeout(function(){
      var destinations = JSON.parse(localStorage.cities)
      // convert each city object into a clean array of cities
      var cities = destinations.map(function(destination){
        return destination.cityName
      })

      // and add the origin city, we'll need this airport code too
      var homeCity = localStorage.homeCity
      // make copies because we end up mutating cities
      var hotelCities = Object.assign({}, cities)
      var flightCities = Object.assign([], cities)
      cities.unshift(homeCity)

      // OK, we've got the cities. now lets get airport codes from the city
      // we'll recursively run getAirportCode until we have them all, pass this function
      // the list of our cities and an empty list to build the list of codes and
      // something to do when we've found all the codes (i.e. the callback function)
      // in this case our callback function will be to actually look up the flights
      airportCodeLookUp(cities, function(){
        console.log(airportCodes)
        localStorage.setItem("airportCodes", JSON.stringify(airportCodes))
        localStorage.setItem("hotelCodes", JSON.stringify(airportCodes.slice(1)));
        // get flights
        getFlights(flightCities)
        // and get hotels
        outer(hotelCities)
      })
    }, 0)
  })

  function getFlights(flightCities){
    console.log("OK, looking for flights now with...")
    //test data
    console.log(flightCities)
    var flightCity = flightCities.pop()
    var org = "&origin=" + airportCodes[0]  /* ABC */
    var dest = "&destination=" + airportCodes.pop();  /* XYZ */
    // NEED TO CONVERT THIS DATE
    var departureDates = JSON.parse(localStorage.departureDates)
    console.log("FLIGHT CITY")
    console.log(flightCity)
    appendDates(org, dest, departureDates, flightCity, function(){
      if (airportCodes.length === 1){
        // WE GOT ALL THE INFO WE NEED
        console.log("WE'RE DONE")
        console.log(fares)
        localStorage.setItem("fares", JSON.stringify(fares))
      }
      else{
        getFlights(flightCities)
      }
    })

  }
  function appendDates(origin, destination, departureDates, flightCity, callback){
    console.log("FLIGHT CITY form append dates")
    console.log(flightCity)
    var departureDate = departureDates.shift()
    var depDate = "&departure_date=" + departureDate; /* YYYY-mm-dd */
    // end of test data/


    var type = "&one-way=false"  /* show round trip fare */
    var length = "&duration=7";  /* length of trip */

    var apikey = "?apikey=0COdldqUIjt22sU7ABdhCSSmsYxU4JTa";
    var siteurl = "https://api.sandbox.amadeus.com/v1.2/flights/extensive-search";
    var searchurl = siteurl + apikey + origin + destination + depDate + type + length;

    $.ajax({
      url: searchurl,
      method: "GET"
    })
      .then(function (response) {
        fares.push({city: flightCity, response: response})
        if (departureDates.length === 0){

          callback()
        }
        else{
          appendDates(origin, destination, departureDates, flightCity, callback)
        }
        // if (flights){
        //   flights.push(response)
        // }
        // else{
        //   var flights = []
        //   flights.push(response)
        // }
        // if (destinations.length > 0){
        //   flightfare(origin, destinations)
        // }
        // else{
        //   console.log("DONE LOOKING FOR FLIGHTS")
        //   console.log(flights)
        // }
        // console.log(response);
      });
  }
  // Call to Amadeus API for hotel price

     // // City Autocomplete - 2 functions - Showcity, Autocomplete
    // // function showcity sends the correct city and IATA code to the screen

  // i supposed this function could be combined with the function that handles the actual API
  // lookup but its working now and we're pressed for time

  // removed link to the form. now this autocomplete lookup happens in the background when
  // the user has entered all of their destinations
    // we pass the function the list of cities
    // and something to do when it's done (i.e. the callback)
  function airportCodeLookUp(cities, callback){
    var city = cities.shift()
    var url = "https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?"
      $.ajax({
        url: "https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?",
        dataType: "json",
        data: {
          apikey: "0COdldqUIjt22sU7ABdhCSSmsYxU4JTa",
          term: city
        }
      })
      .catch(function(error){
        if (city.toLowerCase() === "philadelphia"){
          airportCodes.push("PHL")
        }
        else if (city.toLowerCase() === "boston"){
          airportCodes.push("BOS")
        }
        else if (city.toLowerCase() === "miami"){
          airportCodes.push("MIA")
        }
        if (cities.length === 0){
          callback()
        }
        else{
          airportCodeLookUp(cities, callback)
        }
      })
      .done(function (data) {
          var code = data[0].value
          airportCodes.push(code)
          if (cities.length === 0){
            callback()
          }
          else{
            airportCodeLookUp(cities, callback)
          }
      })
  }


  //----- functions------------------------------------------

  //Calculate the average hotel cost for a given city and timeframe
  //Push array of objects vacRoomCost to local storage after done computing each stay.  ***See issue below.***
  //***note*** needs to be added to javascript.js - Requires hotelCodes array in local storage
  //***note*** needs to be added to javascript.js - hotelCodes is the airportCodes array with the origin city sliced off
  //***note*** needs to be added to javascript.js - localStorage.setItem("hotelCodes", JSON.stringify(airportCodes.slice(1)));
  function hotelstay(loc, date, city) {
      var avgRoomRate = 0;
      var vacRoomCost = {
          cityCode: "",
          stayDate: "",
          avgCost: 0
      }

      var apikey = "?apikey=0COdldqUIjt22sU7ABdhCSSmsYxU4JTa";
      var siteurl = "https://api.sandbox.amadeus.com/v1.2/hotels/search-airport"

      // search paramaters
      var dest = "&location=" + loc;                  /* IATA city code */
      var checkin = "&check_in=" + date.startDate;    /* YYYY-mm-dd */
      var checkout = "&check_out=" + date.endDate;   /* YYYY-mm-dd */
      var rad = "&radius=20";   /* distance in km */
      // end of test search parameters

      var curr = "&currency=usd";   /* show prices in this currency */
      var rescount = "&number_of_results=10";  /* max number of results */
      var roomtype = "&all_rooms=false";  /* shows lowest rate room */

      var searchurl = siteurl + apikey + dest + checkin + checkout + rad + curr + rescount + roomtype;


      $.ajax({
          url: searchurl,
          method: "GET"
      })
          .then(function (response) {
              for (var i = 0; i < 10; i++) {
                  avgRoomRate = avgRoomRate + (response.results[i].total_price.amount) / 10;
              }

              vacRoomCost = {
                  city: city,
                  stayDate: date.startDate,
                  avgCost: avgRoomRate.toFixed(2)
              };


              vacRoomHold.push(vacRoomCost);

              localStorage.setItem("vacRoomHold", JSON.stringify(vacRoomHold))
          });
  }

  // Inner loop goues through each date range
  function inner(city, hotelCity) {
      var ic = 0;

      while (ic < (JSON.parse(localStorage.getItem("hotelRanges")).length)) {
          hotelstay(city, JSON.parse(localStorage.getItem("hotelRanges"))[ic], hotelCity);     /* call hotelstay with city and date */
          ic++
      }

      return;
  }

  // Outer loop goes through each city
  function outer(hotelCities) {
      var oc = 0;     /* outerloop counter */
      while (oc < (JSON.parse(localStorage.getItem("hotelCodes")).length)) {
          inner(JSON.parse(localStorage.getItem("hotelCodes"))[oc], hotelCities[oc]);      /* call inner loop with present city name */
          oc++
      }

      return;
  }
})
