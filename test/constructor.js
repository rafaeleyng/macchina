import assert from 'assert'
import Macchina from '../src/macchina'

describe('constructor', () => {
  it('should be able to create several independent instances', () => {
    // arrange
    const macchina1 = new Macchina([{ name: 'start' }])
    const macchina2 = new Macchina([{ name: 'start' }, { name: 'other' }])
    const macchina3 = new Macchina([{ name: 'start' }, { name: 'different' }])

    // act
    macchina2.transition('other')
    macchina3.transition('different')

    // assert
    assert.equal('start', macchina1.getCurrentStateName())
    assert.equal('other', macchina2.getCurrentStateName())
    assert.equal('different', macchina3.getCurrentStateName())
  })
})
