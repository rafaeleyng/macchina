var Macchina = function(states, options) {
  this.options = options || {};
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

Macchina.prototype.transition = function(state, options) {
  options = options || {};

  var changeStateFunction = function() {
    this.setCurrentState(state);
    var stateAfterChange = this.getCurrentState();
    var didTransition = false;

    // async transition
    var cb = function(nextStateAsync) {
      if (!didTransition) {
        didTransition = true;
        this.transition(nextStateAsync);
      }
    }.bind(this);

    // sync transition
    var nextStateSync = stateAfterChange.transition(cb);
    if (nextStateSync && !didTransition) {
      didTransition = true;
      this.transition(nextStateSync);
    }
  }.bind(this);

  var stateBeforeChange = this.getCurrentState();
  stateBeforeChange && clearTimeout(stateBeforeChange._timeoutID);
  var timeout = options.immediate ? 0 : (stateBeforeChange ? stateBeforeChange.timeout : 0);

  if (timeout === 0) {
    changeStateFunction();
  } else {
    stateBeforeChange._timeoutID = setTimeout(changeStateFunction, timeout);
  }
};

Macchina.prototype.immediateTransition = function(stateChange) {
  this.changeState(stateChange, {immediate: true});
};
