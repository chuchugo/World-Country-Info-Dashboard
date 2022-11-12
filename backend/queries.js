const axios = require('axios');
const { db } = require('./db.js');
const API_URL = "https://restcountries.com/v3.1/";

// Fetch countries data from the correct API endpoint
async function fetchCountries(name) {
  // Make request
  try {
    var res = await axios.get(API_URL + 'name/United')
    console.log(1);
  } catch (error) {
    console.error('error in geting restcountries API', error);
  }
  // Show response data
  return res.data
}

// Insert data from API into the countries table
async function insertCountry(name) {
  const countries = await fetchCountries(name)
  //parse json into a list of info of each country

  let countryRecords = []
  for (let i = 0; i < Object.keys(countries).length; i++) {
    let countryCode = countries[i]['ccn3']
    let name = countries[i]['name']['official']
    let capital = countries[i]['capital'][0]
    let population = countries[i]['population']
    let currency = Object.keys(countries[i]['currencies'])[0]
    let lat = countries[i]['latlng'][0]
    let lng = countries[i]['latlng'][1]
    let area = countries[i]['area']
    let populationDensity = population / area
    //put all data into info
    let info = [countryCode, name, capital, population, currency, lat, lng, area, populationDensity]
    countryRecords.push(info)
  }
  //print the data
  console.log(countryRecords)

  //write in to db
  //create query
  let placeholders = countryRecords.map(() => "(?, ?, ?, ?, ?, ?, ?, ?,?)").join(', ');
  let query = "INSERT INTO countries (country_code, name ,capital, population, currency, lat, lng, area, population_density) VALUES " + placeholders;
  //flat the country info from list of list into just one list
  let flatCountries = [];
  countryRecords.forEach((arr) => { arr.forEach((item) => { flatCountries.push(item) }) });

  db.serialize(function() {
    db.run(query, flatCountries, function(err) {
      if (err) throw err;
    });
  });
  console.log("finished adding to db")
}

var isFirstReq = true
// GET country route
async function getCountries(req, res) {
  if (!req.params.name) {
    return res.json({ err: true, msg: 'invalid request' });
  }

  if (isFirstReq) {
    isFirstReq = false;
    let name = req.params.name;
    await insertCountry(name);
  }

  //Return response to frontend by fetching data from the database
  //read from db
  let sql = `SELECT * FROM countries
             ORDER BY name`;
  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json(rows)
      }
    })
  } catch (err) {
    console.error('error in getting data from database', err);
  }

}

module.exports = {
  getCountries
}