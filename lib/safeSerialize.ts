export type SafeSerializeCast<T> = T extends Date
    ? string
    : T extends (infer U)[]
    ? SafeSerializeCast<U>[]
    : T extends object
    ? { [K in keyof T]: SafeSerializeCast<T[K]> }
    : T

export default function safeSerialize<const T>(data: T): SafeSerializeCast<T> {
    return JSON.parse(JSON.stringify(data))
}
