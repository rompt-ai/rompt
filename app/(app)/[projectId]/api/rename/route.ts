import { NextResponse } from "next/server"
import { Project } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    newName: z.string(),
})

export type ResponseData = Project | z.ZodError<z.infer<typeof schema>>

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

    const { newName } = parseResult.data

    // This is a security check to make sure the user is a member of the project.
    const userIsPartOfProject = !!(await prisma.project.findUnique({
        where: {
            id: projectId,
        },
    }))

    if (userIsPartOfProject) {
        const project = await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                name: newName,
            },
        })

        return new NextResponse(JSON.stringify(project), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        })
    }
}
