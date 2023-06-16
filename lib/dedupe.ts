import pMemoize from "p-memoize"

type Primitive = string | number | boolean | undefined | null

export const dedupe = <Args extends readonly Primitive[], T extends Promise<any>>(fn: (...arguments_: Args) => T) =>
    pMemoize(fn, {
        cacheKey: JSON.stringify,
        cache: false,
    })
