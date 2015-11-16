var Macchina = function(states, options) {
  this.options = options || {};
  this.properties = {};
  this.states = states;
  this._initCurrentState();
  var startState = this._findState('start');
  if (!startState) {
    throw new Error('Must define a `start` state');
  }
  this.transition('start');
};

/*
  private
*/
Macchina.prototype._initCurrentState = function() {
  this._currentState = undefined;
};

Macchina.prototype._getCurrentState = function() {
  return this._currentState;
};

Macchina.prototype._setCurrentState = function(state) {
  this._currentState = state;
};

Macchina.prototype._findState = function(name) {
  return this.states.filter(function(item) {
    return item.name === name;
  })[0];
};

Macchina.prototype._setProperties = function() {
  var state = this._getCurrentState();
  for (var i in state.properties) {
    // transform single string to array
    (typeof state.properties[i] === 'string') && (state.properties[i] = [state.properties[i]]);
    console.log(state.name, i, state.properties[i]);
    // this._setProperty()
  }

  // for (var i in elements) {
  //   var element = elements[i];
  //   var value = true;
  //   if(typeof element !== 'string') return;
  //   if ($.inArray(element, elementsTrue) === -1) {
  //     value = false;
  //   }
  //
  //   var propName = prefix + element.charAt(0).toUpperCase() + element.slice(1);
  //   if (this[propName] === undefined) {
  //     this[propName] = ko.observable();
  //   }
  //   this[propName](value);
  // }

};

Macchina.prototype._setProperty = function(property, value) {
  this.properties[property] = value;
};

/*
  public
*/
Macchina.prototype.getCurrentState = function() {
  return this._getCurrentState().name;
};

Macchina.prototype.transition = function(stateName, options) {
  console.log('transition', stateName);
  options = options || {};

  var changeStateFunction = function() {
    this._setCurrentState(this._findState(stateName));
    var stateAfterChange = this._getCurrentState();
    if (this.options.debug) {
      console.log('currentState:', stateAfterChange.name);
    }
    this._setProperties();

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
  this.changeState(stateChange, {immediate: true});
};
