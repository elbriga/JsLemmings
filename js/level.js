class Level {
  static async create(number) {
    const level = new Level();
    await level._load(number);
    return level;
  }
  
  async _load(number) {
    this.config = new LevelConfig();

    const [ terrain, mask ] = await Promise.all([
      Assets.loadSurface(`levels/level${number}.png`),
      Assets.loadSurface(`levels/level${number}-mask.png`),
      this.config._load(number),
    ]);

    this.terrain = terrain;
    this.terrainMask = mask; // TODO :: Classe Mask

    this.width = this.terrain.width;
    this.height = this.terrain.height;

    this.blockerMask  = new Surface(this.width, this.height);
    this.blockerShape = new Surface(40, 80, true);

    this.digWidth = 44;
    this.digHeight = 10;
    this.digShape = new Surface(this.digWidth, this.digHeight, true); // TODO : meio-circulo
    // criar máscara circular
    this.explosionRadius = 40;
    this.explosionShape = new Surface(this.explosionRadius*2, this.explosionRadius*2);
    this.explosionShape.draw.filled_circle([ this.explosionRadius, this.explosionRadius ], this.explosionRadius, [ 255, 255, 255 ]);
    // Degraus
    this.stepWidth = 16;
    this.stepHeight = 4;
    this.stepShape = new Surface(this.stepWidth, this.stepHeight + 2);
  }

  // Verifica se um pixel eh solido no mapa ou nos Blocker's
  is_solid(x, y) {
    if (x < 0 || x >= this.width || y < 0)
      return true;

    if (y >= this.height)
      return false; // Permitir cair para baixo

    const solid1 = this.terrainMask.getAt(x, y);
    return solid1[0];
    return solid1 || this.blockerMask.getAt(posInt);
  }

  // Reconstroi a mascara dos lemmings Blockers
  build_blocker_mask(lemmings) {
    // TODO!
    return;
    this.blockerMask.clear()
    for (const lem of lemmings) {
      if (lem.stateName == "Blocker" && !lem.dead) {
        this.blockerMask.draw(self.blockerShape, (lem.rect.x, lem.rect.centery));
      }
    }
  }

  // Corta um pedaco do terreno
  dig(x, y) {
    const digRect = new Rect(x, y, this.digWidth, this.digHeight);
    this.terrain.draw.filled_rect(digRect, this.config.backgroundColour);
    this.terrain.reloadImageData(); // Hack!!
    this.terrainMask.draw.filled_rect(digRect, [ 0,0,0 ]);
    this.terrainMask.reloadImageData(); // Hack!!
  }
  
  dig_hole(pos) {
      const x = Math.floor(pos[0]);
      const y = Math.floor(pos[1]);
      // apagar visualmente no terreno
      this.terrain.draw.filled_circle([ x, y ], this.explosionRadius, this.config.backgroundColour);
      this.terrain.reloadImageData(); // Hack!!
      // remover da máscara do terreno
      // TODO :: Classe Mask           this.terrainMask.erase(self.explosionShape, (x - self.explosionRadius, y - self.explosionRadius))
      this.terrainMask.draw.filled_circle([ x, y ], this.explosionRadius, [ 0,0,0 ]);
      this.terrainMask.reloadImageData(); // Hack!!
    }
    
  // Adicionar um degrau
  add_step(pos, direction) {
    let x = pos[0] + (4 * direction);
    let y = pos[1] - this.stepHeight;
    if (direction == -1) {
      x -= this.stepWidth;
    }
    // criar visualmente no terreno
    const stepRect = new Rect(x, y, this.stepWidth, this.stepHeight);
    this.terrain.draw.filled_rect(stepRect, this.config.stepColour);
    this.terrain.reloadImageData(); // Hack!!
    // criar na máscara do terreno
    stepRect.height += 2; // Para grudar no terreno! hack?
    this.terrainMask.draw.filled_rect(stepRect, [ 255,255,255 ]);
    this.terrainMask.reloadImageData(); // Hack!!
  }
}

class LevelConfig {
  constructor() {
    // Defaults
    this.number = 0;
    this.skills = {
        "Blocker":  10,
        "Exploder": 10,
        "Digger":   10,
        "Builder":  10,
        "Umbrella": 10,
    };
    this.objects = [];
    this.numLemmings = 10;
    this.numLemmingsToSave = 8;
    this.startPosition = [ 100, 100 ];
    this.endPosition = [ 580, 710 ];
    this.backgroundColour = [ 114, 114, 201, 255 ];
    this.releaseRate = 10;
    this.timeLimit = 300;
    this.stepColour = [ 99, 0, 19, 255 ];
  }

  async _load(number) {
    this.number = number;
    // TODO
  }
}