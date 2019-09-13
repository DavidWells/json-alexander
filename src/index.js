const {
  isBalanced,
  trimQuotes,
  isNull
} = require('./utils')

module.exports = function parse(x, defaultValue) {
  const value = (typeof x === 'string') ? coerceStr(x, defaultValue) : coerceToString(x)
  try {
    if (isNull(value) && defaultValue) return defaultValue
    return JSON.parse(value)
  } catch (e) {
    // console.log(`JSON.parse failed: ${e.message}`)
    // console.log(value)
    try {
      const stringify = JSON.stringify(trimQuotes(value))
      return JSON.parse(stringify)
    } catch (e) {
      return defaultValue
    }
  }
}

module.exports.simple = function simpleParse(data, defaultValue) {
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

function getType(value, defaultValue) {
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
  const type = getType(str, defaultReturn)
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
  // console.log('Original', str)
  // const replaceOuterQuotes = new RegExp(`(${quoteType})(?=(?:[^${quoteType}]|${quoteType}[^]*${quoteType})*)`, 'g')
  // console.log('replaceOuterQuotes', replaceOuterQuotes)
  const quotePairsRegex = new RegExp(`${quoteType}[^\\\\${quoteType}]*(\\\\${quoteType}[^\\\\${quoteType}]*)*${quoteType}`, 'g')

  const quotePairs = str.match(quotePairsRegex)
  if (!quotePairs) {
    return str
  }
  const redactedOuter = cleanInner(str, quotePairs, quoteType)
  const redactedString = redactedOuter
    .replace(/'/g, 'INNERSINGLEQUOTE')
    .replace(/"/g, 'INNERDOUBLEQUOTE')
  // console.log('redactedString', redactedString)
  const repInner = (objectType === 'array') ? '"' : `\\"`
  const fixed = redactedString
    .replace(/OUTERDOUBLEQUOTE|OUTERSINGLEQUOTE/g, '"')
    .replace(/INNERSINGLEQUOTE/g, `'`)
    .replace(/INNERDOUBLEQUOTE/g, repInner)
  // console.log('fixed', fixed)
  return fixed
}

function cleanInner(str, pairs, quoteType) {
  const word = (quoteType === '"') ? 'OUTERDOUBLEQUOTE' : 'OUTERSINGLEQUOTE'
  const inverse = (quoteType === '"') ? "'" : '"'
  return pairs.reduce((acc, curr) => {
    const replaceInnerConflict = new RegExp(`${quoteType}`, 'g')
    console.log('replaceInnerConflict', replaceInnerConflict)
    const replaceInverseStart = new RegExp(`^${inverse}`)
    console.log('replaceInverseStart', replaceInverseStart)
    const replaceInverseEnd = new RegExp(`${inverse}$`)
    console.log('replaceInverseEnd', replaceInverseEnd)
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
    // console.log(`Converting Array into string`)
    return JSON.stringify(val)
  }
  if (type === 'object') {
    // console.log(`Converting Object into string`)
    return JSON.stringify(val)
  }
  if (type === 'boolean') {
    // console.log(`Converting Boolean into string`)
    return JSON.stringify(val)
  }
  return null
}
