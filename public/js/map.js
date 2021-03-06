const routes = document.querySelector('.routes');
let fullData = {
   locations: {
   }
};

// Variable keeping track of which location is currently selected
let activeLocation;


function updateSidebar(location) {
   let title = document.getElementById("locationName");
   let locationName = <h1>{location}</h1>;
   ReactDOM.render(locationName, title);

   // Update the side bar to include the routes at the selected location
   let sidebar = document.querySelector('.sidebar .routes');
   let output = Object.keys(fullData.locations[location].routes).map((route) => {
      let path = `${location}/${fullData.locations[location].routes[route].id}`;
      return <li id={route} key={route}><a href={path}>{route} (difficulty: {fullData.locations[location].routes[route].rating})</a></li>
   });

   ReactDOM.render(output, sidebar);
}

function addMarkers() {
   // For each location in the data, place a marker labeled with the number of routes at the location.
   Object.keys(fullData.locations).map((location) => {
      // Use the lat and long of the first route at the location because each route will have the same lat and long
      let firstRoute = fullData.locations[location].routes[Object.keys(fullData.locations[location].routes)[0]];
      let coordinates = new google.maps.LatLng(firstRoute.latitude, firstRoute.longitude);
      let marker = new google.maps.Marker({
         position: coordinates,
         label: fullData.locations[location].count.toString(),
         map: map,
         location: location
      });

      // Add event listener to each marker that will update the sidebar
      google.maps.event.addListener(marker, 'click', () => {
         updateSidebar(marker.location);
      });
   });
}

fetch('/data')
.then (response => {
   return response.json();
})
.then(data => {
   
   data.routes.forEach(route => {
   const {location} = route;
   if (location[2] == "North Mountain")
   {
      let area = location[location.length-1];
      if (area in fullData.locations)
      {
         fullData.locations[area].count += 1;
         fullData.locations[area].routes[route.name] = route;
      }
      else
      {
         fullData.locations[area] = {};
         fullData.locations[area].count = 1;
         fullData.locations[area].routes = {};
         fullData.locations[area].routes[route.name] = route;
      }
   }
   });
   
   

   

   

   addMarkers();
   
   
})
.catch(error => console.log(error))


