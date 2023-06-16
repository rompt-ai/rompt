import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    deleteAll: z.boolean().optional(),
    version: z.number(),
})

export type ResponseData = { success: true } | z.ZodError<z.infer<typeof schema>>

export const POST = async function (
    req,
    { params: { projectId, promptId } },
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

    const { deleteAll, version } = parseResult.data

    if (deleteAll) {
        await prisma.prompt.deleteMany({
            where: {
                id: promptId,
            },
        })
    } else {
        await prisma.prompt.delete({
            where: {
                id_version: {
                    id: promptId,
                    version,
                },
            },
        })
    }

    return new NextResponse(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
