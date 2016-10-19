// bt3-browser-shim: shim that simulates the browser, built on bt3gui

// translates `button` code to `buttons` codes (that can be summed with `|`)
// see: https://developer.mozilla.org/en-US/docs/Web/Events/click
var button_to_buttons = {
  0: 1,
  1: 2,
  2: 4,
  3: 8,
  4: 16
};

var handlers = {
  'mousedown': [],
  'mouseup': [],
  'click': [],
  'keydown': [],
  'keyup': [],
  'keypress': []
};

// wrap existing addEventListener, if one exists
if (this.addEventListener)
  var orig_addEventListener = this.addEventListener;

this.addEventListener = function(evt_name, fn) {
  if (evt_name in handlers)
    handlers[evt_name].push(fn);
  else if (orig_addEventListener)
    orig_addEventListener.apply(this, arguments);
};

bt3gui.addEventListener('mousebutton', function(btn, state, x, y) {
  var evt = {
    screenX: x,
    screenY: y,
    clientX: x,
    clientY: y,
    button: btn, // left=0, middle=1, right=2
    buttons: button_to_buttons[btn] // TODO: detect multiple buttons pressed
  };
  _setModifiers(evt);

  if (state == bt3gui.MOUSEDOWN) {
    _nameAndFire('mousedown', evt);
  }
  else if (state == bt3gui.MOUSEUP) {
    _nameAndFire('mouseup', evt);
    _nameAndFire('click', evt);
  }
});

bt3gui.addEventListener('keyboard', function(code, state) {
  var keyCode;
  if (code == 32 || (code >= 48 && code <= 57)) // space & number keys
    keyCode = code;
  else if (code >= 97 && code <= 122) // a-z
    keyCode = code - 32;
  else
    keyCode = null; // TODO: implement these (will require research, the other keys aren't a consistent delta)

  var evt = {
    which: keyCode,
    keyCode: keyCode,
    charCode: 0
  };
  _setModifiers(evt);

  var keypress_evt = {
    which: code,
    keyCode: code,
    charCode: code
  };
  _setModifiers(keypress_evt);

  // TODO: in the browser, if a key is held down then 'keydown' and 'keypress' fire repeatedly
  if (state == bt3gui.KEYDOWN) {
    _nameAndFire('keydown', evt);
    _nameAndFire('keypress', keypress_evt);
  }
  else if (state == bt3gui.KEYUP) {
    _nameAndFire('keyup', evt);
  }
});

function _nameAndFire(evt_name, evt) {
  evt.type = evt_name;
  handlers[evt.type].forEach(function(fn) {
    fn(evt);
  });
};

function _setModifiers(evt) {
  // TODO: implement .metaKey (not exposed in bt3gui.isModifierKeyPressed)
  evt.ctrlKey = bt3gui.isModifierKeyPressed(bt3gui.CTRL);
  evt.altKey = bt3gui.isModifierKeyPressed(bt3gui.ALT);
  evt.shiftKey = bt3gui.isModifierKeyPressed(bt3gui.SHIFT);
}
