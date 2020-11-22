const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const parser = require('body-parser');

app.use(parser.urlencoded({
    'extended': false,
    'limit': 1024
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));

// Fetch variables
const fetch = require('node-fetch');
const key = "200976075-5e0eef9985cd16b8e7a3f68105cd6b29";
const maxResults = 50;
//const url = `https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=31.93&lon=-106.05&maxDistance=1&minDiff=${minGrade}&maxDiff=${maxGrade}&maxResults=${maxResults}&key=${key}`; // TODO set API url here

async function fetchData(minGrade, maxGrade) {
   let url = `https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=31.93&lon=-106.05&maxDistance=1&minDiff=${minGrade}&maxDiff=${maxGrade}&maxResults=${maxResults}&key=${key}`; // TODO set API url here
   let response = await fetch(url);
   let data = await response.json();
   return data;
}

// Global variables
var gradeSelection;



app.get('/', (req, res) => {

});


app.post('/', async(req, res) => {
   gradeSelection = req.body.grade;
   console.log(gradeSelection);
   let x = await fetchData(gradeSelection, gradeSelection);
   for (var i = 0; i < x.routes.length; ++i)
   {
      console.log(x.routes[i].name);
   }
   res.writeHead(302, {'Location': `/`})
   res.end();
});

app.get('/data', async (req, res) => {
   // TODO: get min and max grade from a form from the user as arguments
   let data = await fetchData(("V3", "V3"));
   res.json(data);
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

app.post('/submit', (req, res) => {
   const {grade} = req.body;
   res.writeHead(302, {'Location': `/locations`})
});

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
})