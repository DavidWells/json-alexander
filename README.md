# json-alexander

[![npm version](https://img.shields.io/npm/v/json-alexander.svg)](https://www.npmjs.com/package/json-alexander)
[![license](https://img.shields.io/npm/l/json-alexander.svg)](https://www.npmjs.com/package/json-alexander)

Forgiving JSON parsing for CLI arguments, config snippets, and other places where humans type almost-JSON.

```sh
npm install json-alexander
```

```js
const { parseJSON } = require('json-alexander')

parseJSON('{ hello: there, cool: true, list: [one, two, 3] }')
// => { hello: 'there', cool: true, list: ['one', 'two', 3] }
```

## TL;DR

**The problem:** strict `JSON.parse` is correct, but it is hostile to command-line and handwritten input. A missing quote, single quote, trailing comma, or bare object key turns the whole payload into an exception.

**The solution:** `json-alexander` tries strict JSON first, then applies a small forgiving parser and repair path for common human-authored JSON mistakes.

| You have | `JSON.parse` | `parseJSON` |
| --- | --- | --- |
| `{ foo: bar }` | Throws | `{ foo: 'bar' }` |
| `{'foo': 'bar',}` | Throws | `{ foo: 'bar' }` |
| `[one, two, 3]` | Throws | `['one', 'two', 3]` |
| `{"valid": true}` | Works | Works |
| `null`, `0`, `false`, `""` | Works | Works |

## Quick Example

```js
const { parseJSON, safeParse } = require('json-alexander')

parseJSON('{"valid": "json"}')
// => { valid: 'json' }

parseJSON("{'single': 'quotes'}")
// => { single: 'quotes' }

parseJSON('{ missing: quotes }')
// => { missing: 'quotes' }

parseJSON('{ trailing: "comma", }')
// => { trailing: 'comma' }

parseJSON('[one, [two, 3], { four: [five, { six: true }] }]')
// => ['one', ['two', 3], { four: ['five', { six: true }] }]

safeParse("{'not': 'strict json'}")
// => undefined
```

## When To Use It

| Good fit | Poor fit |
| --- | --- |
| CLI flags like `--data '{ foo: bar }'` | Untrusted server request bodies |
| Internal tools and developer ergonomics | Security boundaries |
| Config snippets authored by humans | Full JSON5 compatibility |
| Best-effort parsing before a helpful error | Validation of data shape or schema |

This package parses values. It does not validate that the resulting object has the shape your application expects.

## Installation

```sh
npm install json-alexander
```

```sh
pnpm add json-alexander
```

```sh
yarn add json-alexander
```

## API

### `parseJSON(input, defaultValue?)`

Forgiving parser. It returns parsed JavaScript values when possible and throws when the input cannot be parsed or repaired.

```js
const { parseJSON } = require('json-alexander')

parseJSON('false')
// => false

parseJSON('"false"')
// => 'false'

parseJSON('0')
// => 0

parseJSON('null')
// => null

parseJSON('')
// => ''

parseJSON('', [])
// => []
```

`parseJSON` accepts native JavaScript values too:

```js
parseJSON({ already: 'an object' })
// => { already: 'an object' }

parseJSON(['already', 'an array'])
// => ['already', 'an array']
```

### `safeParse(input, defaultValue?)`

Strict parser. It uses `JSON.parse`, passes native objects/arrays through, and returns `defaultValue` when strict parsing fails.

```js
const { safeParse } = require('json-alexander')

safeParse('{"valid": true}')
// => { valid: true }

safeParse("{'not': 'strict'}")
// => undefined

safeParse("{'not': 'strict'}", {})
// => {}

safeParse({ already: 'parsed' })
// => { already: 'parsed' }
```

Use `safeParse` when you want strict JSON behavior without throwing on invalid input.

## Supported Loose Syntax

| Input | Output |
| --- | --- |
| `{ cool: beans }` | `{ cool: 'beans' }` |
| `{ cool: 'beans' }` | `{ cool: 'beans' }` |
| `{ cool: true, nope: false }` | `{ cool: true, nope: false }` |
| `{ count: 3, price: 1.25 }` | `{ count: 3, price: 1.25 }` |
| `{ nil: null }` | `{ nil: null }` |
| `[one, two, 3]` | `['one', 'two', 3]` |
| `{ a: [1, 2,], b: { c: 3, }, }` | `{ a: [1, 2], b: { c: 3 } }` |
| `{ url: https://example.com?a=1&b=2 }` | `{ url: 'https://example.com?a=1&b=2' }` |

Quoted values stay strings:

```js
parseJSON('{ quotedNull: "null", quotedFalse: "false", quotedZero: "0" }')
// => { quotedNull: 'null', quotedFalse: 'false', quotedZero: '0' }
```

## Design Notes

1. Strict JSON wins first.
   Valid JSON is returned directly from `JSON.parse`, including falsy root values like `null`, `0`, `false`, and `""`.

2. Loose parsing is best-effort.
   The parser targets common CLI/config mistakes, not every JavaScript object literal feature.

3. Quoted content is protected.
   Delimiters inside quoted strings, such as commas, braces, and comment-like text, are preserved as string content.

4. Security-sensitive paths should stay strict.
   Use `safeParse` or native `JSON.parse` for untrusted server input.

## Architecture

```text
input
  |
  |-- null / undefined / empty string handling
  |
  |-- strict JSON.parse
  |     |
  |     '-- success: return exact JSON value
  |
  |-- loose container parser
  |     |
  |     '-- handles bare keys, bare values, nested arrays/objects, trailing commas
  |
  |-- legacy repair passes
  |     |
  |     '-- quote fixes, comma cleanup, bracket balancing
  |
  '-- throw if no path can produce a value
```

## Security And Performance

`parseJSON` is intentionally forgiving, which means it performs more work than `JSON.parse`. It is designed for convenience in bounded inputs such as CLI arguments and config snippets.

For security-sensitive or long-running server code:

```js
const { safeParse } = require('json-alexander')

const value = safeParse(input, null)
```

The repository includes an adversarial timing check for the regex and parser paths:

```sh
npm run verify
```

The test suite covers strict JSON values, loose objects, loose arrays, nested containers, trailing commas, quoted delimiters, URL-like values, and safe parsing behavior:

```sh
npm test
```

## Comparison

| Package | Primary goal | Forgiving repairs | Safe strict mode | Notes |
| --- | --- | --- | --- | --- |
| `json-alexander` | Human-friendly CLI/config parsing | Yes | Yes, via `safeParse` | Small CommonJS library |
| `JSON.parse` | Standards-compliant JSON | No | Yes | Fastest and strictest |
| `json5` | JSON5 syntax support | Yes, by spec | No separate safe helper | Better if you want JSON5 as a format |
| `dirty-json` | Parse malformed JSON-like text | Yes | No separate safe helper | Broader dirty JSON parser |

## Troubleshooting

### `parseJSON` throws `Unable to parse JSON`

The input is outside the repair grammar. If the value comes from a user or network request, prefer rejecting it or using `safeParse(input, fallback)`.

```js
safeParse(input, {})
// => parsed object or {}
```

### A value became a string

Bare words are treated as strings.

```js
parseJSON('{ mode: production }')
// => { mode: 'production' }
```

Use valid JSON when you need exact types beyond booleans, null, and numbers.

### A quoted value did not coerce

Quoted values intentionally stay strings.

```js
parseJSON('{ enabled: "false" }')
// => { enabled: 'false' }
```

Remove the quotes for booleans:

```js
parseJSON('{ enabled: false }')
// => { enabled: false }
```

### `safeParse` returns `undefined`

That means strict parsing failed and no default was provided.

```js
safeParse("{'loose': true}", {})
// => {}
```

### Comments are not removed

Comment-like text inside strings is preserved. Do not rely on this package as a comment-stripping parser.

```js
parseJSON('"// not a comment"')
// => '// not a comment'
```

## Limitations

- Not a schema validator.
- Not a full JavaScript parser.
- Not a full JSON5 implementation.
- Not recommended as the first parser for untrusted server request bodies.
- Extremely malformed input may still throw.

## FAQ

### Does it parse normal JSON?

Yes. Strict JSON is tried first.

### Does it preserve falsy JSON root values?

Yes. `parseJSON('null')`, `parseJSON('0')`, `parseJSON('false')`, and `parseJSON('""')` return `null`, `0`, `false`, and `''`.

### Does it mutate objects I pass in?

No parser repair is applied to native objects and arrays. They are returned as JavaScript values.

### Should I use this for HTTP request bodies?

Usually no. Use native `JSON.parse`, your framework's JSON body parser, or `safeParse` with a clear fallback.

### Is this a JSON5 parser?

No. It supports some overlapping loose syntax, but it is a forgiving parser for practical CLI/config inputs rather than a JSON5 implementation.

## License

MIT
