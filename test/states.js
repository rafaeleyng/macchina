import assert from 'assert'
import statesData from './data/states0'
import Macchina from '../src/macchina'

let macchina
let callback0
let callback1
let callback2
let callback3

describe('states', () => {
  beforeEach(() => {
    const data = statesData();
    ({ callback0, callback1, callback2, callback3 } = data)
    macchina = new Macchina(data.states)
  })

  it('initial state is "start"', () => {
    // assert
    assert.equal(macchina.getCurrentStateName(), 'start')
  })

  it('callback is called only when transition occurs', () => {
    // assert
    assert.equal(macchina.getCurrentStateName(), 'start')
    assert.equal(callback0.callCount, 1)
    assert.equal(callback1.callCount, 0)
    assert.equal(callback2.callCount, 0)

    // act
    macchina.transition('first')

    // assert
    assert.equal(macchina.getCurrentStateName(), 'first')
    assert.equal(callback0.callCount, 1)
    assert.equal(callback1.callCount, 1)
    assert.equal(callback2.callCount, 0)

    // act
    macchina.transition('second')

    // assert
    assert.equal(macchina.getCurrentStateName(), 'second')
    assert.equal(callback0.callCount, 1)
    assert.equal(callback1.callCount, 1)
    assert.equal(callback2.callCount, 1)
  })
})
