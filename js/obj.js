// TODO : Unir Entity e Obj
class Obj {
  constructor(game, objDef) {
    let name = objDef["type"];
    let x = objDef["x"];
    let y = objDef["y"];

    this.game = game;
    this.frames = Assets.animations[`object_${name}`];
    let width = this.frames[0].width;
    let height = this.frames[0].height;
    this.rect = new Rect(x - width / 2, y - height, width, height);
    this.frame = 0;
    this.animTimer = 0;
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

  draw(screen) {
    this.animTimer += 1;
    if (this.animTimer > 3) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % this.frames.length;
    }
    let frame = this.frames[this.frame % this.frames.length];
    screen.blit(frame, this.rect);
    if (this.game.debug) {
      var triggerArea = new Rect(this.x - 6, this.y - 6, 12, 12);
      screen.draw.rect(triggerArea, "red");
    }
  }
}
