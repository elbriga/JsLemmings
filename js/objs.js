class ExitPortal extends Obj {
  activate(lem) {
    this.game.points += 1;
    lem.die("gone");
  }
}

class TNT extends Obj {
  constructor(game, name, x, y) {
    super(game, name, x, y);
    //this.collideRect = TODO;
    this.collide = 30;
  }

  activate(lem) {
    console.log("FIRE!!!!");
    this.game.explosion(this.pos, 100);
    lem.die();
    this.remove = true;
  }
}

class Explosion extends Obj {
  on_cycle_anim() {
    // Rodar a animação uma vez e remover
    this.remove = true;
  }
}

Obj.classes = { ExitPortal, TNT, Explosion };
