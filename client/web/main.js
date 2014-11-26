/**
 * This is the Javascript file used for testing
 */
(function(socket) {

    // Bind some events to the socket
    socket.onopen = onConnect;
    socket.onclose = onDisconnect;
    socket.onmessage = onMessage;

    var counter = 0;
    var track = [];
    var times = [];

    /**
     * Called when a connection to the socket
     * has been created.
     */
    function onConnect() {
        console.log('Connected to the server');
        counter = 0;
        var interval = setInterval(function() {

            if(counter > 9) {
                clearInterval(interval);
                console.log("Average delay in ms = " + calculateAverage(times));
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
        console.log('Your connection to the server has been closed');
        document.getElementById('status').innerHtml = "Testing finished";
    }

    /**
     * Called when a message has been received
     * from the server.
     *
     * @param  String  message  The message
     */
    function onMessage(message) {
        // Add the amount of time this meessage took to
        // be processed to an array
        // console.log(message.data);
        // console.log(track[message.data] + " ----- " + (new Date().getTime()));
        times.push(track[message.data] - new Date().getTime());
    }

    /**
     * Calculate the average value using the array
     * of times.
     *
     * @param Array  times  An array of times
     */
    function calculateAverage(times) {
        var sum = 0;
        for(var i = 0; i < times.length; i++) {
            sum += Math.abs(times[i]);
        }
        return sum / times.length;
    }

    /**
     * Send a message to the server via a socket
     */
    function sendMessage(message) {
        socket.send(message);
    }

})(new WebSocket('ws://127.0.0.1:1234'));
