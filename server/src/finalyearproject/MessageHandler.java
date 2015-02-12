package finalyearproject;

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
     * @param  msg
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

}
