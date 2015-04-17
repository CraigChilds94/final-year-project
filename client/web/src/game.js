/**
 * This file contains all of the basic game code.
 */
var serverLocation = '127.0.0.1:1234';
var keyboard = new Keyboard();

// Store some game info
var Game = {
    viewWidth:  630,
    viewHeight: 410,
    keyboard: keyboard
};

var client = Client(new WebSocket('ws://' + serverLocation), Game);

// Add renderer
Game.renderer = new PIXI.WebGLRenderer(Game.viewWidth, Game.viewHeight);
document.body.appendChild(Game.renderer.view);

// Create a Game stage
Game.stage = new PIXI.Stage();

// Create game objects
var player = new Player(PIXI, Game, client);
player.setPosition(Game.viewWidth / 2, Game.viewHeight / 2);
player.setControlled(true);
player.init();

// Keep track of any networked entities in the game
// Add the player by default
Game.entities = new EntityMap();
Game.entities.add('player', player);

// Add stuff to the stage
Game.stage.addChild(player.sprite);

// Handle each frame
requestAnimationFrame(update);
function update() {
    Game.keyboard.bind();
    player.update();
    Game.renderer.render(Game.stage);
    requestAnimationFrame(update);
}
