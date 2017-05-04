import assert from 'assert'
import statesData0 from './data/states0'
import statesData1 from './data/states1'
import Macchina from '../src/macchina'

let macchina

describe('properties', () => {
  beforeEach(() => {
    const data = statesData0()
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

  it('should cleanup properties between transitions', () => {
    const data = statesData1()
    macchina = new Macchina(data.states)

    // assert
    assert.strictEqual(macchina.properties().prop0, 'this')
    assert.strictEqual(macchina.properties().prop1, 'state')
    assert.strictEqual(macchina.properties().prop2, 'sure')
    assert.strictEqual(macchina.properties().prop3, 'has')
    assert.strictEqual(macchina.properties().prop4, 'a')
    assert.strictEqual(macchina.properties().prop5, 'lot')
    assert.strictEqual(macchina.properties().prop6, 'of')
    assert.strictEqual(macchina.properties().prop7, 'properties')

    // act
    macchina.transition('first')

    // assert
    assert.strictEqual(macchina.properties().prop0, undefined)
    assert.strictEqual(macchina.properties().prop1, undefined)
    assert.strictEqual(macchina.properties().prop2, undefined)
    assert.strictEqual(macchina.properties().prop3, undefined)
    assert.strictEqual(macchina.properties().prop4, undefined)
    assert.strictEqual(macchina.properties().prop5, undefined)
    assert.strictEqual(macchina.properties().prop6, undefined)
    assert.strictEqual(macchina.properties().prop7, undefined)
  })
})
