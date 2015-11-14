var Macchina = function(states) {
  this.states = states;
  this._currentState = ko.observable();
  this.changeState(this.states.start);
};

Macchina.prototype.getCurrentState = function() {
  return this._currentState;
};

Macchina.prototype.setCurrentState = function(state) {
  this._currentState = state;
};

Macchina.prototype.logCurrentState = function() {
  console.log(this.getCurrentState().state);
};

Macchina.prototype.changeState = function(newState, withoutTimeout) {
  var self = this;

  var changeStateFunction = function() {
    self.setCurrentState(newState);
    self.logCurrentState();
  };

  changeStateFunction();
};
