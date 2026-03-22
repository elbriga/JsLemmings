class Entity {
  constructor(game, width, height) {
    this.game = game;
    var x = game.level.config.startPosition[0];
    var y = game.level.config.startPosition[1];
    this.rect = new Rect(x, y - height, width, height)
    this.frames = []
    this.frame = 0
    this.animTimer = 0
    this.animNext = ""
    this.dead = false
  }

  get x() {
    return this.rect.centerx;
  }
    
  get y() {
    return this.rect.bottom;
  }

  get pos() {
    return [ this.x, this.y ];
  }

  update() {
    return;
  }

  draw() {
    return;
  }

  set_animation(name, next="") {
    this.frames = Assets.animations[`lemming_${name}`]
    this.animNext = next
    this.frame = 0
  }

  // Invocado quando a animacao reseta
  on_cycle_anim() {
    return;
  }
  
  // Invocado quando a animacao muda no mesmo estado (com animNext)
  on_change_anim() {
    return;
  }
}