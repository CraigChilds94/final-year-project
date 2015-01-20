/**
* This is the Javascript file used for testing
*/
var Client = (function(id, socket, callback) {

    // Bind some events to the socket
    socket.onopen = onConnect;
    socket.onclose = onDisconnect;
    socket.onmessage = onMessage;
    socket.onerror = onFail;

    var counter = 0;
    var track = [];
    var times = [];
    var average = 0;
    var stdDeviation = 0;
    var numRequests = 100;
    var max = -1;
    var min = 999999;

    /**
    * Called when a connection to the socket
    * has been created.
    */
    function onConnect() {
        // console.log('Connected to the server : ' + id);
        counter = 0;
        var interval = setInterval(function() {

            if(counter > numRequests) {
                clearInterval(interval);
                average = calculateAverage(times);
                stdDeviation = standardDeviation(times);
                // console.log("C #" + id + ":delay(ms) " + average + " - stddev " + stdDeviation + "<br>");
                socket.close();
                callback(average, stdDeviation, min, max);
                return;
            }

            var key = 'message_' + (counter++);
            var m = key + ':abcdefghijklmnopqrstuvwxyz0123456789';

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
        var diff = new Date().getTime() - track[message.data];
        times.push(diff);
    }

    /**
     * Called when the client fails to
     * connect to the server
     */
    function onFail() {
        console.log('unable to connect');
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
