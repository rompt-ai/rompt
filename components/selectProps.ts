import { cn } from "../lib/utils"

export const selectProps = (className?: string) =>
    ({
        position: "popper",
        side: "bottom",
        className: cn("max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)] !shadow-2xl", className),
        sideOffset: 4,
    } as const)
