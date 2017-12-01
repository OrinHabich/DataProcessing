/*  d3line.js
    Minor programmeren; DataProcessing; D3 Line
    Orin Habich 10689508

    Here D3 is used to implement an interactive multiseries line graph.

    Links to used sources:
    d3:               d3js.org/d3.v3.min.js
    graph:          https://bl.ocks.org/AdamBlaine1/d6c5a1923f53a60876ad
    https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
    update function:  http://bl.ocks.org/d3noob/7030f35b72de721622b8
*/

var margin = {top: 20, right: 80, bottom: 40, left: 80},
    width = 1500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// setup x
var x = d3.time.scale().range([0, width]);
var xAxis = d3.svg.axis().scale(x).orient("bottom");

// setup y
var y = d3.scale.linear().range([height, 0]);
var yAxis = d3.svg.axis().scale(y).orient("left");

// setup time, to ensure JavaScript dates are used
var parseDate = d3.time.format("%Y%m%d").parse;

// setup colors
var color = d3.scale.category10();

// setup line
var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.temperature); });

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load data
d3.json("RainJune2016BiltEindhoven.json", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0].values[0]).filter(function(key) { return key !== "date"; }));

  // parse dates to JavaScript dates
  data[0].values.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  // make 2d data points per statistic (minimum, average and maximum)
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

  // x-axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 2)
    .attr("dx", ".1em")
    .style("text-anchor", "end")
    .text("time (in days)");

  // y-axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -(margin.left - 15))
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("temperature (in 0.1 degree Celsius)");

  // add group elements to svg
  var statistic = svg.selectAll(".statistic")
      .data(statistics)
      .enter().append("g")
      .attr("class", "statistic");

  // draw lines
  statistic.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  // add text along axes
  statistic.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  var selector = d3.select("#selector");

  // setup dropdown menu
  selector
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .text(function(d) { return d.city;})
    .attr("value", function(d) { return d.city; });

  // add consequences to choice in dropdown menu
  selector
    .on("change", function(){
      d3.selectAll(".line")
      var value = selector.property("value");
      if (value == "De Bilt") {
        updateData(data[0]);
      }
      else if (value == "Eindhoven"){
        updateData(data[1]);
      }
      d3.selectAll(".line")
        .filter( function(d) { return d.city != value })
      })

  function updateData(dataChosen) {
    /*
      Updates the graph to dataChosen.
    */

    // parse dateChosen to JavaScript dates if not yet done
    dataChosen.values.forEach(function(d) {
      if (!(d.date instanceof Date)){
        d.date = parseDate(d.date);
      }
    });

      // remake 2d data points per statistic type (minimum, average and maximum)
      var statistics = color.domain().map(function(statisticType) {
         return {
          name: statisticType,
          values: dataChosen.values.map(function(d) {
            return {date: d.date, temperature: d[statisticType]};
          })
        };
      });

      // remake the y axes
      y.domain([
        d3.min(statistics, function(t) { return d3.min(t.values, function(v) { return v.temperature; }); }),
        d3.max(statistics, function(t) { return d3.max(t.values, function(v) { return v.temperature; }); })
      ]);

    // select the section we want to apply our changes to
    var svg = d3.select("body").transition();

      // set new data
      d3.selectAll(".line")
        .data(statistics)

      // make new lines
      svg.selectAll(".line")
          .duration(1000)
          .attr("d", function(d) { return line(d.values); })

      // make a new y axis
      svg.select(".y.axis")
          .duration(1000)
          .call(yAxis);
    };

    // set up the cross hair
    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    // set up a vertical line in the cross hair
    mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "grey")
      .style("stroke-width", "0.2px");

    var lines = document.getElementsByClassName("line");

    var mousePerLine = mouseG.selectAll(".mouse-per-line")
      .data(statistics)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 10)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10, 3)");

    /* append a rect to get mouse movements on canvas
       (get mouse events on a g element is not possible)
    */
    mouseG.append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")

      // on mouse out hide line, circles and text
      .on("mouseout", function() {
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })

      // on mouse in show line, circles and text
      .on("mouseover", function() {
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })

      // mouse moving over canvas
      .on("mousemove", function() {
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          var xDate = x.invert(mouse[0]),
              bisect = d3.bisector(function(d) { return d.date; }).right;
              idx = bisect(d.values, xDate);

          var beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;

          while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0]){
              end = target;
            }
            else if (pos.x < mouse[0]){
              beginning = target;
            }

            // position found
            else{
              break;
            }
          }

          d3.select(this).select("text")
            .text(y.invert(pos.y).toFixed(2));

          return "translate(" + mouse[0] + "," + pos.y +")";
        });
    });
});
