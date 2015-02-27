package gameserver;

import org.java_websocket.WebSocket;

import java.lang.reflect.Array;
import java.util.ArrayList;

/**
 * Handle message building and parsing
 * mimics "Messages" literal in client
 * code.
 */
public class MessageHandler {

    /**
     * Build a String message given a
     * message object.
     *
     * @param  msg The Message object
     * @return The formatted message as a string
     */
    public static String build(Message msg)
    {
        // Grab our message data
        String action = msg.getAction() + "\n";
        String clientID = msg.getClientID() + "\n";
        String body = "\n" + msg.getBody() + "\n";
        int recipient = msg.getRecipient();

        // Need to store the message somewhere
        String message = action + clientID;

        // Recipient will be -1 if not
        // present in message
        if(recipient != -1) {
            message += recipient + "\n";
        }

        // Add the body
        message += body;
        return message;
    }

    /**
     * Given the raw message data, parse it
     * into something we can understand.
     *
     * @param messageData The raw message
     * @return  Message
     */
    public static Message parse(String messageData)
    {
        // Split by new line
        String[] messageParts = messageData.split("\n");

        // Assume first line is the action
        int action = Integer.parseInt(messageParts[0]);

        // And second line is the client
        int clientID = Integer.parseInt(messageParts[1]);

        // Set default for recipient
        int recipient = -1;

        // If the 3rd line is not a new line
        if(messageParts[2] != "\n") {
            // We assume it's the recipient ID
            recipient = Integer.parseInt(messageParts[2]);
        }

        // The last part is always the message body
        String body = messageParts[messageParts.length - 1];
        return new Message(action, clientID, recipient, body);
    }

    /**
     * Given a message we need to work out how many
     * we're actually sending. Ie. is it a broadcast
     * or are there a set number of recipients?
     *
     * @param message The message object
     * @return WebSocket array, recipients
     */
    public static WebSocket[] process(Message message)
    {
        ArrayList<WebSocket> sockets = new ArrayList<WebSocket>();

        // If we're getting a movement update
        if(message.getAction() == Message.moveUpdate) {

            // Get all other clients
            for(WebSocket socket : GameServer.clients.keySet()) {
                int id = GameServer.clients.get(socket);
                if(id != message.getClientID()) {
                    sockets.add(socket);
                }
            }
        }

        return (WebSocket[]) sockets.toArray();
    }

}
