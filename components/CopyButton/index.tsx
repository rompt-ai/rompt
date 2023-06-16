import * as React from "react"
import { Check, Copy } from "lucide-react"

import { IconButton } from "../IconButton"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    value: string
    src?: string
}

async function copyToClipboardWithMeta(value: string, meta?: Record<string, unknown>) {
    navigator.clipboard.writeText(value)
}

export function CopyButton({ value, className, src, ...props }: CopyButtonProps) {
    const [hasCopied, setHasCopied] = React.useState(false)

    React.useEffect(() => {
        setTimeout(() => {
            setHasCopied(false)
        }, 2000)
    }, [hasCopied])

    return (
        <IconButton
            onClick={() => {
                copyToClipboardWithMeta(value, {
                    component: src,
                })
                setHasCopied(true)
            }}
            {...props}
        >
            <span className='sr-only'>Copy</span>
            {hasCopied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
        </IconButton>
    )
}
