Macchina
--------

A Finite States Machine to track properties that change over time.

## Install

```
npm install macchina
```

## Usage

You can use Macchina to organize whatever code that looks like you are transitioning between a bunch of different *states* (think of a state here as *the way the things are in a particular moment*).

For instance, you can organize a piece of UI, like a form that may have some different states, i.e., how it looks/works in different moments like before submitting, while is being submitted and after submission. Macchina allow you to work declaratively with your UI.

1. Define your UI states in a piece of paper or in your head. You have to define the possible states of your UI (and give a name for each state) and the transitions between them:

  ![macchina fsm demo](https://cloud.githubusercontent.com/assets/4842605/12216467/da7c099c-b6c9-11e5-938c-69ca366b354d.png)

1. Transpose your UI states to Javascript code. Use `properties` to describe how you want things look/behave (note that you have to define a state called `'start'`, that will be the first state called):

  ```javascript
var states = [
  {
    name: 'start',
    properties: {
      showUserForm: true,
      statusText: 'Create your user'
    }
  },
  {
    name: 'save',
    callback: function(asyncTransition) {
      userService.save()
        .done(function() {
          asyncTransition('done');
        })
      ;
    },
    properties: {
      showLoader: true
    }
  },
  {
    name: 'done',
    properties: {
      showUserForm: true,
      statusText: 'User created!'
    }
  }
];
```

1. Initialize your Macchina instance, passing the states:

  ```javascript
var macchina = new Macchina(states);
```

1. Bind Macchina state transitions to appropriate UI actions:

  ```javascript
saveButton.addEventListener('click', () => macchina.transition('save'));
```

## States

When defining a state, you can pass the following configurations:

```javascript
{
  name: 'theStateName',
  callback: function() { /* some code */}, // or 'nextStateName'
  timeout: milliseconds,
  properties: {},
}
```

- `name`: uniquely identifies the state inside this Macchina instance. Used in transitions to specify the target state.

- `callback`:
  - a function that will be executed immediately (or after `timeout` delay) when the Macchina instance is transitioned to this state. Inside this function, you can:
    - perform any custom logic and take a callback to make an asynchronous transition, like after receiving data from AJAX. Just call the callback passing the target state name
    - perform any custom logic and return a state name to make a synchronous transition
  - or a string, with the name of the state to where you want to transition to, synchronously. Equivalent to `function() { return 'nextStateName'; }``

- `timeout`: if specified, it will delay the call to the state callback. For instance, if you want to stay in a state for 5 seconds (showing a message, or something) and then automatically transition to another, you can set `timeout: 5000` and `callback: 'targetStateName'`.

- `properties`: see section **How to define properties values**.

### Current State

You can get the current state name by calling `macchina.getCurrentStateName()`.


## How to define properties values

You should only set the properties values that you want defined in a particular state. All properties values not specified in that state will be `undefined`.

```javascript
var states = [
  {
    name: 'saving',
    properties: {
      showLoader: true,
      showMessage: true,
      message 'Wait while saving...'
    }
  },
  {
    name: 'done',
    properties: {
      showUserForm: true,
      showMessage: true,
      message 'Success!'
    }
  },
  // ...
];
```

This will generate a `properties` object inside the Macchina instance, like bellow, whose values will be updated correctly at each state:

```javascript
{
  showLoader: undefined,
  showUserForm: undefined,
  showMessage: undefined,
  message: undefined
};
```

Note that **all properties names are arbitrary values** - you should name them anything that makes sense for you.  When you want `false` values you actually don't have to specify, since Macchina will automatically set unspecified values to `undefined`, which is a *falsy* value.

When you transition to any state, the properties values specified in that state will be set, and everything else will be `undefined`. In the state named `'done'`, properties would be:

```javascript
{
  showLoader: undefined,
  showUserForm: true,
  showMessage: true,
  message 'Success!'
};
```

The way to consume these properties is call `macchina.properties().showLoader` etc.

Note that Macchina won't show or hide the user form or change anything in your UI by itself. It will only keep track of the properties values for each state and take care of synchronous and asynchronous transitions between the states.

To actually change things in your UI you should write code to do that (by consuming `macchina.properties()` and acting appropriately) or use an adapter to some data-bind technology (see **Adapters** section).


## Transitions

There are several ways to transition between states. A transition can happen automatically or by some action, like user clicking in a button.

1. setting `callback` directly to a state name

  This is useful basically for better organizing your code. All the state will do is to call the next. Is equivalent to having a function that simply returns the next state name.

  ```javascript
  {
    name: 'start', // mandatory state name, is the first state that Macchina will call
    callback: 'myFirstActualState'
  }
  ```

1. `return 'myNextStateName'` in the state `callback` function

  This is the way to go if all you want to do in a state is to **perform some synchronous task** and then transition to another state.

  ```javascript
  {
    name: 'start', // mandatory state name, is the first state that Macchina will call
    callback: () => {
      // do stuff
      return 'myFirstActualState'
    }
  }
  ```

1. receive and invoke a callback function in the state's definition `callback` function, passing the next state as a parameter

  This is the way to go if all you want to do in a state is to **perform some asynchronous task ** and then transition to another state.

  ```javascript
  {
    name: 'start', // mandatory state name, is the first state that Macchina will call
    callback: cb => {
      someAsyncCall()
        .then(() => cb('myFirstActualState'))
    }
  }
  ```

1. `macchina.transition(stateName)`

  This is the way to go **to handle user input**, like going to next state when the user clicks the "Next" button. But note: this method will only work if your current state won't perform any automatic transition (caused by the `timeout` property). See `macchina.immediateTransition`.


  ```javascript
  saveButton.addEventListener('click', () => macchina.transition('performingSave'));
  ```

<!-- 1. `asyncTransition(stateName)` callback

  This is the way to go **to handle async calls**, like a state that blocks some inputs while waits for server response. Inside a state `callback`, you can receive a `asyncTransition` and call it passing the next state name.

  ```javascript
  saveButton.addEventListener('click', () => macchina.transition('savingState'));
  ``` -->

1. `macchina.immediateTransition(stateName)`

  This is the way to go **to cancel an automatic transition** (via the `timeout` property) **and make a transition to happen immediately**. For instance,  want to show a message for 5 seconds and dismiss it. You can create a state for that with  `timeout: 5000` and `callback: 'nextStateName'`. But you can provide a button "Dismiss now", and call `immediateTransition('nextStateName')` when that button is clicked.

  ```javascript
  dismissButton.addEventListener('click', () => macchina.immediateTransition('afterWelcome'));
  ```
