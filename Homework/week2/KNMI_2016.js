/** KNMI_2016.js
 * Orin Habich 10689508
 *
 * Draws a graph of the average temperature in De Bilt per day in 2016.
 * Average is over 24 hrs, temperature in 0.1 degree celsius.
 * 2016 was a leap year ('schrikkeljaar')
 *
 * first part parses the data, second part draws the graph on the canvas
 * last part adds a crosshair
 *
 * The graph is scalable (adjust width="1600" and height="900" in the html).
 * Magic numbers are only used to adjust placement of texts,
 * which have fixed sizes anyway.
 **/

var url = "https://orinhabich.github.io/DataProcessing/Homework/week2/KNMI_2016.csv"; //Homework/week2/


 var request = new XMLHttpRequest();
 request.onreadystatechange = function() {
   if (request.status == 200 && request.readyState == 4){
     var response = this.responseText
     make_graph(response)
   }
 }

 request.open("GET", url);
 request.send();

function make_graph(data){

  var temperatures = []
  var dates = []
  var months = []
  var min_temp = max_temp = 0
  var num_days_2016 = 366

  data = data.split("\n");

  // iterate over days in year
  for (i = 1; i < num_days_2016 + 1; i++){
    // split the data into separate values
    var row = data[i].split(",");
    var date = row[0].trim();

    // fill array dates
    //dates.push(date.substr(6,2) + "-" + date.substr(4,2) + "-" + date.substr(0,4))

    // fill array months
    if (Number(date.substr(6,2)) == 1){
      months.push(i);
    }

    // determine minimum and maximum temperature
    var temperature = Number(row[1]);
    if (temperature < min_temp){
      min_temp = temperature;
    }
    else if (max_temp < temperature) {
      max_temp = temperature;
    }

    // fill array temperatures
    temperatures.push(temperature);
  }

  var padding_left = 80;
  var padding_bottom = 80;
  var canvas_width = document.getElementById("Canvas").width;
  var canvas_height = document.getElementById("Canvas").height;

  // obtain scaling formulas to adjust axes to canvas
  var f_x = createTransform(1, num_days_2016, padding_left, canvas_width);
  var f_y = createTransform(min_temp, max_temp, canvas_height - padding_bottom, 0);

  // canvas
  var canvas = document.getElementById('Canvas');
  var ctx = canvas.getContext('2d');

  function draw_line(x_start, y_start, x_end, y_end){
    // draws a line on the canvas
    ctx.beginPath();
    ctx.moveTo(x_start, y_start);
    ctx.lineTo(x_end, y_end);
    ctx.stroke();
  }

  // draw axes
  draw_line(f_x(0), f_y(min_temp), f_x(num_days_2016), f_y(min_temp));
  draw_line(f_x(0), f_y(min_temp), f_x(0), f_y(max_temp));

  // lay-out and content x-axis
  ctx.font = '16px Times New Roman';
  var month_names = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
  for (i = 0; i < months.length; i++){
    draw_line(f_x(months[i]), f_y(min_temp), f_x(months[i]), f_y(min_temp - 2));
    ctx.fillText(month_names[i], padding_left + (canvas_width - padding_left) /
        month_names.length *i + 20, canvas_height - (padding_bottom - 20) );
  }

  // lay-out and content y-axis
  var temp_precision = 0.1;

  for (i = Math.round(min_temp * temp_precision);
      i < Math.round(max_temp * temp_precision) + 1; i++){
    var y = f_y(i / temp_precision)
    draw_line(f_x(0), y, f_x(-1), y);
    ctx.fillText(i, padding_left - 30, y);
  }

  // add label x-axis
  ctx.font = '24px Times New Roman';
  ctx.fillText('time (in days)', canvas_width / 4, canvas_height - 20);

  // add label y-axis
  ctx.font = '24px Times New Roman';
  ctx.rotate(-Math.PI/2);
  ctx.fillText('temperature (in celsius)', - canvas_height / 2, 20);

  // reset rotation
  ctx.rotate(Math.PI/2);

  // add title
  ctx.font = '32px Times New Roman';
  ctx.fillText('Average temperature in De Bilt (NL)', canvas_width - 500, 25);
  ctx.fillText('2016', canvas_width - 120, 60);

  // plot the graph
  ctx.strokeStyle = 'blue';
  for (i = 0; i < num_days_2016; i++){
    draw_line(f_x(i + 1), f_y(temperatures[i]), f_x(i + 2), f_y(temperatures[i + 1]));
  }
}

function createTransform(data_min, data_max, canvas_graph_min, canvas_graph_max){
/*  returns a linear function (x_screen = alpha * x_data + beta) to scale the
    domain or range of the data to an appropriate domain or range on the canvas
*/

  // calculate alpha and beta
  var alpha = (canvas_graph_max - canvas_graph_min) / (data_max - data_min);
  var beta = canvas_graph_max - alpha * data_max;

  // return the function
  return function(x){
    return alpha * x + beta;
  }
}

function draw_line(x_start, y_start, x_end, y_end){
  // draws a line on the canvas

  ctx.beginPath();
  ctx.moveTo(x_start, y_start);
  ctx.lineTo(x_end, y_end);
  ctx.stroke();
}

/*
THE SECOND CANVAS

<canvas id="interactive_layer" width="1600" height="900"></canvas>
</div>
<style>
#stage {
  width: 1600px;
  height: 900px;
  position: relative;
}
canvas { position: absolute; }
#Canvas { z-index: 3 }
#interactive_layer { z-index: 2 }
</style>
*/

// var canvas = document.getElementById('interactive_layer');
// var ctx2 = canvas.getContext('2d');
//
// var x_mouse = 210
// var y_mouse = 397
// var crosshair_big_circle = 15
// var crosshair_small_circle = 3
//
// function draw_line2(x_start, y_start, x_end, y_end){
//   // draws a line on the second canvas
//   ctx2.beginPath();
//   ctx2.moveTo(x_start, y_start);
//   ctx2.lineTo(x_end, y_end);
//   ctx2.stroke();
// }
//
// ctx2.lineWidth = 0.3;
//
// // horizontal line
// draw_line2(f_x(0), y_mouse, x_mouse - crosshair_big_circle, y_mouse);
// draw_line2(x_mouse + crosshair_big_circle, y_mouse, canvas_width, y_mouse);
//
// // vertical line
// draw_line2(x_mouse, f_y(min_temp), x_mouse, y_mouse + crosshair_big_circle);
// draw_line2(x_mouse, y_mouse - crosshair_big_circle, x_mouse, 0);
//
// // two concentric circles
// ctx2.beginPath();
// ctx2.ellipse(x_mouse, y_mouse, crosshair_small_circle, crosshair_small_circle, 0, 0, 2 * Math.PI);
// ctx2.stroke();
// ctx2.beginPath();
// ctx2.ellipse(x_mouse, y_mouse, crosshair_big_circle, crosshair_big_circle, 0, 0, 2 * Math.PI);
// ctx2.stroke();
//
// // get inverse of f_x to go from coordinates on canvas to coordinates in graph
// // note: the coordinates of the mouse will probably become something else? so a TODO here
// var f_x_inv = createTransform([padding_left, canvas_width], [1, num_days_2016])
// var f_y_inv = createTransform([canvas_height - padding_bottom, 0], [min_temp, max_temp])
//
// // distance of respectively <date> and <temperature> from crosshair
// var cr_text_x = canvas_width / 16
// var cr_text_y = canvas_height / 10
//
// // obtain the day nearest to the current x-position of the mouse
// var day = Math.round(f_x_inv(x_mouse))
//
// // add temperature along horizontal line, if crosshair is near graph
// ctx2.font = '18px Times New Roman';
// if (f_y(temperatures[day - 1]) - crosshair_small_circle < y_mouse &&
//  f_y(temperatures[day - 1]) + crosshair_small_circle > y_mouse){
//   if (y_mouse < cr_text_y){
//     ctx2.fillText(temperatures[day - 1] / 10, x_mouse - cr_text_y, y_mouse - 5);
//   }
//   else{
//     ctx2.fillText(temperatures[day - 1] / 10, x_mouse + cr_text_y, y_mouse - 5);
//   }
// }
//
// // add date along vertical line
// ctx2.rotate(-Math.PI/2);
// if (y_mouse < cr_text_x){
//   ctx2.fillText(dates[day - 1], - y_mouse - cr_text_x, x_mouse + 15);
// }
// else{
//   ctx2.fillText(dates[day - 1], - y_mouse + cr_text_x, x_mouse + 15);
// }
//
// function moved(){
//   console.log("Ja Hier ")
// }

// -- #date, average temp
// 20160101,41
// 20160102,54
// 20160103,69
// 20160104,57
// 20160105,68
// 20160106,26
// 20160107,61
// 20160108,54
// 20160109,56
// 20160110,69
// 20160111,48
// 20160112,58
// 20160113,50
// 20160114,35
// 20160115,24
// 20160116,27
// 20160117,-10
// 20160118,-33
// 20160119,-25
// 20160120,12
// 20160121,-12
// 20160122,9
// 20160123,66
// 20160124,77
// 20160125,107
// 20160126,92
// 20160127,109
// 20160128,67
// 20160129,85
// 20160130,74
// 20160131,68
// 20160201,115
// 20160202,89
// 20160203,50
// 20160204,51
// 20160205,87
// 20160206,94
// 20160207,85
// 20160208,85
// 20160209,53
// 20160210,48
// 20160211,38
// 20160212,27
// 20160213,18
// 20160214,14
// 20160215,23
// 20160216,-3
// 20160217,-13
// 20160218,13
// 20160219,39
// 20160220,82
// 20160221,104
// 20160222,68
// 20160223,43
// 20160224,23
// 20160225,18
// 20160226,21
// 20160227,22
// 20160228,22
// 20160229,13
// 20160301,20
// 20160302,53
// 20160303,39
// 20160304,10
// 20160305,5
// 20160306,30
// 20160307,25
// 20160308,36
// 20160309,44
// 20160310,41
// 20160311,32
// 20160312,31
// 20160313,39
// 20160314,41
// 20160315,46
// 20160316,44
// 20160317,57
// 20160318,52
// 20160319,62
// 20160320,68
// 20160321,72
// 20160322,76
// 20160323,76
// 20160324,79
// 20160325,65
// 20160326,95
// 20160327,91
// 20160328,97
// 20160329,78
// 20160330,81
// 20160331,76
// 20160401,72
// 20160402,101
// 20160403,152
// 20160404,124
// 20160405,106
// 20160406,89
// 20160407,73
// 20160408,67
// 20160409,92
// 20160410,107
// 20160411,132
// 20160412,116
// 20160413,90
// 20160414,106
// 20160415,103
// 20160416,86
// 20160417,62
// 20160418,81
// 20160419,97
// 20160420,86
// 20160421,101
// 20160422,87
// 20160423,62
// 20160424,46
// 20160425,49
// 20160426,48
// 20160427,60
// 20160428,58
// 20160429,74
// 20160430,77
// 20160501,79
// 20160502,115
// 20160503,97
// 20160504,95
// 20160505,128
// 20160506,164
// 20160507,195
// 20160508,201
// 20160509,202
// 20160510,189
// 20160511,204
// 20160512,202
// 20160513,154
// 20160514,89
// 20160515,86
// 20160516,93
// 20160517,123
// 20160518,136
// 20160519,134
// 20160520,137
// 20160521,179
// 20160522,155
// 20160523,120
// 20160524,114
// 20160525,118
// 20160526,137
// 20160527,160
// 20160528,176
// 20160529,172
// 20160530,162
// 20160531,182
// 20160601,192
// 20160602,153
// 20160603,164
// 20160604,201
// 20160605,200
// 20160606,189
// 20160607,201
// 20160608,161
// 20160609,153
// 20160610,164
// 20160611,162
// 20160612,166
// 20160613,159
// 20160614,152
// 20160615,146
// 20160616,157
// 20160617,151
// 20160618,141
// 20160619,153
// 20160620,155
// 20160621,170
// 20160622,201
// 20160623,220
// 20160624,192
// 20160625,154
// 20160626,149
// 20160627,149
// 20160628,167
// 20160629,160
// 20160630,164
// 20160701,169
// 20160702,154
// 20160703,147
// 20160704,170
// 20160705,154
// 20160706,149
// 20160707,168
// 20160708,175
// 20160709,197
// 20160710,213
// 20160711,186
// 20160712,166
// 20160713,145
// 20160714,145
// 20160715,166
// 20160716,197
// 20160717,198
// 20160718,202
// 20160719,228
// 20160720,254
// 20160721,218
// 20160722,211
// 20160723,211
// 20160724,207
// 20160725,182
// 20160726,184
// 20160727,179
// 20160728,190
// 20160729,183
// 20160730,177
// 20160731,170
// 20160801,165
// 20160802,166
// 20160803,190
// 20160804,173
// 20160805,176
// 20160806,164
// 20160807,184
// 20160808,172
// 20160809,144
// 20160810,128
// 20160811,136
// 20160812,189
// 20160813,176
// 20160814,170
// 20160815,161
// 20160816,163
// 20160817,172
// 20160818,177
// 20160819,181
// 20160820,178
// 20160821,167
// 20160822,180
// 20160823,210
// 20160824,228
// 20160825,243
// 20160826,221
// 20160827,216
// 20160828,205
// 20160829,172
// 20160830,162
// 20160831,174
// 20160901,172
// 20160902,166
// 20160903,185
// 20160904,179
// 20160905,173
// 20160906,177
// 20160907,183
// 20160908,196
// 20160909,169
// 20160910,184
// 20160911,185
// 20160912,209
// 20160913,235
// 20160914,230
// 20160915,226
// 20160916,174
// 20160917,173
// 20160918,167
// 20160919,144
// 20160920,145
// 20160921,147
// 20160922,138
// 20160923,136
// 20160924,152
// 20160925,163
// 20160926,135
// 20160927,145
// 20160928,187
// 20160929,159
// 20160930,145
// 20161001,135
// 20161002,121
// 20161003,145
// 20161004,130
// 20161005,98
// 20161006,94
// 20161007,118
// 20161008,110
// 20161009,79
// 20161010,79
// 20161011,80
// 20161012,89
// 20161013,91
// 20161014,99
// 20161015,107
// 20161016,133
// 20161017,121
// 20161018,102
// 20161019,88
// 20161020,85
// 20161021,76
// 20161022,67
// 20161023,48
// 20161024,71
// 20161025,87
// 20161026,95
// 20161027,118
// 201610281,31
// 20161029,96
// 20161030,87
// 20161031,85
// 20161101,81
// 20161102,72
// 20161103,67
// 20161104,76
// 20161105,69
// 20161106,61
// 20161107,42
// 20161108,19
// 20161109,30
// 20161110,40
// 20161111,18
// 20161112,20
// 20161113,27
// 20161114,31
// 20161115,108
// 20161116,119
// 20161117,93
// 20161118,60
// 20161119,58
// 20161120,84
// 20161121,120
// 20161122,110
// 20161123,79
// 20161124,66
// 20161125,33
// 20161126,-1
// 20161127,56
// 20161128,-3
// 20161129,-31
// 20161130,20
// 20161201,79
// 20161202,52
// 20161203,-1
// 20161204,-14
// 20161205,-27
// 20161206,1
// 20161207,63
// 20161208,82
// 20161209,91
// 20161210,78
// 20161211,85
// 20161212,53
// 20161213,66
// 20161214,73
// 20161215,65
// 20161216,54
// 20161217,61
// 20161218,62
// 20161219,43
// 20161220,-6
// 20161221,41
// 20161222,59
// 20161223,60
// 20161224,79
// 20161225,104
// 20161226,83
// 20161227,66
// 20161228,10
// 20161229,-22
// 20161230,-11
// 20161231,18
