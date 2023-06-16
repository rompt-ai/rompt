import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getServicesWithValidKeys } from "@/lib/requests/getServicesWithValidKeys"
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
    const [experiment, servicesWithValidKeys, prompts] = await Promise.all([
        getExperiment(params.projectId, params.experimentId),
        getServicesWithValidKeys(params.projectId),
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
        redirect(`/projects/${params.projectId}/experiments/${params.experimentId}`)
    }

    return <LaunchExperimentPageRouter experiment={experiment} prompts={prompts} servicesWithValidKeys={servicesWithValidKeys} />
}
