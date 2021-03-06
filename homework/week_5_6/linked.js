// Name: Michael Zonneveld
// Studentnumber: 11302984
// Date:      18/05/2018

var margin = {top: 20, right: 10, bottom: 20, left: 10};

var width = 720 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;

// dictionaries for usage throughout the whole script
var wellBeingDict = [];
var incomeDict = [];

// list for all the regions for usage in multiple functions
var firstRegionsArray = [];

// the following part will be triggered when the page is loaded
window.onload = function(){

  // api request for the data
  var wellBeing = "https://stats.oecd.org/SDMX-JSON/data/RWB/NL11+NL12+NL13+NL21+NL22+NL23+NL31+NL32+NL33+NL34+NL41+NL42.RWB+EMP_RA+UNEM_RA+EDU38_SH+BB_ACC+SUBJ_SOC_SUPP.VALUE/all?startTime=2014&endTime=2014"
  var income = "https://stats.oecd.org/SDMX-JSON/data/RWB/NL11+NL12+NL13+NL21+NL22+NL23+NL31+NL32+NL33+NL34+NL41+NL42.RIDD+INEQ+GINI+S80S20A+PVT+PVT6A.VALUE+UP_CI+LO_CI/all?startTime=2009&endTime=2014"

  // request for the queries
  d3.queue()
  .defer(d3.request, wellBeing)
  .defer(d3.request, income)
  .defer(d3.json, "nld.json")
  .awaitAll(getData);

};

function getData(error, response, nld){

  // check if data gets loaded
  if (error) throw error;

  // make json format from the first data set
  var firstData = JSON.parse(response[0].responseText);

  // insert twelve regions in array
  for (var i = 0; i < 12; i ++){
    firstRegionsArray.push(firstData.structure.dimensions.series[0].values[i]["name"]);
  }

  // and a list with all the elements from api request
  var firstSet = [];

  // push 8 elements in an array with strictly values
  for (var i = 0; i < firstRegionsArray.length; i ++){
    for (var j = 0; j < 5; j ++){
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
  for (var i = 0; i < 12; i ++){
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
  for (var i = 0; i < 12; i ++){
    secondRegionsArray.push(secondData.structure.dimensions.series[0].values[i]["name"]);
  }

  // and a list with all the elements from second api request
  var secondSet = [];

  // push 3 elements in an array with strictly values
  for (var i = 0; i < secondRegionsArray.length; i ++){
    for (var j = 0; j < 3; j ++){
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

  // linking keys and values in dictionary
  for (var i = 0; i < 12; i ++){
    incomeDict.push({
      region: secondRegionsArray[i],
      gini: giniArray[i],
      povRa: povRaArray[i],
      s80s20: s80s20Array[i],
    });
  }
  createMap(incomeDict, response[2]);
  createChart(wellBeingDict);
};

function createMap(incomeData, nld){

  // remove legends when update (doesn't work, but I tried)
  if (d3.select("#selectPovRa").select("svg")){
    d3.select("#mapLegendOrange").select("svg").remove();
  }

  if (d3.select("#selectS80s20").select("svg")){
    d3.select("#mapLegendGreen").select("svg").remove();
  }

  // create tipbox for regions
  var regionTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d, i){

        var tipBoxDict = {};
        for (i = 0; i < incomeData.length; i ++){
          if (incomeData[i]['region'] == d.properties.name){
            tipBoxDict[incomeData[i]['region']] = incomeData[i]['gini'];
          }
        }

        // indexing on province name and return its value
        return "<strong>Region: </strong>" + d.properties.name + "<br><strong>GINI: </strong>" + tipBoxDict[d.properties.name] +"</span>";
      })

  povRaColors = [];
  s80s20Colors = [];

  for (var i = 0; i < incomeData.length; i ++){
    povRaColors.push(incomeData[i]['povRa']);
    s80s20Colors.push(incomeData[i]['s80s20']);
  }

  // coloring map according to poverty rate
  var colorMapPovRa = d3.scaleQuantize()
      .domain([d3.min(povRaColors), d3.max(povRaColors)])
      .range(colorbrewer.Greens[3]);

  // and another coloring for s80s20 quantile ratio
  var colorMap80s20 = d3.scaleQuantize()
      .domain([d3.min(s80s20Colors), d3.max(s80s20Colors)])
      .range(colorbrewer.Oranges[3]);

  // creating first legend for map coloring
  var mapLegendGreen = d3.legendColor()
        .labelFormat(d3.format(".3f"))
        .shape("path", d3.symbol()
        .type(d3.symbolSquare)
        .size(700)())
        .shapePadding(30)
        .shapeWidth(50)
        .shapeHeight(20)
        .labelOffset(12)
        .title("Regional headcount ratios for disposable income, with poverty line set at 60% of the national median income:")
        .titleWidth(200)
        .scale(colorMapPovRa);

  // creating second legend for map coloring
  var mapLegendOrange = d3.legendColor()
        .labelFormat(d3.format(".3f"))
        .shape("path", d3.symbol()
        .type(d3.symbolSquare)
        .size(700)())
        .shapePadding(30)
        .shapeWidth(50)
        .shapeHeight(20)
        .labelOffset(12)
        .title("Quintile share ratio (S80/S20) for disposable income: Ratio between average income of the top quintile and average income of the bottom quintile.")
        .titleWidth(200)
        .scale(colorMap80s20);

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

  svg.call(regionTip);

  var l = topojson.feature(nld, nld.objects.subunits).features[3],
      b = path.bounds(l),
      s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

  // drawing provinces and give them an ID for clicking function
  svg.selectAll("path")
      .data(topojson.feature(nld, nld.objects.subunits).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", "region")   // adding id's for clicking function

      // return name of the provinces
      .attr("class", function(d, i){
          return d.properties.name;
      })

      // fill them up according to poverty rate
      .style("fill", function(d, i){
        for (i = 0; i < incomeData.length; i ++){
          if(incomeData[i]['region'] == d.properties.name){
            green = colorMapPovRa(povRaColors[i])
            return green
          }}})

      // creating thick borders between provinces and even thicker when touched
      .style('stroke', 'black')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      .style("stroke","black")
      .style('stroke-width', 0.7)
      .on('mouseover',function(d){
        regionTip.show(d);
        d3.select(this)
          .style("opacity", 1)
          .style("stroke","black")
          .style("stroke-width",3)
      })
      .on('mouseout', function(d){
        regionTip.hide(d);
        d3.select(this)
          .style("opacity", 0.8)
          .style("stroke","black")
          .style("stroke-width",0.7)
      })

      // update the barchart with corresponding province
      .on("click", function(d){
        updateChart(wellBeingDict, d.properties.name)
      });

  // placing legends on second row of the website
  var svgMapDes = d3.select("#mapdes")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  svgMapDes.append("g")
      .attr("id", "mapLegendGreen")
      .attr("transform", "translate(20,20)");

  svgMapDes.select("#mapLegendGreen")
      .call(mapLegendGreen);

  // add some padding for the second legend
  svgMapDes.append("g")
      .attr("id", "mapLegendOrange")
      .attr("transform", "translate(300, 20)");

  svgMapDes.select("#mapLegendOrange")
      .call(mapLegendOrange);

  function mapColoring(){

    // change coloring of the map when clicked on variable
    var svgDropPovRa = d3.select("#selectPovRa")
        .on("click", function(d){
          svg.selectAll("path")
          .attr("class", "select1")
          .style("fill", function(d, i){

            // finding corresponding element in dict with province
            for (i = 0; i < incomeData.length; i ++){
              if (incomeData[i]['region'] == d.properties.name){
                var green = colorMapPovRa(povRaColors[i]);
                return green;
              }
            }
          })
        });

    var svgDropS80s20 = d3.select("#selectS80s20")
        .on("click", function(d){
          svg.selectAll("path")
          .style("fill", function(d, i){
            for (i = 0; i < incomeData.length; i ++){
              if (incomeData[i]['region'] == d.properties.name){
                var orange = colorMap80s20(s80s20Colors[i]);
                return orange;
              }
            }
          })
        });

  };

  mapColoring();

};

function createChart(wellBeingDict, region = 0){

  // list for labels under x-axis
  var independents = ['unemRa', 'empRa', 'eduSh', 'socSupp', 'bbAcc'];

  // remove current chart if another is added by clicking on province
  if (d3.select("#chart").select("svg")){
    d3.select("#chart").select("svg").remove();
    d3.select("#chartdes").select("svg").remove();
  }

  // region indicates the clicked or initial province shown in chart
  var chartData = [];

  chartData.push(wellBeingDict[region]['unemRa']);
  chartData.push(wellBeingDict[region]['empRa']);
  chartData.push(wellBeingDict[region]['eduSh']);
  chartData.push(wellBeingDict[region]['socSupp']);
  chartData.push(wellBeingDict[region]['bbAcc']);

  var chartWidth = width - margin.left - margin.right;
  var chartHeight = height - margin.top - margin.bottom;

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

  // ensure shown values are percentages on y-axis
  var yAxis = d3.axisLeft()
     .scale(yScale)
     .tickFormat(function(d){
       return (d + "%");
    });

  // creating tip box to show value
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d, i){
      return (d + "%");
    });

  // colorfunction with colorbrewer for those who suffer from bad eyes
  var colorBars = d3.scaleOrdinal()
      .domain(independents)
      .range(colorbrewer.BrBG[5]);

  // creating extra function to show full variablenames in legend
  var legendBars = d3.scaleOrdinal()
      .domain(["Unemployment rate", "Employment rate", "Share of labour force with at least secondary education",
              "Perceived social network support", "Share of households with internet broadband access"])
      .range(colorbrewer.BrBG[5]);

  // creating legend with colored squares
  var chartLegend = d3.legendColor()
         .shape("path", d3.symbol()
         .type(d3.symbolSquare)
         .size(700)())
         .shapePadding(30)
         .shapeWidth(50)
         .shapeHeight(20)
         .labelOffset(12)
         .scale(legendBars);

  // creating canvas for visualising barchart
  var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  // placing box with value that is shown in bar
  svg.call(tip);

  // placing a bar for every data value
  svg.selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")

      // color the bars
      .attr("fill", function(d, i){
          return colorBars(i);
      })

      // showing box
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

      // shooting bars in the chart with padding
      .attr("x", function (d, i){
        return xScale(independents[i]) + margin.left + margin.left + margin.right;
      })
      .attr("y", chartHeight)
      .attr("width", chartWidth / chartData.length - barSpace)

      // make them move slick
      .transition().duration(2000)
      .delay(function (d, i){
        return i * 200;
      })

      // bars going up
      .attr("y", function (d, i){
        return yScale(d);
      })

      .attr("height", function (d){
        return chartHeight - yScale(d);
      })

  // inserting x-axis on the canvas
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(25," + chartHeight + ")")
      .call(xAxis);

  // and the y-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin.bottom + ",1)")
      .call(yAxis)
      .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", "-.2em")
        .attr("dy", "-.2em")

        // needed to rotate labels due to visibility
        .attr("transform", function(d){
            return "rotate(-90)"
            });

  // adding name of province in chart when clicked
  svg.append("text")
      .attr("id", "provBars")
      .attr("x", chartWidth / 2 - 300)
      .attr("y", chartHeight / 8)
      .text(firstRegionsArray[region]);

  // placing legend in second row in seperate column
  var svgChartDes = d3.select("#chartdes")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  svgChartDes.append("g")
      .attr("class", "chartLegend")
      .attr("transform", "translate(20,20)");

  svgChartDes.select(".chartLegend")
      .call(chartLegend);

};

// data dict needs to be handed to the function for updating the bars
function updateChart(wellBeingDict, province){

  var rightDataNumber;

  // return appropiate number for matching province with data
  for (i = 0; i < firstRegionsArray.length; i ++){
    if (firstRegionsArray[i] == province){
      rightDataNumber = i;
    }
  }

  // calling the updated chart
  createChart(wellBeingDict, region = rightDataNumber);

};
