const { test } = require('uvu')
const assert = require('uvu/assert')
const { safeParse } = require('../src')

test('Safe empty parse', t => {
  var empty = safeParse('')
  assert.is(empty, undefined)

  var emptyTwo = safeParse(null)
  assert.equal(emptyTwo, null)

  var emptyThree = safeParse(undefined)
  assert.equal(emptyThree, undefined)
})

test('Safe objects', t => {
  assert.equal(safeParse("{'hi': 'cool'}"), undefined)

  assert.equal(safeParse("{'lol': 'whate\"ver'}"), undefined)

  assert.equal(safeParse("{'lol': 'hey\"there'}"), undefined)

  assert.equal(safeParse({ what: 'hi' }), { what: 'hi' })

  assert.equal(safeParse({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })
})

test('Safe javascript natives', t => {
  assert.equal(safeParse(['lol']), ['lol'])

  assert.equal(safeParse({ what: 'hi' }), { what: 'hi' })

  assert.equal(safeParse({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })

  assert.equal(safeParse(true), true)

  assert.equal(safeParse(false), false)
})


test.run()