var displayCities = JSON.parse(localStorage.cities)
var coordsList = []
var eventMarkers = []
var vacations = localStorage.vacations
vacations = JSON.parse(vacations)

// playing with changing data to see what happens

   function initMap(){
     // get coords for all the cities
     getCoords(displayCities, function(){
       var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 4.5,
         mapTypeControl: false,
         center: {lat: 38.850033, lng: -97.6500523}
       });

       coordsList.forEach(function(coords, i){
         var cities = JSON.parse(localStorage.cities)
         city = cities[i]
         var cityMarker = new google.maps.Marker({
           position: coords,
           map: map,
           city: city.cityName,
           title: "See your vacation in " + city.cityName
         });
         // set up an event listner for each pin we drop.
         // if the user clicks that pin zoom in
         cityMarker.addListener('click', function(){
           var zoomLevel = 6
           var zoomin = setInterval(function(){
             map.setZoom(zoomLevel);
             map.setCenter(cityMarker.getPosition())
             zoomLevel += 1
             if (zoomLevel >  11){
               displayDateWindows(cityMarker, map)
               clearInterval(zoomin)
             }
           }, 200);
         })
         // map instance that is local to the init function
         $(document).on("click", ".datewindow", function(){
           // clear the city marker
           cityMarker.setMap(null)
           displayEvents(map, this)

         })
       })
     })
   }

   function getCoords(displayCities, callback){
     city = displayCities.shift()
     $.ajax({
       url: "https://maps.googleapis.com/maps/api/geocode/json?address="+city.cityName+"&key=AIzaSyCYUN28qqTKuwxF_I12PmuRvAQ6MqbmUDk&callback"
     })
     .done(function(result){
       coords = result.results[0].geometry.location
       lat = coords.lat
       lng = coords.lng
       coords = {lat: lat, lng: lng}
       coordsList.push(coords)
       if (displayCities.length !== 0){
         getCoords(displayCities, callback)
       }
       else{
         console.log(coordsList)
         callback()
       }
     })
     .fail(function(error){
       console.log(error)
     })

   }

  function displayDateWindows(marker, map){

    console.log("Displaying date window")
    var dateWindows;
    var vacaIndex;
    vacations.forEach(function(vacation, index){
       if (vacation.city.cityName === marker.city){
         dateWindows = vacation.dateWindows
         vacaIndex = index
         return
       }
     })
    var displayDateWindows = dateWindows.map(function(date){
      var formattedStartDate = moment(date.startDate, "YYYYMMDD").format("dddd, MMMM Do, YYYY")
      var formattedEndDate = moment(date.endDate, "YYYYMMDD").format("dddd, MMMM Do YYYY")
      return ("<button class='btn waves-effect waves-light datewindow' id='"+vacaIndex+
      "-"+date.startDate+"'>" + formattedStartDate + " to " + formattedEndDate + "</button></br>")
    })
    var buttons = displayDateWindows.join("")

    var dateWindowContent = "<div><h3 class='cityName'>"+marker.city+"</h3>"+buttons
    $(".dateWindowsContainer").append(dateWindowContent)
  }


  function displayEvents(map, pin){
     // clear the events
     for (var i = 0; i < eventMarkers.length; i++) {
       eventMarkers[i].setMap(null);
     }
     eventMarkers = []
      var index = pin.id.slice(0, pin.id.indexOf("-"))
      var startDate = pin.id.slice(pin.id.indexOf("-")+ 1)
      var windows = vacations[index].dateWindows
      var interests;
      windows.forEach(function(dateWindow){
        if (dateWindow.startDate === startDate){
          interests = dateWindow.interests
        }
      })
      var events;
      interests.forEach(function(interest){
        events = interest.events
      })

      events.forEach(function(currentEvent){
        var lat = parseFloat(currentEvent.lat)
        var lng = parseFloat(currentEvent.lon)
        var coords = {lat: lat, lng: lng}
        var eventMarker = new google.maps.Marker({
          position: coords,
          map: map,
          title: currentEvent.title
        })
        eventMarker.addListener("click", function(){
          // load information into info window
          displayEventInfo(eventMarker, currentEvent, map)
        })
        eventMarkers.push(eventMarker)
      })
   }
   function displayEventInfo(marker, currentEvent, map){
     console.log("MARKER POSITION")
     var lat = marker.getPosition().lat()
     var lat = lat + 0.1030022
     var lng = marker.getPosition().lng()
     map.panTo({lat: lat, lng: lng})
     if (currentEvent.description !== null){
       var description = currentEvent.description
     }
     else{description = ""}
     var infoWindow = new google.maps.InfoWindow({
       content: "<div><h4>"+currentEvent.title+"</h4><p class='truncate toggleText'>"+description+"</p>"+
       "<p>"+currentEvent.startTime+"</p></div>"
     })
     infoWindow.open(map, marker)
   }
   // toggle length of long descriptions
   $(document).on("click", ".toggleText", function(){
     $(this).toggleClass("truncate")
   })
    // append each event to the map
