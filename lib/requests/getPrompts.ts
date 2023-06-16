import { dedupe } from "@/lib/dedupe"

import "server-only"
import { prisma } from "../prisma"
import safeSerialize from "../safeSerialize"

export const getPrompts = dedupe(async (projectId: string) =>
    safeSerialize(
        (
            await prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                include: {
                    prompts: true,
                },
            })
        ).prompts
    )
)
