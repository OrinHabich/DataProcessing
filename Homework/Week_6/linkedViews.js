/*
  linkedViews.js
  Minor programmeren; DataProcessing; Linked Views
  Orin Habich 10689508

  Here D3 is used to implement a stacked barchart and link the bars
  to a pie chart.

  Links to used sources:
  https://bl.ocks.org/mbostock/3886208
  https://bl.ocks.org/mbostock/3887235
*/

window.onload = afterLoad;

function afterLoad() {
    /*  This executes the whole script,
        but it is called only when the window is loaded.
    */

    // variables for the barchart
    var svgBarchart = d3.select("#svgBarchart"),
        margin = {top: 20, right: 80, bottom: 30, left: 60},
        widthBarchart = +svgBarchart.attr("width") - margin.left - margin.right,
        heightBarchart = +svgBarchart.attr("height") - margin.top - margin.bottom,
        gBarchart = svgBarchart.append("g").attr("id", "Barchart").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, widthBarchart])
        .paddingInner(0.05)
        .align(0.1);

    var y = d3.scaleLinear().rangeRound([heightBarchart, 0]);

    var colorsBarchart = ["#FF8C00", "#006400", "#9932CC"];

    var z = d3.scaleOrdinal().range(colorsBarchart);

    // variables for the piechart
    var svgPiechart = d3.select("#svgPiechart"),
        widthPiechart = +svgPiechart.attr("width"),
        heightPiechart = +svgPiechart.attr("height"),
        radius = Math.min(widthPiechart, heightPiechart) / 2,
        gPiechart = svgPiechart.append("g").attr("id", "Piechart")
            .attr("transform",
             "translate(" + widthPiechart / 2 + "," + heightPiechart / 2 + ")");

     var PieTitle = d3.select("#Piechart").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

    var colorsPiechart = d3.scaleOrdinal(["#1E90FF", "#FF69B4"]);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.number; });

    var path = d3.arc().outerRadius(radius).innerRadius(0);

    var label = d3.arc().outerRadius(radius + 20).innerRadius(radius - 100);

    // load the data and call makeCharts()
    queue()
        .defer(d3.csv, "Data/numberZZPyears.csv", function(d, i, columns) {
            for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
            d.total = t;
            return d;
        })
      	.defer(d3.json, "Data/numberZZPgender.json")
      	.await(makeCharts);

    function makeCharts(error, dataBarchart, dataPiechart) {
        /*   Creates charts based on the given data.
             Args: Appriopiate datasets.
        */
        if (error) throw error;

        var keys = dataBarchart.columns.slice(1);

        x.domain(dataBarchart.map(function(d) { return d.year; }));
        y.domain([0, d3.max(dataBarchart, function(d) { return d.total; })]).nice();
        z.domain(keys);

        // make the barchart
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
            .attr("width", x.bandwidth())
            .on("mouseover", function(d) {

                // obtain x and y position
                var xPosition = d.data.year;
                var yPosition = d3.select(this.parentNode).attr("fill");

                // remake piechart, matching the current part of the bar
                if (yPosition == colorsBarchart[0]) {
                  gPiechart.selectAll(".arc").data([]).exit().remove();
                  makePiechart(dataPiechart[xPosition - 2003]["15-25"]);
                  titlePiechart(xPosition, "15-25");
                }
                else if (yPosition == colorsBarchart[1]) {
                  gPiechart.selectAll(".arc").data([]).exit().remove();
                  makePiechart(dataPiechart[xPosition - 2003]["25-45"]);
                  titlePiechart(xPosition, "25-45");
                }
                else if (yPosition == colorsBarchart[2]) {
                  gPiechart.selectAll(".arc").data([]).exit().remove();
                  makePiechart(dataPiechart[xPosition - 2003]["45-75"]);
                  titlePiechart(xPosition, "45-75");
                }
                return
            });

        // make x axis
        gBarchart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + heightBarchart + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", widthBarchart + 5)
            .attr("dy", "0.2em")
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .text("Year");

      // make y axis
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

      // add legend to the barchart
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

      // Draw a default pie chart
      makePiechart(dataPiechart[0]["15-25"])
    };

    function makePiechart(dataChosen) {
       /*   Creates a piechart for the given data.
            Args: An appriopiate data set.
       */

       var arc = gPiechart.selectAll(".arc")
          .data(pie(dataChosen))
          .enter().append("g")
          .attr("class", "arc");

      arc.append("path")
          .attr("d", path)
          .attr("fill", function(d) { return colorsPiechart(d.data.gender); });

      arc.append("text")
          .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
          .text(function(d) { return d.data.gender; });
    };

    function titlePiechart(year, ageGroup) {
      /*   Creates a title for the piechart.
           Args: The year and the age group.
      */
      d3.select(".tooltip").transition().style("opacity", 1);

      d3.select(".tooltip").html(("year: " + year) + "<br/>" + "age group: " + ageGroup)
          .style("left", 0)
          .style("top", heightPiechart);
    };
};
