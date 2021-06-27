import fs from 'fs'
import path from 'path'
import test from 'ava'
import { parseJSON } from '../src'

test('baseline JSON', t => {
  // Native
  t.is(JSON.parse('"lol"'), 'lol')
  // Library
  t.is(parseJSON('"lol"'), 'lol')

  // Native
  t.deepEqual(JSON.parse('["arritem"]'), ['arritem'])
  // Library
  t.deepEqual(parseJSON('["arritem"]'), ['arritem'])

  // Native
  t.deepEqual(JSON.parse('{"key": "value"}'), {'key': 'value'})
  // Library
  t.deepEqual(parseJSON('{"key": "value"}'), {'key': 'value'})

  // Native
  var bool = JSON.parse('false')
  t.is(bool, false)
  t.is(typeof bool, 'boolean')
  // Library
  var boolLib = parseJSON('false')
  t.is(boolLib, false)
  t.is(typeof boolLib, 'boolean')

  // Native
  var boolTwo = JSON.parse('"false"')
  t.is(boolTwo, 'false')
  t.is(typeof boolTwo, 'string')
  // Library
  var boolTwoLib = parseJSON('"false"')
  t.is(boolTwoLib, 'false')
  t.is(typeof boolTwoLib, 'string')
})

test('empty parse', t => {
  var empty = parseJSON('')
  t.is(empty, '')

  var emptyTwo = parseJSON(null)
  t.deepEqual(emptyTwo, null)

  var emptyThree = parseJSON(undefined)
  
  t.deepEqual(emptyThree, undefined)
})

test('empty with defaults', t => {
  var empty = parseJSON('', '')
  t.is(empty, '')

  var emptyTwo = parseJSON(null, [])
  t.deepEqual(emptyTwo, [])

  var emptyThree = parseJSON(undefined, {})
  t.deepEqual(emptyThree, {})
})

test('Strings', t => {
  t.is(parseJSON('lol'), 'lol')

  t.is(parseJSON('"lol"'), 'lol')

  t.is(parseJSON("'lol'"), 'lol')

  t.is(parseJSON("'lol"), 'lol')

  t.is(parseJSON("lol'"), 'lol')
})

test('Javascript natives', t => {
  t.deepEqual(parseJSON(['lol']), ['lol'])

  t.deepEqual(parseJSON({ what: 'hi' }), { what: 'hi' })

  t.deepEqual(parseJSON({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })

  t.deepEqual(parseJSON(true), true)

  t.deepEqual(parseJSON(false), false)
})

test('Javascript strings', t => {
  t.deepEqual(parseJSON('{ cool: "hi" }'), { cool: "hi" }, 'works?')

  const x = parseJSON('{ cool: "hi" }')
  t.deepEqual(x, { cool: "hi" }, '1')

  const y = parseJSON("{ cool: 'hi' }")
  t.deepEqual(y, { cool: "hi" }, '2')

  const z = parseJSON("[ { cool: 'hi', hehehehee: 'hi' } ]")
  t.deepEqual(z, [ { cool: 'hi', hehehehee: 'hi' } ], '3')

  const a = parseJSON(`[ { cool: 'hi', hehehehee: "hi" } ]`)
  t.deepEqual(a, [ { cool: 'hi', hehehehee: 'hi' } ], '4')

  const b = parseJSON(`{ cool: oops }`)
  t.deepEqual(b, { cool: "oops" }, '5')

  const c = parseJSON(`{ cool: oops, noce: ododod }`)
  t.deepEqual(c, { cool: "oops", noce: "ododod" }, '6')

  const d = parseJSON(`{ cool: oops, noce: true, wow: false }`)
  t.deepEqual(d, { cool: "oops", noce: true, wow: false }, '7')

  const e = parseJSON(`[{ cool: [oops], noce: true, wow: false }]`)
  t.deepEqual(e, [{ cool: ["oops"], noce: true, wow: false }], '8')

  const f = parseJSON(`[{ cool: [{ oops: true }], noce: true, wow: false }]`)
  t.deepEqual(f, [{ cool: [{ oops: true }], noce: true, wow: false }], '9')
  
  // unblanced object
  const g = parseJSON(`{ cool: oops, noce: true, wow: false `)
  t.deepEqual(g, { cool: "oops", noce: true, wow: false }, '10')
  
  // unblanced array
  const zz = parseJSON(`[ 'xyz', 'one', 'two' `)
  t.deepEqual(zz, ['xyz', 'one', 'two'])

  // unblanced array. FAILS
  const j = parseJSON(`[{ cool: oops, noce: true, wow: false `)
  t.deepEqual(j, [{ cool: "oops", noce: true, wow: false }])
})

test('Balance malformed payloads', t => {
  t.deepEqual(parseJSON("{'hi': 'fixme'"), {
    hi: 'fixme'
  })

  t.deepEqual(parseJSON('{"hi": "please"'), {
    hi: 'please'
  })

  t.deepEqual(parseJSON('{"hi": "quote\'inside"'), {
    hi: "quote'inside"
  })
})

test('Objects', t => {
  t.deepEqual(parseJSON("{'hi': 'cool'}"), {
    hi: 'cool'
  })

  t.deepEqual(parseJSON("{'lol': 'whate\"ver'}"), {
    lol: 'whate\"ver'
  })

  t.deepEqual(parseJSON("{'lol': 'hey\"there'}"), {
    lol: 'hey\"there'
  })

  t.deepEqual(parseJSON({ what: 'hi' }), { what: 'hi' })

  t.deepEqual(parseJSON({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })

  t.deepEqual(parseJSON("{rad:'blue'}"), {rad:'blue'})

  t.deepEqual(parseJSON("{rad:true}"), {rad:true})
  t.deepEqual(parseJSON("{rad: true}"), {rad:true})
  t.deepEqual(parseJSON("{rad:true }"), {rad:true})
  t.deepEqual(parseJSON("{ rad: true}"), {rad:true})
  t.deepEqual(parseJSON("{ rad: true }"), {rad:true})
  t.deepEqual(parseJSON("{ rad: 'true' }"), {rad:'true'})
})

test('Arrays', t => {
  t.deepEqual(parseJSON('["arritem"]'), ['arritem'])

  t.deepEqual(parseJSON("['arritem']"), ['arritem'])

  t.deepEqual(parseJSON("['one', 'two', 'three']"), ['one', 'two', 'three'])

  t.deepEqual(parseJSON("['1', \"2\", '3']"), ['1', '2', '3'])

  t.deepEqual(parseJSON("['x', \'y\', 'z']"), ['x', 'y', 'z'])

  t.deepEqual(parseJSON("[x, y, z]"), ['x', 'y', 'z'])

  t.deepEqual(parseJSON("[a, b, 2, 3]"), ['a', 'b', 2, 3])

  t.deepEqual(parseJSON("[a, b, { cool: true }]"), ['a', 'b', { cool: true }])

  // t.deepEqual(parseJSON(`[a, b, ["1", "2"]]`), ['a', 'b', ['1', '2']])

  const x = parseJSON("['arr", [])
  // console.log('thing', x)
  t.deepEqual(x, ['arr'])
  t.is(Array.isArray(x), true)
})

test('Booleans', t => {
  var e = parseJSON(false)
  t.is(e, false)
  t.is(typeof e, 'boolean')

  var e1 = parseJSON('false')
  t.is(e1, false)
  t.is(typeof e1, 'boolean')

  var e2 = parseJSON('"false"')
  t.is(e2, 'false')
  t.is(typeof e2, 'string')

  var e3 = parseJSON('true')
  t.is(e3, true)
  t.is(typeof e3, 'boolean')
})

test('test large object', t => {
  const data = require('./fixture.json')
  const value = parseJSON(data)
  t.is(typeof value, 'object')
  t.is(Array.isArray(value), true)
})

test('test large broken object', t => {
  const data = fs.readFileSync(path.join(__dirname, 'fixture-two.json'), 'utf-8')
  const value = parseJSON(data)
  t.is(typeof value, 'object')
})
