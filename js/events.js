class Events {
  static onMouseClick(game, buttons, pos) {
    if (!game) return;

    if (game.endScene) {
      // Tratar os eventos de End Scene
      reset();
      return;
    }

    if (game.hovered) {
      const lem = game.hovered;
      switch (buttons) {
        case 1: // botao esquerdo
          lem.give_skill();
          break;

        case 4: // botao meio
          lem.burn();
          break;

        case 2: // botao direito
          lem.explode();
          break;
      }
    }
  }

  static onKeyPress(game, key) {
    if (!game) return;

    if (game.endScene) {
      // Tratar os eventos de End Scene
      reset();
      return;
    }

    if (game.quitting) {
      // Nao tratar eventos na animacao de Quit
      return;
    }

    switch (key) {
      case "q":
        game.quit();
        break;
      case "p":
        game.toggle_paused();
        break;
      case "m":
        game.toggle_show_mask();
        break;
      case "w":
        game.toggle_debug();
        break;

      case "b":
        game.select_skill("Blocker");
        break;
      case "x":
        game.select_skill("Exploder");
        break;
      case "d":
        game.select_skill("Digger");
        break;
      case "c":
        game.select_skill("Builder");
        break;
      case "g":
        game.select_skill("Umbrella");
        break;
    }
  }
}
