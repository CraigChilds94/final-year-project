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
    private long messagesReceived = 0L,
                 messagesSent = 0L;

    /**
     * Application main
     *
     * @param args CMD Args
     */
    public static void main(String[] args)
    {
        // If we pass an argument, use it as the log file
        if(args.length > 0) {
            if(!args[0].equals("")) {
                SystemMonitor.logFile = args[0];
            }
        } else {
            SystemMonitor.logFile = SystemMonitor.logFileName();
        }

        GameServer gs = null;

        try {
            gs = new GameServer();
            gs.run();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Construct a new Game Server
     */
    public GameServer() throws IOException
    {
        // Address and number of threads to spawn
        super(new InetSocketAddress(1234), 8);
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
        synchronized (clients) {
            // Generate client UID, we'll just use 32-bit ints so we'll get
            // the hashcode of it instead
//            int id = UUID.randomUUID().hashCode();
            // Put client in a Map
//            clients.put(webSocket, id);

            // Build a new connected message and send it to the client
            Message connected = new Message(Message.connection, -1, -1, "You've connected");
            webSocket.send(MessageHandler.build(connected));
            this.messagesSent++;
        }
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
        synchronized (clients) {
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

        System.out.println("Client disconnected: sent(" + this.messagesSent + ") recieved(" + this.messagesReceived + ")");
    }

    /**
     * What happens when we receive a message
     * @param webSocket     The web socket connection
     * @param s             The message
     */
    @Override
    public void onMessage(WebSocket webSocket, String s)
    {
        synchronized (clients) {
            // Get a message and parse it
            Message message = MessageHandler.parse(s);
            this.messagesReceived++;

            // Put the client in the list if it's not in there
            if(!clients.containsKey(webSocket)) {
                clients.put(webSocket, message.getClientID());
            }

//            System.out.println("#" + this.messagesReceived + ": \n" + message);

            // Work out what response we give to who
            WebSocket[] sockets = MessageHandler.process(message);

            this.broadcast(sockets, message);
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
        e.printStackTrace();
    }

    /**
     * Broadcast a message to a list of sockets
     * @param sockets
     * @param message
     */
    public void broadcast(WebSocket[] sockets, Message message)
    {
//        System.out.println("Sending to " + sockets.length + " clients");

        // Send it out to any required recipients
        for(WebSocket socket : sockets) {
            this.messagesSent++;
            socket.send(MessageHandler.build(message));
        }

    }
}
