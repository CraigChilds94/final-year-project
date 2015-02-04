/**
 * This file contains all of the basic game code.
 */
var serverLocation = '127.0.0.1:1234';
var messageBus = new MessageBus();
var keyboard = new Keyboard();
var ws = new WebSocket('ws://' + serverLocation);
var client = Client(ws, Network.onConnect, Network.onMessage, Network.onError, Network.onDisconnect);

// Store some game info
var Game = {
    viewWidth:  630,
    viewHeight: 410,
    keyboard: keyboard
};

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

// Add stuff to the stage
Game.stage.addChild(player.sprite);

// Handle each frame
requestAnimationFrame(update);
function update() {
    Game.keyboard.bind();
    messageBus.process(function(data) {
        console.log(data);
    });
    player.update();
    Game.renderer.render(Game.stage);
    requestAnimationFrame(update);
}
