/**
 * This is the Javascript file used for the game
 * client. It takes a socket and some callbacks
 * so we can handle client events.
 *
 * @param WebSocket socket
 * @param Function onConnect
 * @param Function onMessage
 * @param Function onError
 * @param Function onDisconnect
 */
var Client = (function(socket, Game) {

    // Bind some events to the socket
    socket.onopen = onConnect;
    socket.onclose = onDisconnect;
    socket.onmessage = onMessage;
    socket.onerror = onError;

    /**
     * Called when we connect to the server,
     * if no connection made we need to
     * try again.
     */
    function onConnect() {
        console.log('Connected to the server');
    }

    /**
     * Called when we disconnect from the
     * server.
     */
    function onDisconnect() {
        console.log('Disconnected from the server');
    }

    /**
     * Called when we receive a message
     * from the server
     */
    function onMessage(message) {

        var entity = Game.entities.find('player');

        if(entity != undefined) {
            entity.onMessage(message);
        }
    }

    /**
     * Handle errors
     *
     * @param Mixed e
     */
    function onError(e) {
        console.log('A problem was encountered');
        console.log(e);
    }

    /**
     * Check if we're connected
     */
    function isConnected() {
        return socket.readyState == 1;
    }

    /**
     * Close the connection to the server
     */
    function closeConnection() {
        socket.close();
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
        send : sendMessage,
        close: closeConnection,
        socket: socket,
        isConnected: isConnected
    };
});
