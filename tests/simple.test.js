import test from 'ava'
import { simple as simpleParse } from '../src'

test('simple empty parse', t => {
  var empty = simpleParse('')
  t.is(empty, undefined)

  var emptyTwo = simpleParse(null)
  t.deepEqual(emptyTwo, null)

  var emptyThree = simpleParse(undefined)
  t.deepEqual(emptyThree, undefined)
})

test('simple objects', t => {
  t.deepEqual(simpleParse("{'hi': 'cool'}"), undefined)

  t.deepEqual(simpleParse("{'lol': 'whate\"ver'}"), undefined)

  t.deepEqual(simpleParse("{'lol': 'hey\"there'}"), undefined)

  t.deepEqual(simpleParse({ what: 'hi' }), { what: 'hi' })

  t.deepEqual(simpleParse({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })
})

test('Simple javascript natives', t => {
  t.deepEqual(simpleParse(['lol']), ['lol'])

  t.deepEqual(simpleParse({ what: 'hi' }), { what: 'hi' })

  t.deepEqual(simpleParse({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })

  t.deepEqual(simpleParse(true), true)

  t.deepEqual(simpleParse(false), false)
})
