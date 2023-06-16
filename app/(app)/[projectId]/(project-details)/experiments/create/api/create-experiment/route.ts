import { NextResponse } from "next/server"
import { Experiment } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    experimentName: z.string(),
    reportingType: z.enum(["approval", "numeric"]),
    nResponseVariations: z.number(),
    nVariableVariations: z.number(),
})

export type ResponseData = Experiment | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, { params: { projectId } }) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { experimentName, nResponseVariations, nVariableVariations, reportingType } = parseResult.data

    const createdExperiment = await prisma.experiment.create({
        data: {
            name: experimentName,
            projectId,
            nResponseVariations,
            nVariableVariations,
            // nMagicPrompts,
            // nMagicVariables,
            reportingType,
            didLaunch: false,
        },
    })

    return new NextResponse(JSON.stringify(createdExperiment), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
