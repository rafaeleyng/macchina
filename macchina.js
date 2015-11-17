(function(factory) {
  // establish the root object
  var root = (typeof self == 'object' && self.self == self && self) ||
            (typeof global == 'object' && global.global == global && global);

  // node.js/commonjs
  if (typeof exports !== 'undefined') {
    module.exports = factory(root);
  // browser global
  } else {
    root.Macchina = factory(root);
  }

}(function(root) {
  var Macchina = function(states, options) {
    this._options = options || {};
    this._states = states;
    this._initProperties();
    this._initCurrentState();
    this.transition('start');
  };

  /*
    states
  */
  Macchina.prototype._initCurrentState = function() {
    this._state = undefined;
  };

  Macchina.prototype._setCurrentState = function(state) {
    this._state = state;
  };

  Macchina.prototype._getCurrentState = function() {
    return this._state;
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

  /*
    property
  */
  Macchina.prototype._propName = function(prefix, suffix) {
    return prefix + suffix.charAt(0).toUpperCase() + suffix.slice(1);;
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

  /*
    state properties
  */
  Macchina.prototype._createPropertiesObject = function(properties) {
    var temp = {};
    if (typeof properties === 'string') {
      temp[properties] = true;
      return temp;
    } else if (Array.isArray(properties)) {
      properties.forEach(function(property) {
        temp[property] = true;
      });
      return temp;
    }
    return properties;
  };

  Macchina.prototype._initProperties = function() {
    this._properties = {};
    this._states.forEach(function(state) {
      for (var i in state.properties) {
        var stateProperties = this._createPropertiesObject(state.properties[i]);
        for (var j in stateProperties) {
          this._initProperty(this._propName(i, j));
        }
      }
    }.bind(this));
  };

  Macchina.prototype._setStateProperties = function() {
    this._cleanStateProperties();
    var state = this._getCurrentState();
    for (var i in state.properties) {
      var stateProperties = this._createPropertiesObject(state.properties[i]);
      for (var j in stateProperties) {
        this._setProperty(this._propName(i, j), stateProperties[j]);
      }
    }
  };

  Macchina.prototype._cleanStateProperties = function() {
    for (var i in this._properties) {
      this._setProperty(i, undefined);
    }
  };

  /*
    public API
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
      var asyncTransition = function(nextStateAsync) {
        if (!didTransition) {
          didTransition = true;
          this.transition(nextStateAsync);
        }
      }.bind(this);

      if (stateAfterChange.callback) {
        // sync transition
        var nextStateSync = stateAfterChange.callback(asyncTransition);
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

  return Macchina;
}));
