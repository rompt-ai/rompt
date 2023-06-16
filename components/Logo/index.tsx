import localFont from "next/font/local"

import { cn } from "@/lib/utils"

const roie = localFont({ src: "../../assets/fonts/Roie.woff2", display: "swap" })

export function Logo() {
    return <h4 className={cn("scroll-m-20 text-xl font-semibold leading-none tracking-wide text-foreground", roie.className)}>Rompt.ai</h4>
}
