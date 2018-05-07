var oecdArray = [];



// function that will be triggered when the page is loaded
window.onload = function() {

  // api request for the data
  var wellBeing = "https://stats.oecd.org/SDMX-JSON/data/RWB/NL11+NL12+NL13+NL21+NL22+NL23+NL31+NL32+NL33+NL34+NL41+NL42.RWB+INCOME_DISP+JOB+EMP_RA+UNEM_RA+EDU38_SH+VOTERS_SH+BB_ACC+SUBJ_SOC_SUPP+SUBJ_PERC_CORR.VALUE/all?startTime=2014&endTime=2014"
  var income = "http://stats.oecd.org/SDMX-JSON/data/RWB/NL11+NL12+NL13+NL21+NL22+NL23+NL31+NL32+NL33+NL34+NL41+NL42.RIDD+INEQ+GINI+S80S20A+PVT+PVT6A.VALUE+UP_CI+LO_CI/all?startTime=2009&endTime=2014"

  // request for the queries
  d3.queue()
  .defer(d3.request, wellBeing)
  .defer(d3.request, income)
  .awaitAll(getData);

};

function getData(error, response) {
  if (error) throw error;

  // make json format from the data
  var data = JSON.parse(response[0].responseText);

  // list for all the regions
  var regionsArray = [];

  for(var i = 0; i < 12; i ++){
    regionsArray.push(data.structure.dimensions.series[0].values[i]["name"])
  }

  // console.log(regionsArray)

  // and a list with all the elements from api request
  // var oecdArray = [];

  for(var i = 0; i < regionsArray.length; i ++){
    oecdArray.push(data.dataSets[0].series)
  }

};
