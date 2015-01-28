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

    // Store the sprite details
    var sprite = new PIXI.Sprite(
        new PIXI.Texture.fromImage("http://placekitten.com/g/200/300")
    );

    /**
     * Update the player
     */
    function update() {
        sprite.position.x = pos.x;
        sprite.position.y = pos.y;
        sprite.rotation += 0.1;
        sprite.scale = {x: 0.5, y: 0.5};
    }

    /**
     * Set the Position of the player
     *
     * @param Float x The x position
     * @param Float y The y position
     */
    function setPosition(x, y) {
        pos.x = x;
        pos.y = y;
    }

    // Public methods and properties
    return {
        position: pos,
        update: update,
        setPosition: setPosition,
        sprite: sprite
    };
});
