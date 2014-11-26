import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.function.Function;

/**
 *
 * Created by craigchilds on 12/11/2014.
 *
 */
public class Application extends WebSocketServer {

    /**
     * Main
     * @param args      String array of terminal arguments
     */
    public static void main(String[] args) {
        try {

            Application app = new Application();
            app.start();
            System.out.println("Server started");

        } catch(UnknownHostException e) {
            System.out.println(e.getMessage());
        }

    }

    /**
     * Construct a new test application for this
     * @throws UnknownHostException
     */
    public Application() throws UnknownHostException {
        super(new InetSocketAddress("127.0.0.1", 1234));
        System.out.println(this.getAddress());
    }


    /**
     * What happens when the connection is opened
     * @param webSocket         The web socket connection
     * @param clientHandshake   The handshake
     */
    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
        System.out.println("New connection");
    }

    /**
     * What happens when the connection is closed
     * @param webSocket     The web socket connection
     * @param i             An integer
     * @param s             A string
     * @param b             A boolean
     */
    @Override
    public void onClose(WebSocket webSocket, int i, String s, boolean b) {
        System.out.println("Connection closed");
    }

    /**
     * What happens when we receive a message
     * @param webSocket     The web socket connection
     * @param s             The message
     */
    @Override
    public void onMessage(WebSocket webSocket, String s) {
        String[] parts  = s.split("(:)");
        String key = parts[0];
        System.out.println(parts[0]);
        webSocket.send(key);
    }

    /**
     * What happens when an error occurs
     * @param webSocket     The web socket connection
     * @param e             Exception
     */
    @Override
    public void onError(WebSocket webSocket, Exception e) {
        System.out.println(e);
    }
}
