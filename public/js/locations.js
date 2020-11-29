const locations = document.querySelector('.locations');
const routes = document.querySelector('.routes');
let fullData = {
   locations: {
   }
};

function getLocationsList() {
   let output = Object.keys(fullData.locations).map((location, count) => {
      // If on mobile, clicking a location (not the button) should bring you to the sidebar
      if(window.innerWidth < 415) {
         return <li className='location' id={location} key={location} onClick={() => {updateSidebar(location); window.location.href='#sidebar' }}>{location}: {fullData.locations[location].count} routes</li>
      }
      else
      {
         return <li className='location' id={location} key={location} onClick={() => updateSidebar(location) }><p href={location}>{location}: {fullData.locations[location].count} routes</p></li>
      }
   });

   ReactDOM.render(output, locations);
}

function updateSidebar(location) {
   let title = document.getElementById("locationName");
   // let locationName = <h1><a href={location}>{location}</a></h1>;
   let locationName = <h2>{location}</h2>;
   ReactDOM.render(locationName, title);
   
      // If there is a location active, de-activate it and remove the selected class
      if (activeLocation != null)
         activeLocation.setAttribute('class', 'location');
      // Set the hovered location as the active and selected location
      activeLocation = document.getElementById(`${location}`);
      activeLocation.setAttribute('class', 'selected location');

      // Update the side bar to include the routes at the selected location
      let sidebar = document.querySelector('.sidebar .routes');
      let output = Object.keys(fullData.locations[location].routes).map((route) => {
         let path = `${location}/${fullData.locations[location].routes[route].id}`;
         return <li id={route} key={route}><a href={path}>{route} (difficulty: {fullData.locations[location].routes[route].rating})</a></li>
      });

      ReactDOM.render(output, sidebar);
}

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

   // function getLocationsList() {
   //    let output = Object.keys(fullData.locations).map((location, count) => {
   //       // If on mobile, clicking a location (not the button) should bring you to the sidebar
   //       if(window.innerWidth < 415) {
   //          return <a class='locationLI' href='#sidebar'><li class='location' id={location} key={location} onClick={() => updateSidebar(location) }><a href={location}>{location}</a>: {fullData.locations[location].count} routes found</li></a>
   //       }
   //       else
   //       {
   //          return <li class='location' id={location} key={location} onMouseOver={() => updateSidebar(location) }><a href={location}>{location}</a>: {fullData.locations[location].count} routes found</li>
   //       }
   //    });

   //    ReactDOM.render(output, locations);
   // }

   

   getLocationsList();
   
})
.catch(error => console.log(error))

window.onresize = getLocationsList;


function getRoutes() {
   
}
