// TODO : Unir Entity e Obj
class ExitPortal extends Obj {
  activate(game, lem) {
    game.points += 1;
    lem.die("gone");
  }
}

class TNT extends Obj {
  constructor(game, objDef) {
    super(game, objDef);
    //this.collideRect = TODO;
    this.collide = 30;
  }

  activate(game, lem) {
    console.log("FIRE!!!!");
    game.level.dig_hole(this.pos, 100);
    //new Explosion(); // TODO
    this.remove = true;
    return true;
  }
}

class Explosion extends Obj {
  // TODO!!
}

Obj.classes = { ExitPortal, TNT };
