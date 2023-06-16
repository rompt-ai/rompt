import { NextResponse } from "next/server"
import { Experiment } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export type ResponseData = Experiment

export const POST = async function (
    req,
    { params: { projectId, experimentId } },
) {
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
        await prisma.experiment.delete({
            where: {
                id: experimentId,
            },
        })

        return new NextResponse(JSON.stringify({ success: true }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        })
    }
}
