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
    // var numRequests = 100;
    var requestDelay = 1000;
    var max = -1;
    var min = 999999;
    var time = 0;

    /**
     * Called when a connection to the socket
     * has been created.
     */
    function onConnect() {
        counter = 0;
        var interval = setInterval(function() {

            var key = 'message_' + (counter++);
            var m = key + ':abcdefghijklmnopqrstuvwxyz0123456789';

            sendMessage(m);
            track[key] = new Date().getTime();

        }, requestDelay);
    }

    /**
     * Called when the connection between
     * the client and the server has
     * been closed.
     */
    function onDisconnect() {
        console.log('Your connection to the server has been closed : ' + id);
    }

    /**
     * Called when a message has been received
     * from the server.
     *
     * @param  String  message  The message
     */
    function onMessage(message) {
        // Calculate time diff between request and response
        time = new Date().getTime() - track[message.data];
        callback(time);
    }

    /**
     * Called when the client fails to
     * connect to the server
     */
    function onFail() {
        console.log('Unable to connect');
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
