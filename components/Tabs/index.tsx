"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type PossibleTab = {
    title: string
    slug?: string
    aliases?: (string | { type: "regex"; value: string })[]
    disabled?: boolean
    prefetch?: boolean
}

export interface TabsProps {
    tabs: PossibleTab[]
    path: string
}

export function Tabs({ tabs, path }: TabsProps) {
    const pathname = usePathname()!

    return (
        <div className='flex justify-start space-x-5 overflow-x-clip'>
            {tabs.map((item: PossibleTab) => {
                const isActive =
                    (item.slug && pathname.endsWith(item.slug)) ||
                    (item.aliases &&
                        item.aliases.some((alias) =>
                            typeof alias === "string" ? pathname.endsWith(alias) : new RegExp(alias.value).test(pathname)
                        )) ||
                    (item.slug === undefined &&
                        !tabs.some(
                            (tab) =>
                                (tab.slug && pathname.endsWith(tab.slug)) ||
                                (tab.aliases &&
                                    tab.aliases.some((alias) =>
                                        typeof alias === "string" ? pathname.endsWith(alias) : new RegExp(alias.value).test(pathname)
                                    ))
                        ))

                const href = item.slug ? path + item.slug : path
                return (
                    <Link
                        key={item.title}
                        href={href}
                        className={cn(item.disabled && "pointer-events-none opacity-30")}
                        prefetch={item.prefetch}
                    >
                        <div
                            className={cn(
                                "mb-[-1px] flex max-w-xs space-x-2 truncate whitespace-nowrap p-2 font-medium focus:outline-none focus:ring-0",
                                isActive
                                    ? "border-b-2 border-slate-50 text-slate-50"
                                    : "border-b-2 border-transparent text-slate-300 hover:border-slate-50 hover:text-slate-50"
                            )}
                        >
                            {item.title}
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
