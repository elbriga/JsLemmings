// TODO : Unir Entity e Obj
class Obj {
  static classes = {};

  constructor(game, name, x, y) {
    // TODO name == class_name
    this.game = game;
    this.name = name;

    this.frames = Assets.animations[`object_${this.name}`];
    let width = this.frames[0].width;
    let height = this.frames[0].height;
    this.rect = new Rect(x - width / 2, y - height, width, height);

    this.remove = false;
    this.frame = 0;
    this.animTimer = 0;
    //this.collideRect = TODO;
    this.collide = 6;
  }

  get x() {
    return this.rect.centerx;
  }

  get y() {
    return this.rect.bottom;
  }

  get pos() {
    return [this.x, this.y];
  }

  update() {}

  activate(lem) {}

  on_cycle_anim() {}

  draw(screen) {
    this.animTimer += 1;
    if (this.animTimer > 3) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % this.frames.length;
      if (!this.frame) {
        this.on_cycle_anim();
        if (this.remove) {
          return;
        }
      }
    }
    let frame = this.frames[this.frame % this.frames.length];
    screen.blit(frame, this.rect);
    if (this.game.debug) {
      var triggerArea = new Rect(
        this.x - this.collide,
        this.y - this.collide,
        this.collide * 2,
        this.collide * 2,
      );
      screen.draw.rect(triggerArea, "red");
    }
  }
}
