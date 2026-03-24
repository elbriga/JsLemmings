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
    //mx, my = pygame.mouse.get_pos();
    //this.hovered = this.get_lemming_near(mx, my);

    if (this.paused)
      return;

    if (this.totLemmings < this.level.config.numLemmings && !this.quitting) {
      this.addTimer += 0.1;
      // Add lemming se o intervalo passou
      if (this.addTimer > this.level.config.releaseRate) {
        this.addTimer = 0;
        this.totLemmings += 1;
        this.lemmings.push(new Lemming(this));
        console.log("NEW LEMMING");
      }
    }

    // Atualizar os Lemmings
    for (let lem of this.lemmings) {
      if (!lem.dead) {
        lem.update();
/* TODO
        // Checar pela saida
        if lem.is_near(this.level.config.endPosition, 6):
            this.points += 1;
            lem.die("gone");
        // Checar se caiu para fora da tela
        elif lem.rect.y > this.height:
            lem.die("null");
*/
      }

      // Animacao
      lem.animTimer += 1;
      if (lem.animTimer > 3) {
        lem.animTimer = 0;
        lem.frame = (lem.frame + 1) % lem.frames.length;
        if (lem.frame == 0) {
/*
          lem.on_cycle_anim()
          if lem.animNext != "":
              lem.on_change_anim()
              lem.set_animation(lem.animNext)
          elif lem.dead:
              # Remover os lemmings mortos no final da animacao
              this.lemmings.remove(lem)
              # Verificar se terminou a fase
              if len(this.lemmings) == 0:
                  if this.quitting:
                      this.running = False # Quebra o loop principal
                  else:
                      # Mostrar a tela de End Level
                      win = this.points >= this.level.config.numLemmingsToSave
                      this.endScene = pygame.image.load(f'images/end{"Win" if win else "Lose"}.png').convert()
                      this.paused = True
*/
        }
      }
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