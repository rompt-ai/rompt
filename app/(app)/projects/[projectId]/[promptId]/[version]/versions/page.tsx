import { prisma } from "@/lib/prisma"
import safeSerialize from "@/lib/safeSerialize"

import { VersionsPage } from "../components/VersionsPage"

export const dynamic = "force-dynamic"

export default async function Page({
    params: { projectId, promptId, version },
}: {
    params: { projectId: string; promptId: string; version: string }
}) {
    let currentWhereVersion: number
    if (version === "latest") {
        const remoteLatestVersion = await prisma.prompt.findFirst({
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

        currentWhereVersion = remoteLatestVersion!.version
    } else {
        currentWhereVersion = Number(version)
    }

    const versions = safeSerialize(
        await prisma.prompt.findMany({
            where: {
                id: promptId,
            },
            select: {
                version: true,
                createdAt: true,
                updatedAt: true,
                id: true,
            },
            orderBy: {
                version: "desc",
            },
        })
    )

    return <VersionsPage versions={versions} projectId={projectId} />
}
