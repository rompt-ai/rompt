import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function SourceRow({ children, icon, className }: { children: React.ReactNode; icon?: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "group flex w-full cursor-pointer items-center justify-between rounded-lg border border-border px-2.5 py-1.5",
                "bg-transparent transition-colors hover:bg-muted",
                className
            )}
        >
            <small className='truncate text-xs font-medium tracking-tight'>{children}</small>
            <div className='inline-flex shrink-0'>
                {icon ? icon : <ArrowRight className='ml-2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground' />}
            </div>
        </div>
    )
}
