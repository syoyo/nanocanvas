// bt3gui namespace
this.bt3gui = {};

bt3gui._evt_handlers = {
  mousebutton: [],
  mousemove: [],
  wheel: [],
  keyboard: []
};

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
