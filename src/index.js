const { is } = require('uvu/assert')
const { isBalanced, trimQuotes, isNull } = require('./utils')

const DEBUG = false
const log = (DEBUG) ? console.log : () => {} 

// https://regex101.com/r/hos7d8/1
const TRAILING_JSON_COMMAS = /([}\]]),+(\s*),*(\s*)$/

const TOO_MANY_TRAILING = /(["}\]]),{2,}$/gm

const TRAILING_ARRAY = /(,+[^\S]*)*(])(,+)\s*/g
// https://regex101.com/r/XHmshu/1
const TRAILING_ARRAY_LAST = /(,+[^\S]*)*(])(,+)\s*([}\]])/g

const TRAILING_OBJECT = /(,[^\S]*)*(})(,+)\s*/g
// https://regex101.com/r/7LCYou/1
const TRAILING_OBJECT_LAST = /(,+[^\S]*)*(\})?(,+)\s*([}\]])/g

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

function replaceInnerCharPattern(char = '\\s', open, close, repeat = 0, flags) {
  // og /\s(?=(?:(?:[^"]*(?:")){2})*[^"]*(?:")[^"]*$)/g
  const repeatVal = (repeat) ? `{${repeat}}` : ''
  // const o = (allSpace) ? '' : open
  const o = open
  const f = flags || 'g'
  return new RegExp(`${char}(?=(?:(?:[^${open}]*(?:${open}))${repeatVal})*[^${o}]*(?:${close})[^${close}]*$)`, f)
}


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
  
  const [ err, first ] = parse(value)
  error = err
  // log('trimmed', trimmed)
  if (first) {
    log('first', first)
    if (!needsMoreProcessing(first)) {
      return first
    }
  }

  let trimmed = trimQuotes(value)
  log('trimmed', `|${trimmed}|`)

  // const DOUBLE_IN_SINGLE_QUOTE_RE = replaceInnerCharPattern('"', "'", "'", 2)
  const SINGLE_IN_DOUBLE_QUOTE_RE = replaceInnerCharPattern("'", '"', '"', 2)
  
  if (trimmed.indexOf("'") > -1 && SINGLE_IN_DOUBLE_QUOTE_RE.test(trimmed)) {
    trimmed = trimmed.replace(SINGLE_IN_DOUBLE_QUOTE_RE, '__INNER_SINGLE__')
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

function clean(str) {
  return str
    .replace(/__INNER_SINGLE__/g, "'")
    .replace(TOO_MANY_TRAILING,'$1,')
    .replace(TRAILING_JSON_COMMAS, '$1')
    .replace(TRAILING_ARRAY_LAST, '$2$4')
    .replace(TRAILING_OBJECT_LAST, '$2$4')
    // .replace(TRAILING_ARRAY, '$2,')
    // .replace(TRAILING_OBJECT, '$2,')
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
  // log('Original', str)
  // const replaceOuterQuotes = new RegExp(`(${quoteType})(?=(?:[^${quoteType}]|${quoteType}[^]*${quoteType})*)`, 'g')
  // log('replaceOuterQuotes', replaceOuterQuotes)
  const quotePairsRegex = new RegExp(`${quoteType}[^\\\\${quoteType}]*(\\\\${quoteType}[^\\\\${quoteType}]*)*${quoteType}`, 'g')

  const quotePairs = str.match(quotePairsRegex)
  if (!quotePairs) {
    return str
  }
  const redactedOuter = cleanInner(str, quotePairs, quoteType)
  const redactedString = redactedOuter
    .replace(/'/g, 'INNERSINGLEQUOTE')
    .replace(/"/g, 'INNERDOUBLEQUOTE')
  // log('redactedString', redactedString)
  const repInner = (objectType === 'array') ? '"' : `\\"`
  const fixed = redactedString
    .replace(/OUTERDOUBLEQUOTE|OUTERSINGLEQUOTE/g, '"')
    .replace(/INNERSINGLEQUOTE/g, `'`)
    .replace(/INNERDOUBLEQUOTE/g, repInner)
  // log('fixed', fixed)
  return fixed
}

function cleanInner(str, pairs, quoteType) {
  const word = (quoteType === '"') ? 'OUTERDOUBLEQUOTE' : 'OUTERSINGLEQUOTE'
  const inverse = (quoteType === '"') ? "'" : '"'
  return pairs.reduce((acc, curr) => {
    const replaceInnerConflict = new RegExp(`${quoteType}`, 'g')
    // log('replaceInnerConflict', replaceInnerConflict)
    const replaceInverseStart = new RegExp(`^${inverse}`)
    // log('replaceInverseStart', replaceInverseStart)
    const replaceInverseEnd = new RegExp(`${inverse}$`)
    // log('replaceInverseEnd', replaceInverseEnd)
    const fix = curr
      // replace inner "
      .replace(replaceInnerConflict, `${word}`)
      // replace beginning quote
      .replace(replaceInverseStart, quoteType)
      // replace ending quote
      .replace(replaceInverseEnd, quoteType)
    acc = acc.replace(curr, fix)
    return acc
  }, str)
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
