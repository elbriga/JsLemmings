class Lemming extends Entity {
  constructor(game) {
    super(game, 40, 80);
    this.stateName = "";
    this.stateTimer = 0; // Timer auxiliar para os estados
    this.direction = 1;
    this.climbHeight = 5;
    this.stepCount = 20; // Quantos degraus tem na bolsa!
    this.falling = 0;
    this.hasUmbrella = false;
    this.remove = false;
    this.set_state("Faller"); // Faller nao seta a animation!
    this.set_animation("fall");
  }

  draw() {
    //screen.blit("lemming", this.rect);

    var frame = this.frames[this.frame % this.frames.length];
    if (this.direction == -1) {
      frame = frame.flip(true, false);
    }
    screen.blit(frame, this.rect);
    /*if ( this.hasUmbrella && this.stateName == "Walker") {
        pygame.draw.circle(screen, (255, 255, 0), self.pos, 5);
    }
    if (this.game.debug) {
        pygame.draw.circle(screen, (255, 0, 0), (this.rect.right, this.rect.bottom + 1), 5);
        pygame.draw.circle(screen, (255, 255, 0), (this.rect.left, this.rect.bottom + 1), 5);
        if (this.stateName == "Blocker") {
            blockArea = pygame.Rect(this.rect.x, this.rect.centery, 40, 44);
            pygame.draw.rect(screen, (255,0,0), blockArea, 1);
        }
    }*/
  }

  // update a lemming's position in the level
  update(isRecursion = false) {
    this.state.update(isRecursion);
  }

  // Repassar os eventos para o estado
  on_cycle_anim() {
    this.state.on_cycle_anim();
  }
  on_change_anim() {
    this.state.on_change_anim();
  }

  give_skill() {
    const game = this.game;
    const skill = game.selectedSkill;
    if (skill != "" && game.level.config.skills[skill] > 0) {
      game.level.config.skills[skill] -= 1;
      if (skill == "Umbrella") this.hasUmbrella = true;
      else this.set_state(skill);
    }
    game.build_skills_buttons();
  }

  is_near(pos, distance) {
    const myRect = new Rect(
      self.x - distance,
      self.y - distance,
      distance * 2,
      distance * 2,
    );
    const target = new Rect(
      pos[0] - distance,
      pos[1] - distance,
      distance * 2,
      distance * 2,
    );
    return myRect.colliderect(target);
  }

  is_on_floor() {
    return (
      this.game.level.is_solid(this.rect.left, this.rect.bottom + 1) ||
      this.game.level.is_solid(this.x, this.rect.bottom + 1) ||
      this.game.level.is_solid(this.rect.right, this.rect.bottom + 1)
    );
  }

  floor_height_in_front() {
    var height = 0;
    // Achar a altura do chao na frente do lemming, ate a altura que ele consegue subir
    while (height <= this.climbHeight) {
      // O pixel 'na frente' do lemming depende da direcao dele
      const positionInFront =
        this.direction == 1 ? this.rect.right : this.rect.left;
      if (
        !this.game.level.is_solid(positionInFront, this.rect.bottom - height)
      ) {
        break;
      }
      height += 1;
    }
    return height;
  }

  set_state(stateName) {
    const die = stateName == "Dying";
    const block = stateName == "Blocker" || this.stateName == "Blocker";

    this.state = new LemmingState.states[stateName](this);
    this.stateName = stateName;
    this.stateTimer = 0;

    if (this.state.anim != "") {
      this.set_animation(this.state.anim, this.state.animNext);
    }
    if (block) {
      // Atualizar mascara de block
      this.game.level.build_blocker_mask(this.game.lemmings);
    }
    if (die) {
      this.dead = true;
    }
  }

  die(anim, nextAnim = "") {
    this.set_state("Dying");
    this.set_animation(anim, nextAnim);
  }

  dig() {
    // Se abaixar!
    this.rect.y += 10;
    this.set_state("Digger");
  }

  build() {
    this.set_state("Builder");
  }

  burn() {
    this.die("burn");
  }

  explode() {
    this.set_state("Exploder");
  }
}
