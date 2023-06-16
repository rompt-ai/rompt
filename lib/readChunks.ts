export function readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
    return {
        async *[Symbol.asyncIterator]() {
            let readResult = await reader.read()
            while (!readResult.done) {
                yield readResult.value
                readResult = await reader.read()
            }
        },
    }
}
