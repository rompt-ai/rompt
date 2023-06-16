"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import BackButton from "@/components/BackButton"

export function SmartBackButton({ projectId }: { projectId: string }) {
    const pathname = usePathname()!

    return (
        <Link href={pathname.endsWith("create") ? `/projects/${projectId}/experiments` : `/projects`}>
            <BackButton />
        </Link>
    )
}
