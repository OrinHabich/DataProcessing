
// var width = 1400,
//     height = 500;

var margin = {top: 2, right: 30, bottom: 30, left: 40},
    width = 1400 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

d3.json("regen_zomer_2017.json", function(error, data) {
  y.domain([0, d3.max(data, function(d) { return d.rain; }) + 4 ]);

  var barWidth = width / data.length;

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y(d.rain); })
      .attr("height", function(d) { return height - y(d.rain); })
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("x", barWidth / 10)
      .attr("y", function(d) { return y(d.rain) - 1; })
      .text(function(d) { return d.rain; });

});


20170801,    0
20170802,   51
20170803,   18
20170804,    5
20170805,   14
20170806,    0
20170807,    0
20170808,   51
20170809,    0
20170810,   18
20170811,    8
20170812,   56
20170813,    0
20170814,    0
20170815,   19
20170816,    0
20170817,   29
20170818,   14
20170819,   47
20170820,    0
20170821,    0
20170822,    0
20170823,    0
20170824,    0
20170825,    0
20170826,    0
20170827,    0
20170828,    0
20170829,    5
20170830,   92
20170831,   33


var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 1600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

d3.json("regen_zomer_2017.json", function(error, data) {
  x.domain(data.map(function(d) { return d.datum; }));
  y.domain([0, d3.max(data, function(d) { return d.rain; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.datum); })
      .attr("y", function(d) { return y(d.rain); })

      .attr("height", function(d) { return height - y(d.rain); })
      .attr("width", x.rangeBand());

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

    chart.append("g")
      .attr("class", "x axis")
      .call(x)
      .append("text")
      .attr("x", 60)
      .attr("dy", 40)
      .style("text-anchor", "end")
      .text("Datum");

});


<!-- barchart.html
Orin Habich 10689508-->
<!DOCTYPE html>
<html>
  <head>
    <h1>Rain per month, De Bilt, 2016</h1>
    <svg class="chart"></svg>
    <script src="d3.js"></script>
    <script src="tip.js"></script>
    <script src="barchart.js"></script>
    <style>
      body {
        font: 14px sans-serif;
      }

      .axis path,
      .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
      }

      .bar {
        fill: CornflowerBlue ;
      }

      .bar:hover {
        fill: lightblue ;
      }

      .d3-tip {
        line-height: 1;
        font-weight: bold;
        padding: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        border-radius: 40px;
      }

      /* Creates a small lighning under the tooltip */
      .d3-tip:after {
        box-sizing: border-box;
        display: inline;
        font-size: 20px;
        width: 100%;
        line-height: 0.8;
        color: rgba(0, 0, 0, 0.8);
        content: "\1F5F2";
        position: absolute;
        text-align: center;
      }

      /* Style northward tooltips differently */
      .d3-tip.n:after {
        margin: -1px 0 0 0;
        top: 100%;
        left: 0;
      }
    </style>
  </head>
</html>

// barchart.js
// Minor programmeren, DataProcessing, week3
// Orin Habich 10689508
//
// Here we use D3 to implement an interactive barchart.
// http://bl.ocks.org/Caged/6476579

var margin = {top: 10, right: 30, bottom: 30, left: 70},
  width = 1600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

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

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.rain/10 + "</span><strong> mm rain </strong>";
  })

chart.call(tip);

// http://cdn.knmi.nl/knmi/map/page/klimatologie/gegevens/maandgegevens/mndgeg_260_rh24.txt
d3.json("rain_2016.json", function(error, data) {
  x.domain(data.map(function(d) { return d.datum; }));
  y.domain([0, d3.max(data, function(d) { return d.rain; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.datum); })
      .attr("y", function(d) { return y(d.rain); })
      .attr("height", function(d) { return height - y(d.rain); })
      .attr("width", x.rangeBand())
      .on("mouseover",tip.show)
      .on("mouseout", tip.hide);

      chart.append("g")
        .attr("class", "x axis")
        .call(x)
        .append("text")
        .attr("x", width / 2)
        .attr("dy", height + margin.bottom )
        .style("text-anchor", "end")
        .text("Month");

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


<!--
barchart.html
Minor programmeren; DataProcessing; intro D3
Orin Habich 10689508
-->
