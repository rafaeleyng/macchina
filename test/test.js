import test from 'ava'
import Macchina from '../src/macchina.js'

const states = [
  {
    name: 'start',
    properties: {
      show: {
        some: true,
      },
      text: {
        title: 'Start title',
      },
    },
  },
  {
    name: 'second',
    properties: {
      show: ['some', 'other', 'another'],
      text: {
        subtitle: 'Second subtitle',
      },
    },
  },
  {
    name: 'third',
    properties: {
      show: ['other'],
      text: {
        title: 'Third title',
        subtitle: 'Third subtitle',
      },
    },
  },
  {
    name: 'fourth',
    properties: {
      show: 'some',
      text: {
        comment: 'no title or subtitle on fourth',
      },
    },
  },
  {
    name: 'fifth',
    properties: {
      show: ['other', 'another'],
    },
  },
]

let macchina

test.beforeEach(() => {
  macchina = new Macchina(states)
})

/*
  state changes
*/
test('initial state is "start"', t => {
  t.is(macchina.state(), 'start')
})

test('immediateTransition changes state correctly', t => {
  macchina.immediateTransition('second')
  t.is(macchina.state(), 'second')
})

/*
  properties
*/
test('boolean properties are set correctly in concat mode', t => {
  t.is(macchina.properties().showSome, true)
  t.is(macchina.properties().showOther, undefined)
  t.is(macchina.properties().showAnother, undefined)

  macchina.immediateTransition('second')

  t.is(macchina.properties().showSome, true)
  t.is(macchina.properties().showOther, true)
  t.is(macchina.properties().showAnother, true)

  macchina.immediateTransition('third')

  t.is(macchina.properties().showSome, undefined)
  t.is(macchina.properties().showOther, true)
  t.is(macchina.properties().showAnother, undefined)

  macchina.immediateTransition('fourth')

  t.is(macchina.properties().showSome, true)
  t.is(macchina.properties().showOther, undefined)
  t.is(macchina.properties().showAnother, undefined)

  macchina.immediateTransition('fifth')

  t.is(macchina.properties().showSome, undefined)
  t.is(macchina.properties().showOther, true)
  t.is(macchina.properties().showAnother, true)
})

test('regular properties are set correctly in concat mode', t => {
  t.is(macchina.properties().textTitle, 'Start title')
  t.is(macchina.properties().textSubtitle, undefined)
  t.is(macchina.properties().textComment, undefined)

  macchina.immediateTransition('second')

  t.is(macchina.properties().textTitle, undefined)
  t.is(macchina.properties().textSubtitle, 'Second subtitle')
  t.is(macchina.properties().textComment, undefined)

  macchina.immediateTransition('third')

  t.is(macchina.properties().textTitle, 'Third title')
  t.is(macchina.properties().textSubtitle, 'Third subtitle')
  t.is(macchina.properties().textComment, undefined)

  macchina.immediateTransition('fourth')

  t.is(macchina.properties().textTitle, undefined)
  t.is(macchina.properties().textSubtitle, undefined)
  t.is(macchina.properties().textComment, 'no title or subtitle on fourth')

  macchina.immediateTransition('fifth')

  t.is(macchina.properties().textTitle, undefined)
  t.is(macchina.properties().textSubtitle, undefined)
  t.is(macchina.properties().textComment, undefined)
})
