import { dedupe } from "@/lib/dedupe"

import "server-only"
import { prisma } from "../prisma"

export const getServicesWithValidKeys = dedupe(async (projectId: string) => {
    const serviceKeys = await prisma.serviceKey.findMany({
        where: {
            projectId,
        },
    })

    return serviceKeys.map((ele) => ele.service)
})
