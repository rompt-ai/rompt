"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react"

import { RowDetailSection } from "@/components/RowDetailSection"
import { ScoreBar } from "@/components/ScoreBar"

import { SourceRow } from "../../view/components/SourceRow"
import { ZippedExperimentPrompts } from "./types"

export function ResultsTable({
    promptsArr,
}: {
    promptsArr: (ZippedExperimentPrompts[keyof ZippedExperimentPrompts] & { average: number; key: string })[]
}) {
    const { projectId, experimentId } = useParams()!
    const [expandedRowsMap, setExpandedRowsMap] = useState<Record<string, boolean>>({})
    return (
        <Fragment>
            {promptsArr.map(({ prompt, average, key, ratings }) => (
                <Fragment key={key}>
                    <tr
                        className='cursor-pointer hover:bg-muted/30'
                        onClick={() => setExpandedRowsMap((prev) => ({ ...prev, [key]: !prev[key] }))}
                    >
                        <td className='truncate px-6 py-4 align-middle text-sm'>
                            <div className='space-y-2 p-1'>
                                <Link href={`/projects/${projectId}/${prompt.id}/${prompt.version}`} onClick={(e) => e.stopPropagation()}>
                                    <SourceRow
                                        icon={
                                            <span className='flex items-center'>
                                                <small className='ml-1 flex justify-end text-xs font-medium leading-none tracking-tight text-muted-foreground'>
                                                    v{prompt.version}
                                                </small>
                                                <ArrowRight className='ml-1.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground' />
                                            </span>
                                        }
                                    >
                                        {prompt.name}
                                    </SourceRow>
                                </Link>
                            </div>
                        </td>
                        <td className='truncate px-6 py-4 text-center text-sm'>
                            <ScoreBar
                                score={average * 100}
                                getScoreClassName={(score: number) => {
                                    if (score > 50) {
                                        return "bg-green-600"
                                    } else {
                                        return "bg-red-600"
                                    }
                                }}
                            />
                        </td>
                        <td className='truncate px-6 py-4 text-right'>
                            {expandedRowsMap[key] ? (
                                <ChevronUp size={16} className='ml-auto text-muted-foreground' />
                            ) : (
                                <ChevronDown size={16} className='ml-auto text-muted-foreground' />
                            )}
                        </td>
                    </tr>
                    {expandedRowsMap[key] && (
                        <tr className='!border-t-transparent'>
                            <td colSpan={3} className='px-6 py-4'>
                                <div className='grid grid-cols-3 gap-x-8'>
                                    <div className='col-span-2'>
                                        <RowDetailSection title='Prompt' content={prompt.text} />
                                    </div>
                                    <div>
                                        <small className='ml-6 text-sm font-medium leading-none'>Ratings</small>
                                        {ratings.map(({ experimentPromptId, score }, i) => (
                                            <div key={experimentPromptId} className='mt-2'>
                                                <Link
                                                    href={`/projects/${projectId}/experiments/${experimentId}/view?experimentPromptId=${experimentPromptId}`}
                                                    prefetch={false}
                                                >
                                                    <SourceRow>
                                                        <span className='text-muted-foreground'>{i + 1}.</span> {prompt.name}
                                                    </SourceRow>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </Fragment>
            ))}
        </Fragment>
    )
}
