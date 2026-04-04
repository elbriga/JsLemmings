// TODO : Unir Entity e Obj
class Obj {
  static classes = {};

  constructor(game, objDef) {
    this.name = objDef["type"];
    let x = objDef["x"];
    let y = objDef["y"];

    this.game = game;
    this.remove = false;
    this.frames = Assets.animations[`object_${this.name}`];
    let width = this.frames[0].width;
    let height = this.frames[0].height;
    this.rect = new Rect(x - width / 2, y - height, width, height);
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

  activate(game, lem) {
    return false;
  }

  draw(screen) {
    this.animTimer += 1;
    if (this.animTimer > 3) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % this.frames.length;
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
