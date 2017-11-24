/*  test.js
    Minor programmeren; DataProcessing; test SVG
    Orin Habich 10689508
*/

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
    var colors = ["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824", "#D3D3D3"];
    var data = [1, 2, 3, 4, 5, 6, 7];
    for (var i = 0; i < 3; i++){
      var id = "#kleur" + (i + 1);
      d3.select(id)
        .style('fill', colors[i]);
    }

    for (var i = 4; i < colors.length; i++){
    var id = "#kleur" + (i + 1);
    d3.selectAll("svg")
      .append("rect")
      .attr("id", id)
      .attr("x", "13")
      .attr("y", (i - 1) * 43.4 + 2.8)
      .attr("height", "29")
      .attr("width", "21")
      .style('fill', colors[i]);

    if (i > 4){
      var id = "#tekst" + (i + 1);
      d3.selectAll("svg")
        .append("rect")
        .attr("id", id)
        .attr("x", "46.5")
        .attr("y", (i - 1) * 43.4 + 2.8)
        .attr("height", "29")
        .attr("width", "119.1")
        .style('fill', "lightgrey");
      }

    var textblock = d3.selectAll("g")
    .data(colors)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(46.5," + 200 + ")"; });

textblock.append("rect")
    .attr("width", 119.1)
    .attr("height", 28);

textblock.append("text")
    .attr("x", 121)
    .attr("y", 15)
    .attr("dy", ".35em")
    .text("tekst");
    }
});
