import * as React from "react"

import { cn } from "@/lib/utils"

type IconButtonProps =
    | ({
          as?: "button"
      } & React.HTMLAttributes<HTMLButtonElement>)
    | ({
          as: "span"
      } & React.HTMLAttributes<HTMLSpanElement>)

export function IconButton({ as, ...props }: IconButtonProps) {
    const Component = as ?? "button"
    return (
        <Component
            {...props}
            className={cn(
                "relative z-20 inline-flex h-8 items-center justify-center rounded-md border-border p-2 text-sm font-medium transition-all hover:bg-secondary focus:outline-none",
                props.className
            )}
        />
    )
}
