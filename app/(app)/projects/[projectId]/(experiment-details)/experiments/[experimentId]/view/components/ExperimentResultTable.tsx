"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { IconButton } from "@/components/IconButton"

import { ExperimentPromptRow } from "./ExperimentPromptRow"
import { ExperimentResultTableProps } from "./types"

export function ExperimentResultTable({ experimentInfo, experimentPromptsWithHmac, experimentVariables }: ExperimentResultTableProps) {
    const searchParams = useSearchParams()
    const [isAllRevealed, setIsAllRevealed] = useState(false)

    const experimentPromptId = searchParams.get("experimentPromptId")

    return (
        <Fragment>
            {experimentPromptId && (
                <Link
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-x-2")}
                    href={`/projects/${experimentInfo.projectId}/experiments/${experimentInfo.id}/results`}
                    prefetch={false}
                >
                    <ArrowLeft size={14} />
                    Back to Results
                </Link>
            )}
            <div className='mt-10 rounded-md border-[0.5px] border-border'>
                <table className='w-full min-w-full table-fixed divide-y divide-border'>
                    {experimentInfo.reportingType === "approval" ? (
                        <colgroup>
                            <col className='w-[20%]' />
                            <col className='w-[60%]' />
                            <col className='w-[20%]' />
                        </colgroup>
                    ) : (
                        <colgroup>
                            <col className='w-[20%]' />
                            <col className='w-[50%]' />
                            <col className='w-[30%]' />
                        </colgroup>
                    )}
                    <thead className='!border-t-transparent bg-muted/30'>
                        <tr>
                            <th scope='col' className='py-1 pl-6 text-left text-sm font-medium uppercase leading-none'>
                                <span className='flex items-center gap-x-1'>
                                    Source
                                    <IconButton onClick={() => setIsAllRevealed((prev) => !prev)}>
                                        {isAllRevealed ? (
                                            <EyeOff className='h-4 w-4 text-muted-foreground' />
                                        ) : (
                                            <Eye className='h-4 w-4 text-muted-foreground' />
                                        )}
                                    </IconButton>
                                </span>
                            </th>
                            <th scope='col' className='px-6 py-1 text-left text-sm font-medium uppercase leading-none'>
                                Output
                            </th>
                            <th scope='col' className='px-6 py-1 text-center text-sm font-medium uppercase leading-none'>
                                Rating
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-slate divide-y divide-border'>
                        {experimentPromptsWithHmac.map((experimentPrompt) => (
                            <ExperimentPromptRow
                                key={experimentPrompt.id}
                                reportingType={experimentInfo.reportingType}
                                isAllRevealed={isAllRevealed}
                                experimentVariables={experimentVariables}
                                {...experimentPrompt}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {experimentPromptId && (
                <Badge variant={"secondary"} className='mt-4'>
                    This is a filtered view of the results.
                </Badge>
            )}
        </Fragment>
    )
}
