import { dedupe } from "@/lib/dedupe"

import "server-only"
import { prisma } from "../prisma"
import safeSerialize from "../safeSerialize"

export const getPromptVariableDescriptions = dedupe(async (projectId: string, promptId: string, version: "latest" | number) => {
    let currentWhereVersion: number
    if (version === "latest") {
        const remoteLatestVersion = await prisma.prompt.findFirstOrThrow({
            where: {
                id: promptId,
                projectId,
            },
            orderBy: {
                version: "desc",
            },
            select: {
                version: true,
            },
        })

        currentWhereVersion = remoteLatestVersion.version
    } else {
        currentWhereVersion = version
    }

    return safeSerialize(
        await prisma.promptVariableDescriptions.findMany({
            where: {
                promptId,
                promptVersion: currentWhereVersion,
            },
        })
    )
})
