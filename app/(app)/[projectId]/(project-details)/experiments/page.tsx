import Link from "next/link"
import dayjs from "dayjs"
import { Microscope, Plus } from "lucide-react"

import { getExperiments } from "@/lib/requests/getExperiments"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default async function Page({ params: { projectId } }: { params: { projectId: string } }) {
    const experiments = await getExperiments(projectId)

    const baseCardClassName = "rounded-lg border border-border p-4"
    return (
        <>
            {experiments.length === 0 ? (
                <div className={cn("w-[400px]", baseCardClassName)}>
                    <div className='inline-block rounded-md border border-border p-2 shadow-sm'>
                        <Microscope />
                    </div>
                    <div className='my-4 text-lg font-semibold'>Create your first experiment</div>
                    <p className='text-muted-foreground'>Your experiments will appear here once you create them.</p>
                    <Link href={`/${projectId}/experiments/create`}>
                        <Button className='mt-6 px-4'>
                            <Plus className='mr-2 h-4 w-4' />
                            New Experiment
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className='flex flex-wrap gap-4'>
                    {experiments.map((experiment) => (
                        <Link href={`/${projectId}/experiments/${experiment.id}`} key={experiment.id} prefetch={false}>
                            <div className={cn("w-[250px] bg-accent/60 hover:bg-accent/80", baseCardClassName)}>
                                <div className='inline-block rounded-md border border-slate-500 p-2 shadow-sm'>
                                    <Microscope />
                                </div>
                                <div className='my-4 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold'>
                                    {experiment.name}
                                </div>
                                <p className='text-sm text-muted-foreground'>Edited {dayjs(experiment.updatedAt).format("MMM D, YYYY")}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}
