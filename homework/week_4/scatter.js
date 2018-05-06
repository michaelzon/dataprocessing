// Name:      Michael Zonneveld
// Studentnumber:   11302984
// Date:      06/05/2018
// Sources:   http://bl.ocks.org/jfreels/6734823
//            https://bl.ocks.org/zanarmstrong/0b6276e033142ce95f7f374e20f1c1a7
//            http://bl.ocks.org/LauraCortes/020b0a4dc8e25070a42421382324109d
//            http://charts.animateddata.co.uk/whatmakesushappy/

// function that will be triggered when the page is loaded
window.onload = function() {

  // retrieve data from api and store the queries
  var wellBeing = "https://stats.oecd.org/SDMX-JSON/data/RWB/AUS+AUT+BEL+CAN+CZE+DNK+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+ESP+SWE+CHE+TUR+GBR+USA.VOTERS_SH+BB_ACC+EDU38_SH+SUBJ_PERC_CORR.VALUE/all?startTime=2014&endTime=2014";

  // request for the queries
  d3.queue()
  .defer(d3.request, wellBeing)
  .awaitAll(getData);            // due to asynchronounity wait for all

  function getData(error, response) {
    if (error) throw error;

    // make json format from the data
    var data = JSON.parse(response[0].responseText);

    // list for all the countries
    var countryArray = [];

    for(var i = 0; i < 30; i ++){
      countryArray.push(data.structure.dimensions.series[0].values[i]["name"])
    }

    // and a list with all the elements from api request
    var oecdArray = [];

    // place the values in the list
    for(var i = 0; i < countryArray.length; i ++){
      for(var j = 0; j < 4; j ++){
        var linking = i + ":" + j + ":0";
        oecdArray.push(data.dataSets[0].series[linking].observations);
      }
    }

    var values = [];

    // digging a little bit further so we skip non-values
    for(var i = 0; i < oecdArray.length; i ++){
    values.push(oecdArray[i][0][0]);
    }

    // list for all the internet access values
    var internetArray = [];

    // internet value is on 0th position in oecdArray
    for (var i = 0; i < values.length; i += 4){
      internetArray.push(values[i]);
    }

    // also for the voting turn out values
    var votesArray = [];

    // voting rate is on 1th position
    for(var i = 1; i < values.length; i += 4){
      votesArray.push(values[i]);
    }

    // share of people with secondary degree
    var secDegreeArray = [];

    // which is on the 2th position
    for(var i = 2; i < values.length; i += 4){
      secDegreeArray.push(values[i]);
    }

    // and one for the perception of corruption
    var perceptionArray = [];

    // which is on 3th position
    for(var i = 3; i < values.length; i += 4){
    perceptionArray.push(values[i]);
    }

    // making a dict for indexing later on
    var wellBeingDict = [];

    // linking keys and values in dictionary
    for(var i = 0; i < 30; i++){
      wellBeingDict.push({
        country: countryArray[i],
        internet: internetArray[i],
        votes: votesArray[i],
        education: secDegreeArray[i],
        perception: perceptionArray[i]
      });
    }

  var w = 1200;
  var h = 600;
  var padding = 50;

  // create scale for width with extent returning the boundary as an array
  var xScale = d3.scaleLinear()
                  .domain(d3.extent(wellBeingDict, function(d) {return d.perception})).nice()
                  .range([0, w - padding]);

  // also for height
  var yScale = d3.scaleLinear()
                  .domain([0, 100])
                  .range([h - padding, 0]);

  // for the radius of a point
  var rScale = d3.scaleLinear()
                      .domain(d3.extent(wellBeingDict, function(d) {return d.education}))
                      .range([4, 20]);

  // and a function for sequential coloring (colorblind-friendly)
  var color = d3.scaleSequential(d3.interpolateRgb("#edf8fb","#006d2c"))
                .domain([d3.min(wellBeingDict, function(d) {return d.education}),
                        d3.max(wellBeingDict, function(d) {return d.education})]);

  // function for creating x-axis later on
  var xAxis = d3.axisBottom()
     .scale(xScale);

  // and for y-axis
  var yAxis = d3.axisLeft()
     .scale(yScale);

  // update options
  var update = ["Perception of corruption on x axis (%)",
                "Share of households with internet broadband access on x axis (%)"];

  // creating tip box to show value
  var tip = d3.tip()
           .attr('class', 'd3-tip')
           .offset([-20, 0])
           .html(function(d, i) {
             return "Country: " + d.country
               + "<br>" + "Share of households with internet broadband access: " + d.internet + "<br>" +
          " Voter turnout: " + d.votes + "<br>" + "Labour force withsecondary education: " + d.education + "<br>" +
          " Perception of corruption: " + d.perception});

  // creating legend
  var legend = d3.legendColor()
         .labelFormat(d3.format(".0f"))
         .scale(color)
         .shapePadding(5)
         .shapeWidth(50)
         .shapeHeight(20)
         .labelOffset(12);

  // creating selection menu
  var select = d3.select('body')
    .append('select')
    	.attr('class','select')
      .on('change',updateX)

  var options = select
    .selectAll('option')
  	.data(update)
    .enter()
  	.append('option')
  	.text(function (d) {return d;})
    .classed('selected', function(d) {return d === xAxis;})
    .on('click', function(d) {
      xAxis = d;
      updateX();
    });

  // creating a canvas to draw my scatterplot on
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

              // boxes with value's
              svg.call(tip);

              // drawing x-axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(50," + (h - padding) + ")")
                  .call(xAxis)

              // adding label
              svg.append("text")
                  .attr("transform", "translate(1000, 585)")
                  .attr("class", "textClass")
                  .style("text-anchor", "middle")
                  .text("Perception of corruption (%)");

              // drawing y-axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(" + padding + ")")
                  .call(yAxis)

              // adding label
              svg.append("text")
                  .attr("transform", "translate(15, 50) rotate(-90)")
                  .attr("class", "textClass")
                  .style("text-anchor", "end")
                  .text("Voter turnout (%)");

              // placing legend
              svg.append("g")
                 .attr("transform", "translate(1100, 0)")
                 .call(legend);

              // drawing the scatters
              svg.selectAll("circle")
                 .data(wellBeingDict)
                 .enter()
                 .append("circle")
                 .attr("class", "point")
                 .attr("transform", "translate(50, 0)")
                 .attr("cx", d => xScale(d.perception))
                 .attr("cy", d => yScale(d.votes))
                 .attr("r", d => rScale(d.education))
                 .on('mouseover', tip.show)
                 .on('mouseout', tip.hide)
                 .style("fill", d => color(d.education));

    function updateX() {

      // update axis and scale
      var independent = this.independent
                      xScale.domain(d3.extent(wellBeingDict, function(d) {return d[independent]})).nice()
                      xAxis.scale(xScale)

                // place new x-axis
                d3.select('#xAxis')
                  .transition()
                  .duration(750)
                  .call(xAxis)

                // draw new scatters
                d3.selectAll('circle')
                     .transition()
                     .duration(750)
                     .delay(function (d,i) {
                          return i * 50
                      })
                     .attr('cx',function (d) {
                         return xScale(d[independent])
                     });

    };
  };
};
