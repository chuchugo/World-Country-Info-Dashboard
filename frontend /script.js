const API_URL = "https://WoefulOldlaceRuntime.chuchuwu.repl.co";

const table = document.getElementById('table1');
const tblDensity = document.getElementById('table2');


fetchAPI("/country/United", (data) => {
  if (data.err) {
    return console.log(err);
  }
  //Process the response from the backend
  data.json().then(json => render(json));
  var docs = document.getElementsByClassName('loading');
  for (var i = 0; i < docs.length; ++i) {
    docs[i].style.display = "none";
  }
})


//Fetch backend data
function fetchAPI(endpoint, callback) {
  fetch(API_URL + endpoint, { method: 'GET' })
    .then((response) => callback(response))
    .catch(err => console.log(err)) //deal with errors
}

//Load the chart in the frontend
function render(json) {
  const names = [];
  const populations = [];
  const codes = [];
  const capitals = [];
  const currencies = [];
  const lats = [];
  const lngs = [];
  const areas = [];
  const populationDensities = [];
  json.forEach(country => {
    names.push(country.name);
    populations.push(country.population);
    codes.push(country.country_code);
    capitals.push(country.capital);
    currencies.push(country.currency);
    lats.push(country.lat);
    lngs.push(country.lng);
    areas.push(country.area);
    populationDensities.push(country.population_density);
  });

  loadChart(names, populations);

  //format the data for display
  json.forEach(country => {
    //population with , 
    country.population = String(country.population).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    //lan lng with 2 decimal places
    //population density with 2 decimal places
    country.population_density = (Math.round(country.population_density * 100) / 100).toFixed(2);
  })

  loadTable1(json);
  loadTable2(json);
}
//load table1 using tabulator
function loadTable1(tabledata) {
  //define some sample data
  //create Tabulator on DOM element with id "table1"
  var table = new Tabulator("#table1", {
    height: 205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically 
    data: tabledata, //assign data to table
    layout: "fitColumns", //fit columns to width of table 
    columns: [ //Define Table Columns
      { title: "Code", field: "country_code", width: 70 },
      { title: "Country Name", field: "name", resizable: true, minWidth: 220 },
      { title: "Capital", field: "capital" },
      { title: "Population", field: "population" },
      { title: "Currency", field: "currency", width: 90 },
      { title: "Latitude", field: "lat" },
      { title: "Longtitude", field: "lng" },
    ],
  });
}
//load table of puplation density using tabulator
function loadTable2(tabledata) {
  //define some sample data
  var table = new Tabulator("#table2", {
    resizableColumnFit: true, //maintain the fit of columns when resizing
    height: 205,
    data: tabledata, //assign data to table
    layout: "fitColumns", //fit columns to width of table 
    columns: [ //Define Table Columns
      { title: "Country Name", field: "name", width: 150, resizable: true },
      { title: "Population Density", field: "population_density", width: 150, resizable: true }
    ],
  });
}

//load chart using chartJS
function loadChart(countryNames, countryPopulation) {
  //reformat contryNames by grouping every three words together
  let countryNamesArr = []
  countryNames.forEach(name => {
    let words = name.split(" ");
    let nameArr = []
    //for each name split it in three-words array
    let j = 0
    while (j < words.length) {
      let threeWords;
      if (j == words.length - 1)
        threeWords = words[j];
      else if (j == words.length - 2)
        threeWords = words[j] + " " + words[j + 1];
      else
        threeWords = words[j] + " " + words[j + 1] + " " + words[j + 2];
      j = j + 3
      nameArr.push(threeWords)
    }
    countryNamesArr.push(nameArr);
  })
  //reformat population
  let formatedPopulation = []
  countryPopulation.forEach(population => {
    formatedPopulation.push(population / 1000000);
  })
  //load chart
  const data = {
    labels: countryNamesArr,
    datasets: [{
      backgroundColor: 'rgb(37, 190, 174)',
      borderColor: 'rgb(37, 190, 174)',
      data: formatedPopulation,
      label: "Population(Millions)"
    }]
  };
  const chartPopulation = document.getElementById('chart1');
  const chart1 = new Chart(
    chartPopulation,
    {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0, //set the ticks at x axis displaying horizontally
              minRotation: 0
            }
          }
        }
      }
    }
  );
  chart1.resize(700, 280);
}



