const locations = document.querySelector('.locations');
const routes = document.querySelector('.routes');
let fullData = {
   locations: {
   }
};

// Variable keeping track of which location is currently selected
let activeLocation;

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


   function getLocationsList() {
      let output = Object.keys(fullData.locations).map((location, count) =>
         <li id={location} key={location} onMouseOver={() => updateSidebar(location) }><a href={location}>{location}</a>: {fullData.locations[location].count} routes found</li>
      );

      ReactDOM.render(output, locations);
   }


   function updateSidebar(location) {
      // If there is a location active, de-activate it and remove the selected class
      if (activeLocation != null)
         activeLocation.setAttribute('class', '');
      // Set the hovered location as the active and selected location
      activeLocation = document.getElementById(`${location}`);
      activeLocation.setAttribute('class', 'selected');

      // Update the side bar to include the routes at the selected location
      let sidebar = document.querySelector('.sidebar .routes');
      let output = Object.keys(fullData.locations[location].routes).map((route) => {
         let path = `${location}/${fullData.locations[location].routes[route].id}`;
         return <li id={route} key={route}><a href={path}>{route}</a></li>
      });

      ReactDOM.render(output, sidebar);
   }

   getLocationsList();
   
})
.catch(error => console.log(error))



function getRoutes() {
   
}
