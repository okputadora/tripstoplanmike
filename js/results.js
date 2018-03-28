var displayCities = JSON.parse(localStorage.cities)
var coordsList = []


// playing with changing data to see what happens

   function initMap(){
     // get coords for all the cities
     getCoords(displayCities, function(){
       var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 4.5,
         center: {lat: 38.850033, lng: -97.6500523}
       });
       coordsList.forEach(function(coords, i){
         console.log("new marker")
         console.log(coords)
         var cities = JSON.parse(localStorage.cities)
         city = cities[i]
         var marker = new google.maps.Marker({
           position: coords,
           map: map,
           city: city.cityName,
           title: "See your vacation in " + city.cityName
         });
         // set up an event listner for each pin we drop.
         // if the user clicks that pin zoom in
         console.log(marker)
         marker.addListener('click', function(){
           var zoomLevel = 6
           var zoomin = setInterval(function(){
             map.setZoom(zoomLevel);
             map.setCenter(marker.getPosition())
             zoomLevel += 1
             if (zoomLevel >  12){
               displayCityDetails(marker.city)
               clearInterval(zoomin)
             }
           }, 200);
         })

         var vacations = localStorage.vacations
         vacations = JSON.parse(vacations)
         var dateWindows;
         vacations.forEach(function(vacation){
           if (vacation.city.cityName === marker.city){
             dateWindows = vacation.dateWindows
             return
           }
         })
         var displayDateWindows = dateWindows.map(function(date){
           var formattedStartDate = moment(date.startDate, "YYYYMMDD").format("MM-DD-YYYY")
           var formattedEndDate = moment(date.endDate, "YYYYMMDD").format("MM-DD-YYYY")
           return ("<button class='btn waves-effect waves-light datewindow' id='"+marker.city+"-"+date.startDate+"'>" + formattedStartDate + " to " + formattedEndDate + "</button>")
         })
         var buttons = displayDateWindows.join("")
         console.log("BUTTONS")
         console.log(buttons)
         console.log(dateWindows)
         var infoWindow = new google.maps.InfoWindow({
           content: "<div class='center'><h1 class='cityName'>"+marker.city+"</h1>"+buttons+"<div>"
           //Listener for InfoWindow
         })
         marker.addListener("click", function(){
           infoWindow.open(map, marker);
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

   function displayCityDetails(currentCity){
     // console.log(currentCity)
     // get the data for this vacation
   }

   $(document).on("click", ".datewindow", function(){
     console.log(this.id)
     /// grab the interest list that matches this datewindow and city
   })

// example of part of the working code that has the info window

// function initMap() {
//   var Mandeville = { lat: 18.0313, lng: -77.5046 };
//   var map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 4,
//       center: Mandeville
//   });
//   var marker = new google.maps.Marker({
//       position: Mandeville,
//       map: map
//       //Add icons here for the different results
//
//   });
//   //add info window here so that users are able to view info about the results
//   var infoWindow = new google.maps.InfoWindow({
//       content: "<h1> Mandeville, JA</h1>"
//   });
//   //Listener for InfoWindow
//   marker.addListener("click", function(){
//       infoWindow.open(map, marker);
//   })
