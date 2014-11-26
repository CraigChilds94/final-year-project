import 'dart:html';
import 'dart:async';
import 'dart:math';

void main() {
    WebSocketClient client = new WebSocketClient("127.0.0.1", 1234);   
}

/**
 * Websocket client
 */
class WebSocketClient {
    
    String address;
    int port;
    WebSocket ws;
    
    /**
     * Construct a new client, bind to
     * the [address] and [port]
     */
    WebSocketClient(this.address, this.port) {
        attemptConnection();
    }
    
    /**
     * Attempt a connection to a websocket server on
     * the [address] and [port] and store it in [ws]
     */
    void attemptConnection() {
        ws = new WebSocket('ws://${this.address}:${this.port}');
        ws.onOpen.first.then(onConnect);
        ws.onError.first.then(onFail);
    }
    
    /**
     * What happens when a connection is made,
     * pass throught the [event] object
     */
    void onConnect(event) {
        print("Connection made");
        ws.onMessage.listen((e) {
            onMessage(e.data);
        });
        
        ws.send("Hello server");
        
        for(int i = 0; i < 1000; i++) {
            new Timer(new Duration(milliseconds: new Random().nextInt(100)), () {
                ws.send("Hello server");
            });
        }
    }
    
    /**
     * What happens when a connection fails, also pass
     * the [event]
     */
    void onFail(event) {
        print("Unable to connect. Reattempting connection.");
        new Timer(new Duration(seconds : 2), () {
            attemptConnection();
        });
    }
    
    /**
     * Handle a [message] sent by the server
     */
    void onMessage(String message) {
        print(message);
    }
    
}