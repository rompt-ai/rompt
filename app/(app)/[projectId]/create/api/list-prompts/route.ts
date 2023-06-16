import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export type ResponseData =
    | {
          id: string
          name: string
          text: string
          version: number
      }[]

export const POST = async function (req, { params: { projectId } }) {
    const promptsInProject = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            prompts: {
                select: {
                    id: true,
                    version: true,
                    name: true,
                    text: true,
                },
                orderBy: {
                    version: "desc",
                },
            },
        },
    })
    if (promptsInProject?.prompts) {
        return new NextResponse(JSON.stringify(promptsInProject?.prompts), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        })
    } else {
        throw new Error(`Prompts in project ${projectId} not found`)
    }
}
