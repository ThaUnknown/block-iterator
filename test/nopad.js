
const blockIterator = require('../')
const test = require('tape')

test("don't pad, small writes", async t => {
  async function * data () {
    yield Buffer.from('a')
    yield Buffer.from('b')
    yield Buffer.from('c')
  }

  for await (const c of blockIterator(data(), 16, { nopad: true })) {
    t.equal(Buffer.from(c).toString(), 'abc', "should get 'abc'")
  }

  t.end()
})

test("don't pad, exact write", async t => {
  async function * data () {
    yield Buffer.from('abcdefghijklmnop')
  }
  t.plan(1)
  let first = true
  for await (const c of blockIterator(data(), 16, { nopad: true })) {
    if (first) {
      first = false
      t.equal(Buffer.from(c).toString(), 'abcdefghijklmnop', 'first chunk')
    } else {
      t.fail('should only get one')
    }
  }

  t.end()
})

test("don't pad, big write", async t => {
  async function * data () {
    yield Buffer.from('abcdefghijklmnopq')
  }
  t.plan(2)

  let first = true
  for await (const c of blockIterator(data(), 16, { nopad: true })) {
    if (first) {
      first = false
      t.equal(Buffer.from(c).toString(), 'abcdefghijklmnop', 'first chunk')
    } else {
      t.equal(Buffer.from(c).toString(), 'q')
    }
  }

  t.end()
})
