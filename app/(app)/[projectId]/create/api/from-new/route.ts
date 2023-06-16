import { NextResponse } from "next/server"
import { Prompt } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    selectedProjectId: z.string(),
    name: z.string(),
    text: z.string(),
    type: z.enum(["plaintext", "LMQL"]),
})

export type ResponseData = Prompt | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, _) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { name, text, type, selectedProjectId } = parseResult.data

    const createdPrompt = await prisma.prompt.create({
        data: {
            name,
            text,
            version: 1,
            projectId: selectedProjectId,
            type,
        },
    })
    return new NextResponse(JSON.stringify(createdPrompt), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
