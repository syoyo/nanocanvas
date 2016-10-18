// bt3gui namespace
this.bt3gui = {};

bt3gui._evt_handlers = {
  mousebutton: [],
  mousemove: [],
  wheel: [],
  keyboard: []
};

bt3gui.SHIFT = 65306;
bt3gui.CTRL = 65307;
bt3gui.ALT = 65308;

bt3gui.KEYUP = 0;
bt3gui.KEYDOWN = 1;
bt3gui.MOUSEUP = 0;
bt3gui.MOUSEDOWN = 1;

bt3gui.addEventListener = function(evt_name, fn) {
  var handlers = bt3gui._evt_handlers;
  handlers = handlers[evt_name].push(fn);
};

bt3gui.emit = function(evt_name) {
  var args = Array.prototype.slice.call(arguments, 1);
  var handlers = bt3gui._evt_handlers[evt_name];
  handlers.forEach(function(handler) {
    handler.apply(null, args);
  });
};
