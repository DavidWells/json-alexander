const patterns = require('../src/regex')
const { parseJSON } = require('../src')

const MAX_REGEX_MS = 250
const MAX_PARSE_MS = 250

function time(fn) {
  const started = process.hrtime.bigint()
  fn()
  return Number(process.hrtime.bigint() - started) / 1e6
}

function checkRegexPatterns() {
  const inputs = [
    ['comma-space run without close', '[' + ', '.repeat(16000) + 'x'],
    ['escaped quote run', "'" + "\\'".repeat(16000)],
    ['odd double quote run', '"'.repeat(32000) + "'"],
    ['word colon run', 'a:'.repeat(32000)],
  ]

  patterns.forEach(({ name, regex }) => {
    inputs.forEach(([inputName, input]) => {
      regex.lastIndex = 0
      const ms = time(() => regex.test(input))
      console.log(`${name} / ${inputName}: ${ms.toFixed(2)}ms`)
      if (ms > MAX_REGEX_MS) {
        throw new Error(`Potential ReDoS pattern: ${name} took ${ms.toFixed(2)}ms for ${inputName}`)
      }
    })
  })
}

function checkParserAdversarialInputs() {
  const cases = [
    ['comma-space array without close', '[' + ', '.repeat(16000) + 'x'],
    ['unbalanced quoted array', '[' + "'x', ".repeat(16000)],
    ['many trailing commas', "['x'" + ','.repeat(16000) + ']'],
    ['single quotes inside double string', `{ a: "${"'".repeat(16000)}" }`],
  ]

  cases.forEach(([name, input]) => {
    const ms = time(() => {
      try {
        parseJSON(input)
      } catch (e) {}
    })
    console.log(`parseJSON / ${name}: ${ms.toFixed(2)}ms`)
    if (ms > MAX_PARSE_MS) {
      throw new Error(`Potential parser ReDoS path: ${name} took ${ms.toFixed(2)}ms`)
    }
  })
}

console.log('Checking regex patterns for adversarial timing')
checkRegexPatterns()
console.log('Checking parser adversarial inputs')
checkParserAdversarialInputs()
console.log('No obvious regex DoS timing issues found')
