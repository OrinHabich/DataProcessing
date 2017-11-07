/** KNMI_2016.js
 * Orin Habich 10689508
 * Draws a graph of the average temperature in De Bilt per day in 2016.
 * Average is over 24hrs, temperature in 0.1 degree celsius.
 * 2016 was a leap year ('schrikkeljaar')
 **/

// get the data out of the html file
data = document.getElementById("rawdata").value.split("\n")

temperatures = []
dates = []
months = []
min_temp = max_temp = 0
num_days_2016 = 366

// iterate over days in year
for (i = 1; i < num_days_2016 + 1; i++){
  row = data[i].split(",")
  date = row[0].trim()
  dates.push(date.substr(6,2) + "-" + date.substr(4,2) + "-" + date.substr(0,4))

  if (Number(date.substr(6,2)) == 1){
    months.push(i)
  }

  // determine minimum and maximum temperature
  temperature = Number(row[1])
  if (temperature < min_temp){
    min_temp = temperature
  }
  else if (max_temp < temperature) {
    max_temp = temperature
  }

  temperatures.push(temperature)
}

domain = [1, num_days_2016]
range = [min_temp, max_temp]

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

marge_left = 80
marge_bottom = 80
canvas_width = document.getElementById("Canvas").width
canvas_height = document.getElementById("Canvas").height

// obtain scaling formulas to adjust axes to canvas
f_x = createTransform([1, num_days_2016], [marge_left, canvas_width])
f_y = createTransform(range, [canvas_height - marge_bottom, 0])

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
month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
for (i = 0; i < months.length; i++){
  draw_line(f_x(months[i]), f_y(min_temp), f_x(months[i]), f_y(min_temp - 2))
  ctx.fillText(month_names[i], marge_left + (canvas_width - marge_left) / month_names.length *i + 20, canvas_height - (marge_bottom - 20) );
}

// lay-out and content y-axis
for (i = Math.round(min_temp / 10); i < Math.round(max_temp / 10); i++){
  y = f_y(i * 10)
  draw_line(f_x(0), y, f_x(-2), y)
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
for (i = 1; i < num_days_2016 + 1; i++){
  draw_line(f_x(i), f_y(temperatures[i]), f_x(i + 1), f_y(temperatures[i + 1]))
}

/*
THE SECOND CANVAS
*/

var canvas = document.getElementById('interactive_layer');
var ctx2 = canvas.getContext('2d');

crosshair_x = 100
crosshair_y = 650
crosshair_size_large = 15
crosshair_size_small = 3

ctx2.lineWidth = 0.3;

// x_axis
ctx2.moveTo(f_x(0), crosshair_y);
ctx2.lineTo(crosshair_x - crosshair_size_large, crosshair_y);
ctx2.stroke();
ctx2.moveTo(crosshair_x + crosshair_size_large, crosshair_y);
ctx2.lineTo(canvas_width, crosshair_y);
ctx2.stroke();

// y_axis
ctx2.moveTo(crosshair_x, f_y(min_temp));
ctx2.lineTo(crosshair_x, crosshair_y + crosshair_size_large);
ctx2.stroke();
ctx2.moveTo(crosshair_x, crosshair_y - crosshair_size_large);
ctx2.lineTo(crosshair_x, 0);
ctx2.stroke();

ctx2.beginPath();
ctx2.ellipse(crosshair_x, crosshair_y, crosshair_size_small, crosshair_size_small, 0, 0, 2 * Math.PI);
ctx2.stroke();
ctx2.beginPath();
ctx2.ellipse(crosshair_x, crosshair_y, crosshair_size_large, crosshair_size_large, 0, 0, 2 * Math.PI);
ctx2.stroke();

f_x_inv = createTransform([marge_left, canvas_width], [1, num_days_2016])
day = Math.round(f_x_inv(crosshair_x))
ctx2.font = '16px Times New Roman';
ctx2.rotate(-Math.PI/2);
// distance of date from crosshair
crdist = 120
if (crosshair_y < crdist){
  ctx2.fillText(dates[day - 1], - crosshair_y - crdist, crosshair_x + 15);
}
else{
  ctx2.fillText(dates[day - 1], - crosshair_y + crdist, crosshair_x + 15);
}
// reset text angle
ctx2.rotate(Math.PI/2);

f_y_inv = createTransform([canvas_height - marge_bottom, 0], range)
ctx2.font = '16px Times New Roman';

// distance of temperature from crosshair
crdisttemp = 120
if (crosshair_y < crdisttemp){
  ctx2.fillText(Number(temperatures[day - 1])/10, crosshair_x - crdisttemp, crosshair_y - 5);
}
else{
  ctx2.fillText(Number(temperatures[day - 1])/10, crosshair_x + crdisttemp, crosshair_y - 5);
}

console.log(Number(temperatures[day - 1])/10)
