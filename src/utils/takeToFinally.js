// https://github.com/Andarist/callbag-take-while/blob/master/src/index.js
export default function takeToFinally(predicate, lastly) {
  return source => (start, sink) => {
    if (start !== 0) return

    let sourceTalkback

    source(0, (type, data) => {
      if (type === 0) {
        sourceTalkback = data
      }

      if (type === 1 && !predicate(data)) {
        lastly(data)
        sourceTalkback(2)
        sink(2)
        return
      }

      sink(type, data)
    })
  }
}