import { dedupe } from "@/lib/dedupe"

import "server-only"
import { prisma } from "../prisma"
import safeSerialize from "../safeSerialize"

export const getExperiment = dedupe(async (projectId: string, experimentId: string) =>
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
                        take: 1,
                    },
                },
            })
        ).experiments[0]
    )
)
