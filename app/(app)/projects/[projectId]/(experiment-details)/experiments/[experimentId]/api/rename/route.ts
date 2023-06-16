import { NextResponse } from "next/server"
import { Experiment } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    newName: z.string(),
})

export type ResponseData = Experiment | z.ZodError<z.infer<typeof schema>>

export const POST = async function (
    req,
    { params: { projectId, experimentId } },
) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { newName } = parseResult.data

    // This is a security check to make sure the user is a member of the experiment.
    const userIsPartOfExperiment = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            experiments: {
                where: {
                    id: experimentId,
                },
            },
        },
    })

    if (userIsPartOfExperiment?.experiments?.length) {
        const experiment = await prisma.experiment.update({
            where: {
                id: experimentId,
            },
            data: {
                name: newName,
            },
        })

        return new NextResponse(JSON.stringify(experiment), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        })
    }
}
