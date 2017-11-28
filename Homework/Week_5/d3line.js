/*  d3line.js
    Minor programmeren; DataProcessing; D3 Line
    Orin Habich 10689508

    Here D3 is used to implement an interactive multiseries line graph.

    Links to used sources:
    d3js.org/d3.v3.min.js
    https://bl.ocks.org/AdamBlaine1/d6c5a1923f53a60876ad

*/

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.temperature); });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("RainJune2016BiltEindhoven.json", function(error, data) {
  if (error) throw error;
  color.domain(d3.keys(data[0].values[0]).filter(function(key) { return key !== "date"; }));
  data[0].values.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var statistics = color.domain().map(function(statisticType) {
     return {
      name: statisticType,
      values: data[0].values.map(function(d) {
         return {date: d.date, temperature: d[statisticType]};
      })
    };
  });

  x.domain(d3.extent(data[0].values, function(d) { return d.date; }));

  y.domain([
    d3.min(statistics, function(t) { return d3.min(t.values, function(v) { return v.temperature; }); }),
    d3.max(statistics, function(t) { return d3.max(t.values, function(v) { return v.temperature; }); })
  ]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("temperature (in 0.1 degree celsius)");

  var statistic = svg.selectAll(".statistic")
      .data(statistics)
      .enter().append("g")
      .attr("class", "statistic");

  statistic.append("path")
      .attr("class", "line")
      .attr("d", function(d) {  return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  statistic.append("text")
      .datum(function(d) { console.log(d.name); return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
});
