var Macchina = function(states, options) {
  this._options = options || {};
  this._states = states;
  this._initProperties();
  this._initCurrentState();
  this._initCurrentState();
  this.transition('start');
};

/*
  private
*/
Macchina.prototype._initCurrentState = function() {
  this._state = undefined;
};

Macchina.prototype._getCurrentState = function() {
  return this._state;
};

Macchina.prototype._setCurrentState = function(state) {
  this._state = state;
};

Macchina.prototype._findState = function(name) {
  var state = this._states.filter(function(item) {
    return item.name === name;
  })[0];
  if (state === undefined) {
    throw new Error('Undefined state: ' + name);
  }
  return state;
};

Macchina.prototype._propName = function(prefix, suffix) {
  return prefix + suffix.charAt(0).toUpperCase() + suffix.slice(1);;
};

Macchina.prototype._initProperties = function() {
  this._properties = {};
  this._states.forEach(function(state) {
    for (var i in state.properties) {
      for (var j in state.properties[i]) {
        this._initProperty(this._propName(i, j));
      }
    }
  }.bind(this));
};

Macchina.prototype._initProperty = function(name) {
  this._properties[name] = undefined;
};

Macchina.prototype._setProperty = function(name, value) {
  this._properties[name] = value;
};

Macchina.prototype._getProperty = function(name) {
  return this._properties[name];
};

Macchina.prototype._cleanStateProperties = function() {
  for (var i in this._properties) {
    this._setProperty(i, undefined);
  }
};

Macchina.prototype._setStateProperties = function() {
  this._cleanStateProperties();

  var state = this._getCurrentState();
  for (var i in state.properties) {
    for (var j in state.properties[i]) {
      var propName = this._propName(i, j);
      var propValue = state.properties[i][j];
      this._setProperty(propName, propValue);
    }
  }
};

/*
  public
*/
Macchina.prototype.state = function() {
  return this._getCurrentState().name;
};

Macchina.prototype.properties = function() {
  return this._properties;
};

Macchina.prototype.transition = function(stateName, options) {
  options = options || {};

  var changeStateFunction = function() {
    this._setCurrentState(this._findState(stateName));
    var stateAfterChange = this._getCurrentState();
    if (this._options.debug) {
      console.log('currentState:', stateAfterChange.name);
    }
    this._setStateProperties();

    var didTransition = false;
    // async transition
    var cb = function(nextStateAsync) {
      if (!didTransition) {
        didTransition = true;
        this.transition(nextStateAsync);
      }
    }.bind(this);

    if (stateAfterChange.transition) {
      // sync transition
      var nextStateSync = stateAfterChange.transition(cb);
      if (nextStateSync && !didTransition) {
        didTransition = true;
        this.transition(nextStateSync);
      }
    }
  }.bind(this);

  var stateBeforeChange = this._getCurrentState();
  stateBeforeChange && clearTimeout(stateBeforeChange._timeoutID);
  var timeout = options.immediate ? 0 : (stateBeforeChange ? stateBeforeChange.timeout : 0);

  if (timeout === 0) {
    changeStateFunction();
  } else {
    stateBeforeChange._timeoutID = setTimeout(changeStateFunction, timeout);
  }
};

Macchina.prototype.immediateTransition = function(stateChange) {
  this.transition(stateChange, {immediate: true});
};

Macchina.prototype.immediate = Macchina.prototype.immediateTransition;
