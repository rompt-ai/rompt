import { dedupe } from "@/lib/dedupe"

import "server-only"
import { prisma } from "../prisma"

export const getProject = dedupe((projectId: string) =>
    prisma.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
        },
    })
)
