import React from "react"

import { cn } from "@/lib/utils"

interface ContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title?: string | React.ReactNode
    action?: React.ReactNode
    titleAction?: React.ReactNode
    hideBorder?: boolean
}

export default function Container({ title, action, children, titleAction, hideBorder, ...props }: ContainerProps) {
    return (
        <main className='h-full'>
            <div {...props} className={cn("mx-auto px-4 py-10 md:px-24 lg:px-36", props.className)}>
                {title && (
                    <>
                        <div className='flex items-center justify-between'>
                            <div className='relative'>
                                {titleAction && <div className='absolute left-0 top-[-85%]'>{titleAction}</div>}
                                <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{title}</h3>
                            </div>
                            <span className='hidden md:block'>{action}</span>
                        </div>
                        <div className={cn("mb-8 mt-4 h-[0.5px] w-full", hideBorder ? "bg-transparent" : "bg-border")} />
                    </>
                )}
                {children}
            </div>
        </main>
    )
}
