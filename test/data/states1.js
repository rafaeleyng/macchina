import sinon from 'sinon'

export default () => {
  const states = [
    {
      name: 'start',
      properties: {
        prop0: 'this',
        prop1: 'state',
        prop2: 'sure',
        prop3: 'has',
        prop4: 'a',
        prop5: 'lot',
        prop6: 'of',
        prop7: 'properties',
      },
    },
    {
      name: 'first',
      properties: {},
    },
  ]

  return {
    states,
  }
}
