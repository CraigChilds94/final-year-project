package gameserver;

/**
 * Type representing a Message which is
 * being sent between server and client
 */
public class Message {

    public static int connection = 100, // Represents a new connection msg
                      moveUpdate = 200; // Represents an update msg

    private int action,     // Integer
                clientID,   // ID from client
                recipient;  // ID for next client

    // Body, delimited by a new line either side
    // of content
    private String body;

    public Message(int action, int clientID, int recipient, String body)
    {
        this.action = action;
        this.clientID = clientID;
        this.recipient = recipient;
        this.body = body;
    }

    /**
     * Get the message action
     *
     * @return The ID which represents an action
     */
    public int getAction()
    {
        return this.action;
    }

    /**
     * Get the sending clients ID
     *
     * @return The sending clients ID
     */
    public int getClientID()
    {
        return this.clientID;
    }

    /**
     * Get the recipients ID
     *
     * @return The recipients ID
     */
    public int getRecipient()
    {
        return this.recipient;
    }

    /**
     * Getter for the body of the message
     *
     * @return The body of the message
     */
    public String getBody()
    {
        return this.body;
    }
}
