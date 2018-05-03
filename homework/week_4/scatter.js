// Name: Michael Zonneveld
// Studentnumber: 11302984

// function that will be triggered when the page is loaded
window.onload = function() {

  // retrieve data from api and store the queries
  var wellBeing = "http://stats.oecd.org/SDMX-JSON/data/RWB/AUS+AUT+BEL+CAN+CZE+DNK+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+ESP+SWE+CHE+TUR+GBR+USA.VOTERS_SH+BB_ACC+SUBJ_PERC_CORR.VALUE/all?startTime=2014&endTime=2014";

  // request for the queries
  d3.queue()
  .defer(d3.request, wellBeing)
  .awaitAll(getData);            // due to asynchronounity wait for all

  // makeCanvas();

};

function getData(error, response) {
  if (error) throw error;

  // make json format from the data
  var data = JSON.parse(response[0].responseText);

  // list for all the countries
  var countryArray = [];

  for(var i = 0; i < 30; i++){
    countryArray.push(data.structure.dimensions.series[0].values[i]["name"])
  }

  // and a list for all the values
  var oecdArray = [];

  // place the values in the list
  for(var i = 0; i < countryArray.length; i++){
    for(var j = 0; j < 3; j++){
      var linking = i + ":" + j +":0";
      oecdArray.push(data.dataSets[0].series[linking].observations);
    }
  }

  var values = [];

  // digging a little bit further so we skip non-values
  for(var i = 0; i < oecdArray.length; i++){
  values.push(oecdArray[i][0][0]);
  }

  // list for all the values about internet access
  var internetArray = [];

  for (var i = 0; i < values.length; i+=3){
    internetArray.push(values[i]);
  }

  // also for the voter turn out values
  var voterArray = [];

  for(var i = 1; i < values.length; i+=3){
    voterArray.push(values[i]);
  }

  // and for the perception of corruption
  var perceptionArray = [];

  for(var i = 2; i< values.length; i+=3){
    perceptionArray.push(values[i]);
  }

  // making a dict for indexing later on
  var wellBeingDict = [];

  // linking keys and values in a dictionary
  for(var i = 0; i < 30; i++){
    wellBeingDict.push({
      country: countryArray[i],
      internetAccess: internetArray[i],
      voterTurnOut: voterArray[i],
      perceptionOfCorruption: perceptionArray[i]
    });
  }
  // console.log(wellBeingDict[2]['internetAccess'])

  // data = [[perceptionArray], [voterArray]];
  // console.log(data)

// };
//
// function makeCanvas(){

var w = 1000;
var h = 500;
var margin = {top: 20, right: 20, bottom: 30, left: 40};

var xScale = d3.scaleLinear()
                .domain([0, d3.max(perceptionArray, d => d[0])])
                .range([0, w]);

var yScale = d3.scaleLinear()
               .domain([0, d3.max(voterArray, d => d[1])])
               .range([h, 0]);
xScale
   .domain(perceptionArray)
   .range([0, w]);

yScale
    .domain([0, d3.max(voterArray, function(d) { return d[1]; })])
    .range([0, h]);

// creating a canvas to draw my scatterplot on
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

};
