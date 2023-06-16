import { forwardRef } from "react"
import { ScrollbarProps, Scrollbars } from "react-custom-scrollbars-2"

import { cn } from "@/lib/utils"

const thumbRenderer = ({ style, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div style={style} {...props} className={cn(props.className, "rounded-md bg-slate-600 active:bg-slate-500")} />
}

export const ScrollBars = forwardRef<Scrollbars, ScrollbarProps>(function ScrollBars(props, ref) {
    return <Scrollbars ref={ref} renderThumbVertical={thumbRenderer} universal renderThumbHorizontal={thumbRenderer} {...props} />
})
