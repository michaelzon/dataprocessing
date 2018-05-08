// function that will be triggered when the page is loaded
window.onload = function() {

  // api request for the data
  var wellBeing = "https://stats.oecd.org/SDMX-JSON/data/RWB/NL11+NL12+NL13+NL21+NL22+NL23+NL31+NL32+NL33+NL34+NL41+NL42.RWB+INCOME_DISP+JOB+EMP_RA+UNEM_RA+EDU38_SH+VOTERS_SH+BB_ACC+SUBJ_SOC_SUPP+SUBJ_PERC_CORR.VALUE/all?startTime=2014&endTime=2014"
  var income = "https://stats.oecd.org/SDMX-JSON/data/RWB/NL11+NL12+NL13+NL21+NL22+NL23+NL31+NL32+NL33+NL34+NL41+NL42.RIDD+INEQ+GINI+S80S20A+PVT+PVT6A.VALUE+UP_CI+LO_CI/all?startTime=2009&endTime=2014"

  // request for the queries
  d3.queue()
  .defer(d3.request, wellBeing)
  .defer(d3.request, income)
  .awaitAll(getData);

};

function getData(error, response) {
  if (error) throw error;

  // make json format from the first data set
  var firstData = JSON.parse(response[0].responseText);

  // list for all the regions
  var firstRegionsArray = [];

  // insert twelve regions in array
  for(var i = 0; i < 12; i ++){
    firstRegionsArray.push(firstData.structure.dimensions.series[0].values[i]["name"])
  }

  // and a list with all the elements from api request
  var firstSet = [];

  // push 8 elements in an array with strictly values
  for(var i = 0; i < firstRegionsArray.length; i ++){
    for(var j = 0; j < 8; j ++){
      var linking = i + ":" + j + ":0";
      firstSet.push(firstData.dataSets[0].series[linking].observations["0"]["0"]);
    }
  }

  // list for all the unemployment rate values
  var unemRaArray = [];

  // which is on 0th position
  for (var i = 0; i < firstSet.length; i += 8){
    unemRaArray.push(firstSet[i]);
  }

  // for the employment rate values
  var empRaArray = [];

  // which is on 1th position
  for(var i = 1; i < firstSet.length; i += 8){
    empRaArray.push(firstSet[i]);
  }

  // for the share of labour force with at least secondary education
  var eduShArray = [];

  // which is on the 2th position
  for(var i = 2; i < firstSet.length; i += 8){
    eduShArray.push(firstSet[i]);
  }

  // for the voter turnout in general election
  var votersShArray = [];

  // which is on 3th position
  for(var i = 3; i < firstSet.length; i += 8){
  votersShArray.push(firstSet[i]);
  }

  // for the perceived social network support values
  var socSuppArray = [];

  // which is on 4th position
  for(var i = 4; i < firstSet.length; i += 8){
  socSuppArray.push(firstSet[i]);
  }

  // for the share of households with internet broadband access values
  var bbAccArray = [];

  // which is on 5th position
  for(var i = 5; i < firstSet.length; i += 8){
  bbAccArray.push(firstSet[i]);
  }

  // for the disposable income per capita values
  var incomeDispArray = [];

  // which is on 6th position
  for(var i = 6; i < firstSet.length; i += 8){
  incomeDispArray.push(firstSet[i]);
  }

  // for the perception of corruption
  var percCorrArray = [];

  // which is on 7th position
  for(var i = 7; i < firstSet.length; i += 8){
  percCorrArray.push(firstSet[i]);
  }

  // making first dict for indexing later on
  var wellBeingDict = [];

  // linking keys and values in dictionary
  for(var i = 0; i < 12; i++){
    wellBeingDict.push({
      region: firstRegionsArray[i],
      unemRa: unemRaArray[i], // vraag nog even na hoe je hier procent teken kan hardcoden of zoek het zelf uit.
      empRa: empRaArray[i],
      eduSh: eduShArray[i],
      votersSh: votersShArray[i],
      socSupp: socSuppArray[i],
      bbAcc: bbAccArray[i],
      incomeDisp: incomeDispArray[i],
      percCorr: percCorrArray[i]
    });
  }

  // make json format from the second data set
  var secondData = JSON.parse(response[1].responseText);

  // create a second regions array, because the order from second dataset is not the same as the first dataset
  var secondRegionsArray = [];

  // insert twelve regions in array
  for(var i = 0; i < 12; i ++){
    secondRegionsArray.push(secondData.structure.dimensions.series[0].values[i]["name"])
  }

  // and a list with all the elements from second api request
  var secondSet = [];

  // push 8 elements in an array with strictly values
  for(var i = 0; i < secondRegionsArray.length; i ++){
    for(var j = 0; j < 3; j ++){
      var linking = i + ":" + j + ":0";
      secondSet.push(secondData.dataSets[0].series[linking].observations["0"]["0"]);
    }
  }

  // making a list for all Gini values
  var giniArray = [];

  // which is on 0th position
  for (var i = 0; i < secondSet.length; i += 3){
    giniArray.push(secondSet[i]);
  }

  // for the poverty rate
  var povRaArray = [];

  // which is on 1th position
  for(var i = 1; i < secondSet.length; i += 3){
    povRaArray.push(secondSet[i]);
  }

  // for the S80/S20 disposable income quintile ratio
  var s80s20Array = [];

  // which is on the 2th position
  for(var i = 2; i < secondSet.length; i += 3){
    s80s20Array.push(secondSet[i]);
  }

  // making first dict for indexing later on
  var incomeDict = [];

  // linking keys and values in dictionary
  for(var i = 0; i < 12; i++){
    incomeDict.push({
      region: secondRegionsArray[i],
      gini: giniArray[i],
      povRa: povRaArray[i],
      s80s20: s80s20Array[i],
    });
  }
  console.log(wellBeingDict)
  console.log(incomeDict)
};

function makeMap(){
  var width = 960,
    height = 550;

var colour = d3.scale.category20();

var projection = d3.geo.mercator()
    .scale(1)
    .translate([0, 0]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("nld.json", function(error, nld) {

    var l = topojson.feature(nld, nld.objects.subunits).features[3],
        b = path.bounds(l),
        s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
        .scale(s)
        .translate(t);

    svg.selectAll("path")
        .data(topojson.feature(nld, nld.objects.subunits).features).enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function(d, i) {
            return colour(i);
        })
        .attr("class", function(d, i) {
            return d.properties.name;
        });
});
}
