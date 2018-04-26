// Name: Michael Zonneveld
// Studentnumber: 11302984
// Sources: http://bl.ocks.org/d3noob/8952219
//          https://bost.ocks.org/mike/bar/3/

// creating lists with data for easier coding

yearsArray = [];
numbersArray = [];

// fetching data about Lego in JSON format
d3.json("11302984_legofile.json", function(data) {
  var lego = data;
  for(var i = 0; i < lego.stats.length; i++){
     years = (lego.stats[i]['year'])
     yearsArray.push(years)
     numbers = (lego.stats[i]['num_parts_MEAN'])
     numbersArray.push(numbers)
  }

//width and height of my canvas plus padding for placement
var w = 800;
var h = 249;
var barSpace = 1;
var padding = 40;

// creat scale for width
var xScale = d3.scale.ordinal()
                .domain(yearsArray)
                .rangeRoundBands([10, w + padding + 5]);

// and for height
var yScale = d3.scale.linear()
                .domain([0, d3.max(numbersArray)])
                .range([h, 0]);

// function for creating x-axis later on
var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .ticks(yearsArray.length);

// and for the y-axis
var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left")
              .ticks(3);

// creating tip box to show value
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return (d)
            })

// creating canvas for visualising barchart
var svg = d3.select("body")
            .append("svg")
            .attr("width", w + (padding * 2))
            .attr("height", h + padding);

// placing box with value
svg.call(tip);

// placing a bar for every data value
svg.selectAll("rect")
    .data(numbersArray)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

    // calculating the width of the graphic
    .attr("x", function(d, i){
      return (i * ((w+(padding)) / numbersArray.length)) + padding
    })

    // and height
    .attr("y", function(d, i){
      return yScale(d)
    })

    // calculating the width of every bar
    .attr("width", w / numbersArray.length - barSpace)

    // and its height
    .attr("height", function (d){
      return h - yScale(d);
    })

    // inserting x-axis on the canvas
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(30," + (h + barSpace) + ")") // set it to the bottom
        .call(xAxis)

    // and the y-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",1)")
        .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 14)
          .attr("class", "textClass")
          .style("text-anchor", "end")
          .text("Lego pieces");

});
