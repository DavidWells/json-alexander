const fs = require('fs')
const path = require('path')
const { test } = require('uvu')
const assert = require('uvu/assert')
const { parseJSON } = require('../src')

test('baseline JSON', t => {
  // Native
  assert.is(JSON.parse('"lol"'), 'lol')
  // Library
  assert.is(parseJSON('"lol"'), 'lol')

  // Native
  assert.equal(JSON.parse('["arritem"]'), ['arritem'])
  // Library
  assert.equal(parseJSON('["arritem"]'), ['arritem'])

  // Native
  assert.equal(JSON.parse('{"key": "value"}'), {'key': 'value'})
  // Library
  assert.equal(parseJSON('{"key": "value"}'), {'key': 'value'})

  // Native
  var bool = JSON.parse('false')
  assert.is(bool, false)
  assert.is(typeof bool, 'boolean')
  // Library
  var boolLib = parseJSON('false')
  assert.is(boolLib, false)
  assert.is(typeof boolLib, 'boolean')

  // Native
  var boolTwo = JSON.parse('"false"')
  assert.is(boolTwo, 'false')
  assert.is(typeof boolTwo, 'string')
  // Library
  var boolTwoLib = parseJSON('"false"')
  assert.is(boolTwoLib, 'false')
  assert.is(typeof boolTwoLib, 'string')
})

test('empty parse', t => {
  var empty = parseJSON('')
  assert.is(empty, '')

  var emptyTwo = parseJSON(null)
  assert.equal(emptyTwo, null)

  var emptyThree = parseJSON(undefined)
  
  assert.equal(emptyThree, undefined)
})

test('empty with defaults', t => {
  var empty = parseJSON('', '')
  assert.is(empty, '')

  var emptyTwo = parseJSON(null, [])
  assert.equal(emptyTwo, [])

  var emptyThree = parseJSON(undefined, {})
  assert.equal(emptyThree, {})
})

test('Strings', t => {
  assert.is(parseJSON('lol'), 'lol')

  assert.is(parseJSON('"lol"'), 'lol')

  assert.is(parseJSON("'lol'"), 'lol')

  assert.is(parseJSON("'lol"), 'lol')

  assert.is(parseJSON("lol'"), 'lol')
})

test('Javascript natives', t => {
  assert.equal(parseJSON(['lol']), ['lol'])

  assert.equal(parseJSON({ what: 'hi' }), { what: 'hi' })

  assert.equal(parseJSON({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })

  assert.equal(parseJSON(true), true)

  assert.equal(parseJSON(false), false)
})

test('Javascript strings', t => {
  assert.equal(parseJSON('{ cool: "hi" }'), { cool: "hi" }, 'works?')

  const x = parseJSON('{ cool: "hi" }')
  assert.equal(x, { cool: "hi" }, '1')

  const y = parseJSON("{ cool: 'hi' }")
  assert.equal(y, { cool: "hi" }, '2')

  const z = parseJSON("[ { cool: 'hi', hehehehee: 'hi' } ]")
  assert.equal(z, [ { cool: 'hi', hehehehee: 'hi' } ], '3')

  const a = parseJSON(`[ { cool: 'hi', hehehehee: "hi" } ]`)
  assert.equal(a, [ { cool: 'hi', hehehehee: 'hi' } ], '4')

  const b = parseJSON(`{ cool: oops }`)
  assert.equal(b, { cool: "oops" }, '5')

  const c = parseJSON(`{ cool: oops, noce: ododod }`)
  assert.equal(c, { cool: "oops", noce: "ododod" }, '6')

  const d = parseJSON(`{ cool: oops, noce: true, wow: false }`)
  assert.equal(d, { cool: "oops", noce: true, wow: false }, '7')

  const e = parseJSON(`[{ cool: [oops], noce: true, wow: false }]`)
  assert.equal(e, [{ cool: ["oops"], noce: true, wow: false }], '8')

  const f = parseJSON(`[{ cool: [{ oops: true }], noce: true, wow: false }]`)
  assert.equal(f, [{ cool: [{ oops: true }], noce: true, wow: false }], '9')
  
  // unblanced object
  const g = parseJSON(`{ cool: oops, noce: true, wow: false `)
  assert.equal(g, { cool: "oops", noce: true, wow: false }, '10')
  
  // unblanced array
  const zz = parseJSON(`[ 'xyz', 'one', 'two' `)
  assert.equal(zz, ['xyz', 'one', 'two'])

  // unblanced array.
  const j = parseJSON(`[{ cool: oops, noce: true, wow: false `)
  assert.equal(j, [{ cool: "oops", noce: true, wow: false }])

  assert.equal(parseJSON(`"{rad:[\"whatever\",\"man\"],cool:{ beans: 'here'"`), { rad: [ 'whatever', 'man' ], cool: { beans: 'here' } })
})

test('Balance malformed payloads', t => {
  assert.equal(parseJSON("{'hi': 'fixme'"), {
    hi: 'fixme'
  })

  assert.equal(parseJSON('{"hi": "please"'), {
    hi: 'please'
  })

  assert.equal(parseJSON('{"hi": "quote\'inside"'), {
    hi: "quote'inside"
  })
})

test('Objects', t => {
  assert.equal(parseJSON("{'hi': 'cool'}"), {
    hi: 'cool'
  })

  assert.equal(parseJSON("{'lol': 'whate\"ver'}"), {
    lol: 'whate\"ver'
  })

  assert.equal(parseJSON("{'lol': 'hey\"there'}"), {
    lol: 'hey\"there'
  })

  assert.equal(parseJSON({ what: 'hi' }), { what: 'hi' })

  assert.equal(parseJSON({
    what: 'hi',
    array: ['cool', 'awesome']
  }), {
    what: 'hi',
    array: ['cool', 'awesome']
  })

  assert.equal(parseJSON("{rad:'blue'}"), {rad:'blue'})

  assert.equal(parseJSON("{rad:true}"), {rad:true})
  assert.equal(parseJSON("{rad: true}"), {rad:true})
  assert.equal(parseJSON("{rad:true }"), {rad:true})
  assert.equal(parseJSON("{ rad: true}"), {rad:true})
  assert.equal(parseJSON("{ rad: true }"), {rad:true})
  assert.equal(parseJSON("{ rad: 'true' }"), {rad:'true'})

  assert.equal(parseJSON('{rad:["whatever","man"]}'),  {rad:["whatever","man"]})

  assert.equal(parseJSON('{rad:{cool: "beans"}}'),  { rad: { cool: 'beans' } })

  assert.equal(parseJSON('{rad: {cool: beans }}'),  { rad: { cool: 'beans' } })
  assert.equal(parseJSON('{rad: {cool: beans}}'),  { rad: { cool: 'beans' } })
  assert.equal(parseJSON('{rad: {cool:beans }}'),  { rad: { cool: 'beans' } })
  assert.equal(parseJSON('{rad: {cool:beans}}'),  { rad: { cool: 'beans' } })
  assert.equal(parseJSON('{rad:{cool:beans}}'),  { rad: { cool: 'beans' } })

})

test('Objects trailing commas', t => {
  assert.equal(parseJSON("{'hi': 'cool',}"), {
    hi: 'cool'
  })
  assert.equal(parseJSON("{'hi': 'cool'},"), {
    hi: 'cool'
  })
  assert.equal(parseJSON("{'hi': 'cool',},"), {
    hi: 'cool'
  })
  assert.equal(parseJSON("{'hi': 'cool',,,,}"), {
    hi: 'cool'
  })
  assert.equal(parseJSON("{'hi': 'cool'},,,,"), {
    hi: 'cool'
  })
  assert.equal(parseJSON("{'hi': 'cool',,,,},,,,"), {
    hi: 'cool'
  })
})

test('Arrays', t => {
  assert.equal(parseJSON('["arritem"]'), ['arritem'])

  assert.equal(parseJSON("['arritem']"), ['arritem'])

  assert.equal(parseJSON("['one', 'two', 'three']"), ['one', 'two', 'three'])

  assert.equal(parseJSON("['1', \"2\", '3']"), ['1', '2', '3'])

  assert.equal(parseJSON("['x', \'y\', 'z']"), ['x', 'y', 'z'])

  assert.equal(parseJSON("[x, y, z]"), ['x', 'y', 'z'])

  assert.equal(parseJSON("[a, b, 2, 3]"), ['a', 'b', 2, 3])

  assert.equal(parseJSON("[a, b, { cool: true }]"), ['a', 'b', { cool: true }])

  // assert.equal(parseJSON(`[a, b, ["1", "2"]]`), ['a', 'b', ['1', '2']])

  const x = parseJSON("['arr", [])
  // console.log('thing', x)
  assert.equal(x, ['arr'])
  assert.is(Array.isArray(x), true)
})

test('Arrays trailing commas', t => {
  assert.equal(parseJSON("['one', 'two', 'three'],"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three',]"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three',],"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three',,,,]"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three'],,,,"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three',,,,],,,,"), ['one', 'two', 'three'])
})

test('Booleans', t => {
  var e = parseJSON(false)
  assert.is(e, false)
  assert.is(typeof e, 'boolean')

  var e1 = parseJSON('false')
  assert.is(e1, false)
  assert.is(typeof e1, 'boolean')

  var e2 = parseJSON('"false"')
  assert.is(e2, 'false')
  assert.is(typeof e2, 'string')

  var e3 = parseJSON('true')
  assert.is(e3, true)
  assert.is(typeof e3, 'boolean')
})

test('test large object', t => {
  const data = require('./fixture.json')
  const value = parseJSON(data)
  assert.is(typeof value, 'object')
  assert.is(Array.isArray(value), true)
})

test('test large broken object', t => {
  const data = fs.readFileSync(path.join(__dirname, 'fixture-two.json'), 'utf-8')
  const value = parseJSON(data)
  assert.is(typeof value, 'object')
})

test('Inner quote conflicts', t => {
  assert.equal(parseJSON(`{
    color: 'red',
    whatever: "co'ol",
  }`), { color: "red", whatever: "co'ol" }, 'works?')
})

test('JSON with trailing commas', t => {
  const answer = {
    "debug": "on",
    "window": {
      "title": "Sample Konfabulator Widget",
      "name": "main_window",
      "width": 500,
      "height": 500
    },
    "image": {
      "src": "Images/Sun.png",
      "name": "sun1",
      "hOffset": 250,
      "vOffset": 250,
      "alignment": "center",
      "array": ['one', 'two', 'three'],
    },
    "text": {
      "data": "Click Here",
      "size": 36,
      "style": "bold",
      "name": "text1",
      "hOffset": 250,
      "vOffset": 100,
      "alignment": "center",
      "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
    }
  }
  assert.equal(parseJSON(`
  {
    "debug": "on",
    "window": {
      "title": "Sample Konfabulator Widget",
      "name": "main_window",
      "width": 500,
      "height": 500,
    },
    "image": {
      "src": "Images/Sun.png",
      "name": "sun1",
      "hOffset": 250,
      "vOffset": 250,
      "alignment": "center",
      "array": ['one', 'two', 'three'],
    },
    "text": {
      "data": "Click Here",
      "size": 36,
      "style": "bold",
      "name": "text1",
      "hOffset": 250,
      "vOffset": 100,
      "alignment": "center",,,
      "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;",
    },
  },
  `), answer, 'json')
})



test.run()