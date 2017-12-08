// linkedViews.js
// Minor programmeren; DataProcessing; Linked Views
// Orin Habich 10689508
//
// Here D3 is used to implement an interactive barchart and link that
// to some pie charts.
//
// Links to used sources:
// https://bl.ocks.org/mbostock/3886208


var svgBarchart = d3.select("#svgBarchart"),
    margin = {top: 20, right: 80, bottom: 30, left: 40},
    width = +svgBarchart.attr("width") - margin.left - margin.right,
    height = +svgBarchart.attr("height") - margin.top - margin.bottom,
    g = svgBarchart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#FF8C00", "#006400", "#9932CC"]);


queue()
	.defer(d3.csv, "numberZZPyears.csv", function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  })
	.defer(d3.csv, "numberZZPgender.csv")
	.await(makeCharts);

//d3.csv("numberZZPyears.csv",

function makeCharts(error, dataBarchart, dataPiechart) {
  if (error) throw error;
  console.log(dataBarchart)

  var keys = dataBarchart.columns.slice(1);

  x.domain(dataBarchart.map(function(d) { return d.year; }));
  y.domain([0, d3.max(dataBarchart, function(d) { return d.total; })]).nice();
  //z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(dataBarchart))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.year); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
        .attr("x", width + 5)
        //.attr("y", )
        .attr("dy", "0.2em")
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("Year");

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.2em")
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .text("Number");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width + 60)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 50)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
};
