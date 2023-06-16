import { useCallback, useEffect } from "react"

function on<T extends Window | Document | HTMLElement | EventTarget>(
    obj: T | null,
    ...args: Parameters<T["addEventListener"]> | [string, Function | null, ...any]
): void {
    if (obj && obj.addEventListener) {
        obj.addEventListener(...(args as Parameters<HTMLElement["addEventListener"]>))
    }
}

function off<T extends Window | Document | HTMLElement | EventTarget>(
    obj: T | null,
    ...args: Parameters<T["removeEventListener"]> | [string, Function | null, ...any]
): void {
    if (obj && obj.removeEventListener) {
        obj.removeEventListener(...(args as Parameters<HTMLElement["removeEventListener"]>))
    }
}

export const useBeforeUnload = (enabled: boolean | (() => boolean) = true, message?: string) => {
    const handler = useCallback(
        (event: BeforeUnloadEvent) => {
            const finalEnabled = typeof enabled === "function" ? enabled() : true

            if (!finalEnabled) {
                return
            }

            event.preventDefault()

            if (message) {
                event.returnValue = message
            }

            return message
        },
        [enabled, message]
    )

    useEffect(() => {
        if (!enabled) {
            return
        }

        on(window, "beforeunload", handler)

        return () => off(window, "beforeunload", handler)
    }, [enabled, handler])
}
