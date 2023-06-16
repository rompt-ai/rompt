import { NextResponse } from "next/server"
import { Project } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    name: z.string(),
})

export type ResponseData = Project | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, ctx) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { name } = parseResult.data

    const project = await prisma.project.create({
        data: {
            name,
        },
    })

    return new NextResponse(JSON.stringify(project), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
