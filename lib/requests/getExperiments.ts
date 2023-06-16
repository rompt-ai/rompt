import { dedupe } from "@/lib/dedupe"

import "server-only"
import { prisma } from "../prisma"
import safeSerialize from "../safeSerialize"

export const getExperiments = dedupe(async (projectId: string) =>
    safeSerialize(
        (
            await prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                include: {
                    experiments: true,
                },
            })
        ).experiments
    )
)
