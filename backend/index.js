const express = require('express');
const queries = require('./queries.js');

const PORT = 3000;
const app = express();


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
})

//ROUTES section 
app.get('/', (req, res) => {
  res.send("THIS IS BACKEND!");
})

app.get('/country/:name', queries.getCountries);

app.listen(PORT, () => console.log("server listening!"));