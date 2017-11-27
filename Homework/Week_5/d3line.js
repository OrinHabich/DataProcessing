/*  d3line.js
    Minor programmeren; DataProcessing; D3 Line
    Orin Habich 10689508

    Here D3 is used to implement an interactive multiseries line graph.

    Links to used sources:
    d3js.org/d3.v3.min.js

*/

/*
Make sure that you properly label the axes,
 that the plot has a title and that the data source is explained.
  Make sure that the date axis uses JavaScript dates,
   something that is fairly simple using d3.time.format function.
*/

// https://bl.ocks.org/mbostock/3883245

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
	.x(function(d, i) {return x(d[0].day)})
  .y(function(d) { return y(d.temperatures); });


d3.json("RainJune2016BiltEindhoven.json", function(error, data) {
  if (error) throw error

  console.log(data)
	for (var i = 0; i < data.length; i++){
		console.log(dataBilt[i])
	}
  console.log(xdataBilt)
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return xdataBilt; }));
	y.domain(d3.extent(data, function(d) { return ydataBilt; }));

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
  .select(".domain")
    .remove();

g.append("g")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("temperature");

g.append("path")
    .datum(xdataBilt)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

});
