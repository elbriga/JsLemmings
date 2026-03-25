class Input {
    static mouse = { x: 0, y: 0, delta: 0, buttons: 0 };

    static updateMouse(pos, delta, buttons) {
        [ this.mouse.x, this.mouse.y ] = pos;
        this.mouse.delta = delta;
        this.mouse.buttons = buttons;
    }
}