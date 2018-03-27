var displayCities = JSON.parse(localStorage.cities)
coordsList = []
function initMap() {
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
        }, 200)

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
  console.log(currentCity)
  // get the data for this vacation
  console.log(localStorage.vacations)
}
$("#loader").append(`<div class="preloader-wrapper big active margin30">
          <div class="spinner-layer spinner-blue-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
        <div id="loadingMessages"></div>`)

var loadingMessages = ["Your results are being calculated...",
  "finding events that match your interests...",
  "optimizing the best vacation"]
index = 0
$("#loadingMessages")
setInterval(function(){
  $("#loadingMessages").html(loadingMessages[index])
  index++
  // check if the results are in

}, 3000)
