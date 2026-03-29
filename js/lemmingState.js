class LemmingState {
  static states = {};

  constructor(lemming, ico, icoFrame = 0) {
    this.lem = lemming;
    this.ico = ico;
    this.icoFrame = icoFrame;

    this.anim = "";
    this.animNext = "";
  }

  update(isRecursion = false) {}
  on_cycle_anim() {}
  on_change_anim() {}
}

class Blocker extends LemmingState {
  constructor(lemming) {
    super(lemming, "stop");
    this.anim = "stop";
  }
}

class Walker extends LemmingState {
  constructor(lemming) {
    super(lemming, "walk");
    // Walker nao seta anim automatico
  }

  update(isRecursion = false) {
    const lem = this.lem;

    if (lem.falling > lem.game.minHeightToDie) {
      lem.die("splat");
      return;
    }
    lem.falling = 0;

    if (!lem.is_on_floor()) {
      lem.set_state("Faller");
      if (!isRecursion) lem.update(true);
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
    if (lem.stateTimer == 10) lem.set_animation("walk");
  }
}

class Faller extends LemmingState {
  constructor(lemming) {
    super(lemming, "fall");
    // Faller nao seta anim automatico
  }

  update(isRecursion = false) {
    const lem = this.lem;
    if (lem.is_on_floor()) {
      lem.set_state("Walker");
      if (!isRecursion) lem.update(true);
      return;
    }

    var delta;
    if (lem.falling > 100) delta = 4;
    else if (lem.falling > 50) delta = 3;
    else delta = 2;
    lem.rect.y += delta;
    lem.falling += delta;

    if (lem.falling > 100) {
      if (lem.hasUmbrella) lem.set_state("Floater");
    } else if (lem.falling > 20 && lem.falling < 26) lem.set_animation("fall");
  }
}

class Floater extends LemmingState {
  constructor(lemming) {
    super(lemming, "float");
    this.anim = "open";
    this.animNext = "float";
  }

  update(isRecursion = false) {
    const lem = this.lem;
    if (lem.is_on_floor()) {
      lem.set_state("Walker");
      return;
    }
    lem.rect.y += 1;
  }
}

class Digger extends LemmingState {
  constructor(lemming) {
    super(lemming, "dig");
    this.anim = "dig";
  }

  update(isRecursion = false) {
    const lem = this.lem;
    lem.stateTimer += 1;
    if (lem.stateTimer > 20) {
      lem.stateTimer = 0;
      // Dig
      lem.game.level.dig(lem.rect.x - 2, lem.rect.bottom - 10);
      lem.rect.y += 3;
      if (!lem.is_on_floor()) {
        lem.game.level.dig(lem.rect.x - 2, lem.rect.bottom - 10);
        lem.set_state("Faller");
      }
    }
  }
}

class Exploder extends LemmingState {
  constructor(lemming) {
    super(lemming, "boom", 6);
    this.anim = "boom";
    this.animNext = "explosion";
  }

  update(isRecursion = false) {
    const lem = this.lem;
    if (!lem.is_on_floor()) {
      lem.rect.y += 1;
    }
  }

  on_change_anim() {
    const lem = this.lem;
    lem.dead = true;
    lem.game.level.dig_hole(lem.pos);
    lem.rect.x -= 12; // HACK feio! Explosao é maior
  }
}

class Builder extends LemmingState {
  constructor(lemming) {
    super(lemming, "build");
    this.anim = "build";
  }

  on_cycle_anim() {
    const lem = this.lem;
    if (lem.stateTimer >= lem.stepCount) {
      lem.set_state("Walker");
      return;
    } else if (lem.stateTimer >= lem.stepCount - 1) {
      lem.set_animation("done");
    }
    // Novo degrau
    lem.game.level.add_step(lem.pos, lem.direction);
    lem.rect.x += 4 * lem.direction;
    lem.rect.y -= 4;
    lem.stateTimer += 1; // Contar os degraus
  }
}

class Dying extends LemmingState {}

LemmingState.states = {
  Blocker,
  Walker,
  Faller,
  Floater,
  Digger,
  Exploder,
  Builder,
  Dying,
};
