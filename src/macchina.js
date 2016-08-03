export default class Macchina {
  constructor(states, options) {
    this._options = options || {}
    this._states = states
    this._initProperties()
    this._initCurrentState()
    this.transition('start')

    this.immediate = this.immediateTransition
  }

  /*
    states
  */
  _initCurrentState() {
    this._state = undefined
  }

  _setCurrentState(state) {
    this._state = state
  }

  _getCurrentState() {
    return this._state
  }

  _findState(name) {
    const state = this._states.find(item => item.name === name)
    if (state === undefined) {
      throw new Error(`Undefined state: ${name}`)
    }
    return state
  }

  /*
    property
  */
  _propName(prefix, suffix) {
    return prefix + suffix.charAt(0).toUpperCase() + suffix.slice(1)
  }

  _initProperty(name) {
    this._properties[name] = undefined
  }

  _setProperty(name, value) {
    this._properties[name] = value
  }

  _getProperty(name) {
    return this._properties[name]
  }

  /*
    state properties
  */
  _createPropertiesObject(properties) {
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

  _initProperties() {
    this._properties = {}
    this._states.forEach(state => {
      for (const i in state.properties) {
        const stateProperties = this._createPropertiesObject(state.properties[i])
        for (const j in stateProperties) {
          this._initProperty(this._propName(i, j))
        }
      }
    })
  }

  _setStateProperties() {
    this._cleanStateProperties()
    const state = this._getCurrentState()
    for (const i in state.properties) {
      const stateProperties = this._createPropertiesObject(state.properties[i])
      for (const j in stateProperties) {
        this._setProperty(this._propName(i, j), stateProperties[j])
      }
    }
  }

  _cleanStateProperties() {
    for (const i in this._properties) {
      this._setProperty(i, undefined)
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

  transition(stateName, options = {}) {
    const changeStateFunction = () => {
      this._setCurrentState(this._findState(stateName))
      const stateAfterChange = this._getCurrentState()
      if (this._options.debug) {
        console.log('currentState:', stateAfterChange.name)
      }
      this._setStateProperties()

      let didTransition = false
      // async transition
      const asyncTransition = nextStateAsync => {
        if (!didTransition) {
          didTransition = true
          this.transition(nextStateAsync)
        }
      }

      if (typeof stateAfterChange.callback === 'string') {
        const temp = stateAfterChange.callback
        stateAfterChange.callback = () => temp
      }

      if (stateAfterChange.callback) {
        // sync transition
        const nextStateSync = stateAfterChange.callback(asyncTransition)
        if (nextStateSync && !didTransition) {
          didTransition = true
          this.transition(nextStateSync)
        }
      }
    }

    const stateBeforeChange = this._getCurrentState()
    if (stateBeforeChange) {
      clearTimeout(stateBeforeChange._timeoutID)
    }

    let timeout
    if (options.immediate) {
      timeout = 0
    } else {
      timeout = stateBeforeChange ? stateBeforeChange.timeout : 0
    }

    if (timeout === 0) {
      changeStateFunction()
    } else {
      stateBeforeChange._timeoutID = setTimeout(changeStateFunction, timeout)
    }
  }

  immediateTransition(stateChange) {
    this.transition(stateChange, {immediate: true})
  }
}
