class Events {
    static on_mouse_click(game, buttons, pos) {
        if (!game) return;

        if (game.hovered) {
            const lem = game.hovered;
            switch (buttons) {
                case 1:  // botao esquerdo
                    lem.give_skill();
                    break;

                case 4:  // botao meio
                    lem.burn();
                    break;

                case 2:  // botao direito
                    lem.explode();
                    break;
            }
        }
    }   
}