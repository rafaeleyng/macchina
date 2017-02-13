import assert from 'assert'
import statesData from './data/states0'
import Macchina from '../src/macchina'

let macchina

describe('properties', () => {
  beforeEach(() => {
    const data = statesData();
    macchina = new Macchina(data.states)
  })

  it('should set properties correctly', () => {
    // assert
    assert.strictEqual(macchina.getProperties().showSome, true)
    assert.strictEqual(macchina.getProperties().showOther, undefined)
    assert.strictEqual(macchina.getProperties().showAnother, undefined)
    assert.strictEqual(macchina.getProperties().textTitle, 'Start title')
    assert.strictEqual(macchina.getProperties().textSubtitle, undefined)
    assert.strictEqual(macchina.getProperties().textComment, undefined)

    // act
    macchina.transition('first')

    // assert
    assert.strictEqual(macchina.getProperties().showSome, undefined)
    assert.strictEqual(macchina.getProperties().showOther, true)
    assert.strictEqual(macchina.getProperties().showAnother, true)
    assert.strictEqual(macchina.getProperties().textTitle, undefined)
    assert.strictEqual(macchina.getProperties().textSubtitle, undefined)
    assert.strictEqual(macchina.getProperties().textComment, undefined)

    // act
    macchina.transition('second')

    // assert
    assert.strictEqual(macchina.getProperties().showSome, true)
    assert.strictEqual(macchina.getProperties().showOther, true)
    assert.strictEqual(macchina.getProperties().showAnother, true)
    assert.strictEqual(macchina.getProperties().textTitle, undefined)
    assert.strictEqual(macchina.getProperties().textSubtitle, 'Second subtitle')
    assert.strictEqual(macchina.getProperties().textComment, undefined)

    // act
    macchina.transition('third')

    // assert
    assert.strictEqual(macchina.getProperties().showSome, undefined)
    assert.strictEqual(macchina.getProperties().showOther, true)
    assert.strictEqual(macchina.getProperties().showAnother, undefined)
    assert.strictEqual(macchina.getProperties().textTitle, 'Third title')
    assert.strictEqual(macchina.getProperties().textSubtitle, 'Third subtitle')
    assert.strictEqual(macchina.getProperties().textComment, undefined)

    // act
    macchina.transition('fourth')

    // assert
    assert.strictEqual(macchina.getProperties().showSome, true)
    assert.strictEqual(macchina.getProperties().showOther, undefined)
    assert.strictEqual(macchina.getProperties().showAnother, undefined)
    assert.strictEqual(macchina.getProperties().textTitle, undefined)
    assert.strictEqual(macchina.getProperties().textSubtitle, undefined)
    assert.strictEqual(macchina.getProperties().textComment, 'no title or subtitle on fourth')
  })
})
