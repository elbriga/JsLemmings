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
/*
    // if there's no ground below a lemming (check both corners), it is falling
    let bottomleft = this.lem.game.level.is_solid(this.lem.x - (this.lem.rect.width / 2), this.lem.y + 1),
        bottomright = this.lem.game.level.is_solid(this.lem.x + (this.lem.rect.width / 2), this.lem.y + 1),
        height = 0,
        found = false,
        positioninfront;
    if ((!bottomleft) && (!bottomright)) {
      this.lem.rect.y += 1;
    }
    // if not falling, a lemming is walking
    else {
      // find the height of the ground in front of a lemming
      // up to the maximum height a lemming can climb
      while ((!found) && (height <= this.lem.climbHeight)) {
        // the pixel 'in front' of a lemming will depend on
        // the direction it's traveling
        if (this.lem.direction === 1) {
          positioninfront = this.lem.x + (this.lem.rect.width / 2);
        }
        else {
          positioninfront = this.lem.x - (this.lem.rect.width / 2);
        }
        if (!this.lem.game.level.is_solid(positioninfront, this.lem.y - height)) {
          this.lem.rect.x += this.lem.direction;
          // rise up to new ground level
          this.lem.rect.y -= height;
          found = true;
        }

        height += 1;
      }
      // turn the lemming around if the ground in front
      // is too high to climb
      if (!found) {
        this.lem.direction *= -1;
      }
    }
*/
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