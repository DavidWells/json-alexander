# Forgiving JSON Parser

<img align="right" src="https://user-images.githubusercontent.com/532272/64802133-d3d2b180-d53e-11e9-8182-101a1b927e29.jpg">

Serenity now! A forgiving JSON parser 🙏

```js
import { parseJSON } from 'json-alexander'

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

/* Javascript objects missing quotes */
parseJSON('{ hello: there }')
// -> { "hello": "there" }
```

Throws if value passed in is not parsable.

## Other options

- https://github.com/hua1995116/easy-json-parse
- https://github.com/RyanMarcus/dirty-json
- https://www.npmjs.com/package/try-json

## Security concerns

This package was built for nicer arg parser for CLIs. e.g.

```
my-cli-command --data '{ foo: bar }'
```

If you need a JSON parser for your server, consider the `safeParse` export instead.

This package makes use of regular expressions when fixing malformed json. As a result, it may be vulnerable to a [REDOS attack](https://snyk.io/blog/redos-and-catastrophic-backtracking).

I've run the regex patterns through [vuln-regex-detector](https://github.com/davisjam/vuln-regex-detector) & the patterns used appear to be safe. [See tests/regex](./tests/regexTests)

Recommended usage for this package is in serverless functions where max timeouts on requests can be used. This mitigates risk of REDOS.

If using in long running server... use the default `parseJSON` at your own risk or better yet use `safeParse` if you want to ignore malformed JSON & disable the mechanism that leverage regex patterns.

**Example:**

```js
import { safeParse } from 'json-alexander'

/* Normal Valid JSON */
safeParse('{"valid": "works"}')
// -> {"valid": "works"}

/* Javascript objects */
safeParse({ key: 'val' })
// -> { key: 'val' }

/* Malformed JSON */
safeParse("{'malformed': 'works'}")
// -> null no autofix
```

This code is not vulnerable to possible redos.
