/**
 * This is the Javascript file used for testing
 */
var Client = (function(id, socket, calculateAverage) {

    // Bind some events to the socket
    socket.onopen = onConnect;
    socket.onclose = onDisconnect;
    socket.onmessage = onMessage;

    var counter = 0;
    var track = [];
    var times = [];
    var average = 0;
    var stdDeviation = 0;

    /**
     * Called when a connection to the socket
     * has been created.
     */
    function onConnect() {
        // console.log('Connected to the server : ' + id);
        counter = 0;
        var interval = setInterval(function() {

            if(counter > 9) {
                clearInterval(interval);
                average = calculateAverage(times);
                stdDeviation = standardDeviation(times);
                document.write("Client -- " + id + " : delay (ms) = " + average + " with stddev of " + stdDeviation + "<br>");
                socket.close();
                return;
            }

            var m = 'message_' + counter + ':abcdefghijklmnopqrstuvwxyz0123456789';
            var key = 'message_' + (counter++);
            sendMessage(m);
            track[key] = new Date().getTime();

        }, 100);
    }

    /**
     * Called when the connection between
     * the client and the server has
     * been closed.
     */
    function onDisconnect() {
        // console.log('Your connection to the server has been closed : ' + id);
    }

    /**
     * Called when a message has been received
     * from the server.
     *
     * @param  String  message  The message
     */
    function onMessage(message) {
        // Calculate time diff between request and response
        times.push(track[message.data] - new Date().getTime());
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

        return Math.sqrt(valsum / vals.length / 10);
    }

    /**
     * Send a message to the server via the socket
     *
     * @param String  message  The message to send
     */
    function sendMessage(message) {
        socket.send(message);
    }

    // Give back the data we want access to
    return {
        average : average,
        standardDeviation : stdDeviation
    };
});

// init empty arrays to store results
var averages = [];
var stdDeviation = [];

// Create 100 clients, grab the results
for(var i = 0; i < 100; i++) {
    var client = Client(i, new WebSocket('ws://127.0.0.1:1234'));
    averages[i] = client.average;
    stdDeviation[i] = client.standardDeviation;
}
