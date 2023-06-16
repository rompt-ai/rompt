"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Change } from "diff"
import { ArrowLeft, Diff } from "lucide-react"

import { forceArrToString } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Footer from "@/components/Footer"
import { selectProps } from "@/components/selectProps"

import { DiffViewer } from "./DiffViewer"

const getOrderedVersionsOfPrompt = (
    promptIdMap: {
        [key: string]: {
            id: string
            version: number
            name: string
        }[]
    },
    promptId: string
) => {
    return promptIdMap[promptId].map((ele) => ele.version).sort((a, b) => b - a)
}

export function ComparePage({
    diff,
    promptIdMap,
}: {
    diff: Change[] | undefined
    promptIdMap: {
        [key: string]: {
            id: string
            version: number
            name: string
        }[]
    }
}) {
    const { projectId } = useParams()!
    const searchParams = useSearchParams()

    const [sourcePromptIdSelect, setSourcePromptIdSelect] = useState<string | undefined>(searchParams.get("src-prompt") || undefined)
    const [sourceVersionSelect, setSourceVersionSelect] = useState<number | undefined>(
        searchParams.get("src-version") ? Number(searchParams.get("src-version")) : undefined
    )

    const [comparePromptIdSelect, setComparePromptIdSelect] = useState<string | undefined>(searchParams.get("dest-prompt") || undefined)
    const [compareVersionSelect, setCompareVersionSelect] = useState<number | undefined>(
        searchParams.get("dest-version") ? Number(searchParams.get("dest-version")) : undefined
    )

    return (
        <>
            <div className='w-full rounded-md border-[0.5px] border-border bg-muted p-4'>
                <div className='flex max-w-4xl items-end'>
                    <div className='grid w-full items-center gap-2'>
                        <p className='mr-3 text-sm'>Source</p>
                        <div className='flex items-center space-x-3'>
                            <CompareSelectGroup
                                compareId={sourcePromptIdSelect}
                                setCompareId={setSourcePromptIdSelect}
                                compareVersion={sourceVersionSelect}
                                setCompareVersion={setSourceVersionSelect}
                                promptIdMap={promptIdMap}
                            />
                        </div>
                    </div>
                    <div className='flex h-[40px] items-center'>
                        <ArrowLeft className='mx-4' size={18} />
                    </div>
                    <div className='grid w-full items-center gap-2'>
                        <p className='mr-3 text-sm'>Compare</p>
                        <div className='flex items-center space-x-3'>
                            <CompareSelectGroup
                                compareId={comparePromptIdSelect}
                                setCompareId={setComparePromptIdSelect}
                                compareVersion={compareVersionSelect}
                                setCompareVersion={setCompareVersionSelect}
                                promptIdMap={promptIdMap}
                            />
                        </div>
                    </div>
                    <Link
                        href={`/projects/${forceArrToString(
                            projectId
                        )}/compare?src-prompt=${sourcePromptIdSelect}&src-version=${sourceVersionSelect}&dest-prompt=${comparePromptIdSelect}&dest-version=${compareVersionSelect}`}
                    >
                        <Button
                            className='ml-3'
                            disabled={
                                sourcePromptIdSelect === undefined ||
                                comparePromptIdSelect === undefined ||
                                sourceVersionSelect === undefined ||
                                compareVersionSelect === undefined
                            }
                        >
                            <Diff className='mr-2 h-4 w-4' />
                            Compare
                        </Button>
                    </Link>
                </div>
            </div>
            <div className='min-h-[calc(100vh-600px)]'>
                {diff && (
                    <div>
                        <DiffViewer diff={diff} />
                    </div>
                )}
            </div>
            <Footer className='mt-20' />
        </>
    )
}

interface CompareSelectGroupProps {
    className?: string
    iconClassName?: string
    compareId: string | undefined
    setCompareId: (id: string | undefined) => void
    compareVersion: number | undefined
    setCompareVersion: (version: number | undefined) => void
    promptIdMap: {
        [key: string]: {
            id: string
            version: number
            name: string
        }[]
    }
}

const CompareSelectGroup: React.FC<CompareSelectGroupProps> = ({
    compareId,
    setCompareId,
    compareVersion,
    setCompareVersion,
    promptIdMap,
}) => {
    const selectedPrompt = compareId ? promptIdMap[compareId][0] : undefined

    console.log(compareId, compareVersion)
    const versionDisplay = () => {
        if (compareId === undefined) return "Select a prompt"
        if (compareVersion === undefined) return "Select a version"
        return `Version ${compareVersion}`
    }

    return (
        <>
            <Select
                value={compareId}
                onValueChange={(e) => {
                    setCompareId(e)
                    setCompareVersion(undefined)
                }}
            >
                <SelectTrigger>
                    <span className='truncate'>
                        <SelectValue>{selectedPrompt?.name || "Select a prompt"}</SelectValue>
                    </span>
                </SelectTrigger>
                <SelectContent {...selectProps()}>
                    <SelectGroup>
                        {Object.entries(promptIdMap).map(([currPrompt, promptArr]) => (
                            <SelectItem key={currPrompt} value={currPrompt}>
                                {promptArr[0].name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select
                value={compareVersion !== undefined ? "" + compareVersion : ""}
                onValueChange={(val) => setCompareVersion(Number(val))}
                disabled={compareId === undefined}
            >
                <SelectTrigger>
                    <span className='truncate'>
                        <SelectValue>{versionDisplay()}</SelectValue>
                    </span>
                </SelectTrigger>
                <SelectContent {...selectProps()}>
                    {Array.from({ length: compareId ? getOrderedVersionsOfPrompt(promptIdMap, compareId)[0] : 0 }).map((_, version) => (
                        <SelectItem key={version + 1} value={"" + (version + 1)}>
                            {`Version ${version + 1}`}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    )
}
