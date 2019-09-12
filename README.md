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
