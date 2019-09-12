# Friendly JSON Parse

Serenity now! Safe `JSON.parse`

```js
import parseJson from 'json-statham'

parseJson('{"valid": "works"}')
// object -> {"valid": "works"}
parseJson("{'malformed': 'works'}")
// object -> {"malformed": "works"}
parseJson('{"unbalanced": "object"')
// object -> {"unbalanced": "object" }
```

Returns `undefined` if value passed in is not parsable

## Other options

- https://github.com/hua1995116/easy-json-parse
- https://github.com/RyanMarcus/dirty-json
- https://www.npmjs.com/package/try-json
