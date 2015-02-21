import {Transform} from "stream"

const copy = function(source) {
  const target = {}

  for (let key in source) target[key] = source[key]

  return target
}

const transformFn = function(fn) {
  const objectMode = true
  const transform = (data, enc, cb) => cb(null, fn(data))

  return Transform({objectMode, transform})
}

export default pattern => {
  const tokens = pattern.split(/\$\{([\S\s]*?)\}/)

  const matchSrc = tokens.reduce((src = "", token, i) => {
    return src + (i % 2 ? "(.*?)" : token.replace(/./g, "\\$&"))
  })

  const matchRe = new RegExp(`^${matchSrc}$`)

  const parse = kv => {
    const {key, value} = copy(kv)
    const match = key.match(matchRe) || []

    match.slice(1).forEach((prop, i) => value[tokens[2 * i + 1]] = prop)

    return value
  }

  const serialize = obj => {
    const value = copy(obj)
    const key = tokens.reduce((key = "", name, i) => {
      if (i % 2 === 0) return key + name

      key += value[name]
      delete value[name]
      return key
    })

    return {key, value}
  }

  return {
    serialize: (...args) => 0 in args ? serialize(...args) : transformFn(serialize),
    parse    : (...args) => 0 in args ? parse(...args) : transformFn(parse)
  }
}
