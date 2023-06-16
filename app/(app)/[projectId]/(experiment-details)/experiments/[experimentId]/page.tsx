import { redirect } from "next/navigation"

import { getExperiment } from "@/lib/requests/getExperiment"

export const dynamic = "force-dynamic"

export default async function Page({
    params,
}: {
    params: { projectId: string; experimentId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const experiment = await getExperiment(params.projectId, params.experimentId)

    if (!experiment.didLaunch) {
        redirect(`/${params.projectId}/experiments/${params.experimentId}/launch`)
    } else {
        redirect(`/${params.projectId}/experiments/${params.experimentId}/view`)
    }

    return <></>
}
