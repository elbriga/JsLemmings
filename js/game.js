class Game {
  static async create(numLevel) {
    const game = new Game();
    await game._load(numLevel);
    return game;
  }

  constructor() {
    this.width = screen.bounds().width;
    this.height = screen.bounds().height;
    //this.running = true; // Controla o loop principal
    this.quitting = false;
    this.endScene = undefined;
    this.lemmings = [];
    this.entities = [];
    this.skillsButtons = [];
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
    this.scoreFont = "20px Arial";
    this.skillsFont = "30px Arial";
  }

  async _load(numLevel) {
    const [level, assets, objects] = await Promise.all([
      Level.create(numLevel),
      Assets.load(),
    ]);

    this.level = level;
    this.load_objects();
    this.build_skills_buttons();
  }

  quit() {
    if (this.lemmings.length == 0) {
      this.running = false;
    } else {
      this.armaggedon(true);
    }
  }

  armaggedon(quit = False) {
    if (quit) this.quitting = true;
    for (const l of this.lemmings) if (!l.dead) l.set_state("Exploder");
  }

  new() {
    this.newLevel = this.level.config.number;
    if (this.points >= this.level.config.numLemmingsToSave) {
      // Win!
      this.newLevel += 1;
    }
  }

  update() {
    this.hovered = this.get_lemming_near(Input.mouse.x, Input.mouse.y);

    if (this.paused) return;

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
        // Checar pela saida
        if (lem.is_near(this.level.config.endPosition, 6)) {
          this.points += 1;
          lem.die("gone");
        } else if (lem.rect.y > this.height) {
          // Checar se caiu para fora da tela
          lem.die("null");
        }
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
      this.lemmings = this.lemmings.filter((l) => !l.remove);
      // Verificar se terminou a fase
      if (this.lemmings.length == 0) {
        // if (this.quitting) {
        //     this.running = false; // Quebra o loop principal
        // } else {
        // Mostrar a tela de End Level
        const win = this.points >= this.level.config.numLemmingsToSave;
        Assets.loadImage(`images/end${win ? "Win" : "Lose"}.png`).then(
          (img) => {
            this.endScene = img;
          },
        );
        this.paused = true;
        // }
      }
    }
  }

  draw() {
    this.level.draw(screen, this.showMask);

    // Desenhar os Objetos
    for (let o of this.entities) {
      o.draw(screen);
    }

    // Desenhar os Lemmings
    for (let lem of this.lemmings) {
      lem.draw();
    }

    // Desenhar o selecionado
    if (this.hovered) {
      screen.draw.circle(
        [this.hovered.x, this.hovered.y - this.hovered.rect.height / 4],
        25,
        [0, 255, 0, 255],
        3,
      );
    }
    // Desenhar o score
    let aliveCount = this.lemmings.filter((lem) => !lem.dead).length;
    let scoreText = `Lemmings: ${aliveCount} - Pontos: ${this.points} / ${this.level.config.numLemmingsToSave}`;
    //screen.draw.text(10, 10, scoreText, this.scoreFont, "black");
    screen.draw.text(scoreText, { pos: [10, 10], color: "black" });

    // Desenhar as Skills
    for (const btn of this.skillsButtons) {
      btn.draw(screen);
    }

    if (this.endScene) {
      let w = this.endScene.width;
      let h = this.endScene.height;
      let x = this.width / 2 - w / 2;
      let y = this.height / 2 - h / 2;
      screen.blit(this.endScene, [x, y]);
      //let b = 5;
      //screen.draw.rect((255,255,255,255), (x-b,y-b,w+b,h+b), 10, 10);
    }
  }

  build_skills_buttons() {
    let i = 0;
    this.skillsButtons = [];
    for (let skillName in this.level.config.skills) {
      let val = this.level.config.skills[skillName];
      if (val <= 0) continue;

      let construct =
        LemmingState.states[skillName == "Umbrella" ? "Floater" : skillName];
      let skill = new construct(null);

      let ico = Assets.animations[`lemming_${skill.ico}`][skill.icoFrame];
      let color = skillName == this.selectedSkill ? [255, 0, 255] : [0, 0, 0];

      let btn = new Button(skillName, ico, val, 400 + i * 70, 10, color);
      i += 1;

      this.skillsButtons.push(btn);
    }
  }

  get_lemming_near(mx, my, radius = 80) {
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
    return best;
  }

  toggle_paused() {
    this.paused = !this.paused;
  }

  toggle_debug() {
    this.debug = !this.debug;
  }

  toggle_show_mask() {
    this.showMask = !this.showMask;
  }

  select_skill(skillName) {
    if (skillName in this.level.config.skills) {
      this.selectedSkill = skillName;
      // Atualizar o selecionado
      this.build_skills_buttons();
    }
  }

  load_objects() {
    for (const objDef of this.level.config.objects) {
      // Verificar se existe nos Assets
      const type = "object_" + objDef["type"];
      if (type in Assets.animations) {
        this.entities.push(new Obj(this, objDef));
      }
    }
  }
}
