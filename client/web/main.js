// Let's do some chart stuff
var ctx = document.getElementById('chart').getContext('2d');
Chart.defaults.Line.scaleIntegersOnly = false;
Chart.defaults.Line.scaleSteps = 0.01;
Chart.defaults.Line.scaleStartValue = 0;
var chart = new Chart(ctx);

// init empty arrays to store results
var averages = [];
var stdDeviation = [];
var maximums = [];
var minimums = [];

// Some test variables
var numClients = 20;
var numClientsFinished = 0;

// Create 100 clients, grab the results
for(var i = 0; i < numClients; i++) {
    var client = Client(i, new WebSocket('ws://127.0.0.1:1234'), function(avg, stddev, min, max) {

        averages.push(avg);
        maximums.push(max);
        minimums.push(min);
        stdDeviation.push(stddev);
        numClientsFinished++;

        // console.log(max + " --- " + min);

        if(numClientsFinished == numClients) {
            onFinish();
        }
    });
}

// while(numClientsFinished < numClients){}

// onFinish();
/**
 * Called when the tests have finished
 */
function onFinish() {

    // Heres all the data for the chart
    var data = {
        labels: generateLabels(numClientsFinished),
        datasets: [
            {
                label: 'Averages',
                fillColor: "rgba(255,73,71,0.2)",
                strokeColor: "rgba(255,73,71,1)",
                pointColor: "rgba(255,73,71,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(255, 73, 71, 1)",
                data: averages
            },
            {
                label: 'Standard deviation',
                fillColor: "rgba(67, 96, 232,0.2)",
                strokeColor: "rgba(67, 96, 232,1)",
                pointColor: "rgba(67, 96, 232,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(67, 96, 232,1)",
                data: stdDeviation
            },
            {
                label: 'Maximum response',
                fillColor: "rgba(232, 176, 34, 0.2)",
                strokeColor: "rgba(232, 176, 34, 1)",
                pointColor: "rgba(232, 176, 34, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(232, 176, 34, 1)",
                data: maximums
            },
            {
                label: 'Minimum response',
                fillColor: "rgba(15,255, 165, 0.2)",
                strokeColor: "rgba(15,255, 165, 1)",
                pointColor: "rgba(15,255, 165, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(15,255, 165, 1)",
                data: minimums
            }
        ]
    };

    // Here are the options for the chart
    var options = {};

    // Draw a legend with the data
    legend(document.getElementById("legend"), data);

    // With the data draw a line chart
    chart.Bar(data, options);
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
