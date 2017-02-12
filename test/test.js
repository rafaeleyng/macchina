import test from 'ava'
import Macchina from '../src/macchina.js'

let macchina

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

test.beforeEach(() => {
  macchina = new Macchina(regularModeStates)
})

/*
  state changes
*/
test('initial state is "start"', t => {
  t.is(macchina.getCurrentStateName(), 'start')
})

test('transition changes state correctly when there is no timeout in state', t => {
  macchina.transition('second')
  t.is(macchina.getCurrentStateName(), 'second')
})

test('immediateTransition changes state correctly', t => {
  macchina.immediateTransition('second')
  t.is(macchina.getCurrentStateName(), 'second')
})

/*
  properties - regular mode
*/
const assertBooleanProperties = (t, macchina) => {
  t.is(macchina.getProperties().showSome, true)
  t.is(macchina.getProperties().showOther, undefined)
  t.is(macchina.getProperties().showAnother, undefined)

  macchina.immediateTransition('second')

  t.is(macchina.getProperties().showSome, true)
  t.is(macchina.getProperties().showOther, true)
  t.is(macchina.getProperties().showAnother, true)

  macchina.immediateTransition('third')

  t.is(macchina.getProperties().showSome, undefined)
  t.is(macchina.getProperties().showOther, true)
  t.is(macchina.getProperties().showAnother, undefined)

  macchina.immediateTransition('fourth')

  t.is(macchina.getProperties().showSome, true)
  t.is(macchina.getProperties().showOther, undefined)
  t.is(macchina.getProperties().showAnother, undefined)

  macchina.immediateTransition('fifth')

  t.is(macchina.getProperties().showSome, undefined)
  t.is(macchina.getProperties().showOther, true)
  t.is(macchina.getProperties().showAnother, true)
}

const assertRegularProperties = (t, macchina) => {
  t.is(macchina.getProperties().textTitle, 'Start title')
  t.is(macchina.getProperties().textSubtitle, undefined)
  t.is(macchina.getProperties().textComment, undefined)

  macchina.immediateTransition('second')

  t.is(macchina.getProperties().textTitle, undefined)
  t.is(macchina.getProperties().textSubtitle, 'Second subtitle')
  t.is(macchina.getProperties().textComment, undefined)

  macchina.immediateTransition('third')

  t.is(macchina.getProperties().textTitle, 'Third title')
  t.is(macchina.getProperties().textSubtitle, 'Third subtitle')
  t.is(macchina.getProperties().textComment, undefined)

  macchina.immediateTransition('fourth')

  t.is(macchina.getProperties().textTitle, undefined)
  t.is(macchina.getProperties().textSubtitle, undefined)
  t.is(macchina.getProperties().textComment, 'no title or subtitle on fourth')

  macchina.immediateTransition('fifth')

  t.is(macchina.getProperties().textTitle, undefined)
  t.is(macchina.getProperties().textSubtitle, undefined)
  t.is(macchina.getProperties().textComment, undefined)
}

test('boolean properties are set correctly in regular mode', t => {
  assertBooleanProperties(t, macchina)
})

test('regular properties are set correctly in regular mode', t => {
  assertRegularProperties(t, macchina)
})
