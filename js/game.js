class Game {
  static async create(numLevel) {
    const game = new Game();
    await game._load(numLevel);
    return game;
  }

  constructor() {
    this.width = screen.bounds().width;
    this.height = screen.bounds().height;
    this.running = true;  // Controla o loop principal
    this.quitting = false;
    this.endScene = undefined;
    this.lemmings = [];
    this.entities = [];
    this.newLevel = undefined; // Controla o Spawn de um novo Level ou o mesmo (reset)
    this.points = 0;
    this.totLemmings = 0;
    this.selectedSkill = "Builder";
    this.minHeightToDie = 200;
    this.addTimer = 0;
    this.paused = false;
    this.showMask = false;
    this.hovered = undefined;
    this.debug = false;
    //this.scoreFont = pygame.font.SysFont(None, 40);
    //this.skillsFont = pygame.font.SysFont(None, 30);
  }

  async _load(numLevel) {
    const [level, assets, objects ] = await Promise.all([
      Level.create(numLevel),
      Assets.load(),
      this.load_objects()
    ]);

    this.level = level;
  }

  update() {
    this.hovered = this.get_lemming_near(Input.mouse.x, Input.mouse.y);

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
    var removed = false;
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
          lem.on_cycle_anim();
          if (lem.animNext != "") {
              lem.on_change_anim();
              lem.set_animation(lem.animNext);
          } else if (lem.dead) {
              // Remover os lemmings mortos no final da animacao
              lem.remove = true;
              removed = true;
          }
        }
      }
    }

    if (removed) {
      this.lemmings = this.lemmings.filter(l => !l.remove);
      // Verificar se terminou a fase
      if (this.lemmings.length == 0) {
          if (this.quitting) {
              this.running = false; // Quebra o loop principal
          } else {
              // Mostrar a tela de End Level
              const win = this.points >= this.level.config.numLemmingsToSave;
              this.endScene = Assets.loadImage(`images/end${win ? "Win" : "Lose"}.png`);
              this.paused = true;
          }
      }
    }
  }

  draw() {
    screen.fill(this.level.config.backgroundColour);

    // Desenhar o level
    if (!this.showMask) {
      //screen.blit('level', [0, 0]);
      screen.blit(this.level.terrain, [0, 0]);
    } else {
/* TODO
      mask_surface = this.level.terrainMask.to_surface(
          setcolor=(255, 255, 255, 255),
          unsetcolor=(0, 0, 0, 0)
      )
      this.screen.blit(mask_surface, (0, 0))
      mask_surface = this.level.blockerMask.to_surface(
          setcolor=(255, 0, 0, 255),
          unsetcolor=(0, 0, 0, 0)
      )
      this.screen.blit(mask_surface, (0, 0))
*/
    }

    // Desenhar os Objetos
    for (let o of this.entities) {
        o.draw();
    }

    // Desenhar os Lemmings
    for (let lem of this.lemmings) {
        lem.draw();
    }

    // Desenhar o selecionado
    if (this.hovered) {
      screen.draw.circle([ this.hovered.x, this.hovered.y - this.hovered.rect.height / 4 ], 25, [0, 255, 0, 255], 3);
    }
/* TODO
    # Desenhar o score
    text = this.scoreFont.render(f"Lemmings: {len(this.lemmings)} - Pontos: {this.points} / {this.level.config.numLemmingsToSave}", True, (255, 255, 255))
    this.screen.blit(text, (10, 10))
    # Desenhar as Skills
    i = 0
    for key, val in this.level.config.skills.items():
        if ( val <= 0:
            continue
        colour = (0, 255, 255) if ( key == this.selectedSkill else (255, 255, 255)
        text = this.skillsFont.render(f"{key}: {val}", True, colour)
        this.screen.blit(text, (400, 10 + i * 20))
        i += 1
    
    if ( this.endScene:
        w, h = this.endScene.get_size()
        x = this.width // 2 - w // 2
        y = this.height // 2 - h // 2
        this.screen.blit(this.endScene, (x, y))
        b = 5
        pygame.draw.rect(this.screen, (255,255,255,255), (x-b,y-b,w+b,h+b), 10, 10)
*/
  }

  get_lemming_near(mx, my, radius=80) {
    var best = undefined;
    var best_dist = radius * radius;
    for (const lem of this.lemmings) {
        const dx = lem.x - mx;
        const dy = lem.y - my;
        const dist = dx * dx + dy * dy;
        if (dist < best_dist) {
            best = lem;
            best_dist = dist;
        }
    }
    return best
  }

  load_objects() {

  }
}