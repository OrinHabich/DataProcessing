/** KNMI_2016.js
 * Orin Habich 10689508
 *
 * Draws a graph of the average temperature in De Bilt per day in 2016.
 * Average is over 24 hrs, temperature in 0.1 degree celsius.
 * 2016 was a leap year ('schrikkeljaar')
 *
 * first part parses the data, second part draws the graph on the canvas
 * last part adds a crosshair
 **/

// get the data out of the html file
var data = document.getElementById("rawdata").value.split("\n")

var temperatures = []
var dates = []
var months = []
var min_temp = max_temp = 0
var num_days_2016 = 366

// iterate over days in year
for (i = 1; i < num_days_2016 + 1; i++){
  // split the data into separate values
  var row = data[i].split(",")
  var date = row[0].trim()

  // fill array dates
  dates.push(date.substr(6,2) + "-" + date.substr(4,2) + "-" + date.substr(0,4))

  // fill array months
  if (Number(date.substr(6,2)) == 1){
    months.push(i)
  }

  // determine minimum and maximum temperature
  var temperature = Number(row[1])
  if (temperature < min_temp){
    min_temp = temperature
  }
  else if (max_temp < temperature) {
    max_temp = temperature
  }

  // fill array temperatures
  temperatures.push(temperature)
}

function createTransform(domain, range){
  // domain is a two-element array of the data bounds [domain_min, domain_max]
  // range is a two-element array of the screen bounds [range_min, range_max]
  // this gives you two equations to solve:
  // range_min = alpha * domain_min + beta
  // range_max = alpha * domain_max + beta
    // a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
    var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

var marge_left = 80
var marge_bottom = 80
var canvas_width = document.getElementById("Canvas").width
var canvas_height = document.getElementById("Canvas").height

// obtain scaling formulas to adjust axes to canvas
var f_x = createTransform([1, num_days_2016], [marge_left, canvas_width])
var f_y = createTransform([min_temp, max_temp], [canvas_height - marge_bottom, 0])

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
var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
for (i = 0; i < months.length; i++){
  draw_line(f_x(months[i]), f_y(min_temp), f_x(months[i]), f_y(min_temp - 2))
  ctx.fillText(month_names[i], marge_left + (canvas_width - marge_left) / month_names.length *i + 20, canvas_height - (marge_bottom - 20) );
}

// lay-out and content y-axis
/*
explanation 'magic' numbers:
10 because temperature was measured in 0.1 degree celsius
-1 is the size of the marks at the temperatures at the y axis
30 is the length we take for the temperature (two digits long)
*/
for (i = Math.round(min_temp / 10); i < Math.round(max_temp / 10); i++){
  var y = f_y(i * 10)
  draw_line(f_x(0), y, f_x(-1), y)
  ctx.fillText(i, marge_left - 30, y);
}

// add label x-axis
ctx.font = '24px Times New Roman';
ctx.fillText('time (in days)', canvas_width / 4, canvas_height - 10);

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
  draw_line(f_x(i + 1), f_y(temperatures[i]), f_x(i + 2), f_y(temperatures[i + 1]))
}

/*
THE SECOND CANVAS
*/

var canvas = document.getElementById('interactive_layer');
var ctx2 = canvas.getContext('2d');

var x_mouse = 210
var y_mouse = 397
var crosshair_big_circle = 15
var crosshair_small_circle = 3

function draw_line2(x_start, y_start, x_end, y_end){
  // draws a line on the second canvas
  ctx2.beginPath();
  ctx2.moveTo(x_start, y_start);
  ctx2.lineTo(x_end, y_end);
  ctx2.stroke();
}

ctx2.lineWidth = 0.3;

// horizontal line
draw_line2(f_x(0), y_mouse, x_mouse - crosshair_big_circle, y_mouse);
draw_line2(x_mouse + crosshair_big_circle, y_mouse, canvas_width, y_mouse);

// vertical line
draw_line2(x_mouse, f_y(min_temp), x_mouse, y_mouse + crosshair_big_circle);
draw_line2(x_mouse, y_mouse - crosshair_big_circle, x_mouse, 0);

// two concentric circles
ctx2.beginPath();
ctx2.ellipse(x_mouse, y_mouse, crosshair_small_circle, crosshair_small_circle, 0, 0, 2 * Math.PI);
ctx2.stroke();
ctx2.beginPath();
ctx2.ellipse(x_mouse, y_mouse, crosshair_big_circle, crosshair_big_circle, 0, 0, 2 * Math.PI);
ctx2.stroke();

// get inverse of f_x to go from coordinates on canvas to coordinates in graph
// note: the coordinates of the mouse will probably become something else? so a TODO here
var f_x_inv = createTransform([marge_left, canvas_width], [1, num_days_2016])
var f_y_inv = createTransform([canvas_height - marge_bottom, 0], [min_temp, max_temp])

// distance of respectively <date> and <temperature> from crosshair
var cr_text_x = canvas_width / 16
var cr_text_y = canvas_height / 10

// obtain the day nearest to the current x-position of the mouse
var day = Math.round(f_x_inv(x_mouse))

// add temperature along horizontal line, if crosshair is near graph
ctx2.font = '18px Times New Roman';
if (f_y(temperatures[day - 1]) - crosshair_small_circle < y_mouse &&
 f_y(temperatures[day - 1]) + crosshair_small_circle > y_mouse){
  if (y_mouse < cr_text_y){
    ctx2.fillText(temperatures[day - 1] / 10, x_mouse - cr_text_y, y_mouse - 5);
  }
  else{
    ctx2.fillText(temperatures[day - 1] / 10, x_mouse + cr_text_y, y_mouse - 5);
  }
}

// add date along vertical line
ctx2.rotate(-Math.PI/2);
if (y_mouse < cr_text_x){
  ctx2.fillText(dates[day - 1], - y_mouse - cr_text_x, x_mouse + 15);
}
else{
  ctx2.fillText(dates[day - 1], - y_mouse + cr_text_x, x_mouse + 15);
}

function moved(){
  console.log("Ja Hier ")
}

var url = "https://orinhabich.github.io/DataProcessing/Homework/week2/KNMI_2016.html";
//var url = document.querySelector("interactive_layer");

var request = new XMLHttpRequest();
request.addEventListener("mousemove", moved);
request.open("GET", url);
request.send();

// request.onreadystatechange = function() {
//   console.log("ja oke dit doet het blijkbaar")
//   if (request.status == 200 && request.readyState == 4){
//   }
// }
