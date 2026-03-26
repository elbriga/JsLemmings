/*
 * Global object representing your game screen.
 */
const screen = (function () {
  const DEFAULT_WIDTH = 800;
  const DEFAULT_HEIGHT = 600;

  /*
   * Return a CSS ID selector, adding "#" as needed.
   */
  function to_CSS_ID(selector) {
    if (typeof selector !== 'string') {
      throw new TypeError('selector must be a non-empty CSS selector string.');
    }
    if (selector.length <= 0) {
      throw new RangeError('selector must be a non-empty CSS selector string.');
    }

    if (selector.startsWith('#')) {
      return selector;
    }
    return '#' + selector;
  }

  let canvas = null,
      pauseButton = null,
      resetButton = null,
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      context = null,
      usesKeyboard = false,
      hasKeyDown = false,
      hasKeyUp = false,
      hasDraw = false,
      hasUpdate = false,
      running = 0,
      start;

  /*
   * Event Handlers
   */
  function clickStart(event) {
    // If canvas is null, then clickStart would not have been added
    canvas.removeEventListener('click', clickStart);
    if (pauseButton != null) {
      pauseButton.removeEventListener('click', clickStart);
      pauseButton.addEventListener('click', (event) => {
        if (event.target.textContent === 'Pause') {
          screen.stop();
          event.target.textContent = 'Unpause';
        }
        else {
          event.target.textContent = 'Pause';
          screen.go();
        }
      });
    }
    if (resetButton != null) {
      resetButton.removeEventListener('click', clickStart);
      resetButton.addEventListener('click', (event) => {
        clock._clearQueue();
        Inbetweener._clearQueue();
        for (const n of Object.getOwnPropertyNames(sounds)) {
          sounds[n].stop();
        }
        AudioWrapper.inFlight.clear();
        music.stop();
        if (pauseButton != null) {
          pauseButton.textContent = 'Pause';
        }
        if (typeof window.reset === 'function') {
          window.reset();
        }
        screen.go();
      });
    }

    if (typeof window.reset === 'function') {
      // Call reset() here to get around prohibiting autoplay without user interaction
      window.reset();
    }
    screen.go();
  }

  function keydown(event) {
    keyboard._press(event);
    if (hasKeyDown) {
      window.on_key_down(keyboard._lookup(event), keyboard.bitmask, event.key);
    }
    event.preventDefault();
  }

  function keyup(event) {
    if (hasKeyUp) {
      window.on_key_up(keyboard._lookup(event), keyboard.bitmask);
    }
    keyboard._release(event);
    event.preventDefault();
  }

  function mousedown(event) {
    // Use getBoundingClientRect() to get the distance relative to viewport
    let box = event.target.getBoundingClientRect(),
        x = Math.floor(event.clientX - box.left),
        y = Math.floor(event.clientY - box.top);
    window.on_mouse_down([x, y], event.buttons);
  }

  function mouseup(event) {
    // Use getBoundingClientRect() to get the distance relative to viewport
    let box = event.target.getBoundingClientRect(),
        x = Math.floor(event.clientX - box.left),
        y = Math.floor(event.clientY - box.top);
    window.on_mouse_up([x, y], event.buttons);
  }

  function mousemove(event) {
    // Use getBoundingClientRect() to get the distance relative to viewport
    let box = event.target.getBoundingClientRect(),
        x = Math.floor(event.clientX - box.left),
        y = Math.floor(event.clientY - box.top);
    window.on_mouse_move([x, y], [event.movementX, event.movementY], event.buttons);
  }

  /*
   * The core game loop
   */
  function loop(timestamp) {
    /*
     * Best practice
     * ---
     * Calling the next requestAnimationFrame early ensures the browser
     * receives it on time to plan accordingly even if your current frame
     * misses its VSync window.
     */
    running = window.requestAnimationFrame(loop);

    if (start == null) {
      // For the first run of the game loop
      start = timestamp;
    }

    // JavaScript time is in milliseconds not seconds like Pygame Zero!
    const elapsed = (timestamp - start) / 1000;
    start = timestamp;

    clock._updateQueue(elapsed);
    Inbetweener._updateQueue(elapsed);

    if (hasUpdate) {
      window.update(elapsed);
    }
    if (hasDraw) {
      window.draw();
    }
  }

  /*
   * Wrapper around an audio element to match the Pygame Zero interface.
   */
  class AudioWrapper {
    /*
     * Set of string names of currently playing sounds.
     *
     * Tracked here because Object.getOwnPropertyNames(sounds)
     * returns the names of all sounds.
     */
    static inFlight = new Set();

    static _soundStart(event) {
      AudioWrapper.inFlight.add(event.target.dataset.name.trim());
    }

    static _soundEnd(event) {
      let name = event.target.dataset.name.trim();
      AudioWrapper.inFlight.delete(name);
      if (sounds[name]._play_again()) {
        sounds[name].play(0);
      }
    }


    constructor(audioElement) {
      if (!(audioElement instanceof HTMLMediaElement)) {
        throw new TypeError('audioElement must be a HTMLMediaElement.');
      }

      this.audioElement = audioElement;
      this.audioElement.currentTime = 0;
      this.audioElement.loop = false;
      this.audioElement.muted = false;

      this.loopCount = 0;
      // Own copy of paused for when paused because
      // this.audioElement.paused is true when stopped as well
      this.paused = false;
      this.volume = 1;
      this.audioElement.volume = this.volume;

      this.audioElement.addEventListener('play', AudioWrapper._soundStart);
      this.audioElement.addEventListener('ended', AudioWrapper._soundEnd);
    }

    /*
     * Play the sound, but loop it loopCount number of times and fade in over duration seconds.
     */
    play(loopCount = 1, duration = 0) {
      if (typeof loopCount !== 'number') {
        loopCount = 1;
      }
      if (typeof duration !== 'number') {
        throw new TypeError('duration must be a positive number in seconds.');
      }
      if (duration < 0) {
        throw new RangeError('duration must be a positive number in seconds.');
      }

      this.paused = false;
      if (loopCount < 0) {
        this.audioElement.loop = true;
        // Set this.loopCount to 1 so it will be 0 after decrementing
        this.loopCount = 1;
      }
      else {
        this.audioElement.loop = false;
        this.loopCount += loopCount;
      }
      this.loopCount--;
      if (this.loopCount < 0) {
        // Backstop this.loopCount at 0 for our sanity
        this.loopCount = 0;
        return;
      }

      if (duration > 0) {
        // Fade in the audio element over duration seconds
        this.audioElement.volume = 0;
        animate(this.audioElement, duration, {volume: this.volume}, 'linear');
      }
      else {
        this.audioElement.volume = this.volume;
      }

      this.audioElement.play();
    }

    /*
     * Stop playing the sound.
     */
    stop() {
      this.audioElement.loop = false;
      this.loopCount = 0;
      this.paused = false;
      this.audioElement.currentTime = this.get_length();
    }

    /*
     * Return the duration of the sound in seconds.
     */
    get_length() {
      return this.audioElement.duration;
    }

    /*
     * Pause the sound.
     */
    pause() {
      if (!this.paused) {
        this.audioElement.pause();
        this.paused = true;
      }
    }

    /*
     * Unpause the sound if it was paused.
     */
    unpause() {
      if (this.paused) {
        this.audioElement.play();
        this.paused = false;
      }
    }

    /*
     * Fade out and eventually stop the sound over duration seconds.
     */
    fadeout(duration) {
      if (typeof duration !== 'number') {
        throw new TypeError('duration must be a positive number in seconds.');
      }
      if (duration <= 0) {
        throw new RangeError('duration must be a positive number in seconds.');
      }
      if (this.paused) {
        return;
      }

      this.audioElement.loop = false;
      this.loopCount = 0;
      animate(this.audioElement, duration, {volume: 0}, 'linear', () => this.stop());
    }

    _play_again() {
      return ((!this.paused) && (this.loopCount > 0));
    }

    /*
     * Return the audio volume between 0 (meaning silent) and 1 (meaning full volume).
     */
    get_volume() {
      return this.volume;
    }

    /*
     * Set the audio volume between 0 (meaning silent) and 1 (meaning full volume).
     */
    set_volume(v) {
      if (typeof v !== 'number') {
        throw new TypeError('volume must be a number between 0 (meaning silent) and 1 (meaning full volume).');
      }
      this.volume = Math.max(0, Math.min(v, 1));
      this.audioElement.volume = this.volume;
    }
  }

  return {
// TODO :: Usar Surface aqui e migrar esses metodos para la??
    // context is null here!    draw: Draw.create(context, width, height),

    /*
     * Return a Rect representing the bounds of the screen.
     */
    bounds() {
      return new Rect(0, 0, width, height);
    },

    /*
     * Clear the screen to black.
     */
    clear(color = 'black') {
      if (context == null) {
        return;
      }
      context.clearRect(0, 0, width, height);
      this.fill(color);
    },

    /*
     * Fill the screen with a colour.
     */
    fill(color, gcolor) {
      if (context == null) {
        return;
      }
      if (gcolor != null) {
        let gradient = context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, Draw.parseColor(color));
        gradient.addColorStop(1, Draw.parseColor(gcolor));
        context.fillStyle = gradient;
      }
      else {
        context.fillStyle = Draw.parseColor(color);
      }
      context.fillRect(0, 0, width, height);
    },

    /*
     * Draw object to the screen at the given position.
     */
    blit(object, pos, target) {
      if (context == null) {
        return;
      }

      let x, y, image;
      if (object instanceof Actor) {
        [x=0, y=0] = pos;
        image = images[object.name];
        context.save();
        if (typeof object.opacity === 'number') {
          context.globalAlpha = Math.max(0, Math.min(object.opacity, 1));
        }
        // Move the origin to the anchor so we can rotate
        context.translate(...object.pos);
        // Canvas rotates clockwise but Pygame Zero rotates counterclockwise (anticlockwise)
        context.rotate(-(object.angle % 360) * Math.PI / 180);
        // Move the origin to the topleft to draw the image
        // x and y contain pixel offsets from the topleft corner to the anchor
        context.translate(-x, -y);
        context.drawImage(image, 0, 0);
        context.restore();
      }
      else if (object instanceof Sprite) {
        x = pos.x;
        y = pos.y;
        context.save();
        context.drawImage(object.canvas, x, y);
        context.restore();
      }
      else if (object instanceof Surface) {
        if (pos instanceof Rect) {
          x = pos.x;
          y = pos.y;
        } else {
          [x=0, y=0] = pos;
        }
        context.save();
        context.putImageData(object.imageData, x, y);
        context.restore();
      }
      else if (typeof object === 'string') {
        if (!(object in images)) {
          throw new RangeError(`Unknown image "${ object }".`);
        }
        image = images[object];
        context.save();
        if (pos instanceof Rect) {
          // Support scaling and tilesets when Rect objects are passed as arguments
          if (target instanceof Rect) {
            context.drawImage(image, pos.x, pos.y, pos.width, pos.height,
                              target.x, target.y, target.width, target.height);
          }
          else {
            context.drawImage(image, pos.x, pos.y, pos.width, pos.height);
          }
        }
        else {
          [x=0, y=0] = pos;
          context.drawImage(image, x, y);
        }
        context.restore();
      }
      else {
        // Otherwise, object is not recognized
        throw new TypeError('Unrecognized object to blit.');
      }
    },

    /*
     * Setup the global objects images, sounds, music, and screen.
     */
    init(canvasID = '#screen', resetID = '#reset', pauseID = '#pause', imagesID = '#imageLoader', soundsID = '#soundLoader', musicID = '#musicLoader') {
      let element = document.querySelector(to_CSS_ID(imagesID)),
          name;
      if (element != null) {
        // Populate the images global object
        for (let e of element.querySelectorAll('img')) {
          name = e.dataset.name.trim();
          images[name] = e;
        }
      }

      // Populate the sounds global object
      element = document.querySelector(to_CSS_ID(soundsID));
      if (element != null) {
        for (let e of element.querySelectorAll('audio')) {
          name = e.dataset.name.trim();
          sounds[name] = new AudioWrapper(e);
        }
      }

      // Populate the music global object
      element = document.querySelector(to_CSS_ID(musicID));
      if (element != null) {
        music._load(element);
      }

      if (window.TITLE && (typeof window.TITLE === 'string')) {
        document.querySelector('title').textContent = window.TITLE;
        document.querySelector('h1').textContent = window.TITLE;
      }

      canvas = document.querySelector(to_CSS_ID(canvasID));
      if (canvas == null) {
        // If the element does not exist
        return;
      }
      if (!canvas.getContext) {
        // If not the canvas element or Canvas API not supported
        return;
      }
      if (window.WIDTH && (typeof window.WIDTH === 'number')) {
        width = canvas.width = window.WIDTH;
      }
      else {
        width = canvas.width = DEFAULT_WIDTH;
      }
      if (window.HEIGHT && (typeof window.HEIGHT === 'number')) {
        height = canvas.height = window.HEIGHT;
      }
      else {
        height = canvas.height = DEFAULT_HEIGHT;
      }

      context = canvas.getContext('2d');
      hasKeyDown = (typeof window.on_key_down === 'function');
      hasKeyUp = (typeof window.on_key_up === 'function');
      hasDraw = (typeof window.draw === 'function');
      hasUpdate = (typeof window.update === 'function');

      /*
       * Inspect all script blocks for code that uses the keyboard global.
       *
       * This can be fooled but then you are just dooming yourself.
       */
      for (let e of document.querySelectorAll('script')) {
        if (e.textContent.includes('keyboard[')) {
          usesKeyboard = true;
          break;
        }
      }

      screen.draw = Draw.create(context, width, height);
      screen.draw._playButton();

      // Add listeners to the HTML user interface controls
      canvas.addEventListener('click', clickStart);
      pauseButton = document.querySelector(to_CSS_ID(pauseID));
      if (pauseButton != null) {
        pauseButton.addEventListener('click', clickStart);
      }
      resetButton = document.querySelector(to_CSS_ID(resetID));
      if (resetButton != null) {
        resetButton.addEventListener('click', clickStart);
      }
    },

    go() {
      if (running !== 0) {
        // If the core game loop is already running, then do nothing
        return;
      }

      // Add event listeners

      if (usesKeyboard || hasKeyDown || hasKeyUp) {
        // Only add KeyboardEvent listeners if necessary because it is on window
        window.addEventListener('keydown', keydown, true);
        window.addEventListener('keyup', keyup, true);
      }

      if (canvas != null) {
        if (typeof window.on_mouse_down === 'function') {
          canvas.addEventListener('mousedown', mousedown);
        }
        if (typeof window.on_mouse_up === 'function') {
          canvas.addEventListener('mouseup', mouseup);
        }
        if (typeof window.on_mouse_move === 'function') {
          canvas.addEventListener('mousemove', mousemove);
        }
      }

      // Unpause any sounds that were previously playing
      for (const n of AudioWrapper.inFlight) {
        sounds[n].unpause();
      }
      music.unpause();

      screen.clear();

      // Start the core game loop
      start = undefined;
      running = window.requestAnimationFrame(loop);
    },

    stop() {
      if (running === 0) {
        // If the core game loop is not running, then do nothing
        return;
      }

      // Stop the core game loop
      window.cancelAnimationFrame(running);
      running = 0;

      // Pause any sounds that are currently playing
      for (const n of AudioWrapper.inFlight) {
        sounds[n].pause();
      }
      music.pause();

      // Remove event listeners
      window.removeEventListener('keydown', keydown, true);
      window.removeEventListener('keyup', keyup, true);
      if (canvas != null) {
        canvas.removeEventListener('mousedown', mousedown);
        canvas.removeEventListener('mouseup', mouseup);
        canvas.removeEventListener('mousemove', mousemove);
      }
    },

    /*
     * Return a Surface object containing the underlying pixel data of the screen from (x, y) to (x + width, y + height).
     *
     * If only 2 arguments are supplied, then they are used for width and height and (x, y) is assumed to be (0, 0).
     */
    getSurface() {
      if (context == null) {
        return;
      }

      let x = 0,
          y = 0,
          w = width,
          h = height;
      if (arguments.length < 4) {
        [w=width, h=height] = arguments;
      }
      else {
        [x=0, y=0, w=width, h=height] = arguments;
      }
      return new Surface(context.getImageData(x, y, w, h));
    }
  }
})();