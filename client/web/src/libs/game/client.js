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
     *
     * @param String    msg
     */
    function onMessage(msg) {

        var entity = Game.entities.find('player');
        var message = Messages.parse(msg);

        if(entity != undefined) {
            entity.onMessage(message);
        }

        var action = message.getAction();

        console.log(message.toString());

        // Handle new player connection
        if(action == Messages.types.playerConnection) {
            var newPlayer = new Player(PIXI, Game, self);
            newPlayer.setID(message.getClientID());
            newPlayer.init();

            Game.entities.add(message.getClientID(), newPlayer);
            Game.stage.addChild(newPlayer.sprite);
        }

        // Handle disconnects
        if(action == Messages.types.disconnect) {
            var id = message.getClientID();

            var player = Game.entities.find(id);
            Game.stage.removeChild(player.sprite);
            Game.entities.remove(id);
        }

        // Handle existing players
        if(action == Messages.types.existingConnections) {
            console.log(message.getBody());
            var body = message.getBody();
            var ids = body.replace(/[\[\]']+/g,'').split(',');
            console.log(ids);

            for(i in ids) {
                var playerID = ids[i];
                var newPlayer = new Player(PIXI, Game, self);
                newPlayer.setID(playerID);
                newPlayer.init();

                Game.entities.add(playerID, newPlayer);
                Game.stage.addChild(newPlayer.sprite);

                console.log(playerID);
            }
        }

        // Handle position updates
        if(action == Messages.types.positionUpdate) {
            var player = Game.entities.find(message.getClientID());
            var position = JSON.parse(message.getBody());

            player.setPosition(position.x, position.y);
        }

        // Handle delta change updates
        if(action == Messages.types.moveUpdate) {
            var player = Game.entities.find(message.getClientID());
            var delta = JSON.parse(message.getBody());

            if(player == 'undefined' || !player || player == null) return;
            player.setDelta(delta.x, delta.y);
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
    var self = {
        send : sendMessage,
        close: closeConnection,
        socket: socket,
        isConnected: isConnected
    };

    return self;
});
