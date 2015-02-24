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

/**
 * Message object mimics Java implementation
 * used in server application
 */
var Message = (function(act, ID, rec, b) {

    var action = act,
        clientID = ID,
        recipient = rec,
        body = b;

    /**
     * Getter for the action
     *
     * @return int action
     */
    function getAction() {
        return action;
    }

    /**
     * Getter for the client ID
     * @return int The ID of the client
     */
    function getClientID() {
        return getClientID;
    }

    /**
     * Getter for recipient ID
     * @return int The ID of the intended recipient
     */
    function getRecipient() {
        return recipient;
    }

    /**
     * Getter for the body
     *
     * @return string The body of the message
     */
    function getBody() {
        return body;
    }

    /**
     * Mimic java to string method
     * for easy debugging.
     *
     * @return string The string representation of this object
     */
    function toString() {
        var string =  getAction + "\n"
                    + getClientID + "\n"
                    + getRecipient + "\n\n"
                    + getBody;
        return string;
    }

    // Make getter's publically available
    return {
        getBody: getBody,
        getAction: getAction,
        getRecipient: getRecipient,
        getClientID: getClientID,
        toString: toString
    };
});
