// Name: Michael Zonneveld
// Studentnumber: 11302984

// function that will be triggered when the page is loaded
window.onload = function() {
  var svg = d3.select("svg");
  paragraph = d3.select("body")

  // retrieve data from api and store the queries
  var wellBeing = "http://stats.oecd.org/SDMX-JSON/data/RWB/AUS+AUT+BEL+CAN+CZE+DNK+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+ESP+SWE+CHE+TUR+GBR+USA.VOTERS_SH+BB_ACC+SUBJ_PERC_CORR.VALUE/all?startTime=2014&endTime=2014"

  // request for the queries
  d3.queue()
  .defer(d3.request, wellBeing)
  .awaitAll(getData);            // due to asynchronounity wait for all

  makeCanvas();

};

function getData(error, response) {
  if (error) throw error;

  // make json format from the data
  data = JSON.parse(response[0].responseText)


  // list for all the countries
  var countryArray = []
  for(var i = 0; i < 30; i++){
    countryArray.push(data.structure.dimensions.series[0].values[i]["name"])
  }

  // and a list for all the values
  var oecdArray = []

  // place the values in the list
  for(var i = 0; i < countryArray.length; i++){
    for(var j = 0; j < 3; j++){
      var linking = i + ":" + j +":0"
      oecdArray.push(data.dataSets[0].series[linking].observations)
    }
  }

  var values = []

  // digging a little bit further so we skip non-values
  for(var i = 0; i < oecdArray.length; i++){
  values.push(oecdArray[i][0][0])
  }

  // list for all the values about internet access
  internetArray = [];

  for (var i = 0; i < values.length; i+=3){
    internetArray.push(values[i])
  }

  // also for the voter turn out values
  voterArray = [];

  for(var i = 1; i < values.length; i+=3){
    voterArray.push(values[i])
  }

  // and for the perception of corruption
  perceptionArray = []

  for(var i = 2; i< values.length; i+=3){
    perceptionArray.push(values[i])
  }

  // making a dict for indexing later on
  wellBeingDict = []

  // linking keys and values in a dictionary
  for(var i = 0; i < 30; i++){
    wellBeingDict.push({
      country: countryArray[i],
      internetAccess: internetArray[i],
      voterTurnOut: voterArray[i],
      perceptionOfCorruption: perceptionArray[i]
      })
  }
  console.log(wellBeingDict)

};

function makeCanvas(){
width = 1200;
height = 800;
padding = 200;

// creating a canvas to draw my scatterplot on
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);




};
