"use client"

import Link from "next/link"
import { useParams, usePathname, useSelectedLayoutSegments } from "next/navigation"
import { Disclosure } from "@headlessui/react"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/Logo"

interface NavBarProps {
    className?: string
}

export function NavBar({ className }: NavBarProps) {
    const pathname = usePathname()
    const segments = useSelectedLayoutSegments()
    const { projectId } = useParams()!

    const navigation =
        segments[0] === "settings" || segments.length === 0
            ? []
            : ([
                  { name: "Projects", href: "/" },
                  { name: "Compare", href: `/${projectId}/compare` },
                  { name: "Experiments", href: `/${projectId}/experiments` },
                  { name: "Create prompt", href: `/${projectId}/create` },
                  { name: "API Keys", href: `/${projectId}/api-keys` },
              ] as const)

    return (
        <Disclosure as='nav'>
            {({ open }) => (
                <>
                    <div
                        className={cn(
                            "mx-auto px-4 md:px-24 lg:px-36",
                            segments.length === 0 ||
                                (segments[segments.length - 1] === "create" && segments[segments.length - 2] !== "experiments") ||
                                segments[segments.length - 1] === "compare" ||
                                segments.includes("settings")
                                ? "bg-background"
                                : "bg-muted/30",
                            className
                        )}
                    >
                        <div className='relative flex h-16 items-center justify-between'>
                            <div className={cn("absolute inset-y-0 left-0 flex items-center sm:hidden", !navigation.length && "hidden")}>
                                {/* Mobile menu button*/}
                                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-muted-foreground'>
                                    <span className='sr-only'>Open main menu</span>
                                    {open ? (
                                        <X className='block h-6 w-6' aria-hidden='true' />
                                    ) : (
                                        <Menu className='block h-6 w-6' aria-hidden='true' />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className='flex flex-1 items-center justify-start'>
                                <div className={cn("sm:ml-0", navigation.length && "ml-12")}>
                                    <Logo />
                                </div>
                                <div className={cn("hidden sm:ml-10 sm:block")}>
                                    <div className='flex space-x-1'>
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    pathname === item.href ? "text-foreground" : "text-foreground/75 hover:text-foreground",
                                                    "px-3 py-2 text-sm font-semibold"
                                                )}
                                                aria-current={pathname === item.href ? "page" : undefined}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {navigation.length > 0 && (
                        <Disclosure.Panel className='sm:hidden'>
                            <div className='space-y-1 px-2 pb-3 pt-2'>
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as='a'
                                        href={item.href}
                                        className={cn(
                                            pathname === item.href
                                                ? "bg-gray-900 text-white"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                            "block rounded-md px-3 py-2 text-base font-medium"
                                        )}
                                        aria-current={pathname === item.href ? "page" : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    )}
                </>
            )}
        </Disclosure>
    )
}
