class LemmingState {
  static states = {};

  constructor(lemming) {
    this.lem = lemming;
  }

  update(isRecursion=false) {}
  on_cycle_anim() {}
  on_change_anim() {}
}

class Blocker extends LemmingState {}

class Walker extends LemmingState {
  update(isRecursion=false) {
    const lem = this.lem;

    if (lem.falling > lem.game.minHeightToDie) {
      lem.die("splat");
      return;
    }
    lem.falling = 0;

    if (!lem.is_on_floor()) {
      lem.set_state("Faller");
      if (!isRecursion)
        lem.update(true);
      return;
    }

    const height = lem.floor_height_in_front();
    if (height > lem.climbHeight) {
      lem.direction *= -1;
      return;
    }
    
    // Andar
    lem.rect.x += lem.direction;
    // Subir o terreno se preciso
    lem.rect.y -= height;

    lem.stateTimer += 1;
    if (lem.stateTimer == 10)
        lem.set_animation("walk");
  }
}

class Faller extends LemmingState {
  update(isRecursion=false) {
    const lem = this.lem;
    if (lem.is_on_floor()) {
        lem.set_state("Walker");
        if (!isRecursion)
            lem.update(true);
        return;
    }

    var delta;
    if (lem.falling > 100)
        delta = 4;
    else if (lem.falling > 50)
        delta = 3;
    else
        delta = 2;
    lem.rect.y  += delta;
    lem.falling += delta;

    if (lem.falling > 100) {
        if (lem.hasUmbrella)
            lem.set_state("Floater");
    } else if (lem.falling > 20 && lem.falling < 26)
        lem.set_animation("fall");
  }
}

class Floater extends LemmingState {}

class Digger extends LemmingState {}

class Exploder extends LemmingState {}

class Builder extends LemmingState {}

class Dying extends LemmingState {}

LemmingState.states = {
    "Blocker":  [ Blocker,  "stop",  ""          ],
    "Walker":   [ Walker,   "",      ""          ] ,
    "Faller":   [ Faller,   "",      ""          ],  // Faller nao seta anim automatico
    "Floater":  [ Floater,  "open",  "float"     ],
    "Digger":   [ Digger,   "dig",   ""          ],
    "Exploder": [ Exploder, "boom",  "explosion" ],
    "Builder":  [ Builder,  "build", ""          ],
    "Dying":    [ Dying,    "",      ""          ],  // Usado no lemming.die()
}