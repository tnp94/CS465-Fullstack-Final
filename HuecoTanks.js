const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));
// const url; // TODO set API url here
const fetch = require('node-fetch');


app.get('/', (req, res) => {

});

app.get('/routes', (req, res) => {
   // Fetch the available routes at location and link to each problem
   let routes = []; // Each route should link to the route page
   res.render('routesList', {
      routesList: `${routes}`
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