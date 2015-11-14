var Macchina = function(options) {
  this.options = options || {};
};

Macchina.prototype.start = function(states) {
  this.states = states;
  this._currentState = ko.observable();
  if (!this.states.start) {
    throw new Error('Must define a `start` state');
  }
  this.transition(this.states.start);
};

Macchina.prototype.getCurrentState = function() {
  return this._currentState;
};

Macchina.prototype.setCurrentState = function(state) {
  this._currentState = state;
};

Macchina.prototype.transition = function(newState, options) {
  options = options || {};

  var changeStateFunction = function() {
    this.setCurrentState(newState);
    var stateAfterChange = this.getCurrentState();
    stateAfterChange.transition();
  }.bind(this);

  var stateBeforeChange = this.getCurrentState();
  stateBeforeChange && clearTimeout(stateBeforeChange._timeoutID);
  var timeout = options.skipTimeout ? 0 : stateBeforeChange ? stateBeforeChange.timeout : 0;

  if (timeout === 0) {
    changeStateFunction();
  } else {
    stateBeforeChange._timeoutID = setTimeout(changeStateFunction, timeout);
  }
};

Macchina.prototype.changeStateWithoutTimeout = function(stateChange) {
  this.changeState(stateChange, {skipTimeout: true});
};
