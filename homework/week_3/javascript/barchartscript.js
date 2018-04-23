d3.select("body")
  .append("p")
  .text("New paragraph!");

var lego = [ 5, 10, 15, 20, 25 ];

// select chart id from html
d3.select(".legochart")
  // select al divs, divs are empty tho
  .selectAll("div");
  // pass in the data
  .data(lego)
    // looks at the dom, sees there is no data, so creates 5 datapoints
    .enter()
    // appends a div at the end of datapoints
    .append("div")
    .style("width", function(d) { return d + "px"; })
    .text(function(d) { return d; });
