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

module.exports = async function * (iterator, size = 512) { // <3 Endless
  let buffered = []
  let bufferedBytes = 0

  for await (const value of iterator) {
    bufferedBytes += value.byteLength
    buffered.push(value)

    while (bufferedBytes >= size) {
      const b = concat(buffered)
      bufferedBytes -= size
      yield b.slice(0, size)
      buffered = [b.slice(size, b.length)]
    }
  }
  yield concat(buffered, bufferedBytes)
}
