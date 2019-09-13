const safe = require('safe-regex')
const RE2 = require('re2')
const patterns = require('../src/regex')
const vulnRegexDetector = require('vuln-regex-detector')

function isSafeSafeRegex(regex) {
  return safe(regex)
}

function isSafeRe2(regex) {
  try {
    new RE2(regex)
    return true
  } catch (error) {
    return false
  }
}

console.log('Run quick check. May contain false positives')
patterns.forEach((pat) => {
  const safe = isSafeSafeRegex(pat)
  console.log(`----------`)
  console.log(`Checking ${pat}`)
  console.log(`----------`)
  if (!safe) {
    console.log(`'safe-regex' says NOT SAFE ${pat}`)
  } else {
    console.log(`'safe-regex' says SAFE: ${pat}`)
  }
  const safeTwo = isSafeRe2(pat)
  if (!safeTwo) {
    console.log(`'re2' says NOT SAFE: ${pat}`)
  } else {
    console.log(`'re2' says SAFE: ${pat}`)
  }
})

/*
const regex = /'[^\\']*(\\'[^\\']*)*'/g // RegExp
const pattern = regex.source // String
const cacheConfig = {
  type: vulnRegexDetector.cacheTypes.persistent
}
const config = {
  cache: cacheConfig
}
console.log('Running robust scanner. This may take a while...')
console.log('You might need to run scanner project directly https://github.com/davisjam/vuln-regex-detector locally')

vulnRegexDetector.test(pattern, config).then((result) => {
  if (result === vulnRegexDetector.responses.vulnerable) {
    console.log('Regex is vulnerable')
  } else if (result === vulnRegexDetector.responses.safe) {
    console.log('Regex is safe')
  } else {
    console.log('Not sure if regex is safe or not')
  }
}).catch((err) => {
  console.log('Validation Failed. Library vuln-regex-detector error', err)
  console.log('Please run https://github.com/davisjam/vuln-regex-detector locally')
})
*/
