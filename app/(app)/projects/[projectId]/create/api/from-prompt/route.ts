import { NextResponse } from "next/server"
import { Prompt } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    sourcePromptId: z.string(),
    sourceVersion: z.number(),
    targetName: z.string(),
})

export type ResponseData = Prompt | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, _, session) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { sourcePromptId, sourceVersion, targetName } = parseResult.data

    const [sourcePrompt, sourcePromptVariableDescriptions] = await prisma.$transaction([
        prisma.prompt.findUnique({
            where: {
                id_version: {
                    id: sourcePromptId,
                    version: sourceVersion,
                },
            },
            select: {
                text: true,
                description: true,
                projectId: true,
                type: true,
            },
        }),
        prisma.promptVariableDescriptions.findMany({
            where: {
                promptId: sourcePromptId,
                promptVersion: sourceVersion,
            },
        }),
    ])

    if (!sourcePrompt) {
        throw new Error(`Prompt ${sourcePromptId} version ${sourceVersion} not found`)
    }

    const createdPrompt = await prisma.prompt.create({
        data: {
            ...sourcePrompt,
            name: targetName,
            version: 1,
        },
    })

    await prisma.promptVariableDescriptions.createMany({
        data: sourcePromptVariableDescriptions.map(({ key, description }) => ({
            key,
            description,
            promptId: createdPrompt.id,
            promptVersion: createdPrompt.version,
        })),
    })

    return new NextResponse(JSON.stringify(createdPrompt), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
