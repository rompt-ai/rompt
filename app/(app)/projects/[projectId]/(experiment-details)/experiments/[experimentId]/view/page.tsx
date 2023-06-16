import { OutputGenerationStatus } from "@prisma/client"

import { generateRunExperimentPromptHmac } from "@/lib/generateRunExperimentPromptHmac"
import { getFullExperiment } from "@/lib/requests/getFullExperiment"
import { forceArrToString } from "@/lib/utils"

import { ExperimentResultTable } from "./components/ExperimentResultTable"
import { FullExperimentPromptsWithHmac } from "./components/types"

export const dynamic = "force-dynamic"

export default async function Page({
    params,
    searchParams,
}: {
    params: { projectId: string; experimentId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { experimentPrompts, experimentVariables, ...experimentInfo } = await getFullExperiment(
        params.projectId,
        params.experimentId,
        searchParams["experimentPromptId"] ? forceArrToString(searchParams["experimentPromptId"]) : undefined
    )

    const experimentPromptsWithHmac: FullExperimentPromptsWithHmac = experimentPrompts.map((experimentPrompt) => {
        if (experimentPrompt.outputGenerationStatus === OutputGenerationStatus.ready) {
            return {
                ...experimentPrompt,
                runExperimentHmac: generateRunExperimentPromptHmac(experimentPrompt.id),
            }
        } else {
            return experimentPrompt
        }
    })

    return (
        <ExperimentResultTable
            experimentInfo={experimentInfo}
            experimentPromptsWithHmac={experimentPromptsWithHmac}
            experimentVariables={experimentVariables}
        />
    )
}
