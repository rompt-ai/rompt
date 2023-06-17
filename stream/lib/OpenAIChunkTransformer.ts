import { Transform, TransformCallback, TransformOptions } from "stream"

export class OpenAIChunkTransformer extends Transform {
    private decodedChunks: string[] = []
    private encoder = new TextEncoder()
    private decoder = new TextDecoder()

    constructor(private model: string, private onComplete: (output: string) => void, nativeTransformOptions?: TransformOptions) {
        super(nativeTransformOptions)
        this.on("finish", () => onComplete(this.decodedChunks.join("")))
    }

    _transform(chunk: Uint8Array, encoding: BufferEncoding, callback: TransformCallback) {
        const decoded = this.decoder.decode(chunk)
        const response = JSON.parse(decoded)
        const firstResult = response?.choices?.[0] || {}

        if (OpenAIChunkTransformer.isOpenAIModelChat(this.model)) {
            // https://github.com/SpellcraftAI/openai-streams/blob/1258eccad37cb1fc2c277316d89c452718fb6ac8/src/lib/streaming/transforms.ts#L31
            if (firstResult.finish_reason === "stop" || firstResult.finish_reason === "length") {
                this.push(null)
            } else {
                const text: string | undefined = firstResult?.delta?.content
                if (text) {
                    this.decodedChunks.push(text)
                    this.push(this.encoder.encode(text))
                }
            }

            callback()
        } else {
            // https://github.com/SpellcraftAI/openai-streams/blob/1258eccad37cb1fc2c277316d89c452718fb6ac8/src/lib/streaming/transforms.ts#L52
            if (firstResult.finish_reason === "stop" || firstResult.finish_reason === "length") {
                this.push(null)
            } else {
                const text: string | undefined = firstResult?.text ?? firstResult?.message
                if (typeof text === "string") {
                    this.decodedChunks.push(text)
                    this.push(this.encoder.encode(text))
                }
            }

            callback()
        }
    }

    static isOpenAIModelChat(model: string) {
        return model.startsWith("gpt-")
    }
}
