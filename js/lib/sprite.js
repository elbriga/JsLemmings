class Sprite {
  constructor(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width  = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.draw = Draw.create(this.ctx, this.width, this.height);
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }

  // img = <img>
  // pos = [ x, y ]
  // rect = [ x, y, width, height ]
  blit(img, pos, rect = null) {
    var source = img.canvas || img;
    if (rect) {
      this.ctx.drawImage(
        source,
        rect[0], rect[1], rect[2], rect[3], // origem (recorte)
        pos[0], pos[1], rect[2], rect[3]    // destino
      );
    } else {
      this.ctx.drawImage(source, pos[0], pos[1]);
    }
  }

  set_colorkey(r, g, b) {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (
        data[i] === r &&
        data[i + 1] === g &&
        data[i + 2] === b
      ) {
        data[i + 3] = 0; // transparente
      }
    }

    // atualiza o canvas
    this.ctx.putImageData(imageData, 0, 0);
  }

  scale2x() {
    const newSprite = new Sprite(this.width * 2, this.height * 2);

    newSprite.ctx.imageSmoothingEnabled = false;
    newSprite.ctx.drawImage(
      this.canvas,
      0, 0,
      newSprite.width,
      newSprite.height
    );

    return newSprite;
  }

  flip(horizontal = false, vertical = false) {
    const newSprite = new Sprite(this.width, this.height);

    newSprite.ctx.imageSmoothingEnabled = false;
    newSprite.ctx.save();

    // Move origem antes de inverter
    newSprite.ctx.translate(
      horizontal ? this.width : 0,
      vertical ? this.height : 0
    );

    // Inverte eixo
    newSprite.ctx.scale(
      horizontal ? -1 : 1,
      vertical ? -1 : 1
    );

    newSprite.ctx.drawImage(this.canvas, 0, 0);
    newSprite.ctx.restore();

    return newSprite;
  }
}