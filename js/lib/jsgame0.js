/*
 * An enumeration of buttons that can be received by the on_mouse_* handlers.
 *
 * These DO NOT have the same values as the IntEnum in Pygame Zero.
 * Instead, they match the buttons bitmask in MouseEvent.
 *
 * Mouse wheel support is non-standard so WHEEL_UP and WHEEL_DOWN
 * map to the side buttons (back and forward) on a 5 button mouse.
 * Predictably, the browser navigates away when you click them so
 * you may not see them.
 */
const mouse = Object.freeze({
  LEFT: 1,
  MIDDLE: 4,
  RIGHT: 2,
  WHEEL_UP: 8,
  WHEEL_DOWN: 16
});

/*
 * An enumeration of keys that can be received by the on_key_* handlers.
 *
 * These DO NOT have the same values as the IntEnum in Pygame Zero.
 * Instead, they match the KeyboardEvent.code values.
 *
 * The shift version of keys are added as single character values.
 */
const keys = Object.freeze({
  BACKSPACE: "Backspace",
  TAB: "Tab",
  CLEAR: "Clear",
  RETURN: "Enter",
  PAUSE: "Pause",
  ESCAPE: "Escape",
  SPACE: "Space",
  EXCLAIM: "!",
  QUOTEDBL: '"',
  HASH: "#",
  DOLLAR: "$",
  AMPERSAND: "&",
  QUOTE: "Quote",
  LEFTPAREN: "(",
  RIGHTPAREN: ")",
  ASTERISK: "*",
  PLUS: "+",
  COMMA: "Comma",
  MINUS: "Minus",
  PERIOD: "Period",
  SLASH: "Slash",
  K_0: "Digit0",
  K_1: "Digit1",
  K_2: "Digit2",
  K_3: "Digit3",
  K_4: "Digit4",
  K_5: "Digit5",
  K_6: "Digit6",
  K_7: "Digit7",
  K_8: "Digit8",
  K_9: "Digit9",
  COLON: ":",
  SEMICOLON: "Semicolon",
  LESS: "<",
  EQUALS: "Equal",
  GREATER: ">",
  QUESTION: "?",
  AT: "@",
  LEFTBRACKET: "BracketLeft",
  BACKSLASH: "Backslash",
  RIGHTBRACKET: "BracketRight",
  CARET: "^",
  UNDERSCORE: "_",
  BACKQUOTE: "Backquote",
  A: "KeyA",
  B: "KeyB",
  C: "KeyC",
  D: "KeyD",
  E: "KeyE",
  F: "KeyF",
  G: "KeyG",
  H: "KeyH",
  I: "KeyI",
  J: "KeyJ",
  K: "KeyK",
  L: "KeyL",
  M: "KeyM",
  N: "KeyN",
  O: "KeyO",
  P: "KeyP",
  Q: "KeyQ",
  R: "KeyR",
  S: "KeyS",
  T: "KeyT",
  U: "KeyU",
  V: "KeyV",
  W: "KeyW",
  X: "KeyX",
  Y: "KeyY",
  Z: "KeyZ",
  DELETE: "Delete",
  KP0: "Numpad0",
  KP1: "Numpad1",
  KP2: "Numpad2",
  KP3: "Numpad3",
  KP4: "Numpad4",
  KP5: "Numpad5",
  KP6: "Numpad6",
  KP7: "Numpad7",
  KP8: "Numpad8",
  KP9: "Numpad9",
  KP_PERIOD: "NumpadDecimal",
  KP_DIVIDE: "NumpadDivide",
  KP_MULTIPLY: "NumpadMultiply",
  KP_MINUS: "NumpadSubtract",
  KP_PLUS: "NumpadAdd",
  KP_ENTER: "NumpadEnter",
  KP_EQUALS: "NumpadEqual",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  RIGHT: "ArrowRight",
  LEFT: "ArrowLeft",
  INSERT: "Insert",
  HOME: "Home",
  END: "End",
  PAGEUP: "PageUp",
  PAGEDOWN: "PageDown",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F13: "F13",
  F14: "F14",
  F15: "F15",
  NUMLOCK: "NumLock",
  CAPSLOCK: "CapsLock",
  SCROLLOCK: "ScrollLock",
  RSHIFT: "ShiftRight",
  LSHIFT: "ShiftLeft",
  RCTRL: "ControlRight",
  LCTRL: "ControlLeft",
  RALT: "AltRight",
  LALT: "AltLeft",
  RMETA: "MetaRight",
  LMETA: "MetaLeft",
  LSUPER: "OSLeft",
  RSUPER: "OSRight",
  MODE: "KanaMode",
  HELP: "Help",
  PRINT: "PrintScreen",
  SYSREQ: "SysReq",
  BREAK: "Break",
  MENU: "ContextMenu",
  POWER: "Power",
  EURO: "Euro",
  LAST: "Last"
});

/*
 * Bitmask constants representing modifier keys that may have been
 * depressed during an on_key_up / on_key_down event.
 *
 * These DO NOT have the same values as the IntEnum in Pygame Zero.
 */
const keymods = Object.freeze({
  LSHIFT: 1,
  RSHIFT: 2,
  SHIFT: 4,
  LCTRL: 8,
  RCTRL: 16,
  CTRL: 32,
  LALT: 64,
  RALT: 128,
  ALT: 256,
  LMETA: 512,
  RMETA: 1024,
  META: 2048,
  NUM: 4096,
  CAPS: 8192,
  MODE: 16384
});

/*
 * You can only query the keyboard builtin using the keys enumeration.
 */
const keyboard = (function () {
  /*
   * Set of keys that map to multiple characters.
   *
   * For example, 1 and !, 2 and @, / and ?.
   */
  const DUAL_SET = new Set();
  for (const k of Object.getOwnPropertyNames(keys)) {
    let v = keys[k];
    if ((typeof v === 'string') && (v.length === 1)) {
      DUAL_SET.add(v);
    }
  }

  /*
   * Set of keys currently being pressed.
   */
  const KEY_SET = new Set();

  return {
    /*
     * Return the value of the key that was pressed in event.
     */
    _lookup(event) {
      if (DUAL_SET.has(event.key)) {
        // If the key maps to multiple characters depending on SHIFT
        return event.key;
      }
      return event.code;
    },

    /*
     * Record the key that was pressed in event.
     */
    _press(event) {
      if (DUAL_SET.has(event.key)) {
        // If the key maps to multiple characters depending on SHIFT
        KEY_SET.add(event.key);
      }
      KEY_SET.add(event.code);
    },

    /*
     * Erase the key that was released in event.
     */
    _release(event) {
      KEY_SET.delete(event.key);
      KEY_SET.delete(event.code);
    },

    /*
     * Return a bitmask of modifier keys that were depressed.
     *
     * There is no way to tell if Num Lock or Caps Lock are on or off.
     * So they are omitted.
     */
    get bitmask() {
      let bitmask = 0;
      if (KEY_SET.has(keys.LSHIFT)) {
        bitmask |= keymods.LSHIFT;
        bitmask |= keymods.SHIFT;
      }
      if (KEY_SET.has(keys.RSHIFT)) {
        bitmask |= keymods.RSHIFT;
        bitmask |= keymods.SHIFT;
      }
      if (KEY_SET.has(keys.LCTRL)) {
        bitmask |= keymods.LCTRL;
        bitmask |= keymods.CTRL;
      }
      if (KEY_SET.has(keys.RCTRL)) {
        bitmask |= keymods.RCTRL;
        bitmask |= keymods.CTRL;
      }
      if (KEY_SET.has(keys.LALT)) {
        bitmask |= keymods.LALT;
        bitmask |= keymods.ALT;
      }
      if (KEY_SET.has(keys.RALT)) {
        bitmask |= keymods.RALT;
        bitmask |= keymods.ALT;
      }
      if (KEY_SET.has(keys.LMETA)) {
        bitmask |= keymods.LMETA;
        bitmask |= keymods.META;
      }
      if (KEY_SET.has(keys.RMETA)) {
        bitmask |= keymods.RMETA;
        bitmask |= keymods.META;
      }
      if (KEY_SET.has(keys.MODE)) {
        bitmask |= keymods.MODE;
      }

      return bitmask;
    },

    /*
     * Alias the enum values as getters.
     */
    get [keys.BACKSPACE]() {
      return KEY_SET.has(keys.BACKSPACE);
    },
    get [keys.TAB]() {
      return KEY_SET.has(keys.TAB);
    },
    get [keys.CLEAR]() {
      return KEY_SET.has(keys.CLEAR);
    },
    get [keys.RETURN]() {
      return KEY_SET.has(keys.RETURN);
    },
    get [keys.PAUSE]() {
      return KEY_SET.has(keys.PAUSE);
    },
    get [keys.ESCAPE]() {
      return KEY_SET.has(keys.ESCAPE);
    },
    get [keys.SPACE]() {
      return KEY_SET.has(keys.SPACE);
    },
    get [keys.EXCLAIM]() {
      return KEY_SET.has(keys.EXCLAIM);
    },
    get [keys.QUOTEDBL]() {
      return KEY_SET.has(keys.QUOTEDBL);
    },
    get [keys.HASH]() {
      return KEY_SET.has(keys.HASH);
    },
    get [keys.DOLLAR]() {
      return KEY_SET.has(keys.DOLLAR);
    },
    get [keys.AMPERSAND]() {
      return KEY_SET.has(keys.AMPERSAND);
    },
    get [keys.QUOTE]() {
      return KEY_SET.has(keys.QUOTE);
    },
    get [keys.LEFTPAREN]() {
      return KEY_SET.has(keys.LEFTPAREN);
    },
    get [keys.RIGHTPAREN]() {
      return KEY_SET.has(keys.RIGHTPAREN);
    },
    get [keys.ASTERISK]() {
      return KEY_SET.has(keys.ASTERISK);
    },
    get [keys.PLUS]() {
      return KEY_SET.has(keys.PLUS);
    },
    get [keys.COMMA]() {
      return KEY_SET.has(keys.COMMA);
    },
    get [keys.MINUS]() {
      return KEY_SET.has(keys.MINUS);
    },
    get [keys.PERIOD]() {
      return KEY_SET.has(keys.PERIOD);
    },
    get [keys.SLASH]() {
      return KEY_SET.has(keys.SLASH);
    },
    get [keys.K_0]() {
      return KEY_SET.has(keys.K_0);
    },
    get [keys.K_1]() {
      return KEY_SET.has(keys.K_1);
    },
    get [keys.K_2]() {
      return KEY_SET.has(keys.K_2);
    },
    get [keys.K_3]() {
      return KEY_SET.has(keys.K_3);
    },
    get [keys.K_4]() {
      return KEY_SET.has(keys.K_4);
    },
    get [keys.K_5]() {
      return KEY_SET.has(keys.K_5);
    },
    get [keys.K_6]() {
      return KEY_SET.has(keys.K_6);
    },
    get [keys.K_7]() {
      return KEY_SET.has(keys.K_7);
    },
    get [keys.K_8]() {
      return KEY_SET.has(keys.K_8);
    },
    get [keys.K_9]() {
      return KEY_SET.has(keys.K_9);
    },
    get [keys.COLON]() {
      return KEY_SET.has(keys.COLON);
    },
    get [keys.SEMICOLON]() {
      return KEY_SET.has(keys.SEMICOLON);
    },
    get [keys.LESS]() {
      return KEY_SET.has(keys.LESS);
    },
    get [keys.EQUALS]() {
      return KEY_SET.has(keys.EQUALS);
    },
    get [keys.GREATER]() {
      return KEY_SET.has(keys.GREATER);
    },
    get [keys.QUESTION]() {
      return KEY_SET.has(keys.QUESTION);
    },
    get [keys.AT]() {
      return KEY_SET.has(keys.AT);
    },
    get [keys.LEFTBRACKET]() {
      return KEY_SET.has(keys.LEFTBRACKET);
    },
    get [keys.BACKSLASH]() {
      return KEY_SET.has(keys.BACKSLASH);
    },
    get [keys.RIGHTBRACKET]() {
      return KEY_SET.has(keys.RIGHTBRACKET);
    },
    get [keys.CARET]() {
      return KEY_SET.has(keys.CARET);
    },
    get [keys.UNDERSCORE]() {
      return KEY_SET.has(keys.UNDERSCORE);
    },
    get [keys.BACKQUOTE]() {
      return KEY_SET.has(keys.BACKQUOTE);
    },
    get [keys.A]() {
      return KEY_SET.has(keys.A);
    },
    get [keys.B]() {
      return KEY_SET.has(keys.B);
    },
    get [keys.C]() {
      return KEY_SET.has(keys.C);
    },
    get [keys.D]() {
      return KEY_SET.has(keys.D);
    },
    get [keys.E]() {
      return KEY_SET.has(keys.E);
    },
    get [keys.F]() {
      return KEY_SET.has(keys.F);
    },
    get [keys.G]() {
      return KEY_SET.has(keys.G);
    },
    get [keys.H]() {
      return KEY_SET.has(keys.H);
    },
    get [keys.I]() {
      return KEY_SET.has(keys.I);
    },
    get [keys.J]() {
      return KEY_SET.has(keys.J);
    },
    get [keys.K]() {
      return KEY_SET.has(keys.K);
    },
    get [keys.L]() {
      return KEY_SET.has(keys.L);
    },
    get [keys.M]() {
      return KEY_SET.has(keys.M);
    },
    get [keys.N]() {
      return KEY_SET.has(keys.N);
    },
    get [keys.O]() {
      return KEY_SET.has(keys.O);
    },
    get [keys.P]() {
      return KEY_SET.has(keys.P);
    },
    get [keys.Q]() {
      return KEY_SET.has(keys.Q);
    },
    get [keys.R]() {
      return KEY_SET.has(keys.R);
    },
    get [keys.S]() {
      return KEY_SET.has(keys.S);
    },
    get [keys.T]() {
      return KEY_SET.has(keys.T);
    },
    get [keys.U]() {
      return KEY_SET.has(keys.U);
    },
    get [keys.V]() {
      return KEY_SET.has(keys.V);
    },
    get [keys.W]() {
      return KEY_SET.has(keys.W);
    },
    get [keys.X]() {
      return KEY_SET.has(keys.X);
    },
    get [keys.Y]() {
      return KEY_SET.has(keys.Y);
    },
    get [keys.Z]() {
      return KEY_SET.has(keys.Z);
    },
    get [keys.DELETE]() {
      return KEY_SET.has(keys.DELETE);
    },
    get [keys.KP0]() {
      return KEY_SET.has(keys.KP0);
    },
    get [keys.KP1]() {
      return KEY_SET.has(keys.KP1);
    },
    get [keys.KP2]() {
      return KEY_SET.has(keys.KP2);
    },
    get [keys.KP3]() {
      return KEY_SET.has(keys.KP3);
    },
    get [keys.KP4]() {
      return KEY_SET.has(keys.KP4);
    },
    get [keys.KP5]() {
      return KEY_SET.has(keys.KP5);
    },
    get [keys.KP6]() {
      return KEY_SET.has(keys.KP6);
    },
    get [keys.KP7]() {
      return KEY_SET.has(keys.KP7);
    },
    get [keys.KP8]() {
      return KEY_SET.has(keys.KP8);
    },
    get [keys.KP9]() {
      return KEY_SET.has(keys.KP9);
    },
    get [keys.KP_PERIOD]() {
      return KEY_SET.has(keys.KP_PERIOD);
    },
    get [keys.KP_DIVIDE]() {
      return KEY_SET.has(keys.KP_DIVIDE);
    },
    get [keys.KP_MULTIPLY]() {
      return KEY_SET.has(keys.KP_MULTIPLY);
    },
    get [keys.KP_MINUS]() {
      return KEY_SET.has(keys.KP_MINUS);
    },
    get [keys.KP_PLUS]() {
      return KEY_SET.has(keys.KP_PLUS);
    },
    get [keys.KP_ENTER]() {
      return KEY_SET.has(keys.KP_ENTER);
    },
    get [keys.KP_EQUALS]() {
      return KEY_SET.has(keys.KP_EQUALS);
    },
    get [keys.UP]() {
      return KEY_SET.has(keys.UP);
    },
    get [keys.DOWN]() {
      return KEY_SET.has(keys.DOWN);
    },
    get [keys.RIGHT]() {
      return KEY_SET.has(keys.RIGHT);
    },
    get [keys.LEFT]() {
      return KEY_SET.has(keys.LEFT);
    },
    get [keys.INSERT]() {
      return KEY_SET.has(keys.INSERT);
    },
    get [keys.HOME]() {
      return KEY_SET.has(keys.HOME);
    },
    get [keys.END]() {
      return KEY_SET.has(keys.END);
    },
    get [keys.PAGEUP]() {
      return KEY_SET.has(keys.PAGEUP);
    },
    get [keys.PAGEDOWN]() {
      return KEY_SET.has(keys.PAGEDOWN);
    },
    get [keys.F1]() {
      return KEY_SET.has(keys.F1);
    },
    get [keys.F2]() {
      return KEY_SET.has(keys.F2);
    },
    get [keys.F3]() {
      return KEY_SET.has(keys.F3);
    },
    get [keys.F4]() {
      return KEY_SET.has(keys.F4);
    },
    get [keys.F5]() {
      return KEY_SET.has(keys.F5);
    },
    get [keys.F6]() {
      return KEY_SET.has(keys.F6);
    },
    get [keys.F7]() {
      return KEY_SET.has(keys.F7);
    },
    get [keys.F8]() {
      return KEY_SET.has(keys.F8);
    },
    get [keys.F9]() {
      return KEY_SET.has(keys.F9);
    },
    get [keys.F10]() {
      return KEY_SET.has(keys.F10);
    },
    get [keys.F11]() {
      return KEY_SET.has(keys.F11);
    },
    get [keys.F12]() {
      return KEY_SET.has(keys.F12);
    },
    get [keys.F13]() {
      return KEY_SET.has(keys.F13);
    },
    get [keys.F14]() {
      return KEY_SET.has(keys.F14);
    },
    get [keys.F15]() {
      return KEY_SET.has(keys.F15);
    },
    get [keys.NUMLOCK]() {
      return KEY_SET.has(keys.NUMLOCK);
    },
    get [keys.CAPSLOCK]() {
      return KEY_SET.has(keys.CAPSLOCK);
    },
    get [keys.SCROLLOCK]() {
      return KEY_SET.has(keys.SCROLLOCK);
    },
    get [keys.RSHIFT]() {
      return KEY_SET.has(keys.RSHIFT);
    },
    get [keys.LSHIFT]() {
      return KEY_SET.has(keys.LSHIFT);
    },
    get [keys.RCTRL]() {
      return KEY_SET.has(keys.RCTRL);
    },
    get [keys.LCTRL]() {
      return KEY_SET.has(keys.LCTRL);
    },
    get [keys.RALT]() {
      return KEY_SET.has(keys.RALT);
    },
    get [keys.LALT]() {
      return KEY_SET.has(keys.LALT);
    },
    get [keys.RMETA]() {
      return KEY_SET.has(keys.RMETA);
    },
    get [keys.LMETA]() {
      return KEY_SET.has(keys.LMETA);
    },
    get [keys.LSUPER]() {
      return KEY_SET.has(keys.LSUPER);
    },
    get [keys.RSUPER]() {
      return KEY_SET.has(keys.RSUPER);
    },
    get [keys.MODE]() {
      return KEY_SET.has(keys.MODE);
    },
    get [keys.HELP]() {
      return KEY_SET.has(keys.HELP);
    },
    get [keys.PRINT]() {
      return KEY_SET.has(keys.PRINT);
    },
    get [keys.SYSREQ]() {
      return KEY_SET.has(keys.SYSREQ);
    },
    get [keys.BREAK]() {
      return KEY_SET.has(keys.BREAK);
    },
    get [keys.MENU]() {
      return KEY_SET.has(keys.MENU);
    },
    get [keys.POWER]() {
      return KEY_SET.has(keys.POWER);
    },
    get [keys.EURO]() {
      return KEY_SET.has(keys.EURO);
    },
    get [keys.LAST]() {
      return KEY_SET.has(keys.LAST);
    }
  }
})();

/*
 * Global object to schedule a function to happen in the future.
 *
 * We manually track the callbacks instead of using setTimeout() and
 * setInterval() so they can be synchronized with the core game loop.
 */
const clock = (function () {
  /*
   * Array of Arrays containing the scheduled callbacks.
   */
  let queue = [];

  return {
    /*
     * Schedule callback to be called, at delay seconds from now.
     */
    schedule(callback, delay) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function.');
      }
      if (typeof delay !== 'number') {
        throw new TypeError('delay must be a positive number in seconds.');
      }
      if (delay <= 0) {
        throw new RangeError('delay must be a positive number in seconds.');
      }
      queue.push([callback, delay, 0]);
    },

    /*
     * Schedule callback to be called once, at delay seconds from now.
     */
    schedule_unique(callback, delay) {
      this.unschedule(callback);
      this.schedule(callback, delay);
    },

    /*
     * Schedule callback to be called repeatedly with interval seconds between calls.
     */
    schedule_interval(callback, interval) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function.');
      }
      if (typeof interval !== 'number') {
        throw new TypeError('interval must be a positive number in seconds.');
      }
      if (interval <= 0) {
        throw new RangeError('interval must be a positive number in seconds.');
      }
      queue.push([callback, interval, interval]);
    },

    /*
     * Unschedule the given callback.
     */
    unschedule(callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function.');
      }
      queue = queue.filter((q) => (q[0] !== callback));
    },

    _clearQueue() {
      queue = [];
    },

    /*
     * Return a copy of queue for testing.
     */
    _getQueue() {
      return queue.slice();
    },

    /*
     * Loop through all the callbacks in queue and call any that are due.
     */
    _updateQueue(dt) {
      let due = [],
          result = [],
          newETA;
      for (let [callback, eta, next] of queue) {
        newETA = eta - dt;
        if (newETA <= 0) {
          due.push(callback);
          if (next > 0) {
            result.push([callback, next, next]);
          }
        }
        else {
          result.push([callback, newETA, next]);
        }
      }
      queue = result;

      // Call the callbacks after updating the queue to avoid
      // the lost update problem if a callback modifies the queue
      for (let callback of due) {
        callback();
      }
    }
  }
})();

const images = {};

const sounds = {};

const music = (function () {
  /*
   * Map the string track name to its HTML element.
   */
  const TRACK_MAP = new Map();

  let current = null,
      hasMusicHook = false,
      next = null,
      paused = false,
      volume = 1;

  /*
   * JavaScript callback for when the end of the media is reached.
   */
  function deejay(event) {
    if (hasMusicHook) {
      window.on_music_end();
    }
    if ((current != null) && (!current.loop)) {
      if (next != null) {
        music._play(next, false);
        next = null;
      }
    }
  }

  return {
    _load(loaderElement) {
      for (let e of loaderElement.querySelectorAll('audio')) {
        TRACK_MAP.set(e.dataset.name.trim(), e);
        e.addEventListener('ended', deejay);
      }
      hasMusicHook = (typeof window.on_music_end === 'function');
    },

    _play(name, loop = false) {
      if (!TRACK_MAP.has(name)) {
        // If name is not recognized as a music track
        return;
      }
      current = TRACK_MAP.get(name);
      current.currentTime = 0;
      current.loop = loop;
      current.muted = false;
      current.volume = volume;
      current.play();
      paused = false;
    },

    /*
     * Play the named music track. The track will loop indefinitely.
     *
     * This replaces the currently playing track and cancels any track
     * previously queued with queue().
     */
    play(name) {
      music.stop();
      music._play(name, true);
    },

    /*
     * Similar to play(), but the music will stop after playing through once.
     */
    play_once(name) {
      music.stop();
      music._play(name, false);
    },

    /*
     * Similar to play_once(), but instead of stopping the current music, the
     * track will be queued to play after the current track finishes.
     *
     * Only one track can be queued at a time. Queuing a new track while
     * another track is queued will result in the new track becoming the
     * queued track. Also, if the current track is ever stopped or changed,
     * the queued track will be lost.
     */
    queue(name) {
      if (TRACK_MAP.has(name)) {
        next = name;
      }
    },

    get_pos() {
      if (current != null) {
        return current.currentTime;
      }
      return 0;
    },

    set_pos(pos) {
      if (typeof pos !== 'number') {
        throw new TypeError('pos must be a number between 0 and the duration of the track.');
      }
      if (pos < 0) {
        throw new RangeError('pos must be a number between 0 and the duration of the track.');
      }
      if (current != null) {
        current.currentTime = Math.max(0, Math.min(pos, current.duration));
      }
    },

    rewind() {
      music.set_pos(0);
    },

    /*
     * Stop the music.
     */
    stop() {
      if (current != null) {
        current.loop = false;
        current.currentTime = current.duration;
      }
      current = null;
      // Also, if the current track is ever stopped or changed,
      // the queued track will be lost.
      next = null;
      paused = false;
    },

    /*
     * Pause the music temporarily. It can be resumed by calling unpause().
     */
    pause() {
      if (!paused) {
        if (current != null) {
          current.pause();
        }
        paused = true;
      }
    },

    /*
     * Unpause the music.
     */
    unpause() {
      if (paused) {
        if (current != null) {
          current.play();
        }
        paused = false;
      }
    },

    /*
     * Return true if the music is playing (and is not paused).
     * False otherwise.
     */
    is_playing() {
      return ((current != null) && (!paused));
    },

    /*
     * Fade out and eventually stop the current music playback over duration seconds.
     */
    fadeout(duration) {
      if (typeof duration !== 'number') {
        throw new TypeError('duration must be a positive number in seconds.');
      }
      if (duration <= 0) {
        throw new RangeError('duration must be a positive number in seconds.');
      }

      if (music.is_playing()) {
        current.loop = false;
        animate(current, duration, {volume: 0}, 'linear', () => music.stop());
      }
    },

    /*
     * Get the current volume of the music system.
     */
    get_volume() {
      return volume;
    },

    /*
     * Set the volume of the music system.
     *
     * This takes a number between 0 (meaning silent) and 1 (meaning full volume).
     */
    set_volume(v) {
      if (typeof v !== 'number') {
        throw new TypeError('volume must be a number between 0 (meaning silent) and 1 (meaning full volume).');
      }
      volume = Math.max(0, Math.min(v, 1));
      if (current != null) {
        current.volume = volume;
      }
    }
  }
})();

const tone = (function () {
  /*
   * Map the string note in lowercase to its frequency in hertz.
   */
  const NOTE_MAP = new Map();

  /*
   * Convert the hard-coded number of samples in Pygame Zero to durations in seconds.
   *
   * These constants refer to the stages of the
   * Attack Decay Sustain Release (ADSR) envelope
   * and not the poorly named DECAY constant.
   */
  const SAMPLE_RATE = 22050;
  const ATTACK = 350 / SAMPLE_RATE;
  const DECAY = 650 / SAMPLE_RATE;
  const RELEASE = 2000 / SAMPLE_RATE;

  let context = null;

  /*
   * Lazily create the AudioContext and build NOTE_MAP as needed.
   */
  function populateNotes() {
    if (context == null) {
      context = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (NOTE_MAP.size > 0) {
      return;
    }

    // Frequency of A4 in hertz
    const A4 = 440;
    const TWELFTH_ROOT = Math.pow(2, 1 / 12);

    for (let [note, value] of [
      ['a', 0],
      ['b', 2],
      ['c', -9],
      ['d', -7],
      ['e', -5],
      ['f', -4],
      ['g', -2]]) {
      for (let accidental of ['', 'b', '#']) {
        for (let octave = 0; octave < 9; octave++) {
          let key = note + accidental + octave,
              frequency = value;
          if (accidental === 'b') {
            frequency -= 1;
          }
          else if (accidental === '#') {
            frequency += 1;
          }
          frequency += (octave - 4) * 12;
          frequency = A4 * Math.pow(TWELFTH_ROOT, frequency);

          NOTE_MAP.set(key, frequency);
        }
      }
    }
  }

  return {
    _getNoteMap() {
      populateNotes();
      return NOTE_MAP;
    },

    /*
     * Play note for the given duration.
     *
     * note is a string and duration is a positive number in seconds.
     */
    play(note, duration) {
      if (typeof note !== 'string') {
        throw new TypeError('note must be a string. Notes are A-G, are either normal, flat (b) or sharp (#) and of octave 0-8.');
      }
      if (typeof duration !== 'number') {
        throw new TypeError('duration must be a positive number in seconds.');
      }
      if (duration <= 0) {
        throw new RangeError('duration must be a positive number in seconds.');
      }

      populateNotes();
      let cleaned = note.trim().toLowerCase(),
          envelope = [],
          gain, oscillator;
      if (NOTE_MAP.has(cleaned)) {
        // Create the Attack Decay Sustain Release (ADSR) envelope
        if (duration < (ATTACK + DECAY)) {
          // If duration is shorter than the Attack and Decay stages,
          // then there is no Decay stage
          envelope.push([1, duration * 0.1]);
          envelope.push([0.9, duration]);
          envelope.push([0, duration + RELEASE]);
        }
        else {
          envelope.push([1, ATTACK]);
          envelope.push([0.7, ATTACK + DECAY]);
          envelope.push([0.7, duration]);
          envelope.push([0, duration + RELEASE]);
        }

        gain = context.createGain();
        gain.connect(context.destination);
        gain.gain.setValueAtTime(0, context.currentTime);
        for (let [value, offset] of envelope) {
          // Pygame Zero linearly interpolates the samples so we do the same
          gain.gain.linearRampToValueAtTime(value, context.currentTime + offset);
        }

        // Create the oscillator to generate the actual tone
        oscillator = context.createOscillator();
        oscillator.connect(gain);
        oscillator.type = 'sine';
        oscillator.frequency.value = NOTE_MAP.get(cleaned);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration + RELEASE);
      }
      else {
        throw new RangeError(`Unrecognized note "${ note }". Notes are A-G, are either normal, flat (b) or sharp (#) and of octave 0-8.`);
      }
    }
  }
})();

/*
 * The humble Rect class, the heart of the implementation.
 */
class Rect {
  constructor() {
    let x, y, width, height;
    if (arguments.length < 1) {
      // If there are not enough arguments
      throw new Error('Not enough arguments.');
    }
    if (arguments.length < 2) {
      if (typeof arguments[0] !== 'object') {
        throw new Error('Not enough arguments.');
      }
      if (Array.isArray(arguments[0])) {
        [x=0, y=0, width=0, height=0] = arguments[0];
      }
      else {
        ({x=0, y=0, width=0, height=0} = arguments[0]);
      }
    }
    else if (arguments.length < 4) {
      if ((typeof arguments[0] !== 'object') || (typeof arguments[1] !== 'object')) {
        throw new Error('Not enough arguments.');
      }
      if (Array.isArray(arguments[0])) {
        [x=0, y=0] = arguments[0];
      }
      else {
        ({x=0, y=0} = arguments[0]);
      }
      if (Array.isArray(arguments[1])) {
        [width=0, height=0] = arguments[1];
      }
      else {
        ({width=0, height=0} = arguments[1]);
      }
    }
    else {
      [x=0, y=0, width=0, height=0] = arguments;
    }

    if (typeof x !== 'number') {
      throw new TypeError('x must be a number.');
    }
    if (typeof y !== 'number') {
      throw new TypeError('y must be a number.');
    }
    if (typeof width !== 'number') {
      throw new TypeError('width must be a number.');
    }
    if (typeof height !== 'number') {
      throw new TypeError('height must be a number.');
    }

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get top() {
    return this.y;
  }
  set top(top) {
    this.y = top;
  }
  get left() {
    return this.x;
  }
  set left(left) {
    this.x = left;
  }
  get right() {
    return this.x + this.width;
  }
  set right(right) {
    this.x = right - this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(bottom) {
    this.y = bottom - this.height;
  }
  get centerx() {
    return this.x + Math.floor(this.width / 2);
  }
  set centerx(centerx) {
    this.x = centerx - Math.floor(this.width / 2);
  }
  get centery() {
    return this.y + Math.floor(this.height / 2);
  }
  set centery(centery) {
    this.y = centery - Math.floor(this.height / 2);
  }
  get topleft() {
    return [this.x, this.y];
  }
  set topleft(topleft) {
    let [x=0, y=0] = topleft;
    this.x = x;
    this.y = y;
  }
  get topright() {
    return [this.x + this.width, this.y];
  }
  set topright(topright) {
    let [x=0, y=0] = topright;
    this.x = x - this.width;
    this.y = y;
  }
  get bottomleft() {
    return [this.x, this.y + this.height];
  }
  set bottomleft(bottomleft) {
    let [x=0, y=0] = bottomleft;
    this.x = x;
    this.y = y - this.height;
  }
  get bottomright() {
    return [this.x + this.width, this.y + this.height];
  }
  set bottomright(bottomright) {
    let [x=0, y=0] = bottomright;
    this.x = x - this.width;
    this.y = y - this.height;
  }
  get midtop() {
    return [this.x + Math.floor(this.width / 2), this.y];
  }
  set midtop(midtop) {
    let [x=0, y=0] = midtop;
    this.x = x - Math.floor(this.width / 2);
    this.y = y;
  }
  get midleft() {
    return [this.x, this.y + Math.floor(this.height / 2)];
  }
  set midleft(midleft) {
    let [x=0, y=0] = midleft;
    this.x = x;
    this.y = y - Math.floor(this.height / 2);
  }
  get midbottom() {
    return [this.x + Math.floor(this.width / 2), this.y + this.height];
  }
  set midbottom(midbottom) {
    let [x=0, y=0] = midbottom;
    this.x = x - Math.floor(this.width / 2);
    this.y = y - this.height;
  }
  get midright() {
    return [this.x + this.width, this.y + Math.floor(this.height / 2)];
  }
  set midright(midright) {
    let [x=0, y=0] = midright;
    this.x = x - this.width;
    this.y = y - Math.floor(this.height / 2);
  }
  get center() {
    return [this.x + Math.floor(this.width / 2), this.y + Math.floor(this.height / 2)];
  }
  set center(center) {
    let [x=0, y=0] = center;
    this.x = x - Math.floor(this.width / 2);
    this.y = y - Math.floor(this.height / 2);
  }
  get size() {
    return [this.width, this.height];
  }
  set size(size) {
    let [w=0, h=0] = size;
    this.width = w;
    this.height = h;
  }
  move(dx, dy) {
    return new Rect(this.x + dx, this.y + dy, this.width, this.height);
  }
  move_ip(dx, dy) {
    this.x = this.x + dx;
    this.y = this.y + dy;
  }
  inflate(dx, dy) {
    return new Rect(this.x - Math.floor(dx / 2), this.y - Math.floor(dy / 2), this.width + dx, this.height + dy);
  }
  inflate_ip(dx, dy) {
    this.x = this.x - Math.floor(dx / 2);
    this.y = this.y - Math.floor(dy / 2);
    this.width = this.width + dx;
    this.height = this.height + dy;
  }
  clamp() {
    let rect = new Rect(...arguments),
        x, y;

    if (this.width >= rect.width) {
      x = rect.x + Math.floor(rect.width / 2) - Math.floor(this.width / 2);
    }
    else if (this.x < rect.x) {
      x = rect.x;
    }
    else if ((this.x + this.width) > (rect.x + rect.width)) {
      x = rect.x + rect.width - this.width;
    }
    else {
      x = this.x;
    }

    if (this.height >= rect.height) {
      y = rect.y + Math.floor(rect.height / 2) - Math.floor(this.height / 2);
    }
    else if (this.y < rect.y) {
      y = rect.y;
    }
    else if ((this.y + this.height) > (rect.y + rect.height)) {
      y = rect.y + rect.height - this.height;
    }
    else {
      y = this.y;
    }

    return new Rect(x, y, this.width, this.height);
  }
  clamp_ip() {
    let rect = this.clamp(...arguments);
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
  clip() {
    let rect = new Rect(...arguments),
        x, y, width, height;

    if ((this.x >= rect.x) && (this.x < (rect.x + rect.width))) {
      x = this.x;
    }
    else if ((rect.x >= this.x) && (rect.x < (this.x + this.width))) {
      x = rect.x;
    }
    else {
      // The two Rect objects do not intersect
      return new Rect(this.x, this.y, 0, 0);
    }

    if (((this.x + this.width) > rect.x) && ((this.x + this.width) <= (rect.x + rect.width))) {
      width = this.x + this.width - x;
    }
    else if (((rect.x + rect.width) > this.x) && ((rect.x + rect.width) <= (this.x + this.width))) {
      width = rect.x + rect.width - x;
    }
    else {
      // The two Rect objects do not intersect
      return new Rect(this.x, this.y, 0, 0);
    }

    if ((this.y >= rect.y) && (this.y < (rect.y + rect.height))) {
      y = this.y;
    }
    else if ((rect.y >= this.y) && (rect.y < (this.y + this.height))) {
      y = rect.y;
    }
    else {
      // The two Rect objects do not intersect
      return new Rect(this.x, this.y, 0, 0);
    }

    if (((this.y + this.height) > rect.y) && ((this.y + this.height) <= (rect.y + rect.height))) {
      height = this.y + this.height - y;
    }
    else if (((rect.y + rect.height) > this.y) && ((rect.y + rect.height) <= (this.y + this.height))) {
      height = rect.y + rect.height - y;
    }
    else {
      // The two Rect objects do not intersect
      return new Rect(this.x, this.y, 0, 0);
    }

    return new Rect(x, y, width, height);
  }
  clip_ip() {
    let rect = this.clip(...arguments);
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
  union() {
    let rect = new Rect(...arguments),
        x = Math.min(this.x, rect.x),
        y = Math.min(this.y, rect.y),
        width = Math.max(this.x + this.width, rect.x + rect.width) - x,
        height = Math.max(this.y + this.height, rect.y + rect.height) - y;
    return new Rect(x, y, width, height);
  }
  union_ip() {
    let rect = this.union(...arguments);
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
  unionall(others) {
    let xs = [this.x],
        ys = [this.y],
        widths = [this.x + this.width],
        heights = [this.y + this.height],
        rect;
    for (let other of others) {
      rect = new Rect(other);
      xs.push(rect.x);
      ys.push(rect.y);
      widths.push(rect.x + rect.width);
      heights.push(rect.y + rect.height);
    }
    let x = Math.min(...xs),
        y = Math.min(...ys),
        width = Math.max(...widths) - x,
        height = Math.max(...heights) - y;
    return new Rect(x, y, width, height);
  }
  unionall_ip(others) {
    let rect = this.unionall(others);
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
  fit() {
    let rect = new Rect(...arguments),
        ratio = Math.max(this.width / rect.width, this.height / rect.height),
        width = Math.floor(this.width / ratio),
        height = Math.floor(this.height / ratio),
        x = rect.x + Math.floor((rect.width - width) / 2),
        y = rect.y + Math.floor((rect.height - height) / 2);
    return new Rect(x, y, width, height);
  }
  normalize() {
    if (this.width < 0) {
      this.x = this.x + this.width;
      this.width = Math.abs(this.width);
    }
    if (this.height < 0) {
      this.y = this.y + this.height;
      this.height = Math.abs(this.height);
    }
  }
  contains() {
    let rect = new Rect(...arguments);
    return ((this.x <= rect.x) &&
            (this.y <= rect.y) &&
            ((this.x + this.width) >= (rect.x + rect.width)) &&
            ((this.y + this.height) >= (rect.y + rect.height)) &&
            ((this.x + this.width) > rect.x) &&
            ((this.y + this.height) > rect.y));
  }
  collidepoint() {
    let x, y;
    if (arguments.length < 1) {
      return false;
    }
    if (arguments.length < 2) {
      if (typeof arguments[0] !== 'object') {
        return false;
      }
      if (Array.isArray(arguments[0])) {
        [x=0, y=0] = arguments[0];
      }
      else {
        ({x=0, y=0} = arguments[0]);
      }
    }
    else {
      [x=0, y=0] = arguments;
    }
    return ((this.x <= x) &&
            (x < (this.x + this.width)) &&
            (this.y <= y) &&
            (y < (this.y + this.height)));
  }
  colliderect() {
    let rect = new Rect(...arguments);
    return ((this.x < (rect.x + rect.width)) &&
            (this.y < (rect.y + rect.height)) &&
            ((this.x + this.width) > rect.x) &&
            ((this.y + this.height) > rect.y));
  }
  _collidelist(others) {
    let result = [],
        i = 0,
        rect;
    for (let other of others) {
      rect = new Rect(other);
      if (this.colliderect(rect)) {
        result.push(i);
      }
      i++;
    }
    return result;
  }
  collidelist(others) {
    let result = this._collidelist(others);
    if (result.length <= 0) {
      return -1;
    }
    else {
      return result[0];
    }
  }
  collidelistall(others) {
    return this._collidelist(others);
  }
  collidedict(dict, use_values = true) {
    let result = [];
    for (let [k, v] of dict) {
      if (use_values) {
        if (this.colliderect(v)) {
          result.push(k, v);
          return result;
        }
      }
      else {
        if (this.colliderect(k)) {
          result.push(k, v);
          return result;
        }
      }
    }
    return undefined;
  }
  collidedictall(dict, use_values = true) {
    let result = [];
    for (let [k, v] of dict) {
      if (use_values) {
        if (this.colliderect(v)) {
          result.push([k, v]);
        }
      }
      else {
        if (this.colliderect(k)) {
          result.push([k, v]);
        }
      }
    }
    return result;
  }
  copy() {
    return new Rect(this.x, this.y, this.width, this.height);
  }
}
Rect.prototype.toString = function () {
  return `{x: ${ this.x }, y: ${ this.y }, width: ${ this.width }, height: ${ this.height }}`;
}

/*
 * The Actor class differs from that in Pygame Zero because x and y are not
 * aliases for pos.
 * I found that decision in the Pygame Zero implementation confusing.
 * Here x and y always refer to the topleft corner of an Actor like a Rect.
 * If you want to change the location of the anchor,
 * then use posx, posy, or pos.
 *
 * In addition, the name of the image is stored in the "name" attribute and not
 * the "image" attribute.
 * "image" is too confusing when image Surface objects exist, too.
 */
class Actor {
  constructor(name) {
    // Use the setter for the name check
    this.name = name;

    // If it is a Number, x offset in pixels from the topleft corner to the anchor
    // If it is a String, relative offset that is lazily evaluated
    this.anchorDx = 'center';

    // If it is a Number, y offset in pixels from the topleft corner to the anchor
    // If it is a String, relative offset that is lazily evaluated
    this.anchorDy = 'center';

    // Initialize the anchor at center with the topleft corner at (0, 0)
    this.posx = Math.floor(this.width / 2);
    this.posy = Math.floor(this.height / 2);

    this.angle = 0;
    this.opacity = 1.0;
  }

  get name() {
    return this._name;
  }
  set name(name) {
    if (!(name in images)) {
      throw new RangeError(`Unknown image "${ name }".`);
    }
    this._name = name;
  }

  /*
   * Return an Array containing the x and y pixel offsets from the topleft corner to the anchor.
   *
   * This allows us to lazily evaluate the offsets.
   */
  _calculateAnchor() {
    let result = [];
    if (typeof this.anchorDx === 'number') {
      result.push(this.anchorDx);
    }
    else if (typeof this.anchorDx === 'string') {
      if (this.anchorDx === 'left') {
        result.push(0);
      }
      else if (this.anchorDx === 'center') {
        result.push(Math.floor(this.width / 2));
      }
      else if (this.anchorDx === 'right') {
        result.push(this.width);
      }
    }

    if (typeof this.anchorDy === 'number') {
      result.push(this.anchorDy);
    }
    else if (typeof this.anchorDy === 'string') {
      if (this.anchorDy === 'top') {
        result.push(0);
      }
      else if (this.anchorDy === 'center') {
        result.push(Math.floor(this.height / 2));
      }
      else if (this.anchorDy === 'bottom') {
        result.push(this.height);
      }
    }

    return result;
  }

  /*
   * anchor is overloaded to accept String or Number in Array or not.
   *
   * I personally think it is not Pythonic and violates
   * "There should be one-- and preferably only one --obvious way to do it."
   * but I did not write the Pygame Zero spec.
   */
  set anchor(anchor) {
    let [originalDx=0, originalDy=0] = this._calculateAnchor();

    if (typeof anchor === 'string') {
      let cleaned = anchor.trim().toLowerCase();
      if (cleaned === 'topleft') {
        this.anchorDx = 'left';
        this.anchorDy = 'top';
      }
      else if (cleaned === 'midtop') {
        this.anchorDx = 'center';
        this.anchorDy = 'top';
      }
      else if (cleaned === 'topright') {
        this.anchorDx = 'right';
        this.anchorDy = 'top';
      }
      else if (cleaned === 'midleft') {
        this.anchorDx = 'left';
        this.anchorDy = 'center';
      }
      else if (cleaned === 'center') {
        this.anchorDx = 'center';
        this.anchorDy = 'center';
      }
      else if (cleaned === 'midright') {
        this.anchorDx = 'right';
        this.anchorDy = 'center';
      }
      else if (cleaned === 'bottomleft') {
        this.anchorDx = 'left';
        this.anchorDy = 'bottom';
      }
      else if (cleaned === 'midbottom') {
        this.anchorDx = 'center';
        this.anchorDy = 'bottom';
      }
      else if (cleaned === 'bottomright') {
        this.anchorDx = 'right';
        this.anchorDy = 'bottom';
      }
      else {
        throw new RangeError(`Unknown anchor "${ anchor }". Must be "topleft", "midtop", "topright", "midleft", "center", "midright", "bottomleft", "midbottom", or "bottomright".`);
      }
    }
    else if (typeof anchor === 'object') {
      let originalAnchorDx = this.anchorDx,
          originalAnchorDy = this.anchorDy,
          x, y, cleaned;
      if (Array.isArray(anchor)) {
        [x=0, y=0] = anchor;
      }
      else {
        ({x=0, y=0} = anchor);
      }

      if (typeof x === 'number') {
        this.anchorDx = x;
      }
      else if (typeof x === 'string') {
        cleaned = x.trim().toLowerCase();
        if (cleaned === 'left') {
          this.anchorDx = 'left';
        }
        else if ((cleaned === 'center') || (cleaned === 'middle')) {
          this.anchorDx = 'center';
        }
        else if (cleaned === 'right') {
          this.anchorDx = 'right';
        }
        else {
          throw new RangeError(`Unknown anchor "${ x }". Must be "left", "center", "middle", or "right".`);
        }
      }
      else {
        throw new TypeError('Unrecognized anchor type. Must be a Number or a String.');
      }

      if (typeof y === 'number') {
        this.anchorDy = y;
      }
      else if (typeof y === 'string') {
        cleaned = y.trim().toLowerCase();
        if (cleaned === 'top') {
          this.anchorDy = 'top';
        }
        else if ((cleaned === 'center') || (cleaned === 'middle')) {
          this.anchorDy = 'center';
        }
        else if (cleaned === 'bottom') {
          this.anchorDy = 'bottom';
        }
        else {
          // Reset the anchor in case the x value is valid and was set
          this.anchorDx = originalAnchorDx;
          this.anchorDy = originalAnchorDy;
          throw new RangeError(`Unknown anchor "${ y }". Must be "top", "center", "middle", or "bottom".`);
        }
      }
      else {
        // Reset the anchor in case the x value is valid and was set
        this.anchorDx = originalAnchorDx;
        this.anchorDy = originalAnchorDy;
        throw new TypeError('Unrecognized anchor type. Must be a Number or a String.');
      }
    }
    else {
      throw new TypeError('Unrecognized anchor type.');
    }

    let [dx=0, dy=0] = this._calculateAnchor();
    if ((dx !== originalDx) || (dy !== originalDy)) {
      // If the anchor offsets changed, then update the anchor
      this.posx = this.posx - originalDx + dx;
      this.posy = this.posy - originalDy + dy;
    }
  }

  get pos() {
    return [this.posx, this.posy];
  }
  set pos(pos) {
    let x, y;
    if (Array.isArray(pos)) {
      [x=0, y=0] = pos;
    }
    else {
      ({x=0, y=0} = pos);
    }
    this.posx = x;
    this.posy = y;
  }

  /*
   * Make x, y, width, and height available as attributes to mimic the Rect class.
   */
  get x() {
    let [dx=0, dy=0] = this._calculateAnchor();
    return this.posx - dx;
  }
  set x(x) {
    let [dx=0, dy=0] = this._calculateAnchor();
    this.posx = x + dx;
  }
  get y() {
    let [dx=0, dy=0] = this._calculateAnchor();
    return this.posy - dy;
  }
  set y(y) {
    let [dx=0, dy=0] = this._calculateAnchor();
    this.posy = y + dy;
  }
  get width() {
    return images[this._name].width;
  }
  get height() {
    return images[this._name].height;
  }

  /*
   * Same attributes as the Rect class based on x, y, width, and height above.
   */
  get top() {
    return this.y;
  }
  set top(top) {
    this.y = top;
  }
  get left() {
    return this.x;
  }
  set left(left) {
    this.x = left;
  }
  get right() {
    return this.x + this.width;
  }
  set right(right) {
    this.x = right - this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(bottom) {
    this.y = bottom - this.height;
  }
  get centerx() {
    return this.x + Math.floor(this.width / 2);
  }
  set centerx(centerx) {
    this.x = centerx - Math.floor(this.width / 2);
  }
  get centery() {
    return this.y + Math.floor(this.height / 2);
  }
  set centery(centery) {
    this.y = centery - Math.floor(this.height / 2);
  }
  get topleft() {
    return [this.x, this.y];
  }
  set topleft(topleft) {
    let [x=0, y=0] = topleft;
    this.x = x;
    this.y = y;
  }
  get topright() {
    return [this.x + this.width, this.y];
  }
  set topright(topright) {
    let [x=0, y=0] = topright;
    this.x = x - this.width;
    this.y = y;
  }
  get bottomleft() {
    return [this.x, this.y + this.height];
  }
  set bottomleft(bottomleft) {
    let [x=0, y=0] = bottomleft;
    this.x = x;
    this.y = y - this.height;
  }
  get bottomright() {
    return [this.x + this.width, this.y + this.height];
  }
  set bottomright(bottomright) {
    let [x=0, y=0] = bottomright;
    this.x = x - this.width;
    this.y = y - this.height;
  }
  get midtop() {
    return [this.x + Math.floor(this.width / 2), this.y];
  }
  set midtop(midtop) {
    let [x=0, y=0] = midtop;
    this.x = x - Math.floor(this.width / 2);
    this.y = y;
  }
  get midleft() {
    return [this.x, this.y + Math.floor(this.height / 2)];
  }
  set midleft(midleft) {
    let [x=0, y=0] = midleft;
    this.x = x;
    this.y = y - Math.floor(this.height / 2);
  }
  get midbottom() {
    return [this.x + Math.floor(this.width / 2), this.y + this.height];
  }
  set midbottom(midbottom) {
    let [x=0, y=0] = midbottom;
    this.x = x - Math.floor(this.width / 2);
    this.y = y - this.height;
  }
  get midright() {
    return [this.x + this.width, this.y + Math.floor(this.height / 2)];
  }
  set midright(midright) {
    let [x=0, y=0] = midright;
    this.x = x - this.width;
    this.y = y - Math.floor(this.height / 2);
  }
  get center() {
    return [this.x + Math.floor(this.width / 2), this.y + Math.floor(this.height / 2)];
  }
  set center(center) {
    let [x=0, y=0] = center;
    this.x = x - Math.floor(this.width / 2);
    this.y = y - Math.floor(this.height / 2);
  }
  get size() {
    return [this.width, this.height];
  }
  contains() {
    let rect = new Rect(...arguments);
    return ((this.x <= rect.x) &&
            (this.y <= rect.y) &&
            ((this.x + this.width) >= (rect.x + rect.width)) &&
            ((this.y + this.height) >= (rect.y + rect.height)) &&
            ((this.x + this.width) > rect.x) &&
            ((this.y + this.height) > rect.y));
  }
  collidepoint() {
    let x, y;
    if (arguments.length < 1) {
      return false;
    }
    if (arguments.length < 2) {
      if (typeof arguments[0] !== 'object') {
        return false;
      }
      if (Array.isArray(arguments[0])) {
        [x=0, y=0] = arguments[0];
      }
      else {
        ({x=0, y=0} = arguments[0]);
      }
    }
    else {
      [x=0, y=0] = arguments;
    }
    return ((this.x <= x) &&
            (x < (this.x + this.width)) &&
            (this.y <= y) &&
            (y < (this.y + this.height)));
  }
  colliderect() {
    let rect = new Rect(...arguments);
    return ((this.x < (rect.x + rect.width)) &&
            (this.y < (rect.y + rect.height)) &&
            ((this.x + this.width) > rect.x) &&
            ((this.y + this.height) > rect.y));
  }

  draw() {
    screen.blit(this, this._calculateAnchor());
  }

  _vector_to(target) {
    let [ax=0, ay=0] = this.pos,
        tuple = [],
        x, y, dx, dy;
    if (typeof target !== 'object') {
      tuple.push(0, 0);
      return tuple;
    }
    else if (target instanceof Actor) {
      [x=0, y=0] = target.pos;
    }
    else if (Array.isArray(target)) {
      [x=0, y=0] = target;
    }
    else {
      ({x=0, y=0} = target);
    }

    dx = x - ax;
    // The y-axis is inverted in graphics (positive goes down)
    dy = ay - y;
    tuple.push(Math.hypot(dx, dy), Math.atan2(dy, dx) * 180 / Math.PI);
    return tuple;
  }

  /*
   * Return the angle from this actor's position to target, in degrees.
   */
  angle_to(target) {
    return this._vector_to(target)[1];
  }

  /*
   * Return the distance from this actor's position to target, in pixels.
   */
  distance_to(target) {
    return this._vector_to(target)[0];
  }

  /*
   * Return a Rect object that is the minimum bounding box for this instance.
   *
   * The Rect methods of the Actor class do not account for rotation.
   * So if you need to do collision detection with a rotated Actor instance,
   * this method returns the minimum bounding box as a Rect object.
   */
  getBoundingBox() {
    let [dx=0, dy=0] = this._calculateAnchor(),
        angle = this.angle % 360,
        theta = -angle * Math.PI / 180,
        sinTheta = Math.sin(theta),
        cosTheta = Math.cos(theta),
        // width and height of the minimum bounding box
        width = Math.abs(this.width * cosTheta) + Math.abs(this.height * sinTheta),
        height = Math.abs(this.width * sinTheta) + Math.abs(this.height * cosTheta),
        // Offset of the anchor from the center
        cax = dx - (this.width / 2),
        cay = dy - (this.height / 2),
        // Subtract rotated offset of the anchor from the center + half from anchor
        x = this.posx - ((cax * cosTheta) - (cay * sinTheta) + (width / 2)),
        y = this.posy - ((cax * sinTheta) + (cay * cosTheta) + (height / 2));

    // Use exact values if the angle is a right angle
    if (angle === 0) {
      return new Rect(this.x, this.y, this.width, this.height);
    }
    else if (angle === 90) {
      return new Rect(this.posx - dy, this.posy - (this.width - dx), this.height, this.width);
    }
    else if (angle === 180) {
      return new Rect(this.posx - (this.width - dx), this.posy - (this.height - dy), this.width, this.height);
    }
    else if (angle === 270) {
      return new Rect(this.posx - (this.height - dy), this.posy - dx, this.height, this.width);
    }
    else {
      return new Rect(x, y, width, height);
    }
  }
}

/*
 * Class to handle the animation.
 *
 * It cannot be named "Animation" because the Web Animation API already uses
 * that name.
 * So we use a more appropriate and exact name.
 *
 * In traditional animation, an inbetweener is the assistant responsible for
 * drawing the images between the keyframes.
 * Shortening "inbetween" is where we got the term "tween".
 */
class Inbetweener {
  /*
   * Tween functions
   */
  static linear(n) {
    return n;
  }

  static accelerate(n) {
    return (n * n);
  }

  static decelerate(n) {
    return (-1.0 * n * (n - 2.0));
  }

  static accel_decel(n) {
    let p = n * 2;
    if (p < 1) {
      return (0.5 * p * p);
    }
    p -= 1.0;
    return (-0.5 * ((p * (p - 2.0)) - 1.0));
  }

  static in_elastic(n) {
    let p = 0.3,
        s = p / 4.0;
    if (n === 1) {
      return 1.0;
    }
    n -= 1;
    return -(Math.pow(2, 10 * n) * Math.sin((n - s) * 2 * Math.PI / p));
  }

  static out_elastic(n) {
    let p = 0.3,
        s = p / 4.0;
    if (n === 1) {
      return 1.0;
    }
    return ((Math.pow(2, -10 * n) * Math.sin((n - s) * 2 * Math.PI / p)) + 1.0);
  }

  static in_out_elastic(n) {
    let p = 0.3 * 1.5,
        s = p / 4.0,
        q = n * 2;
    if (q === 2) {
      return 1.0;
    }
    if (q < 1) {
      q -= 1;
      return (-0.5 * Math.pow(2, 10 * q) * Math.sin((q - s) * 2 * Math.PI / p));
    }
    q -= 1;
    return ((0.5 * Math.pow(2, -10 * q) * Math.sin((q - s) * 2 * Math.PI / p)) + 1.0);
  }

  static _out_bounce_internal(t, d) {
    let p = t / d;
    if (p < (1.0 / 2.75)) {
      return (7.5625 * p * p);
    }
    if (p < (2.0 / 2.75)) {
      p -= 1.5 / 2.75;
      return ((7.5625 * p * p) + 0.75);
    }
    if (p < (2.5 / 2.75)) {
      p -= 2.25 / 2.75;
      return ((7.5625 * p * p) + 0.9375);
    }
    p -= 2.625 / 2.75;
    return ((7.5625 * p * p) + 0.984375);
  }

  static _in_bounce_internal(t, d) {
    return (1.0 - Inbetweener._out_bounce_internal(d - t, d));
  }

  static bounce_end(n) {
    return Inbetweener._out_bounce_internal(n, 1);
  }

  static bounce_start(n) {
    return Inbetweener._in_bounce_internal(n, 1);
  }

  static bounce_start_end(n) {
    let p = n * 2;
    if (p < 1) {
      return (Inbetweener._in_bounce_internal(p, 1) * 0.5);
    }
    return ((Inbetweener._out_bounce_internal(p - 1, 1) * 0.5) + 0.5);
  }

  /*
   * Animation queue: Array of Inbetweener objects.
   */
  static queue = [];

  /*
   * Clear the animation queue.
   */
  static _clearQueue() {
    Inbetweener.queue = [];
  }

  /*
   * Loop through all the animations in the animation queue and tween.
   */
  static _updateQueue(dt) {
    let due = [],
        result = [];
    for (let a of Inbetweener.queue) {
      a.update(dt);
      if (a.done) {
        if (typeof a.callback === 'function') {
          due.push(a.callback);
        }
      }
      else {
        result.push(a);
      }
    }
    Inbetweener.queue = result;

    // Call the callbacks after updating the queue to avoid
    // the lost update problem if a callback modifies the queue
    for (let callback of due) {
      callback();
    }
  }

  constructor(puppet, duration, attributes, tween, callback) {
    if (typeof puppet !== 'object') {
      throw new TypeError('puppet must be an object.');
    }
    if (typeof duration !== 'number') {
      throw new TypeError('duration must be a positive number in seconds.');
    }
    if (duration <= 0) {
      throw new RangeError('duration must be a positive number in seconds.');
    }
    if (typeof attributes !== 'object') {
      throw new TypeError('attributes must be an object.');
    }
    if (typeof tween !== 'string') {
      this.tween = 'linear';
    }
    else {
      this.tween = tween.trim().toLowerCase();
      if (this.tween.startsWith('_') || (!(this.tween in Inbetweener))) {
        throw new RangeError(`Unrecognized tween function "${ tween }".`);
      }
    }

    this.puppet = puppet;
    this.elapsed = 0;
    this.duration = duration;
    this.callback = callback;

    // Populate this.attributes with the start and the end values of the properties to tween
    // They must either both be Numbers or Arrays of Numbers the same length
    this.attributes = new Map();
    for (let a of Object.getOwnPropertyNames(attributes)) {
      if (!(a in this.puppet)) {
        continue;
      }
      let start = this.puppet[a],
          end = attributes[a];
      if ((typeof start === 'number') && (typeof end === 'number')) {
        this.attributes.set(a, {start: start, end: end});
      }
      else if (Array.isArray(start) && Array.isArray(end)) {
        if (start.length !== end.length) {
          continue;
        }
        if (start.some((e) => (typeof e !== 'number'))) {
          continue;
        }
        if (end.some((e) => (typeof e !== 'number'))) {
          continue;
        }
        this.attributes.set(a, {start: start, end: end});
      }
    }
  }

  /*
   * Update the animation after dt seconds have passed.
   */
  update(dt) {
    this.elapsed += dt;
    if (this.elapsed > this.duration) {
      // If the animation has reached its end
      for (let [k, v] of this.attributes) {
        this.puppet[k] = v.end;
      }
    }
    else {
      // Interpolate between start and end based on the tween function
      let n = Inbetweener[this.tween](this.elapsed / this.duration);
      for (let [k, v] of this.attributes) {
        if (typeof v.start === 'number') {
          this.puppet[k] = v.start + ((v.end - v.start) * n);
        }
        else if (Array.isArray(v.start)) {
          let result = [];
          for (let i = 0; i < v.start.length; i++) {
            result.push(v.start[i] + ((v.end[i] - v.start[i]) * n));
          }
          this.puppet[k] = result;
        }
      }
    }
  }

  /*
   * Boolean flag that is true if the animation is complete.
   */
  get done() {
    if (this.attributes.size <= 0) {
      // If there is no property to update
      return true;
    }
    return (this.elapsed > this.duration);
  }
}

/*
 * Animate the attributes on puppet from their current value to that
 * specified in the attributes object over duration.
 */
function animate() {
  if (arguments.length < 1) {
    // If there are not enough arguments
    throw new Error('Not enough arguments.');
  }

  let animation;
  if (arguments.length < 3) {
    animation = arguments[0];
  }
  else {
    animation = new Inbetweener(...arguments);
  }
  if (animation instanceof Inbetweener) {
    if (!animation.done) {
      // Newly scheduled animations will overwrite old ones
      Inbetweener.queue = Inbetweener.queue.filter((a) => (a.puppet !== animation.puppet));
      Inbetweener.queue.push(animation);
    }
    return animation;
  }
  else {
    throw new Error('Not enough arguments.');
  }
}