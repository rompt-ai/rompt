import Link from "next/link"
import { redirect } from "next/navigation"
import dayjs from "dayjs"
import { FolderSymlink, Package } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"

import Container from "./components/Container"
import { CreateProjectDialog } from "./components/CreateProjectDialog"

export const dynamic = "auto"

export default async function ProjectsPage({
    searchParams,
}: {
    params: {}
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const projects = await prisma.project.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            updatedAt: true,
        },
    })

    if (searchParams["to-first"] === "true") {
        redirect(`/projects/${projects[0].id}`)
    }

    const baseCardClassName = "rounded-lg border border-border p-4"
    return (
        <Container title='Projects' action={<CreateProjectDialog variant={"default"} />}>
            {projects.length === 0 ? (
                <div className={cn("w-[400px]", baseCardClassName)}>
                    <div className='inline-block rounded-md border border-border p-2 shadow-sm'>
                        <Package />
                    </div>
                    <div className='my-4 text-lg font-semibold'>Create your first project</div>
                    <p className='mb-6 text-muted-foreground'>After you create your first project, it will appear here.</p>
                    <CreateProjectDialog />
                </div>
            ) : (
                <div className='flex flex-wrap gap-4'>
                    {projects.map(({ updatedAt, name, id }) => (
                        <Link href={`/projects/${id}`} key={id}>
                            <div className={cn("w-[250px] bg-accent/60 hover:bg-accent/80", baseCardClassName)}>
                                <div className='inline-block rounded-md border border-transparent p-2'>
                                    <FolderSymlink />
                                </div>
                                <div className='my-4 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold'>{name}</div>
                                <p className='text-sm text-muted-foreground'>Edited {dayjs(updatedAt).format("MMM D, YYYY")}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </Container>
    )
}
