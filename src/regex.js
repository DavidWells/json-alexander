module.exports = [
  {
    name: 'wrap true object values',
    regex: /:\s?(true+?)\s?/g,
  },
  {
    name: 'wrap false object values',
    regex: /:\s?(false+?)\s?/g,
  },
  {
    name: 'wrap bare single array item',
    regex: /\[\s?([A-Za-z.@_]+?)\s?\]/g,
  },
  {
    name: 'wrap bare object value before close',
    regex: /:\s?([A-Za-z]+?)\s?}/g,
  },
  {
    name: 'wrap bare object value before comma',
    regex: /:\s?([A-Za-z]+?)\s?,/g,
  },
  {
    name: 'restore true placeholder',
    regex: /:\s?("TRUE_PLACEHOLDER"+?)\s?/g,
  },
  {
    name: 'restore false placeholder',
    regex: /:\s?("FALSE_PLACEHOLDER"+?)\s?/g,
  },
  {
    name: 'array object prefix',
    regex: /^"?\[{/,
  },
  {
    name: 'array object suffix',
    regex: /\}\]$/,
  },
  {
    name: 'loose array wrapper',
    regex: /^\[(.*)\]/,
  },
  {
    name: 'close open quote',
    regex: /("[^"\]}]+)$/,
  },
  {
    name: 'escaped quote spacing',
    regex: /\s?\\"/g,
  },
  {
    name: 'escaped key colon',
    regex: /\\"\:/,
  },
  {
    name: 'object key formatter',
    regex: /(\w+\s*(?::))[^:/]/g,
  },
  {
    name: 'formatter ending char',
    regex: /(["'A-Za-z0-9\[\{])$/,
  },
  {
    name: 'leading brackets',
    regex: /^(?:\s+)?([[{(])(\s+)?(['|"])/g,
  },
  {
    name: 'starts with quoted container',
    regex: /^[[{]\s?['"]/,
  },
  {
    name: 'ends with quoted container',
    regex: /['"]\s?[\]}]$/,
  },
]
