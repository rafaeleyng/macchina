export default class Macchina {
  constructor(states, options = {}) {
    // init
    this.options = options
    this.states = states
    this.initProperties()
    this.initCurrentState()

    // start the macchina
    this.transition('start')
  }

  /*
    states
  */
  initCurrentState() {
    this.currentState = undefined
  }

  setCurrentState(state) {
    this.currentState = state
  }

  getCurrentState() {
    return this.currentState
  }

  findState(name) {
    const state = this.states.filter(item => item.name === name)[0]
    if (state === undefined) {
      throw new Error(`[macchina] undefined state: ${name}`)
    }
    return state
  }

  /*
    property
  */
  propName(prefix, suffix) {
    return prefix + suffix.charAt(0).toUpperCase() + suffix.slice(1)
  }

  setProperty(name, value) {
    this.properties[name] = value
  }

  getProperty(name) {
    return this.properties[name]
  }

  /*
    state properties
  */
  createPropertiesObject(properties) {
    const temp = {}
    if (typeof properties === 'string') {
      temp[properties] = true
      return temp
    } else if (Array.isArray(properties)) {
      properties.forEach(property => {
        temp[property] = true
      })
      return temp
    }
    return properties
  }

  initProperties() {
    this.properties = {}
    this.states.forEach(state => {
      for (const i in state.properties) {
        this.setProperty(i, undefined)
      }
    })
  }

  setCurrentStateProperties() {
    // clean previous values
    this.initProperties()
    // set values for current state
    const state = this.getCurrentState()
    for (const i in state.properties) {
      this.setProperty(i, state.properties[i])
    }
  }

  /*
    public API
  */
  getCurrentStateName() {
    return this.getCurrentState().name
  }

  getProperties() {
    return this.properties
  }

  transition(stateName, transitionOptions = {}) {
    const changeStateFunction = () => {
      this.setCurrentState(this.findState(stateName))
      const stateAfter = this.getCurrentState()
      if (this.options.debug) {
        console.log('currentState:', stateAfter.name)
      }
      this.setCurrentStateProperties()

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

    const stateBefore = this.getCurrentState()
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
