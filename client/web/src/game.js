/**
 * This file contains all of the basic game code.
 */
var ws = new WebSocket('ws://127.0.0.1:1234');
var client = Client(ws, Network.onConnect, Network.onMessage, Network.onError, Network.onDisconnect);

// Add renderer
var renderer = new PIXI.WebGLRenderer(800, 600);
document.body.appendChild(renderer.view);

// Create game objects
var player = new Player(PIXI, {}, client);
var stage = new PIXI.Stage();
stage.addChild(player.sprite);

// Handle each frame
requestAnimationFrame(update);
function update() {
    player.update();
    renderer.render(stage);
    requestAnimationFrame(update);
}
