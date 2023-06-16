import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const schema = z.object({
    experimentPromptId: z.string(),
    score: z.number().min(0).max(10),
})

export type ResponseData = { success: true } | z.ZodError<z.infer<typeof schema>>

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

    const { score, experimentPromptId } = parseResult.data

    await prisma.experimentPromptRating.upsert({
        create: {
            score,
            experimentPromptId,
            projectId,
        },
        update: {
            score,
        },
        where: {
            experimentPromptId_projectId: {
                experimentPromptId,
                projectId,
            }
        },
    })

    return new NextResponse(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
