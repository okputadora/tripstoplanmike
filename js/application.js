// this file is solely for converting form inputs into localstorage
$(document).ready(function () {
    $("#cityBtn").on("click", function () {
        var cities = [];
        $(".city").each(function () {
            if ($(this).val() !== "") {
                var city = {
                    cityName: $(this).val(),
                };
                cities.push(city);
            }
        });
        localStorage.setItem("cities", JSON.stringify(cities));
        console.log(localStorage)
    });


    //Interests
    $("#interestBtn").on("click", function () {
        var interests = [];
        var interest;
        var categories = ["music", "sports", "theater"]
        $(".interest").each(function () {
            if ($(this).val() !== "") {
                for (i = 0; i < categories.length; i++) {
                    if ($(this).hasClass(categories[i])) {
                        var cat = categories[i]
                        interest = {
                            interestName: $(this).val(),
                            category: cat
                        }
                        interests.push(interest);
                        break;
                    }
                }
            }
        })
        console.log(interests)
        // add to local storage
        localStorage.setItem("interests", JSON.stringify(interests))
    })

    //************
    //DATE and range code
    //************
    $('.datepicker').pickadate({
        // selectMonths: true,// Creates a dropdown to control month
        // selectYears: 15 // Creates a dropdown of 15 years to control year,
    });
    //Dates with MOMENT Conversion
    $("#dateBtn").on("click", function () {
        //keep this vacaLenght
        var vacaLength = parseInt($("#vacaLength").val().trim());
        var eventfulRanges = [];
        var departureDates = [];
        var hotelRanges = [];
        $(".date").each(function () {
          // convert date for eventful api format
          // and different format for amadeus api
            if ($(this).val() !== "") {
                var date = $(this).val();
                var ourFormat = "DDMMMMY";
                // create a moment from the users input date
                var startMoment = moment(date, ourFormat)
                // use this moment to get a string of the start date
                // in the format we want for storage
                var startDate = startMoment.format("YYYYMMDD");
                var departureDate = startMoment.format("YYYY-MM-DD")
                // use the original moment object to calculate the end date
                // and format it at the same time
                var endDate = startMoment.add(vacaLength, "day")
                var endDate = endDate.format("YYYYMMDD")
                var hotelEndDate = endDate.format("YYYY-MM-DD")
                var eventfulRange = {
                    startDate: startDate,
                    endDate: endDate,
                };
                var hotelRange = {
                  startDate: departureDate,
                  endDate: hotelEndDate,
                }
                hotelRanges.push(hotelRange)
                eventfulRanges.push(eventfulRange)
                departureDates.push(departureDate)
            }

        });
        // add to localstorage
        localStorage.setItem("eventfulRanges", JSON.stringify(eventfulRanges))
        localStorage.setItem("hotelRanges", JSON.stringify(hotelRanges))
        localStorage.setItem("departureDates", JSON.stringify(departureDates))
        localStorage.setItem("duration", JSON.stringify(vacaLength))
        // LETS CONVERT THESE
    });


    //************
    //HomeLocation Code
    //************
    $("#homeBtn").on("click", function () {
        console.log("button worked and files are linked")
        var homeCity = $("#home").val().trim();
        console.log(homeCity);
        // add to local storage
        localStorage.setItem("homeCity", homeCity)
    });
    //************
    //get Long and Lat of current computer location
    //************
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    //lat and long positions happen behind the scenes
    function showPosition(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);
        var latlon = position.coords.latitude + "," + position.coords.longitude;
    }

    //************
    //Take Long and Lat of current computer location and get city and airport code
    //no code yet
    //************

});
