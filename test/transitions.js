import assert from 'assert'
import sinon from 'sinon'
import statesData from './data/states0'
import Macchina from '../src/macchina'

let macchina
let callback0
let callback1
let callback2
let callback3

describe('transitions', () => {
  beforeEach(() => {
    const data = statesData();
    ({ callback0, callback1, callback2, callback3 } = data)
    macchina = new Macchina(data.states)
  })

  it('transition changes state correctly', () => {
    // act
    macchina.transition('second')

    // assert
    assert.equal(macchina.getCurrentStateName(), 'second')
  })

  it('transition throws if state doesn\'t exist', () => {
    // assert
    assert.throws(() => macchina.transition('no-cigar'), e => e.message === '[macchina] undefined state: no-cigar')
  })

  it('immediateTransition changes state correctly', () => {
    // act
    macchina.immediateTransition('second')

    // assert
    assert.equal(macchina.getCurrentStateName(), 'second')
  })

  it('immediateTransition throws if state doesn\'t exist', () => {
    // assert
    assert.throws(() => macchina.immediateTransition('no-cigar'), e => e.message === '[macchina] undefined state: no-cigar')
  })

  // it('dunno', (done) => {
  //   // arrange
  //   callback1 = sinon.stub()
  //   // callback1 = () => console.log('### callback 1')
  //
  //   const states = [
  //     {
  //       name: 'start',
  //     },
  //     {
  //       name: 'second',
  //       callback: callback1,
  //       timeout: 10,
  //     },
  //   ]
  //
  //   macchina = new Macchina(states)
  //
  //   // assert
  //   assert.equal(callback1.callCount, 0)
  //
  //   setTimeout(() => {
  //     assert.equal(callback1.callCount, 1)
  //     done()
  //   }, 50)
  // })
})
