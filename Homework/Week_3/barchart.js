// barchart.js
// Minor programmeren; DataProcessing; D3 barchart
// Orin Habich 10689508
//
// Here D3 is used to implement an interactive barchart.
//
// Links to used sources:
// https://bost.ocks.org/mike/bar/
// http://bl.ocks.org/Caged/6476579
// d3js.org/d3.v3.min.js

var margin = {top: 10, right: 30, bottom: 30, left: 70},
  width = 1600 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var chart = d3.select(".chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// interactive element (D3-tip)
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.Rain/10 + "</span><strong> mm </strong>";
  })

chart.call(tip);

// Source data:
// http://cdn.knmi.nl/knmi/map/page/klimatologie/gegevens/maandgegevens/mndgeg_260_rh24.txt

// load data
d3.json("rain_2016.json", function(error, data) {

  x.domain(data.map(function(d) { return d.Month; }));
  y.domain([0, d3.max(data, function(d) { return d.Rain; })]);

// bars, including interactive elements
chart.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.Month); })
  .attr("y", function(d) { return y(d.Rain); })
  .attr("height", function(d) { return height - y(d.Rain); })
  .attr("width", x.rangeBand())
  .on("mouseover",tip.show)
  .on("mouseout", tip.hide);

// x-axis, including labels
chart.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
  .attr("x", width / 2)
  .attr("dy", "1.9em")
  .style("text-anchor", "end")
  .text("Month");

// y-axis, including labels
chart.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -(margin.left - 15))
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("1/10 milliliters");
});
