type Stream = Iterable<any> | AsyncIterable<any>

declare function chunk(stream: Stream, size?: number, option?: {
    zeroPadding?: boolean,
}): AsyncIterable<Uint8Array | string>;

declare function chunk(stream: Stream, option?: {
    size?: number,
    zeroPadding?: boolean,
}): AsyncIterable<Uint8Array | string>;

export = chunk;