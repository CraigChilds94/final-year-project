/**
 * Handle Network interactions
 * @type Object
 */
var Network = {

    /**
     * Called when we connect to the socket
     */
    onConnect: function() {
        console.log('Connected to ' + serverLocation);
    },

    /**
     * Called when we receive a message
     */
    onMessage: function() {

    },

    /**
     * Called when an error occurs
     */
    onError: function() {

    },

    /**
     * Called if we disconnect
     */
    onDisconnect: function() {
        console.log('Disconnected from ' + serverLocation);
    }
};
