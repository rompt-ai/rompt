import { dedupe } from "@/lib/dedupe"

import "server-only"
import { prisma } from "../prisma"

export const getServiceKeys = dedupe((projectId: string) =>
    prisma.serviceKey.findMany({
        where: {
            projectId,
        },
    })
)
