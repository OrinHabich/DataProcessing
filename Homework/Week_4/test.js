/*  test.js
    Minor programmeren; DataProcessing; test SVG
    Orin Habich 10689508
*/

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    var svg = d3.select("#Laag_1")
    console.log(svg)
    var colors = ["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824", "#D3D3D3"];
    var data = ["100", "1000", "10000", "100000", "10000000", "10000000", "Unknown data"]

    svg.selectAll(".st1")
      .data(colors)
      .enter()
      .append("rect")
      .attr("id", function(d, i) { return "kleur" + (i + 1)})
      .style("fill", function(d, i) { return colors[i]})
      .attr("height", "29")
      .attr("width", "21")
      .attr("x", "13")
      .attr("y", function(d, i) { return i * 38 + 24});

    svg.selectAll(".st1")
      .style("fill", function(d, i) { return colors[i]})


    svg.selectAll(".st2")
      .data(colors)
      .enter()
      .append("rect")
      .attr("id", function(d, i) { return "tekst" + (i + 1)})
      .style("fill", "lightgrey")
      .attr("height", "29")
      .attr("width", "119.1")
      .attr("x", "46.5")
      .attr("y", function(d, i) { return i * 38 + 24});

    svg.selectAll(".st2")
      .data(data)
      .enter()
      .append("text")
      .attr("x", "50")
      .attr("y", function(d, i) { return i * 38 + 24})
    .attr("dy", "1em")
    .text(function(d, i) { return data[i]; });

});
