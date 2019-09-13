
// https://regex101.com/r/WWrRQF/1
const quotePairsRegex = /'[^\\']*(\\'[^\\']*)*'/g
const replaceInnerConflict = /'/g
const replaceInverseStart = /^"/
const replaceInverseEnd = /"$/

// const wrappingQuotes = /(')(?=(?:[^']|'[^]*')*)/g

// const regex = /(\[|\{|\()(\s+)?(['|"])/g
// https://regex101.com/r/qqkJSR/1
/* Is safe according to https://github.com/davisjam/vuln-regex-detector */
const leadingBrackets = /^(?:\s+)?([[{(])(\s+)?(['|"])/g
// const regex = /^([\[\{\(])([ \t]+)?(['"])/gm
const startsWith = /^[[{]\s?['"]/ // {' {" [' ["
const endsWith = /['"]\s?[\]}]$/ // '} "} '] "]

module.exports = [
  quotePairsRegex,
  replaceInnerConflict,
  replaceInverseStart,
  replaceInverseEnd,
  leadingBrackets,
  startsWith,
  endsWith,
]
