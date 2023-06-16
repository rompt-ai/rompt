import { prisma } from "@/lib/prisma"
import safeSerialize from "@/lib/safeSerialize"

import { CreateExperimentRouter } from "./components/CreateExperimentRouter"
import CreateExperimentProvider from "./context/CreateExperimentContext"

export default async function Page({ params: { projectId } }: { params: { projectId: string } }) {
    const _project = await prisma.project.findUniqueOrThrow({
        where: {
            id: projectId,
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
        },
    })

    const project = safeSerialize(_project)

    return (
        <CreateExperimentProvider project={project}>
            <CreateExperimentRouter />
        </CreateExperimentProvider>
    )
}
