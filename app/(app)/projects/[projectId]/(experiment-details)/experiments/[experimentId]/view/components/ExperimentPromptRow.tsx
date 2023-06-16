"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ReactComponent as OpenaiSvg } from "@/assets/icons/openai.svg"
import { OutputGenerationStatus } from "@prisma/client"
import { ArrowRight, ThumbsDown, ThumbsUp } from "lucide-react"
import { CachePolicies, useFetch } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { isType } from "@/lib/isType"
import { readChunks } from "@/lib/readChunks"
import { cn } from "@/lib/utils"
import { useIsomorphicEffect } from "@/hooks/use-isomorphic-effect"
import { useToast } from "@/hooks/use-toast"
import { Button, ButtonProps } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { CodeBlock } from "@/components/CodeBlock"

import { SuccessfulResponseData } from "../api/get-experiment-prompt/route"
import { ParametersSheet } from "./ParametersSheet"
import { SourceRow } from "./SourceRow"
import { StickyRowContainer } from "./StickyRowContainer"
import { ExperimentResultTableProps, FullExperimentPromptsWithHmac } from "./types"

export function ExperimentPromptRow({
    outputGenerationStatus,
    reportingType,
    output,
    isAllRevealed,
    experimentVariables,
    ...experimentPrompt
}: {
    reportingType: ExperimentResultTableProps["experimentInfo"]["reportingType"]
    isAllRevealed: boolean
    experimentVariables: ExperimentResultTableProps["experimentVariables"]
} & FullExperimentPromptsWithHmac[number]) {
    const [buffs, setBuffs] = useState<Buffer[]>([])
    const [finalOutput, setFinalOutput] = useState<string | undefined>(output === null ? undefined : output)
    const [isSourceVisible, setIsSourceVisible] = useState(false)
    const [experimentPromptRating, setExperimentPromptRating] = useState<number | undefined>(
        experimentPrompt.experimentPromptRatings[0]?.score
    )
    const pathname = usePathname()!
    const { projectId } = useParams()!
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        if (buffs.length > 0) {
            setFinalOutput(Buffer.concat(buffs).toString("utf-8"))
        }
    }, [buffs])

    useEffect(() => {
        setIsSourceVisible(isAllRevealed)
    }, [isAllRevealed])

    // Only runs once at most
    useIsomorphicEffect(() => {
        let fetchInterval: NodeJS.Timeout
        const fetchExperimentPromptInterval = () => {
            fetchInterval = setInterval(() => {
                fetch(`${pathname}/api/get-experiment-prompt`, {
                    method: "POST",
                    body: JSON.stringify({
                        experimentPromptId: experimentPrompt.id,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-cache",
                    next: {
                        revalidate: 0,
                    },
                })
                    .then((res) => res.json())
                    .then((res) => {
                        if (isType<SuccessfulResponseData>(res, !!res.outputGenerationStatus)) {
                            if (res.outputGenerationStatus === OutputGenerationStatus.complete) {
                                setFinalOutput(res.output || "")
                                clearInterval(fetchInterval)
                            } else if (res.outputGenerationStatus === OutputGenerationStatus.failed) {
                                setFinalOutput("Failed to generate output")
                                clearInterval(fetchInterval)
                            }
                        }
                    })
            }, 2000)
        }

        let aborter: AbortController | undefined
        if (outputGenerationStatus === OutputGenerationStatus.ready) {
            aborter = new AbortController()
            fetch(`https://crun.rompt.ai/run-plaintext-experiment-prompt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: aborter.signal,
                body: JSON.stringify({
                    experimentPromptId: experimentPrompt.id,
                    runExperimentHmac: experimentPrompt.runExperimentHmac,
                }),
                cache: "no-store",
                next: {
                    revalidate: 0,
                },
            }).then(async (response) => {
                if (response.headers.get("content-type")?.includes("application/json")) {
                    const { notice } = await response.json()
                    if (notice === "Experiment prompt not ready") {
                        setFinalOutput("In progress...")
                        fetchExperimentPromptInterval()
                    }
                } else {
                    if (response.body) {
                        const reader = response.body.getReader()
                        for await (const chunk of readChunks(reader)) {
                            setBuffs((prev) => [...prev, Buffer.from(chunk)])
                        }
                    }
                }
            })
        } else if (outputGenerationStatus === OutputGenerationStatus.inProgress) {
            setFinalOutput("In progress...")
            fetchExperimentPromptInterval()
        } else if (outputGenerationStatus === OutputGenerationStatus.complete) {
            // Already set state. Do nothing.
        }

        return () => {
            clearInterval(fetchInterval)
            aborter?.abort()
        }
    }, [])

    const { post: postRateExperimentPrompt, loading: loadingRateExperimentPrompt } = useFetch(`${pathname}/api/rate-experiment-prompt`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    const ratingButtonProps = (value: number, className?: string): Partial<ButtonProps> =>
        ({
            variant: "outline",
            disabled: loadingRateExperimentPrompt,
            onClick: () => {
                postRateExperimentPrompt({
                    experimentPromptId: experimentPrompt.id,
                    score: value,
                }).then(() => {
                    setExperimentPromptRating(value)
                    router.refresh()
                })
            },
            className: cn(className, experimentPromptRating === value && "pointer-events-none bg-border"),
        } as const)

    return (
        <>
            <tr>
                <td className='px-6 py-4 align-top text-sm'>
                    <StickyRowContainer>
                        <div className='relative w-full'>
                            <div className='space-y-2 p-1'>
                                <Link href={`/projects/${projectId}/${experimentPrompt.promptId}/${experimentPrompt.promptVersion}`}>
                                    <SourceRow
                                        icon={
                                            <span className='flex items-center'>
                                                <small className='ml-1 flex justify-end text-xs font-medium leading-none tracking-tight text-muted-foreground'>
                                                    v{experimentPrompt.promptVersion}
                                                </small>
                                                <ArrowRight className='ml-1.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground' />
                                            </span>
                                        }
                                    >
                                        <span className='text-muted-foreground'>Name: </span>
                                        {experimentPrompt.prompt.name}
                                    </SourceRow>
                                </Link>
                                <Sheet>
                                    <SheetTrigger className='w-full'>
                                        <SourceRow className='cursor-pointer'>View parameters</SourceRow>
                                    </SheetTrigger>
                                    <ParametersSheet {...experimentPrompt} experimentVariables={experimentVariables} />
                                </Sheet>
                                <SourceRow icon={<OpenaiSvg />} className='pointer-events-none'>
                                    {experimentPrompt.model.split("/").pop()}
                                </SourceRow>
                            </div>
                            {!isSourceVisible && (
                                <div className='absolute inset-0'>
                                    <div
                                        className='flex h-full cursor-pointer items-center justify-center rounded-md bg-secondary/70 px-2 py-1.5 text-muted-foreground shadow-xl backdrop-blur-md transition-colors hover:bg-muted hover:text-foreground'
                                        onClick={() => setIsSourceVisible(true)}
                                    >
                                        <small className='text-center text-sm font-medium leading-snug tracking-tight'>
                                            Click to reveal
                                        </small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </StickyRowContainer>
                </td>
                <td className='px-6 py-4 text-left align-middle text-sm'>
                    <CodeBlock className='m-0 px-0 py-2' spanClassName='break-words' hideCopy>
                        {finalOutput || ""}
                    </CodeBlock>
                </td>
                <td className='px-6 py-4 text-center align-top text-sm' style={{ verticalAlign: "unset" }}>
                    {reportingType === "approval" ? (
                        <StickyRowContainer>
                            <Button {...ratingButtonProps(1, "rounded-r-none border-r-0")}>
                                <ThumbsUp className='h-4 w-4 text-green-500' />
                            </Button>
                            <Button {...ratingButtonProps(0, "rounded-l-none")}>
                                <ThumbsDown className='h-4 w-4 text-red-500' />
                            </Button>
                        </StickyRowContainer>
                    ) : (
                        <StickyRowContainer>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ele, i, arr) => (
                                <Button
                                    {...ratingButtonProps(
                                        ele,
                                        cn(
                                            "h-8 w-[22px] rounded-none border-r-0 px-1.5 text-xs text-muted-foreground",
                                            i === 0 && "rounded-l-md",
                                            i === arr.length - 1 && "rounded-r-md border-r"
                                        )
                                    )}
                                    key={ele}
                                >
                                    {ele}
                                </Button>
                            ))}
                        </StickyRowContainer>
                    )}
                </td>
            </tr>
        </>
    )
}
