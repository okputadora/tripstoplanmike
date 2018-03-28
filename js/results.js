var displayCities = JSON.parse(localStorage.cities)
var coordsList = []
var vacations = localStorage.vacations
vacations = JSON.parse(vacations)

// playing with changing data to see what happens

   function initMap(){
     // get coords for all the cities
     getCoords(displayCities, function(){
       var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 4.5,
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
         $("#map").on("click", ".datewindow", function(){
           cityMarker.setMap(null)
           // clear the city marker
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
     var infoWindow = new google.maps.InfoWindow({
       content: "<div class='center'><h3 class='cityName'>"+marker.city+"</h3>"+
        "<p class='vacaDesc'>You have "+displayDateWindows.length+" possible vacations in "+marker.city+
        ". Click the date window to see some events you might be interested in.</br>"+
        buttons+"<div>"
     })
     infoWindow.open(map, marker);
   }
   function displayEvents(map, pin){
      var index = pin.id.slice(0, pin.id.indexOf("-"))
      var startDate = pin.id.slice(pin.id.indexOf("-")+ 1)
      var windows = vacations[index].dateWindows
      var interests;
      windows.forEach(function(window){
        if (window.startDate === startDate){
          interests = window.interests
        }
      })
      var events;
      interests.forEach(function(interest){
        events = interest.events
      })
      events.forEach(function(event){
        var lat = parseFloat(event.lat)
        var lng = parseFloat(event.lon)
        var coords = {lat: lat, lng: lng}
        var eventMarker = new google.maps.Marker({
          position: coords,
          map: map,
          animation: google.maps.Animation.DROP,
          title: event.title
        })
        eventMarker.addListener("click", function(){
          // load information into info window
          displayEventInfo(eventMarker, event)
        })
      })
   }
   function displayEventInfo(marker, event){
     if (event.description !== null){
       var description = event.description
     }
     else{description = ""}
     var infoWindow = new google.maps.InfoWindow({
       content: "<div><h4>"+event.title+"</h4><p class='truncate'>"+description+"</p></div>"
     })
     infoWindow.open(map, marker)
   }
    // append each event to the map
