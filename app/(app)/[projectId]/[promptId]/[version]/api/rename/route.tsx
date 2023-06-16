import { NextResponse } from "next/server"
import { Prompt } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    newName: z.string(),
    version: z.number(),
})

export type ResponseData = Prompt | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, { params: { projectId, promptId } }) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { newName, version } = parseResult.data
    const prompt = await prisma.prompt.update({
        where: {
            id_version: {
                id: promptId,
                version,
            },
        },
        data: {
            name: newName,
        },
    })

    return new NextResponse(JSON.stringify(prompt), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
