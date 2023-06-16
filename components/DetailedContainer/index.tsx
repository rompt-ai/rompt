import React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tabs, TabsProps } from "@/components/Tabs"

export interface DetailedContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: string | React.ReactNode
    subtitle: string | React.ReactNode
    action?: React.ReactNode
    titleAction?: React.ReactNode
    tabsProps: TabsProps
    Icon: LucideIcon
}

export function DetailedContainer({ title, action, children, titleAction, tabsProps, subtitle, Icon, ...props }: DetailedContainerProps) {
    const rootSpacingClassNames = "px-4 md:px-24 lg:px-36 mx-auto"
    return (
        <main className='h-full'>
            <div className={cn("bg-muted/30 pb-6 pt-14", rootSpacingClassNames)}>
                <div className='flex items-center justify-between'>
                    <div className='relative'>
                        {titleAction && <div className='absolute left-0 top-[-65%]'>{titleAction}</div>}
                        <div className='flex h-[60px]'>
                            <div className='mr-6 flex h-[60px] w-[60px] items-center justify-center rounded-2xl border-[0.5px] border-border bg-accent shadow-md'>
                                <Icon size={24} className='text-foreground/90' />
                            </div>
                            <div className='flex h-[60px] flex-col justify-between py-[1px]'>
                                <h2 className='scroll-m-20 text-3xl font-semibold leading-none tracking-tight'>{title}</h2>
                                <p className='text-sm text-muted-foreground'>{subtitle}</p>
                            </div>
                        </div>
                    </div>
                    <span className='hidden md:block'>{action}</span>
                </div>
            </div>
            <div className={cn(rootSpacingClassNames, "bg-muted/30")}>
                <Tabs {...tabsProps} />
            </div>
            <div className='h-[0.5px] w-full bg-border' />
            <div {...props} className={cn("px-4 py-10", rootSpacingClassNames, props.className)}>
                {children}
            </div>
        </main>
    )
}
