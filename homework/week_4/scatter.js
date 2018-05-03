// Name: Michael Zonneveld
// Studentnumber: 11302984


// function that will be triggered when the page is loaded
window.onload = function() {
  var svg = d3.select("svg");
  paragraph = d3.select("body")
  paragraph.append("p").text("Name: Michael Zonneveld")
  paragraph.append("p").text("Studentnummer: 11302984")
  paragraph.append("p").text("Insert information here")

  // retrieve data from api and store the queries
  wellBeing = "http://stats.oecd.org/SDMX-JSON/data/RWB/AUS+AUT+BEL+CAN+CZE+DNK+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+ESP+SWE+CHE+TUR+GBR+USA.VOTERS_SH+BB_ACC+SUBJ_PERC_CORR.VALUE/all?startTime=2014&endTime=2014"

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

  // create a list with countries
  countryArray = []

  for(var i = 0; i < 30; i++){
    countryArray.push(data.structure.dimensions.series[0].values[i]["name"])
  }
  console.log(countryArray)

  // and a list with all the values
  wellBeingArray = []

  for(var i = 0; i < countryArray.length; i++){
    for(var j = 0; j < 3; j++){
      var linking = i + ":" + j +":0"
      wellBeingArray.push(data.dataSets[0].series[linking].observations)
    }
  }
  console.log(wellBeingArray)

  
};



function makeCanvas(){
width = 1200;
height = 800;
padding = 200;

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


};
