// A message bus datatype
var MessageBus = (function() {

    var messages = [];

    /**
     * Consume a message on the bus
     *
     * @return Mixed the data returned from the consumption
     */
    function consume() {
        var message = messages.pop();
        return message.body();
    }

    /**
     * Add a new message to the bus
     *
     * @param Mixed   id    Something that is a UID
     * @param Function callback What to do when we reach this message
     */
    function add(id, callback) {
        var message = {
            id: id,
            body: callback
        };

        messages.unshift(message);
    }


    /**
     * Process the messages on the bus, passes
     * data returned from consumption to callback
     * else false in the case that there are no
     * messages to consume.
     *
     * @param Function Callback  Called when we consume a message
     */
    function process(callback) {
        for(messageIndex in messages) {
            var message = messages[messageIndex];
            callback(message.consume());
        }
        callback(false);
    }

    /**
     * Clear the message queue
     *
     * @return Array The old message queue
     */
    function clear() {
        var temp = messages;
        messages = [];
        return temp;
    }

    // give access to public stuff
    return {
        consume: consume,
        process: process,
        clear: clear,
        add: add
    };

});
