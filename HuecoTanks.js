// Using express framework
const express = require('express');
const app = express();
var url = require("url");
var fs = require('fs');
//const port = process.env.PORT || 5000;
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

// Serve index, locationList, and map(not yet implemented) as static pages
app.use(express.static('public'));

// Parser for parsing form data from post methods
const parser = require('body-parser');

app.use(parser.urlencoded({
    'extended': false,
    'limit': 1024
}));

// Add functionality for the pug templating engine
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Save individual route information in a cache as requested by the mountain project API
// Add cache functionality for individual routes
var cache = require('memory-cache');
let routeCache = new cache.Cache();


// Fetch variables
const fetch = require('node-fetch');
const { render } = require('pug');
const { Router } = require('express');
const { removeData } = require('jquery');
const key = "200976075-5e0eef9985cd16b8e7a3f68105cd6b29";
const maxResults = 50;
//const url = `https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=31.93&lon=-106.05&maxDistance=1&minDiff=${minGrade}&maxDiff=${maxGrade}&maxResults=${maxResults}&key=${key}`; // TODO set API url here

// Function to fetch the data from the api, this is used on the back end to keep api-key private and it's reusable
async function fetchData(minGrade, maxGrade) {
   let cacheTarget = 'full'; // Use a temporary cache target since this is limited functionality at the moment
   let data = cache.get(cacheTarget); // Check if fullData is in the server-side cache
   if (data === null)
   {
      // If it was not in the cache, fetch the full data and then add it to the cache for 10 minutes
      let url = `https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=31.93&lon=-106.05&maxDistance=1&minDiff=${minGrade}&maxDiff=${maxGrade}&maxResults=${maxResults}&key=${key}`; // TODO set API url here
      let response = await fetch(url);
      data = await response.json();
      cache.put(cacheTarget, data, 600000);
   }
   return data;
}

// For fetching particular grades and caching those grades.
async function fetchData2(minGrade, maxGrade) {
   let cacheTarget = 'full';
   let data = cache.get(cacheTarget);
   let url = `https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=31.93&lon=-106.05&maxDistance=1&minDiff=${minGrade}&maxDiff=${maxGrade}&maxResults=${maxResults}&key=${key}`; // TODO set API url here
   let response = await fetch(url);
   data = await response.json();
   cache.clear();
   cache.put(cacheTarget, data, 600000);
   return data;
}

async function getRoute(routeID) {
   let route = routeCache.get(routeID); // Check if route is in the server-side cache
   if (route === null)
   {
      // If it was not in the cache, fetch the route and add it to the cache for 1 week as requested by the mountain project api
      let url = `https://www.mountainproject.com/data/get-routes?routeIds=${routeID}&key=${key}`;
      let response = await fetch(url);
      let data = await response.json();
      route = data.routes[0];
      routeCache.put(routeID, route, 604800000); 
   }
   return route;
}

// Global variables
var gradeSelection;
var problems;

app.post('/filteredRoutes/', async(req, res) => {
   gradeSelection = req.body.grade;
   console.log(gradeSelection);
   problems = await fetchData2(gradeSelection, gradeSelection);
   //console.log(problems.routes);
    res.render('problemList', {
       problemList: problems.routes
   });
   res.end();
});

<<<<<<< HEAD
app.get('/problem/:id', async (req, res) => {
   //console.log(req.params.id);
   var route_id = req.params.id;
   var found = false;
   var index;
   for (index = 0; index < problems.routes.length && found == false; ++index) {
      if (route_id == problems.routes[index].id) {
         found = true;
      }
   }
   if (found) {
      --index;
      var img_url = `/images/${problems.routes[index].id}.jpg`;
      console.log(img_url);
      res.render('problem', {
         routeID: problems.routes[index].id,
         problem: problems.routes[index].name,
         type: problems.routes[index].type,
         difficulty: problems.routes[index].rating,
         stars: problems.routes[index].stars,
         subArea: problems.routes[index].location[3],
         urlMP: problems.routes.url,
         image: img_url
      });
   }
   else {
      res.redirect('/');
   }
   res.end();
});

=======
// ROUTE FOR HOME PAGE
>>>>>>> 03dd86214c293187e59d289e25b88fbbb9a992e6
app.get('/', async (req, res) => {
   res.end();
});

// ROUTE TO GET ALL OF THE DATA
app.get('/data', async (req, res) => {
   // Get all data from the API
   let data = await fetchData("V0", "V15");
   res.json(data);
   res.end();
});

<<<<<<< HEAD



// app.get('/:location?', (req, res) => {
//    // Fetch the available problems at the route location and link to each problem
//    let problems = []; // Each problem should link to the problem page
//    res.render('location', {
//       location: `${req.params.location}`,
//       problemList: problems
//    });
// });

=======
// ROUTE FOR EACH INDIVIDUAL PROBLEM
>>>>>>> 03dd86214c293187e59d289e25b88fbbb9a992e6
app.get('/:location/:problem', async (req, res) => {
   // Fetch all information for the problem and display the information with the route pug template
   if (isNaN(parseInt(req.params.problem))) // Catches pathways that are not routeID's
   {
      res.writeHead(404, { 'Content-Type': 'text/plain'});
      res.write('404 - Page not found');
      res.end();
   }
   else
   {
      let route = await getRoute(req.params.problem);
      if (route === null) 
      {
         // problem was not a valid RouteID. API returned nothing
         res.render('problem', {
            location: `${req.params.location}`,
            problem: `NOT FOUND`
         });
      }
      else
      {
         // problem found, display detailed information
         const {id, name, type, rating, stars, location, url, imgMedium} = route;
         res.render('problem', {
            location: `${req.params.location}`,
            problem: name,
            routeID: id,
            type: type,
            difficulty: rating,
            stars: stars,
            locationHierarchy: location,
            link: url,
            imageUrl: imgMedium
            // Put other relevant information here
         });
      }
   }

});

<<<<<<< HEAD


=======
// ---------- I THINK THIS IS NOT USED BUT I AM AFRAID TO DELETE IT SO CLOSE TO SUBMISSION ----------
>>>>>>> 03dd86214c293187e59d289e25b88fbbb9a992e6
app.get('/:location?', async (req, res) => {
   // Fetch all information for the problem and display the information with the route pug template
   {
      let route = await getRoute(req.params.problem);
      if (route === null) 
      {
         // problem was not a valid RouteID. API returned nothing
         res.render('location', {
            location: `<a href='/${req.params.location}'>${req.params.location}</a>`,
         });
      }
      else
      {
         // problem found, display detailed information
         res.render('location', {
            location: `<a href='/${req.params.location}'>${req.params.location}</a>`,
         });
      }
   }
});
// ----------------------------------- End of unused -------------------------------------------------

app.post('/submit', (req, res) => {
   const {grade} = req.body;
   res.writeHead(302, {'Location': `/locations`})
});

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
});