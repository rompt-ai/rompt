import { NextResponse } from "next/server"
import { PromptType } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    version: z.number(),
    promptId: z.string(),
})

export type ResponseData =
    | {
          type: PromptType
          text: string
      }
    | z.ZodError<z.infer<typeof schema>>

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

    const { version, promptId } = parseResult.data

    const returnedPrompt = await prisma.prompt.findUniqueOrThrow({
        where: {
            id_version: {
                id: promptId,
                version: version,
            },
        },
        select: {
            text: true,
            type: true,
        },
    })

    return new NextResponse(JSON.stringify(returnedPrompt), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
