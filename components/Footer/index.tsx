import Link from "next/link"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/Logo"

export default function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn("rounded-lg bg-transparent p-4 md:px-6 md:py-8", className)}>
            <hr className='my-6 border-border sm:mx-auto lg:my-8' />
            <div className='sm:flex sm:items-center sm:justify-between'>
                <Link href='/' className='mb-4 sm:mb-0'>
                    <Logo />
                </Link>
            </div>
        </footer>
    )
}
