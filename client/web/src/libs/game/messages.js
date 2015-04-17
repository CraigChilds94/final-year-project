// Store some message ID's / Action ID's in
// an object literal. Equivalent to an
// Enum in Java
var Messages = {

    // Where the types of messages are stored
    types: {
        // Represents a new client connection
        connection: 100,

        // represent a player connecting
        playerConnection: 101,

        // Handle ack of existing connections
        existingConnections: 102,

        // Disconnection of a client
        disconnect: 103,

        // Represents a moveUpdate
        // sent from client to server
        // and server to client
        moveUpdate: 200,

        // Represent a forced position
        // update message.
        positionUpdate: 201,
    },


    /**
     * Build a new message into
     * the approrpriate format
     *
     * @param   Integer   id      Type of message
     * @param   Object    data    The data to be sent
     * @return  Message           The message object
     */
    build: function(id, data) {
        return new Message(data.action, id, data.recipient, data.body);
    },

    /**
     * Parse a message from string
     *
     * @param  String   msg     The message data
     * @return Message          The message object
     */
    parse: function(msg) {
        var parts = msg.data.trim().split("\n");

        var type        = parts[0];
        var clientID    = parts[1];
        var recipientID = parts[2];
        var body        = parts[parts.length - 1];

        var data = {
            action: type,
            recipient: recipientID,
            body: body
        };

        return this.build(clientID, data);
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
     *
     * @return int The ID of the client
     */
    function getClientID() {
        return clientID;
    }

    /**
     * Getter for recipient ID
     *
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
        var string =  getAction() + "\n"
                    + getClientID() + "\n"
                    + getRecipient() + "\n\n"
                    + getBody();
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
