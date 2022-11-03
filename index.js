function concat (chunks, size) {
  if (!size) size = chunks.reduce((acc, curr) => acc + curr.length, 0)

  const b = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    b.set(chunk, offset)
    offset += chunk.byteLength || chunk.length
  }

  return b
}

module.exports = async function * (iterator, size = 512, opts = {}) { // <3 Endless
  if (typeof size === 'object') {
    opts = size
    size = opts.size
  }
  let { nopad, zeroPadding = true } = opts

  if (nopad) zeroPadding = false

  let buffered = []
  let bufferedBytes = 0

  for await (const value of iterator) {
    bufferedBytes += value.byteLength || value.length
    buffered.push(value)

    while (bufferedBytes >= size) {
      const b = concat(buffered)
      bufferedBytes -= size
      yield b.slice(0, size)
      buffered = [b.slice(size, b.length)]
    }
  }
  if (bufferedBytes) {
    if (zeroPadding) buffered.push(new Uint8Array(size - bufferedBytes))
    yield concat(buffered)
  }
}
