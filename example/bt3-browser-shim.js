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

var MOUSE_UP = 0;
var MOUSE_DOWN = 1;

var handlers = {
  'mouseup': [],
  'mousedown': [],
  'click': []
};

// wrap existing addEventListener, if one exists
if (this.addEventListener)
  var orig_addEventListener = this.addEventListener;

this.addEventListener = function(evt_name, fn) {
  if (evt_name == 'mouseup' || evt_name == 'mousedown' || evt_name == 'click')
    handlers[evt_name].push(fn);
  else if (orig_addEventListener)
    orig_addEventListener.apply(this, arguments);
};

bt3gui.addEventListener('mousebutton', function(btn, state, x, y) {
  var evt = {
    // TODO: implement altKey, ctrlKey, shiftKey, metaKey booleans
    screenX: x,
    screenY: y,
    clientX: x,
    clientY: y,
    button: btn, // left=0, middle=1, right=2
    buttons: button_to_buttons[btn] // TODO: detect multiple buttons pressed
  };

  if (state == MOUSE_DOWN) {
    evt.type = 'mousedown';
    handlers.mousedown.forEach(function(fn) {
      fn(evt);
    });
  }
  else if (state == MOUSE_UP) {
    evt.type = 'mouseup';
    handlers.mouseup.forEach(function(fn) {
      fn(evt);
    });

    evt.type = 'click';
    handlers.click.forEach(function(fn) {
      fn(evt);
    });
  }
});
