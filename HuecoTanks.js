const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));

app.get('/', (req, res) => {

});

app.get('/map', (req, res) => {
   

});

app.get('/routes', (req, res) => {
   

});

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
})