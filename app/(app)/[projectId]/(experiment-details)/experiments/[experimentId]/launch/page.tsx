import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getExperiment } from "@/lib/requests/getExperiment"
import safeSerialize from "@/lib/safeSerialize"

import { LaunchExperimentPageRouter } from "./components/LaunchExperimentPageRouter"

export const dynamic = "force-dynamic"

export default async function Page({
    params,
}: {
    params: { projectId: string; experimentId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const [experiment, prompts] = await Promise.all([
        getExperiment(params.projectId, params.experimentId),
        prisma.prompt
            .findMany({
                where: {
                    projectId: params.projectId,
                },
                orderBy: {
                    version: "desc",
                },
            })
            .then(safeSerialize),
    ])

    if (experiment.didLaunch) {
        redirect(`/${params.projectId}/experiments/${params.experimentId}`)
    }

    return <LaunchExperimentPageRouter experiment={experiment} prompts={prompts} />
}
