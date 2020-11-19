const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));

// Fetch variables
const fetch = require('node-fetch');
var minGrade = "V3";
var maxGrade = "V3";
const key = "200976075-5e0eef9985cd16b8e7a3f68105cd6b29";
var maxResults = 5;
const url = `https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=31.93&lon=-106.05&maxDistance=1&minDiff=${minGrade}&maxDiff=${maxGrade}&maxResults=${maxResults}&key=${key}`; // TODO set API url here

let routes;
fetch(url)
    .then (response => {
        return response.json();
    })
    .then(data => {
        routes = data;
      //   console.log(routes);
    })
    .catch(error => console.log(error))

app.get('/', (req, res) => {

});

app.get('/locations', (req, res) => {
   // Fetch the available routes at location and link to each problem
   let locationsArr= []; // Each route should link to the route page
   let locations = {};

   // Simple test case, tested and works (11/18/2020)
   routes.routes.forEach(route => {
      let area;
      const {location} = route;
      if (location.length >= 4) // Find the location, 4th from the top hierarchy if it exists
      {
         area = location[3];
      }
      else // If the location doesn't have a hierarchy depth of 4, use the last available
      {
         area = location[location.length-1];
      }

      if (area in locations)
      {
         locations[area] += 1;

      }
      else
      {
         locations[area] = 1;
      }
   });
   for (let location in locations)
   {
      locationsArr.push(`<li><a href='${location}'>${location}</a>: ${locations[location]} routes found</li>`);
   }
   //routesArr[0] = routes.routes[0].name;
   res.render('locationList', {
      locationsList: `${locationsArr.join(``)}`
   });
});

app.get('/:location?', (req, res) => {
   // Fetch the available problems at the route location and link to each problem
   let problems = []; // Each problem should link to the problem page
   res.render('location', {
      location: `${req.params.location}`,
      problemList: problems
   });
});

app.get('/:location/:problem', (req, res) => {
   // Fetch all information for the problem and display the information with the route pug template
   res.render('problem', {
      location: `<a href='/${req.params.location}'>${req.params.location}</a>`,
      problem: `${req.params.problem}`
      // Put other relevant information here
   });
});

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
})