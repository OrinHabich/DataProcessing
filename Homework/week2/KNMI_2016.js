/** KNMI_2016.js
 * Orin Habich 10689508
 *
 * Draws a graph of the average temperature in De Bilt per day in 2016.
 * Average is over 24 hrs, temperature in 0.1 degree celsius.
 * 2016 was a leap year ('schrikkeljaar')
 *
 * first part parses the data, second part draws the graph on the canvas
 *
 * The graph is scalable (adjust width="1600" and height="900" in the html).
 * Magic numbers are only used to adjust placement of texts,
 * which have fixed sizes anyway.
 **/

var url =
  "https://orinhabich.github.io/DataProcessing/Homework/week2/KNMI_2016.csv";

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
// creates a line graph with the given data

  var temperatures = []
  var dates = []
  var months = []
  var min_temp = max_temp = 0
  var num_days_2016 = 366

  // split the data
  var data = data.split("\n");

  // iterate over days in year
  for (i = 1; i < num_days_2016 + 1; i++){

    // split the data into separate values
    var row = data[i].split(",");
    var date = row[0].trim();

    /*
    fill array months, this array contains which day of the year
    is the first day of a month
    */
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
  transform_x = create_transform(1, num_days_2016, padding_left, canvas_width);
  transform_y = create_transform(min_temp, max_temp,
    canvas_height - padding_bottom, 0);

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
  draw_line(transform_x(0), transform_y(min_temp), transform_x(num_days_2016),
    transform_y(min_temp));
  draw_line(transform_x(0), transform_y(min_temp), transform_x(0),
    transform_y(max_temp));

  // lay-out and content x-axis
  ctx.font = '16px Times New Roman';
  var month_names = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
  for (i = 0; i < months.length; i++){
    draw_line(transform_x(months[i]), transform_y(min_temp),
      transform_x(months[i]), transform_y(min_temp - 2));
    ctx.fillText(month_names[i], padding_left + (canvas_width - padding_left) /
        month_names.length * i + 20, canvas_height - (padding_bottom - 20) );
  }

  // lay-out and content y-axis
  var temp_precision = 0.1;

  for (i = Math.round(min_temp * temp_precision);
      i < Math.round(max_temp * temp_precision) + 1; i++){
    var y = transform_y(i / temp_precision)
    draw_line(transform_x(0), y, transform_x(-1), y);
    ctx.fillText(i, padding_left - 30, y);
  }

  // add label x-axis
  ctx.font = '24px Times New Roman';
  ctx.fillText('time (in days)', canvas_width / 4, canvas_height - 20);

  // add (rotated) label y-axis
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
    draw_line(transform_x(i + 1), transform_y(temperatures[i]),
      transform_x(i + 2), transform_y(temperatures[i + 1]));
  }
}

function create_transform(data_min, data_max, canvas_graph_min, canvas_graph_max){
/*  returns a linear function (x_screen = alpha * x_data + beta) to scale the
    domain or range of the data to an appropriate size for the canvas
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
