function concat (chunks, size) {
  if (typeof chunks[0] === 'string') return chunks.join('')
  if (typeof chunks[0] === 'number') return new Uint8Array(chunks)
  const b = new Uint8Array(size)
  let offset = 0
  for (let i = 0, l = chunks.length; i < l; i++) {
    const chunk = chunks[i]
    b.set(chunk, offset)
    offset += chunk.byteLength || chunk.length
  }

  return b
}

module.exports = async function * (iterator, size = 512, opts = {}) {
  if (typeof size === 'object') {
    opts = size
    size = opts.size
  }
  let { nopad, zeroPadding = true } = opts

  if (nopad) zeroPadding = false

  let buffered = []
  let bufferedBytes = 0

  for await (const value of iterator) {
    bufferedBytes += value.byteLength || value.length || 1
    buffered.push(value)

    if (bufferedBytes >= size) {
      const b = concat(buffered, bufferedBytes)
      let offset = 0

      while (bufferedBytes >= size) {
        yield b.slice(offset, offset + size)
        bufferedBytes -= size
        offset += size
      }

      buffered = [b.slice(offset, b.length)]
    }
  }
  if (bufferedBytes) yield concat(buffered, zeroPadding ? size : bufferedBytes)
}
