import fs from 'fs'
import path from 'path'
import test from 'ava'
import parseJson from '../src'

test('baseline JSON', t => {
  // Native
  t.is(JSON.parse('"lol"'), 'lol')
  // Library
  t.is(parseJson('"lol"'), 'lol')

  // Native
  t.deepEqual(JSON.parse('["arritem"]'), ['arritem'])
  // Library
  t.deepEqual(parseJson('["arritem"]'), ['arritem'])

  // Native
  t.deepEqual(JSON.parse('{"key": "value"}'), {'key': 'value'})
  // Library
  t.deepEqual(parseJson('{"key": "value"}'), {'key': 'value'})

  // Native
  var bool = JSON.parse('false')
  t.is(bool, false)
  t.is(typeof bool, 'boolean')
  // Library
  var boolLib = parseJson('false')
  t.is(boolLib, false)
  t.is(typeof boolLib, 'boolean')

  // Native
  var boolTwo = JSON.parse('"false"')
  t.is(boolTwo, 'false')
  t.is(typeof boolTwo, 'string')
  // Library
  var boolTwoLib = parseJson('"false"')
  t.is(boolTwoLib, 'false')
  t.is(typeof boolTwoLib, 'string')
})

test('empty parse', t => {
  var empty = parseJson('')
  t.is(empty, '')

  var emptyTwo = parseJson(null)
  t.deepEqual(emptyTwo, null)

  var emptyThree = parseJson(undefined)
  t.deepEqual(emptyThree, undefined)
})

test('empty with defaults', t => {
  var empty = parseJson('', '')
  t.is(empty, '')

  var emptyTwo = parseJson(null, [])
  t.deepEqual(emptyTwo, [])

  var emptyThree = parseJson(undefined, {})
  t.deepEqual(emptyThree, {})
})

test('Strings', t => {
  t.is(parseJson('lol'), 'lol')

  t.is(parseJson('"lol"'), 'lol')

  t.is(parseJson("'lol'"), 'lol')

  t.is(parseJson("'lol"), 'lol')

  t.is(parseJson("lol'"), 'lol')
})

test('Javascript natives', t => {
  t.deepEqual(parseJson(['lol']), ['lol'])

  t.deepEqual(parseJson({ what: 'hi' }), { what: 'hi' })

  t.deepEqual(parseJson({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })

  t.deepEqual(parseJson(true), true)

  t.deepEqual(parseJson(false), false)
})

test('Balance malformed payloads', t => {
  t.deepEqual(parseJson("{'hi': 'fixme'"), {
    hi: 'fixme'
  })

  t.deepEqual(parseJson('{"hi": "please"'), {
    hi: 'please'
  })

  t.deepEqual(parseJson('{"hi": "quote\'inside"'), {
    hi: "quote'inside"
  })
})

test('Objects', t => {
  t.deepEqual(parseJson("{'hi': 'cool'}"), {
    hi: 'cool'
  })

  t.deepEqual(parseJson("{'lol': 'whate\"ver'}"), {
    lol: 'whate\"ver'
  })

  t.deepEqual(parseJson("{'lol': 'hey\"there'}"), {
    lol: 'hey\"there'
  })

  t.deepEqual(parseJson({ what: 'hi' }), { what: 'hi' })

  t.deepEqual(parseJson({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })
})

test('Arrays', t => {
  t.deepEqual(parseJson('["arritem"]'), ['arritem'])

  t.deepEqual(parseJson("['arritem']"), ['arritem'])

  t.deepEqual(parseJson("['one', 'two', 'three']"), ['one', 'two', 'three'])

  t.deepEqual(parseJson("['1', \"2\", '3']"), ['1', '2', '3'])

  t.deepEqual(parseJson("['x', \'y\', 'z']"), ['x', 'y', 'z'])

  const x = parseJson("['arr", [])
  // console.log('thing', x)
  t.deepEqual(x, ['arr'])
  t.is(Array.isArray(x), true)
})

test('Booleans', t => {
  var e = parseJson(false)
  t.is(e, false)
  t.is(typeof e, 'boolean')

  var e1 = parseJson('false')
  t.is(e1, false)
  t.is(typeof e1, 'boolean')

  var e2 = parseJson('"false"')
  t.is(e2, 'false')
  t.is(typeof e2, 'string')

  var e3 = parseJson('true')
  t.is(e3, true)
  t.is(typeof e3, 'boolean')
})

test('test large object', t => {
  const data = require('./fixture.json')
  const value = parseJson(data)
  t.is(typeof value, 'object')
  t.is(Array.isArray(value), true)
})

test('test large broken object', t => {
  const data = fs.readFileSync(path.join(__dirname, 'fixture-two.json'), 'utf-8')
  const value = parseJson(data)
  t.is(typeof value, 'object')
})
