"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import type { Prompt } from "@prisma/client"

import { ResponseData as FromNewResponseData } from "../../../../../create/api/from-new/route"
import { SelectPromptsPage } from "./SelectPromptsPage"
import { ImportedPrompt, LaunchExperimentPageProps, NewPromptComplete, isSelectedPromptImported } from "./types"

export function LaunchExperimentPageRouter({ experiment, prompts, servicesWithValidKeys }: LaunchExperimentPageProps) {
    const { projectId } = useParams()!
    const pathname = usePathname()!
    const router = useRouter()

    return (
        <SelectPromptsPage
            experiment={experiment}
            prompts={prompts}
            servicesWithValidKeys={servicesWithValidKeys}
            onLaunch={async (prompts, variableToVariationMap) => {
                const promptsForExperimentRun: ImportedPrompt[] = []

                const isSuccessfulFromNewResponse = (res: FromNewResponseData): res is Prompt => !!(res as any).id
                const createPromptAndAppend = async (prompt: NewPromptComplete) => {
                    const res = await fetch(`/${projectId}/create/api/from-new`, {
                        method: "POST",
                        body: JSON.stringify({
                            name: prompt.name || `${experiment.name} prompt ${prompt.uiId}`,
                            text: prompt.text,
                            type: "plaintext",
                            selectedProjectId: projectId,
                        }),
                    }).then((res) => res.json() as Promise<FromNewResponseData>)

                    if (isSuccessfulFromNewResponse(res)) {
                        promptsForExperimentRun.push({
                            uiId: prompt.uiId,
                            promptId: res.id,
                            promptVersion: res.version,
                            frequency_penalty: prompt.frequency_penalty,
                            model: prompt.model,
                            presence_penalty: prompt.presence_penalty,
                            temperature: prompt.temperature,
                            top_p: prompt.top_p,
                            max_tokens: prompt.max_tokens,
                        })
                    }
                }

                const creationPromises: Promise<void>[] = []
                // Create any new prompts then run the experiment
                for (const prompt of prompts) {
                    if (isSelectedPromptImported(prompt)) {
                        promptsForExperimentRun.push(prompt)
                    } else {
                        creationPromises.push(createPromptAndAppend(prompt))
                    }
                }

                await Promise.all(creationPromises)

                const res = await fetch(`${pathname}/api/launch`, {
                    method: "POST",
                    body: JSON.stringify({
                        experimentPrompts: promptsForExperimentRun,
                        variableToVariationMap,
                    }),
                })
                if (res.status === 200) {
                    const resJson = await res.json()
                    if (resJson.success) {
                        // This will force us to the view page since didLaunch is now true
                        router.refresh()
                    } else {
                        throw resJson
                    }
                } else {
                    throw res
                }
            }}
        />
    )
}
