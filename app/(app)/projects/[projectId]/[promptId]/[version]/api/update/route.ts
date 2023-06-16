import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    text: z.string(),
    promptVariableDescriptionsMap: z.record(z.string()),
})

export type ResponseData = { version: number } | z.ZodError<z.infer<typeof schema>>

export const POST = async function (
    req,
    { params: { projectId, promptId, version } },
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

    const { text, promptVariableDescriptionsMap } = parseResult.data

    const latestVersionOfPrompt = await prisma.prompt.findFirst({
        where: {
            id: promptId,
            projectId,
        },
        orderBy: {
            version: "desc",
        },
        select: {
            version: true,
            name: true,
            description: true,
            type: true,
        },
    })

    if (!latestVersionOfPrompt) {
        return
    }

    await prisma.$transaction([
        prisma.prompt.create({
            data: {
                id: promptId,
                text: text,
                version: latestVersionOfPrompt.version + 1,
                name: latestVersionOfPrompt.name,
                description: latestVersionOfPrompt.description,
                type: latestVersionOfPrompt.type,
                projectId,
            },
        }),
        prisma.promptVariableDescriptions.createMany({
            data: Object.entries(promptVariableDescriptionsMap).map(([key, description]) => ({
                description,
                key,
                promptId,
                promptVersion: latestVersionOfPrompt.version + 1,
            })),
        }),
    ])

    return new NextResponse(JSON.stringify({ version: latestVersionOfPrompt.version + 1 }), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
