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
var Client = (function(socket, onConnect, onMessage, onError, onDisconnect) {

    // Bind some events to the socket
    socket.onopen = onConnect;
    socket.onclose = onDisconnect;
    socket.onmessage = onMessage;
    socket.onerror = onError;

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
