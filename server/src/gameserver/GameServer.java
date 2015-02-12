package gameserver;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Implementation of a Web Socket Server
 * to handle messages for a game.
 */
public class GameServer extends WebSocketServer {

    private int decoders = 10; // How many decoders are being used
    private HashMap<WebSocket, Integer> clients; // Where we store refs to clients

    /**
     * Construct a new Game Server
     */
    public GameServer()
    {
        super(new InetSocketAddress("127.0.0.1", 1234), decoders);
        clients = new HashMap<WebSocket, Integer>();
        System.out.println("The server is running on: " + this.getAddress());
    }

    /**
     * What happens when the connection is opened
     * @param webSocket         The web socket connection
     * @param clientHandshake   The handshake
     */
    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake)
    {
        // Generate client UID
        int id = UUID.randomUUID();

        // Put client in a Map
        clients.put(webSocket, id);

        // Build a new connectd mesage and send it to the client
        Message connected = new Message(Message.connection, id, -1, "");
        webSocket.send(MessageHandler.build(connected));
    }

    /**
     * What happens when the connection is closed
     * @param webSocket     The web socket connection
     * @param i             An integer
     * @param s             A string
     * @param b             A boolean
     */
    @Override
    public void onClose(WebSocket webSocket, int i, String s, boolean b)
    {
        // Remove client from refs
        clients.pop(webSocket);

        // Tell clients about closed connection
        System.out.println("Connection closed");
    }

    /**
     * What happens when we receive a message
     * @param webSocket     The web socket connection
     * @param s             The message
     */
    @Override
    public void onMessage(WebSocket webSocket, String s)
    {
        // Get a message and parse it
        Message message = MessageHandler.parse(s);

        // Work out what response we give
        Message[] messages = MessageHandler.process(message);

        // Send it out to any required recipients
        for(Message response : messages) {

            // Grab the recipients websocket
            int id = response.getRecipient();
            WebSocket socket = clients.get(id);

            // Send the message to them
            socket.send(MessageHandler.build(response));
        }
    }

    /**
     * What happens when an error occurs
     * @param webSocket     The web socket connection
     * @param e             Exception
     */
    @Override
    public void onError(WebSocket webSocket, Exception e)
    {
        System.out.println(e);
    }

}
