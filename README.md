# block-iterator

## Transform input into equally-sized chunks as output.

A majorly simplified version of [block-stream2](https://www.npmjs.com/package/block-stream2). Dependency free and very fast.

Works with Uint8Arrays, Node Buffers, Arrays and Strings!

## Usage

``` js
import blockIterator from 'block-iterator'
import { Readable } from 'streamx'

const stream = fs.createReadStream(__dirname + '/letters.txt')

const asyncIterator = blockIterator(stream, 16, { zeroPadding: true })
const stream = Readable.from(asyncIterator)

stream.pipe(process.stdout)

// or

for await (const letters of blockIterator(stream, { size: 16, zeroPadding: true })) { // top level await
  console.log(letters)
}
```
Yields:
```
cat cag car cet
ceg cer cit cig
cir cot cog cor
cut cug cur dat
dag dar det deg
der dit dig dir
dot dog dor dut
dug dur fat fag
far fet feg fer
fit fig fir fot
fog for fut fug
fur\x0a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00
```

# Methods

``` js
import blockIterator from 'block-iterator'
```

## const b = blockIterator(opts)
## const b = blockIterator(size, opts)

Create a new async iterator `b` that outputs chunks of length `size` or
`opts.size`.

When `opts.zeroPadding` is false, do not zero-pad the last chunk.

# Install

With [npm](https://npmjs.org) do:

```
npm install block-iterator
```

# License

MIT
