// Let's do some chart stuff
var ctx = document.getElementById('chart').getContext('2d');
var chart = new Chart(ctx);
var lineChart = null;
var i = 1;
var maxToShow = 10;

// init empty arrays to store results
var times = [];
var stdDeviation = [];
var maximums = [];
var minimums = [];

initChart();

// Create a client, grab the results
var client = Client(1, new WebSocket('ws://127.0.0.1:1234'), function(time) {

    times.push(time);
    update(time);

});

/**
 * Update the graph with the times data
 */
function update(time) {

    lineChart.addData([time], i);

    if(i >= maxToShow) {
        lineChart.removeData();
    }

    lineChart.update();

    i++;
}

/**
 * Called when drawing the chart for
 * the first time
 */
function initChart() {

    // Heres all the data for the chart
    var data = {
        labels: [0],
        datasets: [
            {
                label: 'Response Time (ms) every second',
                fillColor: "rgba(255,73,71,0.2)",
                strokeColor: "rgba(255,73,71,1)",
                pointColor: "rgba(255,73,71,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(255, 73, 71, 1)",
                data: [0]
            }
        ]
    };

    // Here are the options for the chart
    var options = {};

    // With the data draw a line chart
    lineChart = chart.Line(data, options);

    // Draw a legend with the data
    legend(document.getElementById("legend"), data);
}

/**
 * Generate the number labels given an upper bound,
 * used for labelling the graph.
 *
 * @param Int upper The number of labels
 * @return Array an array of numbers, ie. the labels
 */
function generateLabels(upper) {
    var nums = [];
    for(var i = 1; i <= upper; i++) {
        nums.push(i);
    }
    return nums;
}

/**
 * Generate a legend for chart JS data
 * from https://github.com/bebraw/Chart.js.legend/blob/master/src/legend.js
 */
function legend(parent, data) {
    parent.className = 'legend';
    var datas = data.hasOwnProperty('datasets') ? data.datasets : data;

    // remove possible children of the parent
    while(parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }

    datas.forEach(function(d) {
        var title = document.createElement('span');
        title.className = 'title';
        title.style.borderColor = d.hasOwnProperty('strokeColor') ? d.strokeColor : d.color;
        title.style.borderStyle = 'solid';
        parent.appendChild(title);

        var text = document.createTextNode(d.label);
        title.appendChild(text);
    });
}

/**
* Calculate the average value using the array
* of times.
*
* @param Array  times  An array of times
* @return Int  The average of all values in the array
*/
function calculateAverage(times) {
    var sum = 0;
    for(var i = 0; i < times.length; i++) {
        if(times[i] < min) {
            min = times[i];
        }

        if(times[i] > max) {
            max = times[i];
        }

        sum += Math.abs(times[i]);
    }
    return sum / times.length;
}

/**
* Get the standard deviation for the averages
*
* @param Array  times  An array of times
* @return Int  The Std Deviation
*/
function standardDeviation(times) {
    var vals = [];
    for(var i = 0; i < times.length; i++) {
        var diff = times[i] - average;
        var val = diff*diff;
        vals[i] = val;
    }

    var valsum = 0;
    for(var j = 0; j < vals.length; j++) {
        valsum += vals[j];
    }

    return Math.sqrt(valsum / vals.length);
}
