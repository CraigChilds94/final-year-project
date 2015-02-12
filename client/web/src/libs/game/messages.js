// Store some message ID's / Action ID's in
// an object literal. Equivalent to an
// Enum in Java
var Messages = {

    // Where the types of messages are stored
    types: {
        // Represents a new client connection
        connection: 100,

        // Represents a moveUpdate
        // sent from client to server
        // and server to client
        moveUpdate: 200
    },


    /**
     * Build a new message into
     * the approrpriate format
     *
     * @param Integer id Type of message
     * @param Object data The data to be sent
     */
    build: function(id, data) {
        var messageAction = 'id:' + id + '\n';
        var messageBody = '\n' + data.body + '\n';
        var messageRecipient = data.recipient;
        var messageClientID = data.myID + '\n';

        var message = messageAction + messageClientID;

        if(messageRecipient != undefined) {
            message += messageRecipient + '\n';
        }

        message += messageBody;
        return message;
    }
};
