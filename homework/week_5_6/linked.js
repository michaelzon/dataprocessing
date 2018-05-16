
var margin = {top: 20, right: 10, bottom: 20, left: 10};

var width = 720 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var wellBeingDict = [];

var independents = ['unemRa', 'empRa', 'eduSh', 'socSupp', 'bbAcc'];

// function that will be triggered when the page is loaded
window.onload = function() {

  // api request for the data
  var wellBeing = "https://stats.oecd.org/SDMX-JSON/data/RWB/NL11+NL12+NL13+NL21+NL22+NL23+NL31+NL32+NL33+NL34+NL41+NL42.RWB+EMP_RA+UNEM_RA+EDU38_SH+BB_ACC+SUBJ_SOC_SUPP.VALUE/all?startTime=2014&endTime=2014"
  var income = "https://stats.oecd.org/SDMX-JSON/data/RWB/NL11+NL12+NL13+NL21+NL22+NL23+NL31+NL32+NL33+NL34+NL41+NL42.RIDD+INEQ+GINI+S80S20A+PVT+PVT6A.VALUE+UP_CI+LO_CI/all?startTime=2009&endTime=2014"

  // request for the queries
  d3.queue()
  .defer(d3.request, wellBeing)
  .defer(d3.request, income)
  .awaitAll(getData);

  createWebInfo();
};

function getData(error, response, nld) {

  // check if data gets loaded
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
    for(var j = 0; j < 5; j ++){
      var linking = i + ":" + j + ":0";
      firstSet.push(firstData.dataSets[0].series[linking].observations["0"]["0"]);
    }
  }

  // list for all the unemployment rate values
  var unemRaArray = [];

  // for the employment rate values
  var empRaArray = [];

  // for the share of labour force with at least secondary education
  var eduShArray = [];

  // for the perceived social network support values
  var socSuppArray = [];

  // for the share of households with internet broadband access values
  var bbAccArray = [];

  for (var i = 0; i < firstSet.length; i += 5){
    unemRaArray.push(firstSet[i]);
    empRaArray.push(firstSet[i+1]);
    eduShArray.push(firstSet[i+2]);
    socSuppArray.push(firstSet[i+3]);
    bbAccArray.push(firstSet[i+4]);
  }

  // linking keys and values in dictionary
  for(var i = 0; i < 12; i++){
    wellBeingDict.push({
      region: firstRegionsArray[i],
      unemRa: unemRaArray[i], // vraag nog even na hoe je hier procent teken kan hardcoden of zoek het zelf uit.
      empRa: empRaArray[i],
      eduSh: eduShArray[i],
      socSupp: socSuppArray[i],
      bbAcc: bbAccArray[i],
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

  // push 3 elements in an array with strictly values
  for(var i = 0; i < secondRegionsArray.length; i ++){
    for(var j = 0; j < 3; j ++){
      var linking = i + ":" + j + ":0";
      secondSet.push(secondData.dataSets[0].series[linking].observations["0"]["0"]);
    }
  }

  // making a list for all Gini values
  var giniArray = [];

  // for the poverty rate
  var povRaArray = [];

  // for the S80/S20 disposable income quintile ratio
  var s80s20Array = [];

  for (var i = 0; i < secondSet.length; i += 3){
    giniArray.push(secondSet[i]);
    povRaArray.push(secondSet[i+1]);
    s80s20Array.push(secondSet[i+2]);
  }

  // making second dict for indexing later on
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

  // console.log(wellBeingDict)
  // console.log(incomeDict)
  createMap(incomeDict, nld)
  createChart(wellBeingDict);

};

function createWebInfo(){

  // writing information to webpage per paragraph
  paragraph = d3.select("header")
  paragraph.append("p").text("Name: Michael Zonneveld")
  paragraph.append("p").text("Studentnummer: 11302984")
  paragraph.append("p").text("This webpage shows (not yet) 2 interactive visualizations ")
}

function createMap(incomeData, nld){

  var format = d3.format(",");
  // console.log("henk:",incomeData[0].region)

  // create tipbox for regions
  var regionTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d, i){
        return "<strong>Region: </strong>" + d.properties.name + "<br><strong>Poverty rate: </strong>" + (incomeData, function(d, i) {console.log(d)}) +"</span>";
      })

      // .html(function(d, i){
      //   return "<strong>Region: </strong>" + d.properties.name + "<br><strong>Poverty rate: </strong>" + (incomeData, function(d, i) {console.log(d)}) +"</span>";
      // })

  // console.log(incomeData)
  var color = d3.scaleThreshold()
                .domain([d3.min(incomeData, function(d) {return d.s80s20}), d3.max(incomeData, function(d) {return d.s80s20})])
                .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"])

  // and a function for sequential coloring (colorblind-friendly)
  // var color = d3.scaleSequential(d3.interpolateRgb("#0000FF","#FF0000"))
  //               .domain([d3.min(incomeData, function(d) {return d.s80s20}),
  //                       d3.max(incomeData, function(d) {return d.s80s20})])


  // extract the meaning of projection for code-clearity
  var projection = d3.geoMercator()
      .scale(1)
      .translate([0, 0]);

  var path = d3.geoPath()
      .projection(projection);

  // create root svg element
  var svg = d3.select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.call(regionTip)

  // projection so we can display map, path generator formats the projection for svg element
  d3.json("nld.json", function(error, nld) {

      var l = topojson.feature(nld, nld.objects.subunits).features[3],
          b = path.bounds(l),
          s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
          t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

      projection
          .scale(s)
          .translate(t);

    // svg.append("g")
      svg.selectAll("path")
          .data(topojson.feature(nld, nld.objects.subunits).features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("id", "region")   // adding id's for clicking function

          // return name of the provinces
          .attr("class", function(d, i) {
            // console.log(d.properties.name)
              return d.properties.name;
          })

          // fill them up according to s80s20 ratio
          .attr("fill", function(d, i) {
            // if (incomeData[i].regio == d.properties.name){
            // console.log(incomeData[i].s80s20
              return color(i);
          })

          .style('stroke', 'white')
          .style('stroke-width', 1.5)
          .style("opacity",0.8)
          .style("stroke","white")
          .style('stroke-width', 0.3)
          .on('mouseover',function(d){
            regionTip.show(d);
            d3.select(this)
              .style("opacity", 1)
              .style("stroke","white")
              .style("stroke-width",3)
          })
          .on('mouseout', function(d){
            regionTip.hide(d);
            d3.select(this)
              .style("opacity", 0.8)
              .style("stroke","white")
              .style("stroke-width",0.3)
          })
          .on("click", function(d){
            update(d.properties.name);
          });

    });

    // load topojson file
    // d3.json("nld.json", function(error, nld) {
    //   if (error) return console.error(error);
    //   console.log(nld);
    //
    //   // projection so we can display map, path generator formats the projection for svg element
    //   svg.append("path")
    //       .datum(topojson.feature(nld, nld.objects.subunits))
    //       .attr("d", d3.geoPath().projection(d3.geoMercator()));
    // });
    //
    // // create root svg element
    // var svg = d3.select("#map").append("svg")
    //   .attr("width", width)
    //   .attr("height", height);
    //
    // // While our data can be stored more efficiently in TopoJSON, we must convert back to GeoJSON for display ???
    // var subunits = topojson.feature(nld, nld.objects.subunits).features;
    //
    // // extract the meaning of projection for code-clearity
    // var projection = d3.geoMercator
    //     .scale(500)
    //     .translate([width / 2, height / 2]);
    //
    // var path = d3.geoPath()
    //     .projection(projection)
    //
    // // binding path element to geojson data, setting 'd' attribute to the path data
    // svg.append("path")
    //     .datum(subunits)
    //     .attr("d", path)
    //
    // var projection = d3.geo.albers()
    //   .center([0, 55.4])
    //   .rotate([4.4, 0])
    //   .parallels([50, 60])
    //   .scale(6000)
    //   .translate([width / 2, height / 2]);
}

function createChart(wellBeingDict, region = 0){
  // console.log(wellBeingDict)

  var chartdata = [];

  chartdata.push(wellBeingDict[region]['unemRa'])
  chartdata.push(wellBeingDict[region]['empRa'])
  chartdata.push(wellBeingDict[region]['eduSh'])
  chartdata.push(wellBeingDict[region]['socSupp'])
  chartdata.push(wellBeingDict[region]['bbAcc'])

  var chartWidth = width - margin.left - margin.right
  var chartHeight = height - margin.top - margin.bottom

  var barSpace = 5;
  var barWidth = 30;

  // create scale for width
  var xScale = d3.scaleBand()
      .domain(independents)
      .rangeRound ([0, chartWidth]);

  // and for height
  var yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([chartHeight, 0]);

  // function for creating x-axis later on
  var xAxis = d3.axisBottom()
     .scale(xScale);

  // and for y-axis
  var yAxis = d3.axisLeft()
     .scale(yScale);

  // creating tip box to show value
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d, i) {
      return (d)
      })

  // creating canvas for visualising barchart
  var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // placing box with value
    svg.call(tip);

  // placing a bar for every data value
  svg.selectAll("rect")
      .data(chartdata)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

      // shooting bars on my screen
      .attr("x", function (d, i){
        return xScale(independents[i]) + margin.left + margin.right;
      })

      .attr("y", function (d, i){
        return yScale(d)
      })

      // calculating the width of every bar
      .attr("width", chartWidth / chartdata.length - barSpace)

      // and its height
      .attr("height", function (d){
        return chartHeight - yScale(d);
      })

  // inserting x-axis on the canvas
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(20," + chartHeight + ")")
      .call(xAxis);


  // and the y-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin.bottom + ",1)")
      .call(yAxis)


};

function update(province){
  // barchart update als je op provincie klikt.
  // 1 bereken nieuwe scalings
  // select element die je wil veranderen
  // data als argument


};
