// Name: Michael Zonneveld
// Studentnumber: 11302984

// function that will be triggered when the page is loaded
window.onload = function() {

  // retrieve data from api and store the queries
  var employmentStrictness = "http://stats.oecd.org/SDMX-JSON/data/EPL_R/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.EPR_V3";
  var employmentRate =   "http://stats.oecd.org/SDMX-JSON/data/STLABOUR/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.LREM64TT.STSA.A/all?startTime=2008&endTime=2013";
  var gdpPpp = "http://stats.oecd.org/SDMX-JSON/data/PDB_LV/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.T_GDPPOP.VPVOB/all?startTime=2008&endTime=2013";

  // request for the queries
  d3.queue()
  .defer(d3.request, employmentStrictness)
  .defer(d3.request, employmentRate)
  .defer(d3.request, gdpPpp)
  .awaitAll(getData);            // due to asynchronounity wait for all

  function getData(error, response) {
    if (error) throw error;

    // parse gigantic string to nice json format
    var data0 = JSON.parse(response[0].responseText);
    console.log("employmentStrictness: ",data0.dataSets)

    // parse gigantic string to nice json format
    var data1 = JSON.parse(response[1].responseText);
    // console.log("employmentRate: ",data1.dataSets)

    // parse gigantic string to nice json format
    var data2 = JSON.parse(response[2].responseText);
    // console.log("gdpPpp:",data2.dataSets)
  };
};
