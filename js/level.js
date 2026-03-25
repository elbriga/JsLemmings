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
    this.terrainMask = mask;

    this.width = this.terrain.width;
    this.height = this.terrain.height;
    //terrainMaskImage = pygame.image.load(f'levels/level{number}-mask.png').convert()
    //terrainMaskImage.set_colorkey((0, 0, 0, 255))
    //this.terrainMask = pygame.mask.from_surface(terrainMaskImage)

    //this.blockerMask = pygame.mask.Mask((this.width, this.height), False)
    //this.blockerShape = pygame.mask.Mask((40, 80), True)

    this.digWidth = 44;
    this.digHeight = 10;
    //this.digShape = pygame.mask.Mask((this.digWidth, this.digHeight), True) # TODO : meio-circulo
    // criar máscara circular
    this.explosionRadius = 40;
    //surf = pygame.Surface((this.explosionRadius*2, this.explosionRadius*2), pygame.SRCALPHA)
    //pygame.draw.circle(surf, (255, 255, 255), (this.explosionRadius, this.explosionRadius), this.explosionRadius)
    //this.explosionShape = pygame.mask.from_surface(surf)
    // Degraus
    this.stepWidth = 16;
    this.stepHeight = 4;
    //this.stepShape = pygame.mask.Mask((this.stepWidth, this.stepHeight + 2), True)
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
}

class LevelConfig {
  constructor() {
    // Defaults
    this.number = 0;
    this.skills = {
        "Blocker":  0,
        "Exploder": 0,
        "Digger":   0,
        "Builder":  0,
        "Umbrella": 0,
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