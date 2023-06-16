import { cn } from "@/lib/utils"

import { CopyButton } from "../CopyButton"

interface CodeBlockProps {
    children: string
    className?: string
    hideCopy?: boolean
    codeClassName?: string
    spanClassName?: string
}

export function CodeBlock({ children, className, hideCopy, codeClassName, spanClassName }: CodeBlockProps) {
    return (
        <pre className={cn("mb-4 mt-6 overflow-x-auto rounded-lg border", "relative border-border bg-background px-2 py-4", className)}>
            {!hideCopy && (
                <div className='absolute right-4 top-0 z-20 inline-flex h-[60px] items-center justify-center opacity-70 transition-opacity hover:opacity-100'>
                    <CopyButton value={children} />
                </div>
            )}
            <code className={cn("rounded font-mono text-sm font-semibold", "whitespace-pre-wrap bg-transparent", codeClassName)}>
                <span className={cn("inline-block min-h-[0.85rem] break-all px-4 py-1", spanClassName)}>{children}</span>
            </code>
        </pre>
    )
}
