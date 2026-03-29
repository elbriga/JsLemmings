function debugSprite(sprite, label = "") {
  const container = document.createElement("div");

  const canvas = sprite.canvas || document.createElement("canvas");

  if (!sprite.canvas) {
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    canvas.getContext("2d").drawImage(sprite, 0, 0);
  }

  const text = document.createElement("div");
  text.innerText = label;
  text.style.color = "white";
  text.style.fontSize = "10px";

  canvas.style.border = "1px solid red";
  canvas.style.imageRendering = "pixelated";

  container.appendChild(canvas);
  container.appendChild(text);

  document.getElementById("debug").appendChild(container);
}

class Assets {
  static animations = {};
  static final_width = 10; // x4
  static final_height = 20; // x4

  static async loadImage(url) {
    const img = new Image();
    img.src = url;

    await img.decode(); // ou usar onload
    return img;
  }

  static async loadSurface(url) {
    const img = await Assets.loadImage(url);

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);

    return new Surface(imageData);
  }

  static slice_sprites(sheet, total, xi, yi, step, width, height) {
    var sprites = [];
    for (var i = 0; i < total; i++) {
      var x = xi + i * step;
      var sprite = new Sprite(Assets.final_width, Assets.final_height);
      sprite.blit(
        sheet,
        [0, Assets.final_height - height],
        [x, yi, width, height],
      );
      sprite.set_colorkey(0, 0, 0);
      sprite = sprite.scale2x();
      sprite = sprite.scale2x();
      sprites.push(sprite);
    }
    return sprites;
  }

  static async load() {
    const [exit, tnt] = await Promise.all([
      Assets.loadImage("images/portal.png"),
      Assets.loadImage("images/tnt.png"),
      // https://www.spriters-resource.com/amiga_amiga_cd32/lemmings/asset/37732/
      this.loadSheet("images/lemming_sheet.png", (sheet) => {
        Assets.animations["lemming_null"] = Assets.slice_sprites(
          sheet,
          1,
          0,
          0,
          16,
          10,
          10,
        );
        Assets.animations["lemming_walk"] = Assets.slice_sprites(
          sheet,
          8,
          18,
          0,
          16,
          10,
          10,
        );
        Assets.animations["lemming_fall"] = Assets.slice_sprites(
          sheet,
          4,
          14,
          20,
          16,
          10,
          10,
        );
        Assets.animations["lemming_open"] = Assets.slice_sprites(
          sheet,
          4,
          19,
          96,
          16,
          10,
          16,
        );
        Assets.animations["lemming_float"] = Assets.slice_sprites(
          sheet,
          4,
          83,
          96,
          16,
          10,
          16,
        );
        Assets.animations["lemming_splat"] = Assets.slice_sprites(
          sheet,
          16,
          19,
          138,
          16,
          10,
          10,
        );
        Assets.animations["lemming_stop"] = Assets.slice_sprites(
          sheet,
          16,
          20,
          148,
          16,
          10,
          10,
        );
        Assets.animations["lemming_burn"] = Assets.slice_sprites(
          sheet,
          16,
          19,
          169,
          16,
          10,
          12,
        );
        Assets.animations["lemming_dig"] = Assets.slice_sprites(
          sheet,
          16,
          20,
          247,
          16,
          10,
          14,
        );
        Assets.animations["lemming_build"] = Assets.slice_sprites(
          sheet,
          16,
          19,
          195,
          16,
          10,
          13,
        );
        Assets.animations["lemming_done"] = Assets.slice_sprites(
          sheet,
          8,
          20,
          224,
          16,
          10,
          10,
        );
        Assets.animations["lemming_boom"] = Assets.slice_sprites(
          sheet,
          16,
          19,
          128,
          16,
          10,
          10,
        );
        Assets.animations["lemming_gone"] = Assets.slice_sprites(
          sheet,
          8,
          18,
          182,
          16,
          10,
          14,
        );
      }),

      // https://opengameart.org/content/explosion
      this.loadSheet("images/explosion.png", (sheet) => {
        Assets.animations["lemming_explosion"] = [];
        var explosionSize = 64;
        for (var y = 0; y < 4 * explosionSize; y += explosionSize) {
          for (var x = 0; x < 4 * explosionSize; x += explosionSize) {
            var sprite = new Sprite(explosionSize, 100);
            sprite.blit(
              sheet,
              [0, 100 - explosionSize],
              [x, y, explosionSize, explosionSize],
            );
            sprite.set_colorkey(0, 0, 0);
            Assets.animations["lemming_explosion"].push(sprite);
          }
        }
      }),
    ]);

    // Objects
    Assets.animations["object_exit"] = [exit];
    Assets.animations["object_tnt"] = [tnt];

    /* TODO
    //sheet = pygame.image.load("images/tocha.png").convert_alpha();
    //Assets.animations["object_tocha"]  = cls.slice_sprites(sheet, 4, 0, 0, 38, 38, 68);
*/
    console.log("Sprites carregados ✔");
  }

  static async loadSheet(filename, process) {
    var sheet = await Assets.loadImage(filename);

    if (sheet.complete) {
      process(sheet);
    } else {
      sheet.onload = () => process(sheet);
    }
  }
}
