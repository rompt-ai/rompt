import { dedupe } from "@/lib/dedupe"

import "server-only"
import { prisma } from "../prisma"
import safeSerialize from "../safeSerialize"

export const getFullExperiment = dedupe(async (projectId: string, experimentId: string, experimentPromptId?: string) =>
    safeSerialize(
        (
            await prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                include: {
                    experiments: {
                        where: {
                            id: experimentId,
                        },
                        include: {
                            experimentPrompts: {
                                where: experimentPromptId
                                    ? {
                                        id: experimentPromptId,
                                    }
                                    : undefined,
                                include: {
                                    experimentPromptRatings: true,
                                    prompt: true,
                                },
                                orderBy: {
                                    id: "asc", // This is deterministic, but doesn't appear to be ordered which is ideal
                                },
                            },
                            experimentVariables: true,
                        },
                        take: 1,
                    },
                },
            })
        ).experiments[0]
    )
)
