
/**
 * Verify brackets are balanced
 * @param  {string}  str - string with code
 * @return {Boolean}
 */
function isBalanced(str) {
  let count = 0
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char === '(' || char === '{' || char === '[') {
      count++
    } else if (char === ')' || char === '}' || char === ']') {
      count--
    }
  }
  return count === 0
}

/**
 * Remove leading and trailing quotes ' & "
 * @param  {string} str
 * @return {string}
 */
function trimQuotes(str) {
  return str.replace(/^['"]/, '').replace(/['"]$/, '')
}

function isNull(value) {
  return value === null && typeof value === 'object'
}

/*
// not in use
function formatter(x, defaultReturn) {
  const type = getType(x, defaultReturn)
  if (type === 'array') {
    return `[${x.replace(/^\[/, '').replace(/\]$/, '')}]`
  }
  if (type === 'object') {
    return `{${x.replace(/^\{/, '').replace(/\}$/, '')}}`
  }
  return `"${x}"`
}

function guessDefault(x, defaultReturn = '') {
  if (x.match(/^["']/)) {
    return ''
  }
  if (x.match(/^\[/)) {
    return []
  }
  if (x.match(/^\{/)) {
    return {}
  }
  console.log('guess')
  return defaultReturn
}

Regex
const replaceQuotesNotInside = /(')(?=(?:[^']|'[^]*')*$)/g

*/

module.exports = {
  isBalanced,
  trimQuotes,
  isNull
}
