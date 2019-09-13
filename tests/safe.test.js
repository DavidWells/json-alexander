import test from 'ava'
import { safeParse } from '../src'

test('Safe empty parse', t => {
  var empty = safeParse('')
  t.is(empty, undefined)

  var emptyTwo = safeParse(null)
  t.deepEqual(emptyTwo, null)

  var emptyThree = safeParse(undefined)
  t.deepEqual(emptyThree, undefined)
})

test('Safe objects', t => {
  t.deepEqual(safeParse("{'hi': 'cool'}"), undefined)

  t.deepEqual(safeParse("{'lol': 'whate\"ver'}"), undefined)

  t.deepEqual(safeParse("{'lol': 'hey\"there'}"), undefined)

  t.deepEqual(safeParse({ what: 'hi' }), { what: 'hi' })

  t.deepEqual(safeParse({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })
})

test('Safe javascript natives', t => {
  t.deepEqual(safeParse(['lol']), ['lol'])

  t.deepEqual(safeParse({ what: 'hi' }), { what: 'hi' })

  t.deepEqual(safeParse({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })

  t.deepEqual(safeParse(true), true)

  t.deepEqual(safeParse(false), false)
})
