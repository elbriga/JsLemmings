class Level {
  static async create(number) {
    const level = new Level();
    await level._load(number);
    return level;
  }

  async _load(number) {
    this.config = new LevelConfig();

    const [terrain, background] = await Promise.all([
      Assets.loadSurface(`levels/level${number}.png`),
      Assets.loadSurface(`levels/level${number}-bg.png`),
      this.config._load(number),
    ]);

    this.terrain = terrain;
    this.background = background;

    this.width = this.terrain.width;
    this.height = this.terrain.height;

    this.blockerMask = new Surface(this.width, this.height); // TODO :: Classe Mask
    //this.blockerShape = new Surface(40, 80, true);

    this.digWidth = 44;
    this.digHeight = 10;
    //this.digShape = new Surface(this.digWidth, this.digHeight, true); // TODO : meio-circulo
    // criar máscara circular
    this.explosionRadius = 40;
    //this.explosionShape = new Surface(this.explosionRadius*2, this.explosionRadius*2);
    //this.explosionShape.draw.filled_circle([ this.explosionRadius, this.explosionRadius ], this.explosionRadius, [ 255, 255, 255 ]);
    // Degraus
    this.stepWidth = 16;
    this.stepHeight = 4;
    //this.stepShape = new Surface(this.stepWidth, this.stepHeight + 2);
  }

  draw(screen, showMask = false) {
    // Desenhar o level
    screen.blit(this.background, [0, 0]);
    if (!showMask) {
      screen.blit(this.terrain, [0, 0]);
    } else {
      screen.blit(this.terrain.toMask(), [0, 0]);
      screen.blit(this.blockerMask, [0, 0]);
    }
  }

  // Verifica se um pixel eh solido no mapa ou nos Blocker's
  is_solid(x, y) {
    if (x < 0 || x >= this.width || y < 0) return true; // Bater nos cantos

    if (y >= this.height) return false; // Permitir cair para baixo

    let ground = this.terrain.getAt(x, y);
    if (ground[3])
      // Testar o Alpha da cor do terreno
      return true;

    let block = this.blockerMask.getAt(x, y);
    if (block[0] || block[1] || block[2])
      // testar pela cor preta
      return true;

    return false;
  }

  // Reconstroi a mascara dos lemmings Blockers
  build_blocker_mask(lemmings) {
    this.blockerMask.clear();
    for (const lem of lemmings) {
      if (lem.stateName == "Blocker" && !lem.dead) {
        // this.blockerMask.draw(self.blockerShape, (lem.rect.x, lem.rect.centery));
        const blockRect = new Rect(lem.rect.x, lem.rect.centery, 40, 80);
        this.blockerMask.draw.filled_rect(blockRect, [255, 255, 255, 255]);
      }
    }
    this.blockerMask.reloadImageData(); // Hack!!
  }

  // Corta um pedaco do terreno
  dig(x, y) {
    const digRect = new Rect(x, y, this.digWidth, this.digHeight);
    this.terrain.draw.filled_rect(digRect, "erase");
    this.terrain.reloadImageData(); // Hack!!
  }

  dig_hole(pos) {
    this.terrain.draw.filled_circle(pos, this.explosionRadius, "erase");
    this.terrain.reloadImageData(); // Hack!!
  }

  // Adicionar um degrau
  add_step(pos, direction) {
    let x = pos[0] + 4 * direction;
    let y = pos[1] - this.stepHeight;
    if (direction == -1) {
      x -= this.stepWidth;
    }
    // criar visualmente no terreno
    const stepRect = new Rect(x, y, this.stepWidth, this.stepHeight + 2); // Hack Feio
    this.terrain.draw.filled_rect(stepRect, this.config.stepColour);
    this.terrain.reloadImageData(); // Hack!!
  }
}

class LevelConfig {
  constructor() {
    // Defaults
    this.number = 0;
    this.skills = {
      Blocker: 10,
      Exploder: 10,
      Digger: 10,
      Builder: 10,
      Umbrella: 10,
    };
    this.objects = [];
    this.numLemmings = 10;
    this.numLemmingsToSave = 8;
    this.startPosition = [100, 100];
    this.endPosition = [580, 710];
    this.backgroundColour = [114, 114, 201, 255];
    this.releaseRate = 10;
    this.timeLimit = 300;
    this.stepColour = [99, 0, 19, 255];
  }

  async _load(number) {
    this.number = number;
    // TODO
  }
}
