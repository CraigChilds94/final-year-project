/**
 * Player object, takes the world and client
 *
 * @param PIXI the PIXI library
 * @param Object world
 * @param Client client
 */
var Player = (function(PIXI, world, client) {

    // Store some positional info
    var pos = {
        x: 0,
        y: 0
    };

    // Store delta values
    var delta = {
        x: 0,
        y: 0
    };
    var idle = true;
    var lastDelta = delta;

    // Is this controlled by the current client?
    var controlled = false;

    // Store the sprite details
    var sprite = new PIXI.Sprite(
        new PIXI.Texture.fromImage("http://placekitten.com/g/200/300")
    );

    /**
     * Construct the player
     */
    function init() {
        // Set the initial scale for the image
        sprite.scale = {x: 0.5, y: 0.5};

        if(controlled) {
            // Bind keyup interaction
            world.keyboard.addEventListener('keyup', function() {
                setDelta(0, 0);
            });

            // Bind keydown interaction
            world.keyboard.addEventListener('keydown', function(e) {
                e = e || window.event;

                if (e.keyCode == '38') {
                    setDelta(0, -1); // up
                } else if (e.keyCode == '40') {
                    setDelta(0, 1); // down
                } else if (e.keyCode == '37') {
                    setDelta(-1, 0); // left
                } else if (e.keyCode == '39') {
                    setDelta(1, 0); // right
                }
            });
        }

        networkUpdate(500);
    }

    /**
     * Handle the rate at which the network updates
     * are sent to the server
     *
     * @param Integer rate
     */
    function networkUpdate(rate) {
        setInterval(function() {
            if(client.isConnected() && JSON.stringify(delta) != lastDelta && !idle) {
                client.send(JSON.stringify(delta));
            }
        }, rate);
    }

    /**
     * Set whether or not this player is controlled
     * locally.
     *
     * @param Boolean boolean
     */
    function setControlled(boolean) {
        controlled = boolean;
    }

    /**
     * Update the player
     */
    function update() {
        sprite.position.x += delta.x;
        sprite.position.y += delta.y;
    }

    /**
     * Set the Position of the player
     *
     * @param Float  x  The x position
     * @param Float  y  The y position
     */
    function setPosition(x, y) {
        pos.x = x;
        pos.y = y;
    }

    /**
     * Set the delta values
     *
     * @param Float  x  The x position
     * @param Float  y  The y position
     */
    function setDelta(x, y) {
        lastDelta = JSON.stringify(delta);
        delta.x = x;
        delta.y = y;

        if(delta.x == 0 && delta.y == 0) {
            idle = true;
        } else {
            idle = false;
        }
    }

    /**
     * Handle an incoming message for this entity
     *
     * @param String data
     */
    function onMessage(data) {
        console.log(data);
    }

    // Public methods and properties
    return {
        position: pos,
        update: update,
        sprite: sprite,
        setPosition: setPosition,
        setDelta: setDelta,
        setControlled: setControlled,
        init: init,
        onMessage: onMessage
    };
});
