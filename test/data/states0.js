import sinon from 'sinon'

export default () => {
  const callback0 = sinon.stub()
  const callback1 = sinon.stub()
  const callback2 = sinon.stub()
  const callback3 = sinon.stub()
  const callback4 = sinon.stub()

  const states = [
    {
      name: 'start',
      callback: callback0,
      properties: {
        showSome: true,
        textTitle: 'Start title',
      },
    },
    {
      name: 'first',
      callback: callback1,
      properties: {
        showOther: true,
        showAnother: true,
      },
    },
    {
      name: 'second',
      callback: callback2,
      properties: {
        showSome: true,
        showOther: true,
        showAnother: true,
        textSubtitle: 'Second subtitle',
      },
    },
    {
      name: 'third',
      callback: callback3,
      properties: {
        showOther: true,
        textTitle: 'Third title',
        textSubtitle: 'Third subtitle',
      },
    },
    {
      name: 'fourth',
      callback: callback4,
      properties: {
        showSome: true,
        textComment: 'no title or subtitle on fourth',
      },
    },
  ]

  return {
    states,
    callback0,
    callback1,
    callback2,
    callback3,
    callback4,
  }
}
