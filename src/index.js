const { isBalanced, trimQuotes, isNull } = require('./utils')

const DEBUG = false
const log = (DEBUG) ? console.log : () => {} 


function simpleParse(data, defaultValue) {
  try {
    if (isNull(data) && defaultValue) {
      return defaultValue
    }
    return JSON.parse(data)
  } catch (e) {
    if (typeof data === 'object') {
      return data
    }
    return defaultValue
  }
}

module.exports.safeParse = simpleParse

module.exports.parseJSON = function parseJSON(input, defaultValue) {
  let error
  if (isNull(input) || input === '' || input === undefined) {
    return defaultValue || input
  }

  if (typeof input === 'string') {
    const simple = simpleParse(input)
    if (simple) {
      return simple
    }
  }

  const value = (typeof input === 'string') ? coerceStr(input, defaultValue) : coerceToString(input)

  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }

  const isNumber = Number(input)
  if (typeof isNumber === 'number' && !isNaN(isNumber)) {
    return isNumber
  }

  let trimmed = trimQuotes(value)
  log('trimmed', `|${trimmed}|`)

  const loose = parseLooseContainer(trimmed)
  if (loose.ok) {
    return loose.value
  }
  
  const [ err, first ] = parse(value)
  error = err
  // log('trimmed', trimmed)
  if (first) {
    log('first', first)
    if (!needsMoreProcessing(first)) {
      return first
    }
  }

  if (trimmed.indexOf("'") > -1 && trimmed.indexOf('"') > -1) {
    trimmed = replaceSingleQuotesInsideDoubleQuotes(trimmed)
  }

  log('trimmed clean ', `|${trimmed}|`)

  const [errTwo, second ] = parse(trimmed)
  error = errTwo
  if (second) {
    log('second', `|${second}|`)
    if (!needsMoreProcessing(second)) {
      return second
    }
  }

  let fixString = convertStringObjectToJsonString(trimmed)
  //*
  log('fixString', `|${fixString}|`)
  /**/
  const [errThree, third ] = parse(fixString)
  error = errThree
  if (third) {
    log('third', third)
    if (!needsMoreProcessing(third)) {
      return third
    }
  }

  const foo = coerceStr(fixString, defaultValue)
  log('foo', foo)
  let what = fixEscapedKeys(foo)
  log('what', what)

  const [errFour, four ] = parse(what)
  error = errFour
  if (four) {
    log('four', four)
    if (!needsMoreProcessing(four)) {
      return four
    }
  }

  const final = trimQuotes(what.replace(/'/g, '"'))
  // console.log('final', final)
  const [errFive, five ] = parse(final)
  error = errFive
  if (five) {
    log('five', five)
    if (!needsMoreProcessing(five)) {
      return five
    }
  }

  // Wrap values missing quotes { cool: nice }
  const newer = final
    // Temporarily stash boolean values
    .replace(/:\s?(true+?)\s?/g, ': "TRUE_PLACEHOLDER"')
    .replace(/:\s?(false+?)\s?/g, ': "FALSE_PLACEHOLDER"')
    // .replace(/\[\s?(true+?)\s?\]/, 'TRUE_PLACEHOLDER')
    // .replace(/\[\s?(false+?)\s?\]/, 'FALSE_PLACEHOLDER')
    // [ xyz ]
    .replace(/\[\s?([A-Za-z.@_]+?)\s?\]/g, '[ "$1" ]')
    // [ xyz, 
    // .replace(/\[\s?([_@.A-Za-z]+?),\s?/g,  '[ "$1",')
    // .replace(/,\s?([_@.A-Za-z]+?)\s?\]/g, ', "$1" ]')
    .replace(/:\s?([A-Za-z]+?)\s?}/g, ': "$1" }')


  // var pattern = /([^[]+(?=]))/gm

  // let updated = newer
  // while((result = pattern.exec(newer)) !== null) {
  //   // console.log(result);
  //   if (result[0]) {
  //     const newText = result[0].replace(/\b([A-Za-z.@_]+?)\b/g, '"$1"')
  //     updated = updated.replace(result[0], newText)
  //   }
  // }
  // console.log('xupdated', updated)
  
  log('newer', newer)
  // Wrap values missing quotes
  const newerStill = newer
    .replace(/:\s?([A-Za-z]+?)\s?,/g, ': "$1",')

    // Reset Temporarily stashed boolean values
    .replace(/:\s?("TRUE_PLACEHOLDER"+?)\s?/g, ': true')
    .replace(/:\s?("FALSE_PLACEHOLDER"+?)\s?/g, ': false')
    // malformed brackets
    .replace(/}"}$/, '}}')
    
  log('newerStill', newerStill)

  const [errSeven, six ] = parse(newerStill)
  error = errSeven
  if (six) {
    log('six', six)
    return six
  }

  // Attempt final rebalance
  const balance = coerceStr(newerStill, defaultValue)
    .replace(/\sfalse"}$/, ' false}')
    .replace(/\strue"}$/, ' true}')
  
  const [errEight, seven ] = parse(balance)


  error = errEight
 

  if (newerStill.match(/^"?\[{/) && !newerStill.match(/\}\]$/)) {
    const [errNine, eight ] = parse(`${newerStill} }]`)
    error = errNine
    if (eight) {
      log('eight', eight)
      return eight
    }
  }

  const convert = seven || newerStill
  if (typeof convert === 'string') {
    const looksLikeArray = convert.match(/^\[(.*)\]/)
    if (looksLikeArray && looksLikeArray[1]) {
      // TODO refactor for array support e,g ["x", "y"] wont work here
      const newVal = looksLikeArray[1].split(",").map((x) => {
        return parseJSON(x.trim())
      })
      return newVal
    }
  }

  if (seven) {
    // Parse string like array [one, two, 2, 4]
    log('seven', seven)
    return seven
  }

  // Try to balance object brackets
  if (convert && convert.match(/^{/)) {
    const leadingBrackets = (convert.match(/{/g) || []).length
    const trailingBrackets = (convert.match(/}/g) || []).length
    if (leadingBrackets !== trailingBrackets) {
      const addBrackets = Math.abs(leadingBrackets - trailingBrackets)
      const newBrackets = '}'.repeat(addBrackets)
      const lastTry = `${closeOpenQuote(convert)}${newBrackets}`
      const [errBracketBalance, bracketBalance ] = parse(lastTry)
      error = errBracketBalance
      if (bracketBalance) {
        log('bracketBalnce', bracketBalance)
        return bracketBalance
      }
    }
  }
 
  throw new Error(`Unable to parse JSON\n${error}\n\n${input}`)
}



function closeOpenQuote(str) {
  return str.replace(/("[^"\]}]+)$/, '$1"')
}

function fixEscapedKeys(value) {
  return value.replace(/\s?\\"/g, '"').replace(/\\"\:/, '":')
}

function replaceSingleQuotesInsideDoubleQuotes(str) {
  let output = ''
  let inDoubleQuote = false
  let escape = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (escape) {
      output += char
      escape = false
      continue
    }

    if (char === '\\') {
      output += char
      escape = true
      continue
    }

    if (char === '"') {
      inDoubleQuote = !inDoubleQuote
      output += char
      continue
    }

    output += inDoubleQuote && char === "'" ? '__INNER_SINGLE__' : char
  }

  return output
}

function clean(str) {
  return stripDanglingCommas(str.replace(/__INNER_SINGLE__/g, "'"))
}

function stripDanglingCommas(str) {
  let output = ''
  let quote = ''
  let escape = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (quote) {
      output += char
      if (escape) {
        escape = false
      } else if (char === '\\') {
        escape = true
      } else if (char === quote) {
        quote = ''
      }
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      output += char
      continue
    }

    if (char === '}' || char === ']') {
      output = removeTrailingCommaRun(output)
    }

    output += char
  }

  return removeCommasAfterFinalClose(output)
}

function removeTrailingCommaRun(str) {
  let end = str.length
  while (end > 0 && isWhitespace(str[end - 1])) {
    end--
  }

  let start = end
  let foundComma = false
  while (start > 0) {
    if (str[start - 1] === ',') {
      foundComma = true
      start--
      while (start > 0 && isWhitespace(str[start - 1])) {
        start--
      }
      continue
    }
    break
  }

  if (!foundComma) {
    return str
  }

  return str.slice(0, start)
}

function removeCommasAfterFinalClose(str) {
  let end = str.length
  while (end > 0 && isWhitespace(str[end - 1])) {
    end--
  }

  let cursor = end
  let foundComma = false
  while (cursor > 0) {
    if (str[cursor - 1] === ',') {
      foundComma = true
      cursor--
      while (cursor > 0 && isWhitespace(str[cursor - 1])) {
        cursor--
      }
      continue
    }
    break
  }

  if (foundComma && (str[cursor - 1] === '}' || str[cursor - 1] === ']')) {
    return str.slice(0, cursor)
  }

  return str
}

function isWhitespace(char) {
  return char === ' ' || char === '\n' || char === '\r' || char === '\t'
}

function parse(value) {
  let result, error
  try {
    result = JSON.parse(clean(value))
  } catch (err) {
    // log('err', err)
    error = err
  }
  return [ error, result ]
}

function parseLooseContainer(value) {
  if (typeof value !== 'string') {
    return { ok: false }
  }

  const parser = new LooseParser(value)
  return parser.parse()
}

class LooseParser {
  constructor(input) {
    this.input = input
    this.index = 0
  }

  parse() {
    this.skipWhitespace()
    const char = this.peek()
    if (char !== '{' && char !== '[') {
      return { ok: false }
    }

    try {
      const value = this.parseValue()
      this.skipWhitespace()
      return { ok: true, value }
    } catch (e) {
      return { ok: false, error: e }
    }
  }

  parseValue() {
    this.skipWhitespace()
    const char = this.peek()
    if (char === '{') return this.parseObject()
    if (char === '[') return this.parseArray()
    if (char === '"' || char === "'") return this.parseString()
    return this.parseBareValue()
  }

  parseObject() {
    const obj = {}
    this.index++

    while (this.index < this.input.length) {
      this.skipWhitespace()
      if (this.peek() === ',') {
        this.index++
        continue
      }
      if (this.peek() === '}') {
        this.index++
        return obj
      }

      const key = this.parseKey()
      this.skipWhitespace()
      if (this.peek() !== ':') {
        throw new Error('Expected object colon')
      }
      this.index++
      obj[key] = this.parseValue()

      this.skipWhitespace()
      if (this.peek() === ',') {
        this.index++
        continue
      }
      if (this.peek() === '}') {
        this.index++
        return obj
      }
    }

    return obj
  }

  parseArray() {
    const arr = []
    this.index++

    while (this.index < this.input.length) {
      this.skipWhitespace()
      if (this.peek() === ',') {
        if (this.isSparseArraySlot()) {
          arr.push('')
        }
        this.index++
        continue
      }
      if (this.peek() === ']') {
        this.index++
        return arr
      }

      arr.push(this.parseValue())

      this.skipWhitespace()
      if (this.peek() === ',') {
        this.index++
        continue
      }
      if (this.peek() === ']') {
        this.index++
        return arr
      }
    }

    return arr
  }

  parseKey() {
    this.skipWhitespace()
    const char = this.peek()
    if (char === '"' || char === "'") {
      return this.parseString()
    }
    return this.readUntil([':', '\n', '\r']).trim()
  }

  parseString() {
    const quote = this.peek()
    let value = ''
    let curlyDepth = 0
    let arrayDepth = 0
    let parenDepth = 0
    this.index++

    while (this.index < this.input.length) {
      const char = this.input[this.index]
      if (char === '\\') {
        this.index++
        if (this.index < this.input.length) {
          value += this.unescapeCharacter(this.input[this.index])
          this.index++
        }
        continue
      }
      if (char === quote && curlyDepth === 0 && arrayDepth === 0 && parenDepth === 0) {
        this.index++
        return value
      }
      if (char === '{') curlyDepth++
      else if (char === '}' && curlyDepth) curlyDepth--
      else if (char === '[') arrayDepth++
      else if (char === ']' && arrayDepth) arrayDepth--
      else if (char === '(') parenDepth++
      else if (char === ')' && parenDepth) parenDepth--
      value += char
      this.index++
    }

    return value
  }

  parseBareValue() {
    const raw = this.readBareToken().trim()
    if (raw === '') return ''
    if (raw === 'true') return true
    if (raw === 'false') return false
    if (raw === 'null') return null

    const number = Number(raw)
    if (!isNaN(number)) {
      return number
    }

    return raw
  }

  readBareToken() {
    let quote = ''
    let curlyDepth = 0
    let arrayDepth = 0
    let value = ''

    while (this.index < this.input.length) {
      const char = this.input[this.index]

      if (quote) {
        value += char
        if (char === '\\') {
          this.index++
          if (this.index < this.input.length) {
            value += this.input[this.index]
          }
        } else if (char === quote) {
          quote = ''
        }
        this.index++
        continue
      }

      if (char === '"' || char === "'") {
        quote = char
        value += char
        this.index++
        continue
      }

      if (char === '{') curlyDepth++
      else if (char === '}' && curlyDepth) curlyDepth--
      else if (char === '[') arrayDepth++
      else if (char === ']' && arrayDepth) arrayDepth--

      if (
        curlyDepth === 0 &&
        arrayDepth === 0 &&
        (char === ',' || char === '}' || char === ']')
      ) {
        break
      }

      value += char
      this.index++
    }

    return value
  }

  readUntil(stops) {
    let value = ''
    while (this.index < this.input.length && !stops.includes(this.input[this.index])) {
      value += this.input[this.index]
      this.index++
    }
    return value
  }

  skipWhitespace() {
    while (isWhitespace(this.peek())) {
      this.index++
    }
  }

  peek() {
    return this.input[this.index]
  }

  isSparseArraySlot() {
    let next = this.index + 1
    while (isWhitespace(this.input[next])) {
      next++
    }
    return this.input[next] !== ',' && this.input[next] !== ']'
  }

  unescapeCharacter(char) {
    if (char === 'n') return '\n'
    if (char === 'r') return '\r'
    if (char === 't') return '\t'
    if (char === 'b') return '\b'
    if (char === 'f') return '\f'
    return char
  }
}

// function convertStringObjectToJsonString(str) {
//   return str.replace(/(\w+:)|(\w+ :)/g, (matchedStr) => {
//     return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":'
//   })
// }

function convertStringObjectToJsonString(str) {
  return str.replace(/(\w+\s*(?::))[^:/]/g, (matchedStr) => {
    // console.log('matchedStr', matchedStr)
    const endsWith = matchedStr.match(/(["'A-Za-z0-9\[\{])$/)
    // console.log('endsWith', endsWith)
    const ending = (endsWith) ? endsWith[0] : ''
    const x = matchedStr.substring(0, matchedStr.length - 2)
    const y = x.trim().replace(/:/, '')
    const z = '"' + y + '": ' + ending
    // console.log('z', z)
    return z
  })
  .replace(/""/g, '"').replace(/"'/g, "'")
}

/*
function convertValuesObjectToJsonString(str) {
  return str.replace(/:(\w+')|(:\w+ ')/g, (matchedStr) => {
    return ": '" + matchedStr.substring(0, matchedStr.length - 1) + "'"
  })
}
*/

function needsMoreProcessing(value) {
  if (typeof value !== 'string') {
    return false
  }
  const stringType = getStringType(value)
  return stringType === 'array' || stringType === 'object'
}

function getStringType(value, defaultValue) {
  if (Array.isArray(value) || Array.isArray(defaultValue)) {
    return 'array'
  }

  if (defaultValue) {
    return typeof defaultValue
  }
  const type = typeof value
  if (type === 'string' && value.match(/^{/)) {
    return 'object'
  }
  if (type === 'string' && value.match(/^\[/)) {
    return 'array'
  }
  return type
}

// TODO verify regex https://github.com/b0uh/safe-regex-parser
function coerceStr(str, defaultReturn) {
  if (str === 'false' || str === 'true') return str
  let rawVal = trimQuotes(str)
  const type = getStringType(str, defaultReturn)
  if ((type === 'array' || type === 'object') && !isBalanced(str)) {
    // Find and try to fix mismatch brackets
    // https://regex101.com/r/qqkJSR/3
    const leadingBrackets = /^(?:\s+)?([[{(])(\s+)?(['|"])/g
    const match = leadingBrackets.exec(str)
    if (match) {
      // replace whitespace
      const start = match[0].replace(leadingBrackets, '$1$3')
      const end = start.split('').reverse().join('')
        .replace(/\[$/, ']')
        .replace(/\{$/, '}')
        .replace(/\($/, ')')
      const fixed = `${str.trim().replace(/['"]$/, '')}${end}`
      if (isBalanced(fixed)) {
        try {
          JSON.parse(fixed)
          return fixed
        } catch (e) {
          return fixed.replace(/'/g, '"')
        }
      }
    }
  }
  // If looks like array or object try and fix
  const startsWith = /^[[{]\s?['"]/ // {' {" [' ["
  const endsWith = /['"]\s?[\]}]$/ // '} "} '] "]
  if (str.match(startsWith) && str.match(endsWith)) {
    // Single Quoted objects
    return invertQuotes(str, "'", type)
  }

  // const format = formatter(rawVal, defaultReturn)
  return `"${rawVal}"`
}

function invertQuotes(str, quoteType, objectType) {
  const repInner = (objectType === 'array') ? '"' : `\\"`
  let output = ''
  let inQuotePair = false
  let escape = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (escape) {
      output += char
      escape = false
      continue
    }

    if (char === '\\') {
      output += char
      escape = true
      continue
    }

    if (char === quoteType) {
      inQuotePair = !inQuotePair
      output += '"'
      continue
    }

    if (char === '"') {
      output += repInner
      continue
    }

    output += char
  }

  return output
}

function coerceToString(val) {
  const type = typeof val
  if (isNull(val)) return null
  if (val === '' && type === 'string') return ''
  if (val === undefined && type === 'undefined') return

  if (Array.isArray(val)) {
    // log(`Converting Array into string`)
    return JSON.stringify(val)
  }
  if (type === 'object') {
    // log(`Converting Object into string`)
    return JSON.stringify(val)
  }
  if (type === 'boolean') {
    // log(`Converting Boolean into string`)
    return JSON.stringify(val)
  }
  return null
}
