/// <reference lib="es2018.asynciterable" />

type Stream<T> = Iterable<T> | AsyncIterable<T>

declare function chunk<T extends Uint8Array | string>(stream: Stream<T>, size?: number, option?: {
    zeroPadding?: boolean,
}): AsyncIterable<T>;

declare function chunk<T extends Uint8Array | string>(stream: Stream<T>, option?: {
    size?: number,
    zeroPadding?: boolean,
}): AsyncIterable<T>;

export = chunk;