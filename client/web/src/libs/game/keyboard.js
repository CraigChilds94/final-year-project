// Handle Keyboard stuff
var Keyboard = (function() {

    // Store some bindings
    var eventStack = {
        keyup: [],
        keydown: []
    };

    /**
     * Bind our listeners
     */
    function bind() {
        document.onkeyup = call('keyup');
        document.onkeydown = call('keydown');
    }

    /**
     * Call the event stack on the native listener
     *
     * @param String    type
     * @return Function callback
     */
    function call(type) {
        return function(data) {

            for(index in eventStack[type]) {
                var func = eventStack[type][index];
                func(data);
            }

        };
    }

    /**
     * Add a new callback to an event listener
     *
     * @param String  type
     * @param Function callback
     */
    function addEventListener(type, callback) {
        eventStack[type].push(callback);
    }

    // Return public scoped functions/variables
    return {
        bind: bind,
        events: eventStack,
        addEventListener: addEventListener
    };
});
