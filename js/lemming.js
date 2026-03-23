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
    this.set_state("Faller");  // Faller nao seta a animation!
    this.set_animation("fall");
  }

  draw() {
    //screen.blit("lemming", this.rect);
    
    var frame = this.frames[this.frame % this.frames.length]
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
  update() {
    // if there's no ground below a lemming (check both corners), it is falling
    let bottomleft = groundatposition([this.x - (this.rect.width / 2), this.y + 1]),
        bottomright = groundatposition([this.x + (this.rect.width / 2), this.y + 1]),
        height = 0,
        found = false,
        positioninfront;
    if ((!bottomleft) && (!bottomright)) {
      this.rect.y += 1;
    }
    // if not falling, a lemming is walking
    else {
      // find the height of the ground in front of a lemming
      // up to the maximum height a lemming can climb
      while ((!found) && (height <= this.climbHeight)) {
        // the pixel 'in front' of a lemming will depend on
        // the direction it's traveling
        if (this.direction === 1) {
          positioninfront = [this.x + (this.rect.width / 2), this.y - height];
        }
        else {
          positioninfront = [this.x - (this.rect.width / 2), this.y - height];
        }
        if (!groundatposition(positioninfront)) {
          this.rect.x += this.direction;
          // rise up to new ground level
          this.rect.y -= height;
          found = true;
        }

        height += 1;
      }
      // turn the lemming around if the ground in front
      // is too high to climb
      if (!found) {
        this.direction *= -1;
      }
    }
  }

  set_state(state) {

  }
}