part of inputs;

class Mouse {

    var element;

    /**
     * The object we want to listen to
     * events on
     */
    void attachTo(element)
    {
        this.element = element;
    }

    /**
     * Attach a listener for mouse movement
     */
    void move(function)
    {
        element.onMouseMove.listen(function);
    }

    /**
     * Attach a listener to a mouse click
     */
    void click(function)
    {
        element.onMouseDown.listen(function);
    }
}
