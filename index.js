function concat (chunks, size) {
  if (typeof chunks[0] === 'string') return chunks.join('')
  if (!size) {
    size = 0
    let i = chunks.length || chunks.byteLength || 0
    while (i--) size += chunks[i].length
  }
  const b = new Uint8Array(size)
  let offset = 0
  for (let i = 0, l = chunks.length; i < l; i++) {
    const chunk = chunks[i]
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
