const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));
// const url; // TODO set API url here

// Fetch variables
const fetch = require('node-fetch');
var minGrade = "V3";
var maxGrade = "V3";
const key = "200976075-5e0eef9985cd16b8e7a3f68105cd6b29";
var maxResults = 5;

let routes;
fetch(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=31.93&lon=-106.05&maxDistance=1&minDiff=${minGrade}&maxDiff=${maxGrade}&maxResults=${maxResults}&key=${key}`)
    .then (response => {
        return response.json();
    })
    .then(data => {
        routes = data;
        console.log(routes);
    })
    .catch(error => console.log(error))

app.get('/', (req, res) => {

});

app.get('/routes', (req, res) => {
   // Fetch the available routes at location and link to each problem
   let routesArr = []; // Each route should link to the route page

   // Simple test case, tested and works (11/18/2020)
   routesArr[0] = routes.routes[0].name;
   res.render('routesList', {
      routesList: `${routesArr}`
   });
});

app.get('/:route?', (req, res) => {
   // Fetch the available problems at the route location and link to each problem
   let problems = []; // Each problem should link to the problem page
   res.render('route', {
      route: `${req.params.route}`,
      problemList: problems
   });
});

app.get('/:route/:problem', (req, res) => {
   // Fetch all information for the problem and display the information with the route pug template
   res.render('problem', {
      route: `<a href='/${req.params.route}'>${req.params.route}</a>`,
      problem: `${req.params.problem}`
      // Put other relevant information here
   });
});

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
})