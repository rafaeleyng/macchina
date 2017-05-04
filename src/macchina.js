export default class Macchina {
  constructor(states, options = {}) {
    // init
    this._options = options
    this._states = states
    this._currentState = undefined
    this._initProperties()

    // start the macchina
    this.transition('start')
  }

  /*
    states
  */
  _setCurrentState(state) {
    this._currentState = state
  }

  _getCurrentState() {
    return this._currentState
  }

  _findState(name) {
    const state = this._states.filter(item => item.name === name)[0]
    if (state) {
      return state
    }
    throw new Error(`[macchina] undefined state: ${name}`)
  }

  /*
    properties
  */
  _setProperty(name, value) {
    this._properties[name] = value
  }

  _initProperties() {
    this._properties = {}
    this._states.forEach(state => {
      for (const i in state.properties) {
        this._setProperty(i, undefined)
      }
    })
  }

  _setCurrentStateProperties() {
    // clean previous values
    this._initProperties()

    // set values for current state
    const state = this._getCurrentState()
    for (const i in state.properties) {
      this._setProperty(i, state.properties[i])
    }
  }

  /*
    public API
  */
  state() {
    return this._getCurrentState().name
  }

  properties() {
    return this._properties
  }

  transition(stateName, transitionOptions = {}) {
    const changeStateFunction = () => {
      this._setCurrentState(this._findState(stateName))
      const stateAfter = this._getCurrentState()
      if (this._options.debug) {
        console.log('currentState:', stateAfter.name)
      }
      this._setCurrentStateProperties()

      let didTransition = false
      // async transition
      const asyncTransition = nextStateAsync => {
        if (!didTransition) {
          didTransition = true
          this.transition(nextStateAsync)
        }
      }

      if (typeof stateAfter.callback === 'string') {
        const nextStateName = stateAfter.callback
        stateAfter.callback = () => nextStateName
      }

      if (stateAfter.callback) {
        // sync transition
        const nextStateSync = stateAfter.callback(asyncTransition)
        if (nextStateSync && !didTransition) {
          didTransition = true
          this.transition(nextStateSync)
        }
      }
    }

    const stateBefore = this._getCurrentState()
    const isInitialState = stateBefore === undefined
    if (!isInitialState) {
      clearTimeout(stateBefore.__timeoutID)
    }

    let timeout
    if (transitionOptions.immediate) {
      timeout = 0
    } else if (isInitialState) {
      timeout = 0
    } else {
      timeout = stateBefore.timeout ? stateBefore.timeout : 0
    }

    // console.log('timeout', timeout, stateBefore)
    if (timeout === 0) {
      changeStateFunction()
    } else {
      stateBefore.__timeoutID = setTimeout(changeStateFunction, timeout)
    }
  }

  immediateTransition(stateName) {
    this.transition(stateName, { immediate: true })
  }
}
