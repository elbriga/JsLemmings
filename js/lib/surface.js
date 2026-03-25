/*
 * Wrapper around an ImageData object
 * to support scripts that rely on pixel manipulation.
 *
 * There is no pixel array or screen buffer to which you can write in
 * JavaScript.
 * The closest thing is drawing to and then getting the pixels for a portion of
 * the screen.
 * This class is a compromise to enable pixel manipulation through this
 * mechanism.
 * As a result, it has a very limited set of methods.
 * If possible, you should think of more standard ways to achieve the same
 * result.
 */
class Surface {
  /*
   * Return a padded copy of the Array color to 4 elements.
   */
  static _padColorArray(color) {
    let result = color.slice(0, 4);
    while (result.length < 3) {
      result.push(0);
    }
    while (result.length < 4) {
      result.push(255);
    }
    return result;
  }

  /*
   * Return true if the numbers in the Arrays first and second are equal.
   */
  static isColorEqual(first, second) {
    if (Array.isArray(first) && Array.isArray(second)) {
      if (first.length <= 0) {
        return false;
      }
      if (second.length <= 0) {
        return false;
      }

      let a = Surface._padColorArray(first),
          b = Surface._padColorArray(second);

      for (let i = 0; i < 4; i++) {
        if (typeof a[i] !== 'number') {
          return false;
        }
        if (typeof b[i] !== 'number') {
          return false;
        }
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  constructor() {
    var init = false;
    if (arguments.length == 1) {
      var imageData = arguments[0];
      if (!(imageData instanceof ImageData)) {
        throw new TypeError('imageData must be an ImageData.');
      }
      this.imageData = imageData;
      init = true;
    } else if (arguments.length == 2) {
      this.imageData = new ImageData(arguments[0], arguments[1]);
    } else {
      throw new TypeError('invalid Surface constructor');
    }
    
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    if (init) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(this.imageData, 0, 0);
    }
  }

  get width() {
    return this.imageData.width;
  }
  get height() {
    return this.imageData.height;
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
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
  }

  /*
   * Return the starting index of the pixel data for coordinates (x, y).
   */
  _coordinatesToIndex(x, y) {
    return (x + (y * this.width)) * 4;
  }

  /*
   * Return an Array containing the RGBA components of the color at coordinates (x, y).
   */
  getAt(x = 0, y = 0) {
    if (typeof x !== 'number') {
      throw new TypeError('x must be a number.');
    }
    if (typeof y !== 'number') {
      throw new TypeError('y must be a number.');
    }

    if (x < 0) {
      return [0, 0, 0, 0];
    }
    if (y < 0) {
      return [0, 0, 0, 0];
    }
    if (this.width <= x) {
      return [0, 0, 0, 0];
    }
    if (this.height <= y) {
      return [0, 0, 0, 0];
    }

    let start = this._coordinatesToIndex(x, y),
        color = [];
    for (let i = 0; i < 4; i++) {
      color.push(this.imageData.data[start+i]);
    }
    return color;
  }

  /*
   * Set the color at coordinates (x, y) to the RGBA components in the Array color.
   */
  setAt(x, y, color) {
    if (typeof x !== 'number') {
      throw new TypeError('x must be a number.');
    }
    if (typeof y !== 'number') {
      throw new TypeError('y must be a number.');
    }
    if (!Array.isArray(color)) {
      throw new TypeError('color must be an Array of 3 or 4 integers.');
    }

    if (x < 0) {
      return;
    }
    if (y < 0) {
      return;
    }
    if (this.width <= x) {
      return;
    }
    if (this.height <= y) {
      return;
    }

    let start = this._coordinatesToIndex(x, y),
        newColor = Surface._padColorArray(color),
        c;
    for (let i = 0; i < 4; i++) {
      c = newColor[i];
      if (typeof c !== 'number') {
        throw new TypeError('color must be an Array of 3 or 4 integers.');
      }
      // ImageData clamps the value if c is not in [0, 255]
      this.imageData.data[start+i] = c;
    }
    this.ctx.putImageData(this.imageData, 0, 0, x, y, 1, 1);
  }

  scale2x() {
    const newSurface = new Surface(this.width * 2, this.height * 2);

    newSurface.ctx.imageSmoothingEnabled = false;

    newSurface.ctx.drawImage(
      this.canvas,
      0, 0,
      newSurface.width,
      newSurface.height
    );

    newSurface.imageData = newSurface.ctx.getImageData(0, 0, newSurface.width, newSurface.height);

    return newSurface;
  }

  flip(horizontal = false, vertical = false) {
    const newSurface = new Surface(this.width, this.height);
    const ctx = newSurface.ctx;

    ctx.imageSmoothingEnabled = false;

    ctx.save();

    // Move origem antes de inverter
    ctx.translate(
      horizontal ? this.width : 0,
      vertical ? this.height : 0
    );

    // Inverte eixo
    ctx.scale(
      horizontal ? -1 : 1,
      vertical ? -1 : 1
    );

    ctx.drawImage(this.canvas, 0, 0);

    ctx.restore();

    newSurface.imageData = ctx.getImageData(0, 0, newSurface.width, newSurface.height);

    return newSurface;
  }
}