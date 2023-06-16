"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ContainerAction({ projectId }: { projectId: string }) {
    const pathname = usePathname()!

    if (pathname.includes("experiments")) {
        return (
            <Link href={`/projects/${projectId}/experiments/create`}>
                <Button className='px-4'>
                    <Plus className='mr-2 h-4 w-4' />
                    New Experiment
                </Button>
            </Link>
        )
    } else {
        return (
            <Link href={`/projects/${projectId}/create`}>
                <Button className='px-4'>
                    <Plus className='mr-2 h-4 w-4' />
                    New Prompt
                </Button>
            </Link>
        )
    }
}
