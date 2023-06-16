import type { Prompt } from "@prisma/client"

import type { getServicesWithValidKeys } from "@/lib/requests/getServicesWithValidKeys"
import type { getUserExperiment } from "@/lib/requests/getExperiment"
import { SafeSerializeCast } from "@/lib/safeSerialize"

import type { ModelOptions } from "../api/launch/route"

// Models
// Generic Row Props
export type GetDetailsFn = () => { text: string; name: string }
export type UpdateObject = AllowUndefined<ModelOptions>
export const defaultModelOptions: ModelOptions = {
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: undefined,
    model: "openai/gpt-3.5-turbo",
}
export type RowProps<T extends {}> = T &
    ModelOptions & {
        onRemove: () => void
        onUpdate: (update: UpdateObject) => void
    }

// Types of experiment prompts
export type ImportedPrompt = ModelOptions & {
    promptId: string
    promptVersion: number
    uiId: string
}
export type NewPrompt = ModelOptions & {
    type: "new"
    uiId: string
}

// Before we can use the imported prompt, we need to get the details from the API
export type NewPromptComplete = NewPrompt & ReturnType<GetDetailsFn>

// The variables for the prompts
type VariableName = string
type VariableValue = string
type Variation = `${number}`
export type VariableToVariationMap = Record<VariableName, Record<Variation, VariableValue>>

// Utils
export const isSelectedPromptImported = (prompt: ImportedPrompt | NewPrompt): prompt is ImportedPrompt => !!(prompt as any).promptId
type AllowUndefined<T> = {
    [P in keyof T]?: T[P] | undefined
}
export type LaunchExperimentPageProps = {
    experiment: Awaited<ReturnType<typeof getUserExperiment>>
    prompts: SafeSerializeCast<Prompt[]>
    servicesWithValidKeys: SafeSerializeCast<Awaited<ReturnType<typeof getServicesWithValidKeys>>>
}
