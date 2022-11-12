const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.log("db error!", err.message);
  }
});

//country code, capital, population, lat, lng
db.serialize(function() {
  db
    .run(`CREATE TABLE countries (
            country_code TEXT,
            name TEXT, 
            capital TEXT, 
            population NUMERIC,
            currency TEXT, 
            lat TEXT, 
            lng TEXT,
            area NUMERIC,
            population_density NUMERIC)`);
});

module.exports.db = db;