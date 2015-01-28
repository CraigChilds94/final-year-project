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
    onMessage: function(message) {
        MessageBus.add(1, function() {
            console.log(message);
        });
    },

    /**
     * Called when an error occurs
     */
    onError: function() {
        console.log('Something went wrong');
    },

    /**
     * Called if we disconnect
     */
    onDisconnect: function() {
        console.log('Disconnected from ' + serverLocation);
    }
};
