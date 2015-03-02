package gameserver;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.UUID;

/**
 * Implementation of a Web Socket Server
 * to handle messages for a game.
 */
public class GameServer extends WebSocketServer {

    public static HashMap<WebSocket, Integer> clients; // Where we store refs to clients


    /**
     * Application main
     *
     * @param args CMD Args
     */
    public static void main(String[] args) throws IOException {
        // If we pass an argument, use it as the log file
        if(args.length > 0) {
            if(!args[0].equals("")) {
                SystemMonitor.logFile = args[0];
            }
        } else {
            SystemMonitor.logFile = SystemMonitor.logFileName();
        }

        GameServer gs = new GameServer();
        gs.run();
    }

    /**
     * Construct a new Game Server
     */
    public GameServer() throws IOException {
        // Address and number of threads to spawn
        super(new InetSocketAddress("127.0.0.1", 1234), 8);
        clients = new HashMap<WebSocket, Integer>();

        // Run some system monitoring
        Thread t = new Thread(new SystemMonitor());
        t.start();

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
        // Generate client UID, we'll just use 32-bit ints so we'll get
        // the hashcode of it instead
        int id = UUID.randomUUID().hashCode();

        // Put client in a Map
        clients.put(webSocket, id);

        // Build a new connected message and send it to the client
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
        // Grab the client
        int id = clients.get(webSocket);

        // Build the clientDisconnect message
        Message message = new Message(Message.clientDisconnect, id, -1, "");

        // Remove the client from the list of disconnections
        clients.remove(webSocket);

        // Send
        WebSocket[] sockets = MessageHandler.process(message);
        this.broadcast(sockets, message);
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

        // Work out what response we give to who
        WebSocket[] sockets = MessageHandler.process(message);

        this.broadcast(sockets, message);
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

    /**
     * Broadcast a message to a list of sockets
     * @param sockets
     * @param message
     */
    public void broadcast(WebSocket[] sockets, Message message) {

        // Send it out to any required recipients
        for(WebSocket socket : sockets) {
            socket.send(MessageHandler.build(message));
        }
    }
}
