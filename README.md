# Friendly JSON Parse

<img align="right" src="https://user-images.githubusercontent.com/532272/64802133-d3d2b180-d53e-11e9-8182-101a1b927e29.jpg">

Serenity now! Safe `JSON.parse`

```js
import parseJSON from 'json-alexander'

/* Normal Valid JSON */
parseJSON('{"valid": "works"}')
// -> {"valid": "works"}

/* Javascript objects */
parseJSON({ key: 'val' })
// -> { key: 'val' }

/* Malformed JSON */
parseJSON("{'malformed': 'works'}")
// -> {"malformed": "works"}

/* Unbalanced JSON */
parseJSON('{"unbalanced": "object"')
// -> {"unbalanced": "object" }
```

Returns `undefined` if value passed in is not parsable

## Other options

- https://github.com/hua1995116/easy-json-parse
- https://github.com/RyanMarcus/dirty-json
- https://www.npmjs.com/package/try-json

## Security concerns

This package makes use of regular expressions when fixing malformed json. As a result, it may be vulnerable to a [REDOS attack](https://snyk.io/blog/redos-and-catastrophic-backtracking).

I've run the regex patterns through [vuln-regex-detector](https://github.com/davisjam/vuln-regex-detector) and the patterns used appear to be safe.

I'm leveraging this in Serverless Functions with max timeouts on requests, so redos is somewhat mitigated. If using in long running server... use at your own risk.

Use `simple` parser if you want to ignore malformed JSON & disable the mechanism that leverage regex patterns.


```js
import { simple as simpleParse } from 'json-alexander'

/* Normal Valid JSON */
simpleParse('{"valid": "works"}')
// -> {"valid": "works"}

/* Javascript objects */
simpleParse({ key: 'val' })
// -> { key: 'val' }

/* Malformed JSON */
simpleParse("{'malformed': 'works'}")
// -> null no autofix
```
