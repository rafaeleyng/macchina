var Macchina = function(states, options) {
  this.options = options || {};
  this.properties = {};
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
    if (this.options.debug) {
      console.log('currentState:', stateAfterChange.name || stateAfterChange);
    }
    this.setProperties();

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

Macchina.prototype.setProperties = function() {
  var state = this.getCurrentState();
  for (var i in state.properties) {
    // transform single string to array
    (typeof state.properties[i] === 'string') && (state.properties[i] = [state.properties[i]]);
    console.log(state.name, i, state.properties[i]);
    // this.setProperty()
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

Macchina.prototype.setProperty = function(property, value) {
  this.properties[property] = value;
};
