import { NextResponse } from "next/server"
import { OutputGenerationStatus } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const schema = z.object({
    experimentPromptId: z.string(),
})

export type SuccessfulResponseData = {
    outputGenerationStatus: OutputGenerationStatus
    output: string | null
}

export type ResponseData = SuccessfulResponseData | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, { params: { projectId, experimentId } }) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { experimentPromptId } = parseResult.data

    const experimentPrompt = await prisma.experimentPrompt.findUniqueOrThrow({
        where: {
            id: experimentPromptId,
        },
        select: {
            outputGenerationStatus: true,
            output: true,
        },
    })

    return new NextResponse(JSON.stringify(experimentPrompt), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
