import { DependencyList, EffectCallback, useEffect, useRef } from "react"

export function useIsomorphicEffect(effect: EffectCallback, deps?: DependencyList) {
    const effectCalled = useRef<boolean>(false)

    useEffect(() => {
        if (effectCalled.current) {
            return
        }
        effectCalled.current = true
        return effect()
    }, deps)
}
