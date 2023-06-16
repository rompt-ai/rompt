import { NextResponse } from "next/server"
import { Project } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export type ResponseData = Project

export const POST = async function (req, { params: { projectId } }) {
    // This is a security check to make sure the user is a member of the project.
    const userIsPartOfProject = !!(await prisma.project.findUnique({
        where: {
            id: projectId,
        },
    }))

    if (userIsPartOfProject) {
        await prisma.project.delete({
            where: {
                id: projectId,
            },
        })

        return new NextResponse(JSON.stringify({ success: true }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        })
    }
}
