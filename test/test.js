import assert from 'assert'
import Macchina from '../src/macchina.js'

const regularModeStates = [
  {
    name: 'start',
    properties: {
      showSome: true,
      textTitle: 'Start title',
    },
  },
  {
    name: 'second',
    properties: {
      showSome: true,
      showOther: true,
      showAnother: true,
      textSubtitle: 'Second subtitle',
    },
  },
  {
    name: 'third',
    properties: {
      showOther: true,
      textTitle: 'Third title',
      textSubtitle: 'Third subtitle',
    },
  },
  {
    name: 'fourth',
    properties: {
      showSome: true,
      textComment: 'no title or subtitle on fourth',
    },
  },
  {
    name: 'fifth',
    properties: {
      showOther: true,
      showAnother: true,
    },
  },
]

describe('macchina', () => {
  let macchina

  beforeEach(() => {
    macchina = new Macchina(regularModeStates)
  })

  describe('states', () => {
    it('initial state is "start"', () => {
      assert.equal(macchina.getCurrentStateName(), 'start')
    })
  })

  describe('transitions', () => {
    it('transition changes state correctly when there is no timeout in state', () => {
      macchina.transition('second')
      assert.equal(macchina.getCurrentStateName(), 'second')
    })

    it('immediateTransition changes state correctly', () => {
      macchina.immediateTransition('second')
      assert.equal(macchina.getCurrentStateName(), 'second')
    })
  })

  describe('properties', () => {
    it('should set properties correctly', () => {
      assert.strictEqual(macchina.getProperties().showSome, true)
      assert.strictEqual(macchina.getProperties().showOther, undefined)
      assert.strictEqual(macchina.getProperties().showAnother, undefined)
      assert.strictEqual(macchina.getProperties().textTitle, 'Start title')
      assert.strictEqual(macchina.getProperties().textSubtitle, undefined)
      assert.strictEqual(macchina.getProperties().textComment, undefined)

      macchina.immediateTransition('second')

      assert.strictEqual(macchina.getProperties().showSome, true)
      assert.strictEqual(macchina.getProperties().showOther, true)
      assert.strictEqual(macchina.getProperties().showAnother, true)
      assert.strictEqual(macchina.getProperties().textTitle, undefined)
      assert.strictEqual(macchina.getProperties().textSubtitle, 'Second subtitle')
      assert.strictEqual(macchina.getProperties().textComment, undefined)

      macchina.immediateTransition('third')

      assert.strictEqual(macchina.getProperties().showSome, undefined)
      assert.strictEqual(macchina.getProperties().showOther, true)
      assert.strictEqual(macchina.getProperties().showAnother, undefined)
      assert.strictEqual(macchina.getProperties().textTitle, 'Third title')
      assert.strictEqual(macchina.getProperties().textSubtitle, 'Third subtitle')
      assert.strictEqual(macchina.getProperties().textComment, undefined)

      macchina.immediateTransition('fourth')

      assert.strictEqual(macchina.getProperties().showSome, true)
      assert.strictEqual(macchina.getProperties().showOther, undefined)
      assert.strictEqual(macchina.getProperties().showAnother, undefined)
      assert.strictEqual(macchina.getProperties().textTitle, undefined)
      assert.strictEqual(macchina.getProperties().textSubtitle, undefined)
      assert.strictEqual(macchina.getProperties().textComment, 'no title or subtitle on fourth')

      macchina.immediateTransition('fifth')

      assert.strictEqual(macchina.getProperties().showSome, undefined)
      assert.strictEqual(macchina.getProperties().showOther, true)
      assert.strictEqual(macchina.getProperties().showAnother, true)
      assert.strictEqual(macchina.getProperties().textTitle, undefined)
      assert.strictEqual(macchina.getProperties().textSubtitle, undefined)
      assert.strictEqual(macchina.getProperties().textComment, undefined)      
    })
  })
})
