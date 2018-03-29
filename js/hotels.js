$(document).ready(function () {
  
  console.log("HOTELS LINKED")

  //----- global variables-----------------------------------
    var vacRoomHold = [];    /* holding spot for existing array elements from local Storage */

    //----- functions------------------------------------------

    //Calculate the average hotel cost for a given city and timeframe
    //Push array of objects vacRoomCost to local storage after done computing each stay.  ***See issue below.***
    //***note*** needs to be added to javascript.js - Requires hotelCodes array in local storage
    //***note*** needs to be added to javascript.js - hotelCodes is the airportCodes array with the origin city sliced off
    //***note*** needs to be added to javascript.js - localStorage.setItem("hotelCodes", JSON.stringify(airportCodes.slice(1)));
    function hotelstay(loc, date) {
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

        console.log(dest + "   " + checkin + "   " + checkout);

        var rad = "&radius=20";   /* distance in km */
        // end of test search parameters

        var curr = "&currency=usd";   /* show prices in this currency */
        var rescount = "&number_of_results=10";  /* max number of results */
        var roomtype = "&all_rooms=false";  /* shows lowest rate room */

        var searchurl = siteurl + apikey + dest + checkin + checkout + rad + curr + rescount + roomtype;
        console.log(searchurl);

        $.ajax({
            url: searchurl,
            method: "GET"
        })
            .then(function (response) {
                for (var i = 0; i < 10; i++) {
                    avgRoomRate = avgRoomRate + (response.results[i].total_price.amount) / 10;
                }

                vacRoomCost = [{
                    cityCode: loc,
                    stayDate: date.startDate,
                    avgCost: avgRoomRate.toFixed(2)
                }];

                console.log(vacRoomCost);
                vacRoomHold.push(vacRoomCost);
            });
    }

    // Inner loop goues through each date range
    function inner(city) {
        var ic = 0;

        while (ic < (JSON.parse(localStorage.getItem("hotelRanges")).length)) {
            hotelstay(city, JSON.parse(localStorage.getItem("hotelRanges"))[ic]);     /* call hotelstay with city and date */
            ic++
        }

        return;
    }

    // Outer loop goes through each city
    function outer() {
        var oc = 0;     /* outerloop counter */

        while (oc < (JSON.parse(localStorage.getItem("hotelCodes")).length)) {
            inner(JSON.parse(localStorage.getItem("hotelCodes"))[oc]);      /* call inner loop with present city name */
            oc++
        }

        return;
    }

    //----- end of functions-----------------------------------



    //----- start----------------------------------------------
    $(window).on("load", function () {
      $("#dateBtn").on("click", function(){
        outer();    /* call statement start the calculations */
        console.log("VACAROOMHOLD")
        console.log(vacRoomHold)
        localStorage.setItem("vacRoomCost", JSON.stringify(vacRoomHold));
      })

    });






});
