class Game {
  constructor(numLevel) {
    this.width = screen.bounds().width;
    this.height = screen.bounds().height;
    this.running = true;  // Controla o loop principal
    this.quitting = false;
    this.endScene = undefined;
    this.lemmings = [];
    this.entities = [];
    this.level = new Level(numLevel);
    this.newLevel = undefined; // Controla o Spawn de um novo Level ou o mesmo (reset)
    this.points = 0;
    this.totLemmings = 0;
    this.selectedSkill = "";
    this.minHeightToDie = 200;
    this.addTimer = 0;
    this.paused = false;
    this.showMask = false;
    this.hovered = undefined;
    this.debug = false;
    //this.scoreFont = pygame.font.SysFont(None, 40);
    //this.skillsFont = pygame.font.SysFont(None, 30);
    Assets.load();
    this.load_objects();
  }

  update() {
    const MAX_LEMMINGS = 10;
    const INTERVAL = 10;

    // increment the timer and create a new
    // lemming if the interval has passed
    this.addTimer += 0.1;
    if ((this.addTimer > INTERVAL) && (this.lemmings.length < MAX_LEMMINGS)) {
      this.addTimer = 0;
      this.lemmings.push(new Lemming(this));
      console.log("NEW LEMMING");
    }

    // update each lemming's position in the level
    for (let i of this.lemmings) {
      i.update();
    }
  }

  draw() {
    const LEVEL_IMAGE = 'level';

    screen.clear();
    // draw the level
    screen.blit(LEVEL_IMAGE, [0, 0]);

    // draw lemmings
    for (let i of this.lemmings) {
      i.draw();
    }
  }

  load_objects() {

  }
}