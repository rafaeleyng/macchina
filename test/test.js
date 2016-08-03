import test from 'ava'
import Macchina from '../src/macchina.js'

const states = [
  {
    name: 'start',
    properties: {
      show: 'someButton',
    },
  },
  {
    name: 'second',
    properties: {
      show: ['otherButton'],
    },
  },
]

let macchina

test.beforeEach(() => {
  macchina = new Macchina(states)
})

test('initial state is "start"', t => {
  t.is(macchina.state(), 'start')
})

test.cb('transition to other state changes the state accordingly', t => {
  macchina.transition('second')
  t.is(macchina.state(), 'second')
})

test.cb('transition to other state changes the state accordingly TEMP', t => {
  t.plan(1)
  macchina.transition('second')

  setTimeout(() => {
    t.is(macchina.state(), 'second')
    t.end()
  })
})
