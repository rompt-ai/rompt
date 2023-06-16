import Link from "next/link"
import dayjs from "dayjs"
import { AlignLeft, Package, Plus } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getProject } from "@/lib/requests/getProject"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function ProjectPage({ params: { projectId } }) {
    const [prompts, project] = await Promise.all([
        prisma.prompt.findMany({
            where: {
                projectId: projectId,
            },
            orderBy: {
                createdAt: "desc",
            },
            distinct: ["id"],
        }),
        getProject(projectId),
    ])

    if (!project) {
        throw new Error("Project not found")
    }

    const baseCardClassName = "rounded-lg border border-border p-4"
    return (
        <>
            {prompts.length === 0 ? (
                <div className={cn("w-[400px]", baseCardClassName)}>
                    <div className='inline-block rounded-md border border-border p-2 shadow-sm'>
                        <Package />
                    </div>
                    <div className='my-4 text-lg font-semibold'>Create your first prompt</div>
                    <p className='text-muted-foreground'>Your prompts will appear here once you create them.</p>
                    <Link href={`/projects/${project.id}/create`}>
                        <Button className='mt-6 px-4'>
                            <Plus className='mr-2 h-4 w-4' />
                            New Prompt
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className='flex flex-wrap gap-4'>
                    {prompts.map((prompt) => (
                        <Link href={`/projects/${project.id}/${prompt.id}/latest`} key={prompt.id}>
                            <div className={cn("w-[250px] bg-accent/60 hover:bg-accent/80", baseCardClassName)}>
                                <div className='inline-block rounded-md border border-border p-2 shadow-sm'>
                                    <AlignLeft />
                                </div>
                                <div className='my-4 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold'>
                                    {prompt.name}
                                </div>
                                <p className='text-sm text-muted-foreground'>Edited {dayjs(prompt.updatedAt).format("MMM D, YYYY")}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}
