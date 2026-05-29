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

test('Strict JSON falsy values', t => {
  assert.is(parseJSON('null'), null)
  assert.is(parseJSON('0'), 0)
  assert.is(parseJSON('""'), '')
  assert.is(parseJSON('false'), false)
  assert.equal(parseJSON('[]'), [])
  assert.equal(parseJSON('{}'), {})
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

test('Quoted strings preserve content', t => {
  assert.is(parseJSON('"hello world"'), 'hello world')
  assert.is(parseJSON('"// not a comment"'), '// not a comment')
  assert.is(parseJSON('"/* not a comment */"'), '/* not a comment */')
  assert.is(parseJSON('"# not a comment"'), '# not a comment')
  assert.is(parseJSON('"one\\ntwo"'), 'one\ntwo')
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

test('Object primitive values', t => {
  assert.equal(parseJSON('{ nil: null, falsy: false, zero: 0, empty: "" }'), {
    nil: null,
    falsy: false,
    zero: 0,
    empty: ''
  })

  assert.equal(parseJSON('{ neg: -1, float: -1.5, sci: 1e3 }'), {
    neg: -1,
    float: -1.5,
    sci: 1000
  })

  assert.equal(parseJSON('{ quotedNull: "null", quotedFalse: "false", quotedZero: "0" }'), {
    quotedNull: 'null',
    quotedFalse: 'false',
    quotedZero: '0'
  })
})

test('Object keys with punctuation and spaces', t => {
  assert.equal(parseJSON(`{"a-b": 1, '$weird': two, " spaced ": three}`), {
    'a-b': 1,
    '$weird': 'two',
    ' spaced ': 'three'
  })
})

test('Objects with loose nested arrays', t => {
  assert.equal(parseJSON(`{
    sessionId: /dev/ttys129,
    sessionIndex: 1.10,
    cool: true,
    notCool: false,
    array: [1, 2, 3]
  }`), {
    sessionId: '/dev/ttys129',
    sessionIndex: 1.1,
    cool: true,
    notCool: false,
    array: [1, 2, 3]
  })

  assert.equal(parseJSON(`{
    nested: [{ cool: beans }, [one, two, 3]],
    path: /dev/ttys129
  }`), {
    nested: [
      { cool: 'beans' },
      ['one', 'two', 3]
    ],
    path: '/dev/ttys129'
  })
})

test('Objects preserve URL-like bare values', t => {
  assert.equal(parseJSON(`{
    url: https://example.com?a=1&b=2,
    path: /dev/ttys129,
    glob: /**/**.md/
  }`), {
    url: 'https://example.com?a=1&b=2',
    path: '/dev/ttys129',
    glob: '/**/**.md/'
  })
})

test('Loose strings with nested quoted object text', t => {
  assert.equal(parseJSON(`[
    {
      type: "content",
      content: "Content here...

<Builder
  components={[{ type: "content", content: "Content here... woah" }]}
/>"
    }
  ]`), [
    {
      type: 'content',
      content: `Content here...

<Builder
  components={[{ type: "content", content: "Content here... woah" }]}
/>`
    }
  ])
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

test('Objects with repeated interior commas', t => {
  assert.equal(parseJSON('{ a: 1,, b: 2, c: { d: 3,,, }, }'), {
    a: 1,
    b: 2,
    c: { d: 3 }
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

  assert.equal(parseJSON("[1,,3]"), [1, '', 3])

  // assert.equal(parseJSON(`[a, b, ["1", "2"]]`), ['a', 'b', ['1', '2']])

  const x = parseJSON("['arr", [])
  // console.log('thing', x)
  assert.equal(x, ['arr'], 'works?')
  assert.is(Array.isArray(x), true)
})

test('Arrays with primitive values', t => {
  assert.equal(parseJSON('[null, false, true, 0, "", "null", "false"]'), [
    null,
    false,
    true,
    0,
    '',
    'null',
    'false'
  ])
})

test('Arrays preserve quoted delimiters', t => {
  assert.equal(parseJSON('["a,b", "c]d", "e{f}", "// nope", "/* nope */"]'), [
    'a,b',
    'c]d',
    'e{f}',
    '// nope',
    '/* nope */'
  ])
})

test('Nested arrays and objects', t => {
  assert.equal(parseJSON('[one, [two, 3], { four: [five, { six: true }] }]'), [
    'one',
    ['two', 3],
    { four: ['five', { six: true }] }
  ])
})

test('Arrays trailing commas', t => {
  assert.equal(parseJSON("['one', 'two', 'three'],"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three',]"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three',],"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three',,,,]"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three'],,,,"), ['one', 'two', 'three'])
  assert.equal(parseJSON("['one', 'two', 'three',,,,],,,,"), ['one', 'two', 'three'])
})

test('Nested trailing commas', t => {
  assert.equal(parseJSON('{ a: [1, 2,], b: { c: 3, }, }'), {
    a: [1, 2],
    b: { c: 3 }
  })
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

test('Null values', t => {
  assert.is(parseJSON(null), null)
  assert.is(parseJSON('null'), null)
  assert.equal(parseJSON('{ key: null }'), { key: null })
  assert.equal(parseJSON('[null]'), [null])
})

test('Number values', t => {
  assert.is(parseJSON(0), 0)
  assert.is(parseJSON('0'), 0)
  assert.is(parseJSON('-10'), -10)
  assert.is(parseJSON('1.25'), 1.25)
  assert.is(parseJSON('1e3'), 1000)
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
