/*  d3line.js
    Minor programmeren; DataProcessing; D3 Line
    Orin Habich 10689508

    Here D3 is used to implement an interactive multiseries line graph.

    Links to used sources:
    d3js.org/d3.v3.min.js

*/

/*
Make sure that you properly label the axes,
 that the plot has a title and that the data source is explained.
  Make sure that the date axis uses JavaScript dates,
   something that is fairly simple using d3.time.format function.
*/

d3.json("RainJune2016BiltEindhoven.json", function(error, data) {
  if (error) throw error
  console.log(data)
});
