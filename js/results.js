// results.js takes the data from eventful.js and amadeus.js
// and displays them in the browser on top of a google map
//
// the general structure is as follows:
// 1. Initialize the map
// 2. use googleGeoCoder to get the coordinates of the cities
//    2.1 put the cities on the map as their results come in
//    2.2 and add an eventListener to the marker
// 3. zoom into city when a city marker is clicked
// 4. Display dateRanges
// 5. display events when a dateRange is clicked
//    5.1 add an event listener for each event
//    5.2 display event info when clicked
// 6. display flight and hotel info when a dateRange is clicked
// 7. reset map i.e. zoom back out


var displayCities = JSON.parse(localStorage.cities);
var eventList = JSON.parse(localStorage.eventList);
var coordsList = []; // store all of the geoCoordinates of the cities
var eventMarkers = []; // store marker objects for the events so we can clear them whenever we need to
var globalInfoWindow;
var MAP;
//1. initialize the map
function initMap(){
  MAP = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    mapTypeControl: false,
    center: {lat: 38.850033, lng: -97.6500523}
  });
  //2. get the coordinates and put a pin on the map for each city
  getCoords();
}

// 2. get coords
function getCoords(){
  displayCities.forEach(function(city){
    $.ajax({
      url: "https://maps.googleapis.com/maps/api/geocode/json?address="+city.cityName+"&key=AIzaSyCYUN28qqTKuwxF_I12PmuRvAQ6MqbmUDk&callback"
    })
    .done(function(result){
      var lat = result.results[0].geometry.location.lat;
      var lng = result.results[0].geometry.location.lng;
      coords = {lat: lat, lng: lng}
      // 2.1 put it on the map
      var cityMarker = new google.maps.Marker({
        position: coords,
        map: MAP,
        city: city.cityName,
        title: 'click to view your vacation in '+ city.cityName
      })
      // 2.2 add event listener for each marker
      // note - zoomeInToCity is in an anonymous function to prevent it from
      // running when this event listener is defined
      cityMarker.addListener('click', function(){zoomInToCity(cityMarker)})
    })
    .fail(function(error){
      console.log(error)
    })
 })
}

// 3. zoom in to city marker on click
function zoomInToCity(marker){
  var zoomLevel = 5
  var zoomIn = setInterval(function(){
    MAP.panTo(marker.getPosition());
    MAP.setZoom(zoomLevel);
    zoomLevel += 1
    if (zoomLevel >  11){
      console.log(zoomLevel)
      marker.setMap(null);
      // 4. display dateWindow
      displayDateRanges(marker); // pass the marker along so we can reference its city prop
      clearInterval(zoomIn);
    }
  }, 200);
}

// 4. display dateWindow
function displayDateRanges(marker){
  var dateRanges = JSON.parse(localStorage.hotelRanges);
  // map the dates to html elements
  var displayDateRanges = dateRanges.map(function(date){
    // reformat the dates
    var formattedStartDate = moment(date.startDate, "YYYY-MM-DD").format("dddd, MMMM Do, YYYY");
    var formattedEndDate = moment(date.endDate, "YYYY-MM-DD").format("dddd, MMMM Do YYYY");
    return ("<button class='btn waves-effect waves-light dateWindow' id='"+marker.city+
    "-"+date.startDate+"'>" + formattedStartDate + " to " + formattedEndDate + "</button></br>");
  })
  var buttons = displayDateRanges.join("")

  var dateWindowContent = "<div><h3 class='cityName'>"+marker.city+"</h3>"+buttons
  $(".dateWindowsContainer").append(dateWindowContent)
  $(".dateWindowsContainer").append("<button class='btn wave-effect waves-light resetMap'>Reset Map</button")
  $(".dateWindowsContainer").css("opacity", .9)
}

// 5 & 6 display events and flight/hotel info when datewindow clicked
$(document).on("click", ".dateWindow", function(){
  console.log("clicked")
  // grab the city and start date from this elements id
  var city = this.id.slice(0, this.id.indexOf("-"));
  var startDate = this.id.slice(this.id.indexOf("-")+ 1);
  startDate = moment(startDate, "YYYY-MM-DD").format("YYYYMMDD")
  displayEvents(city, startDate)
  // displayFlightHotel(city, startDate)
})

// 5. display events
function displayEvents(city, startDate){
  // clear any events they may already be on the map
  eventMarkers.forEach(function(event){
    event.setMap(null)
  })
  // find the events that match this city and start date
  eventList.forEach(function(event){
    if (event.city === city && event.dateRange.startDate === startDate){
      // and then add a marker for each event and map them to the global
      // variable eventMarkers so we can clear them when we load the next batch
      // of events
      eventMarkers = event.events.map(function(currentEvent){
        // grab the interest name
        var label = event.interest.interestName
        label = label.slice(0,2) // truncate
        // grab the coordinate data
        var lat = parseFloat(currentEvent.lat)
        var lng = parseFloat(currentEvent.lon)
        var coords = {lat: lat, lng: lng}
        // create a new marker for the event
        var eventMarker = new google.maps.Marker({
          position: coords,
          map: MAP,
          label: label,
          title: currentEvent.title
        })
        // 5.1 add event listener to this marker
        eventMarker.addListener("click", function(){
          displayEventInfo(currentEvent, eventMarker) // pass the event info
        })
        return(eventMarker)
      })
    }
  })
}

// 5.2 display eventInfo
function displayEventInfo(event, marker){
   // close any open windows
   if(globalInfoWindow){
    globalInfoWindow.close();
   }
   if (MAP.zoom === 11){
     var lat = marker.getPosition().lat()
     var lat = lat + 0.1
     var lng = marker.getPosition().lng()
     MAP.panTo({lat: lat, lng: lng})
   }
   if (event.description !== null){
     var description = event.description
   }
   else{description = ""}
   var startTime = moment(event.startTime, "YYYY-MM-DD HH:mm:ss").format("dddd, MMMM Do YYYY")
   var infoWindow = new google.maps.InfoWindow({
     content: "<div><h4>"+event.title+"</h4><p>"+startTime+
     "<p><a href='"+event.venueUrl+"'>"+event.venue+"</a></p>"+"<p>"+event.venueAddress+"</p>"+
     "</p><p class='truncate toggleText'>"+description+"</p></div>"
   })
   globalInfoWindow = infoWindow;
   infoWindow.open(MAP, marker)
 }
 // toggle length of long descriptions
 $(document).on("click", ".toggleText", function(){
   $(this).toggleClass("truncate")
 })

// 6. display flight/hotel info
function displayHotelsAndFlights(city, startDate){
  // clear ouy the div
  $(".hotelAndFlightContainer").empty();
  // find the
  var formattedDate = moment(startDate, "YYYYMMDD").format("YYYY-MM-DD")
  var hotels = JSON.parse(localStorage.getItem("vacRoomHold"))
  var hotelPrice;
  // find the hotel
  hotels.forEach(function(hotel){
    if (hotel.city === city && hotel.stayDate == formattedDate){
      // we've found the right hotel price
      hotelPrice = hotel.avgCost
      return;
    }
  })
  // find the flight
  var flights = JSON.parse(localStorage.getItem("fares"))
  var flightPrice;
  flights.forEach(function(flight){
    console.log(flight.response.results[0])
    console.log(flight.city)
    if (flight.city === city && flight.response.results[0].departure_date == formattedDate){
      flightPrice = flight.response.results[0].price
    }
  })
  $(".hotelAndFlightContainer").append("<p>Average hotel price: $"+hotelPrice+"</p>")
  $(".hotelAndFlightContainer").append("<p>Flight price: $"+flightPrice+"</p>")
  $(".hotelAndFlightContainer").css("opacity", .9)
}

// 7. reset map
$(document).on("click", ".resetMap", function(){
 for (var i = 0; i < eventMarkers.length; i++) {
   eventMarkers[i].setMap(null);
 }
 // reset the city markers
 getCoords()
 var zoomLevel = 11
 // clear the info panels
 $(".dateWindowsContainer").empty()
 $(".hotelAndFlightContainer").empty().css("opacity", 0)
 // and zoom out
 var zoomOut = setInterval(function(){
   MAP.setZoom(zoomLevel)
   zoomLevel -= 1
   if (zoomLevel < 4){
     MAP.panTo({lat: 38.850033, lng: -97.6500523})
     clearInterval(zoomOut)
   }
 }, 200)
})
