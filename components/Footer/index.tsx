import Link from "next/link"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/Logo"

export default function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn("rounded-lg bg-transparent p-4 md:px-6 md:py-8", className)}>
            <div className='sm:flex sm:items-center sm:justify-between'>
                <Link href='/' className='mb-4 sm:mb-0'>
                    <Logo />
                </Link>
                <ul className='my-6 block flex-wrap items-center space-y-4 text-sm text-muted-foreground sm:my-0 sm:flex sm:space-y-0'>
                    <li>
                        <Link href='/privacy' className='mr-4 hover:underline md:mr-6'>
                            Privacy Policy
                        </Link>
                    </li>
                    <li>
                        <Link href='/terms' className='mr-4 hover:underline md:mr-6 '>
                            Terms of Service
                        </Link>
                    </li>
                    <li>
                        <Link href='/aup' className='mr-4 hover:underline md:mr-6 '>
                            Acceptable Use Policy
                        </Link>
                    </li>
                </ul>
            </div>
            <hr className='my-6 border-border sm:mx-auto lg:my-8' />
            <span className='block text-sm text-muted-foreground sm:text-center'>
                <b>© Rompt.ai</b> All Rights Reserved.
            </span>
        </footer>
    )
}
