// scatterplot.js
// Minor programmeren; DataProcessing; D3 Scatterplot
// Orin Habich 10689508
//
// Here D3 is used to implement a scatterplot.
//
// Links to used sources:
// d3js.org/d3.v3.min.js


d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
});
