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
    assert.strictEqual(macchina.properties().showSome, true)
    assert.strictEqual(macchina.properties().showOther, undefined)
    assert.strictEqual(macchina.properties().showAnother, undefined)
    assert.strictEqual(macchina.properties().textTitle, 'Start title')
    assert.strictEqual(macchina.properties().textSubtitle, undefined)
    assert.strictEqual(macchina.properties().textComment, undefined)

    // act
    macchina.transition('first')

    // assert
    assert.strictEqual(macchina.properties().showSome, undefined)
    assert.strictEqual(macchina.properties().showOther, true)
    assert.strictEqual(macchina.properties().showAnother, true)
    assert.strictEqual(macchina.properties().textTitle, undefined)
    assert.strictEqual(macchina.properties().textSubtitle, undefined)
    assert.strictEqual(macchina.properties().textComment, undefined)

    // act
    macchina.transition('second')

    // assert
    assert.strictEqual(macchina.properties().showSome, true)
    assert.strictEqual(macchina.properties().showOther, true)
    assert.strictEqual(macchina.properties().showAnother, true)
    assert.strictEqual(macchina.properties().textTitle, undefined)
    assert.strictEqual(macchina.properties().textSubtitle, 'Second subtitle')
    assert.strictEqual(macchina.properties().textComment, undefined)

    // act
    macchina.transition('third')

    // assert
    assert.strictEqual(macchina.properties().showSome, undefined)
    assert.strictEqual(macchina.properties().showOther, true)
    assert.strictEqual(macchina.properties().showAnother, undefined)
    assert.strictEqual(macchina.properties().textTitle, 'Third title')
    assert.strictEqual(macchina.properties().textSubtitle, 'Third subtitle')
    assert.strictEqual(macchina.properties().textComment, undefined)

    // act
    macchina.transition('fourth')

    // assert
    assert.strictEqual(macchina.properties().showSome, true)
    assert.strictEqual(macchina.properties().showOther, undefined)
    assert.strictEqual(macchina.properties().showAnother, undefined)
    assert.strictEqual(macchina.properties().textTitle, undefined)
    assert.strictEqual(macchina.properties().textSubtitle, undefined)
    assert.strictEqual(macchina.properties().textComment, 'no title or subtitle on fourth')
  })
})
