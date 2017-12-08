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
    widthBarchart = +svgBarchart.attr("width") - margin.left - margin.right,
    heightBarchart = +svgBarchart.attr("height") - margin.top - margin.bottom,
    gBarchart = svgBarchart.append("g").attr("id", "Barchart").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, widthBarchart])
    .paddingInner(0.05)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([heightBarchart, 0]);

var z = d3.scaleOrdinal()
    .range(["#FF8C00", "#006400", "#9932CC"]);



var svgPiechart = d3.select("#svgPiechart"),
  widthPiechart = +svgPiechart.attr("width"),
  heightPiechart = +svgPiechart.attr("height"),
  radius = Math.min(widthPiechart, heightPiechart) / 2,
  gPiechart = svgPiechart.append("g").attr("transform", "translate(" + widthPiechart / 2 + "," + heightPiechart / 2 + ")");

var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var pie = d3.pie()
  .sort(null)
  .value(function(d) { return d.number; });

var path = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

var label = d3.arc()
  .outerRadius(radius - 40)
  .innerRadius(radius - 40);


queue()
	.defer(d3.csv, "numberZZPyears.csv", function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  })
	.defer(d3.csv, "numberZZPgender2003.csv", function(d) {
    d.number = +d.number;
    return d;
  })
	.await(makeCharts);

//d3.csv("numberZZPyears.csv",

function makeCharts(error, dataBarchart, dataPiechart) {
  if (error) throw error;
  console.log(dataPiechart)

  var keys = dataBarchart.columns.slice(1);

  x.domain(dataBarchart.map(function(d) { return d.year; }));
  y.domain([0, d3.max(dataBarchart, function(d) { return d.total; })]).nice();
  z.domain(keys);

  gBarchart.append("g")
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

  gBarchart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + heightBarchart + ")")
      .call(d3.axisBottom(x))
      .append("text")
        .attr("x", widthBarchart + 5)
        //.attr("y", )
        .attr("dy", "0.2em")
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("Year");

  gBarchart.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.2em")
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .text("Number (x 1000)");

  var legend = gBarchart.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", widthBarchart + 60)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", widthBarchart + 50)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });



  var arc = gPiechart.selectAll(".arc")
    .data(pie(dataPiechart))
    .enter().append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.gender); });

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.gender; });

};
