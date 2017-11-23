d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
    var colors = ["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824", "#D3D3D3"];
    // // var x = d3.select("#kleur1");
    // // console.log(x);
    // // x.style('fill', colors[0]);
    // for (var i = 0; i < 3; i++){
    //   var id = "#kleur" + (i + 1);
    //   d3.select(id)
    //     .style('fill', colors[i]);
    //   }
    // for (var i = 4; i < colors.length; i++){
    //   var id = "#kleur" + (i + 1);
    //   d3.append("rect")
    //     .attr("class", "st1")
    //     .attr("id", id)
    //     .attr("x", "13")
    //     .attr("y", "140")
    //     .attr("height", "29")
    //     .attr("width", "21")
    //     .style('fill', colors[i]);
    // var colors = d3.scale.ordinal()
    // .domain(d3.extent(dataset, function (d) { return d.colors; }))
    // .range(["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824", "#D3D3D3"]);
    //

    d3.selectAll("rect")
    .data(colors).enter()
    .append("rect")
    .attr("fill", function (colors){ return colors; })
    .attr("x", function (colors, index){ return (index * 12) + "px"; })
    .attr("y", 8 + "px")
    .attr("width", 8 + "px")
    .attr("height", 8 + "px");

});
