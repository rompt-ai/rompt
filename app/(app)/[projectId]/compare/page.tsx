import Link from "next/link"
import { Prompt } from "@prisma/client"
import { diffChars } from "diff"

import { prisma } from "@/lib/prisma"
import safeSerialize from "@/lib/safeSerialize"
import { forceArrToString } from "@/lib/utils"
import BackButton from "@/components/BackButton"
import Container from "@/app/(app)/components/Container"

import { ComparePage } from "../components/ComparePage"

export default async function Page({
    params: { projectId },
    searchParams,
}: {
    params: { projectId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const {
        ["dest-prompt"]: destPromptId,
        ["dest-version"]: destVersion,
        ["src-prompt"]: srcPromptId,
        ["src-version"]: srcVersion,
    } = searchParams

    let _prompts: {
        id: string
        version: number
        name: string
    }[]
    let srcPrompt: Prompt | undefined
    let destPrompt: Prompt | undefined

    if (destPromptId === undefined || destVersion === undefined || srcPromptId === undefined || srcVersion === undefined) {
        _prompts = (
            await prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                select: {
                    prompts: {
                        orderBy: {
                            version: "asc",
                        },
                        select: {
                            id: true,
                            name: true,
                            version: true,
                        },
                    },
                },
            })
        ).prompts
    } else {
        const [
            { prompts: __prompts },
            {
                prompts: [_srcPrompt],
            },
            {
                prompts: [_destPrompt],
            },
        ] = await prisma.$transaction([
            prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                select: {
                    prompts: {
                        orderBy: {
                            version: "asc",
                        },
                        select: {
                            id: true,
                            name: true,
                            version: true,
                        },
                    },
                },
            }),
            prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                select: {
                    prompts: {
                        where: {
                            id: forceArrToString(srcPromptId),
                            version: Number(forceArrToString(srcVersion)),
                        },
                    },
                },
            }),
            prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                select: {
                    prompts: {
                        where: {
                            id: forceArrToString(destPromptId),
                            version: Number(forceArrToString(destVersion)),
                        },
                    },
                },
            }),
        ])

        _prompts = __prompts
        srcPrompt = _srcPrompt
        destPrompt = _destPrompt
    }

    const diff = srcPrompt && destPrompt ? diffChars(destPrompt.text, srcPrompt.text) : undefined
    const prompts = safeSerialize(_prompts)

    const promptIdMap = prompts.reduce(
        (acc, prompt) => {
            if (acc[prompt.id] === undefined) {
                acc[prompt.id] = [prompt]
            } else {
                acc[prompt.id].push(prompt)
            }

            return acc
        },
        {} as {
            [key: string]: {
                id: string
                version: number
                name: string
            }[]
        }
    )

    return (
        <Container
            title='Compare'
            titleAction={
                <Link href={`/${projectId}`}>
                    <BackButton />
                </Link>
            }
        >
            <ComparePage diff={diff} promptIdMap={promptIdMap} />
        </Container>
    )
}
