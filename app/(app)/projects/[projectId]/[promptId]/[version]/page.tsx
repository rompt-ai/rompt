import { getPrompt } from "@/lib/requests/getPrompt"
import { getPromptVariableDescriptions } from "@/lib/requests/getPromptVariableDescriptions"

import { OverviewPage } from "./components/OverviewPage"

export const dynamic = "force-dynamic"

export default async function Page({
    params: { projectId, promptId, version },
}: {
    params: { projectId: string; promptId: string; version: string }
}) {
    const [prompt, promptVariableDescriptionsMap] = await Promise.all([
        getPrompt(projectId, promptId, version === "latest" ? "latest" : Number(version)),
        getPromptVariableDescriptions(projectId, promptId, version === "latest" ? "latest" : Number(version)).then((res) =>
            res.reduce((acc, cur) => {
                acc[cur.key] = cur.description
                return acc
            }, {} as Record<string, string>)
        ),
    ])
    return <OverviewPage prompt={prompt} promptVariableDescriptionsMap={promptVariableDescriptionsMap} />
}
