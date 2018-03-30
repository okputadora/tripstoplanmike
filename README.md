# TripsToPlan
TripsToPlan is an application for planning trips that are suited to your interests

## File structure
+--index.html
+--application.html
+--results.html
+--about.html
+--js
|  +--loadViews.js
|  +--amadeus.js
|  +--eventful.js
|  +--results.js
+--css
|  +--styles.css
|  +--materilize.css
## Summary of the Code

### loadViews.js

### eventful.js
results.js takes the data from eventful.js and amadeus.js
and displays them in the browser on top of a google map

the general structure is as follows:
1. Initialize the map
2. use googleGeoCoder to get the coordinates of the cities
   2.1 put the cities on the map as their results come in
   2.2 and add an eventListener to the marker
3. zoom into city when a city marker is clicked
4. Display dateRanges
5. display events when a dateRange is clicked
   5.1 add an event listener for each event
   5.2 display event info when clicked
6. display flight and hotel info when a dateRange is clicked
7. reset map i.e. zoom back out

### results.js
results.js takes the data from eventful.js and amadeus.js
and displays them in the browser on top of a google map

the general structure is as follows:
1. Initialize the map
2. use googleGeoCoder to get the coordinates of the cities
   2.1 put the cities on the map as their results come in
   2.2 and add an eventListener to the marker
3. zoom into city when a city marker is clicked
4. Display dateRanges
5. display events when a dateRange is clicked
   5.1 add an event listener for each event
   5.2 display event info when clicked
6. display flight and hotel info when a dateRange is clicked
7. reset map i.e. zoom back out
