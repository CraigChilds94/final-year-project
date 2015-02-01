/**
 * Handle Network interactions
 * @type Object
 */
var Network = {

    // Message id
    id: 0,

    /**
     * Called when we connect to the socket
     */
    onConnect: function() {
        console.log('Connected to ' + serverLocation);
        console.log(client);
        client.send('Here is a message');
    },

    /**
     * Called when we receive a message
     */
    onMessage: function(message) {
        messageBus.add(Network.id++, function() {
            return message;
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
