var minGrade = "V3";
var maxGrade = "V3";
const key = "200976075-5e0eef9985cd16b8e7a3f68105cd6b29";
var maxResults = 500;
const url = `https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=31.93&lon=-106.05&maxDistance=1&minDiff=${minGrade}&maxDiff=${maxGrade}&maxResults=${maxResults}&key=${key}`; // TODO set API url here

      const locations = document.querySelector('.locations');
      const routes = document.querySelector('.routes');
      let fullData = {
         locations: {
         }
      };
      let locationsList = {};
      let routesList = {};
      
      fetch('/data')
      .then (response => {
         return response.json();
      })
      .then(data => {
         
         data.routes.forEach(route => {
         const {location} = route;
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
         });


         function getLocationsList() {

            let output = Object.keys(fullData.locations).map((location, count) =>
               <li id={location} key={location} onClick={() => updateSidebar(location) }><a href={location}>{location}</a>: {fullData.locations[location].count} routes found</li>
            );

            ReactDOM.render(output, locations);
         }

         function updateSidebar(location) {
            let sidebar = document.querySelector('.sidebar .routes');
            let output = Object.keys(fullData.locations[location].routes).map((route) => 
               <li id={route} key={route}><a href={route}>{route}</a></li>
            );

            ReactDOM.render(output, sidebar);
         }

         getLocationsList();
         
      })
      .catch(error => console.log(error))



      function getRoutes() {
         
      }
