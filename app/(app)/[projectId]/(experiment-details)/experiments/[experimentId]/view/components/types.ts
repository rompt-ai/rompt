import { getFullExperiment } from "@/lib/requests/getFullExperiment"

type FullExperimentPrompts = Awaited<ReturnType<typeof getFullExperiment>>["experimentPrompts"]
type FullExperimentVariables = Awaited<ReturnType<typeof getFullExperiment>>["experimentVariables"]
type FullExperimentInfo = Omit<Awaited<ReturnType<typeof getFullExperiment>>, "experimentVariables" | "experimentPrompts">

export type FullExperimentPromptsWithHmac = (FullExperimentPrompts[number] & { runExperimentHmac?: string })[]

export type ExperimentResultTableProps = {
    experimentPromptsWithHmac: FullExperimentPromptsWithHmac
    experimentVariables: FullExperimentVariables
    experimentInfo: FullExperimentInfo
}
