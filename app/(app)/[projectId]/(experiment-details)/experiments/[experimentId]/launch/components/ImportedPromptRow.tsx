"use client"

import { useState } from "react"
import type { Prompt } from "@prisma/client"

import { PromptInput } from "@/components/PromptInput"

import { GenericRow } from "./GenericRow"
import { RowProps } from "./types"

export function ImportedPromptRow({
    promptVersion,
    onRemove,
    name,
    text,
    type,
    onUpdate,
    ...modelOpts
}: RowProps<{
    promptVersion: number
    name: string
    text: string
    type: Prompt["type"]
}>) {
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true)

    return (
        <GenericRow
            header={
                <small className='truncate text-sm leading-none'>
                    <span className='font-semibold'>
                        {name}
                        &nbsp;–
                    </span>
                    &nbsp;
                    <span className='italic text-slate-400'>version {promptVersion}</span>
                </small>
            }
            isPreviewOpen={isPreviewOpen}
            setIsPreviewOpen={setIsPreviewOpen}
            onUpdate={onUpdate}
            onRemove={onRemove}
            {...modelOpts}
        >
            {isPreviewOpen && <PreviewInputPrompt text={text} type={type} />}
        </GenericRow>
    )
}

function PreviewInputPrompt({ text, type }: { text: string; type: Prompt["type"] }) {
    return (
        <div className='h-[100px]'>
            <PromptInput readOnly value={text} shrink type={type} />
        </div>
    )
}
