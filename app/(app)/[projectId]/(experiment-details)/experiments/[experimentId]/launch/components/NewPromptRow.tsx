"use client"

import { useEffect, useRef, useState } from "react"
import { Pencil } from "lucide-react"
import { type editor } from "monaco-editor"

import { cn } from "@/lib/utils"
import { PromptInput } from "@/components/PromptInput"

import { GenericRow } from "./GenericRow"
import { GetDetailsFn, RowProps } from "./types"

export function NewPromptRow({
    onRemove,
    onGetDetailsCallback,
    onUpdate,
    ...modelOpts
}: RowProps<{
    onGetDetailsCallback: (fn: GetDetailsFn) => void
}>) {
    const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor>()
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editorInstance && inputRef.current) {
            onGetDetailsCallback(() => ({
                text: editorInstance.getValue(),
                name: inputRef.current!.value,
            }))
        }
    }, [editorInstance, inputRef, onGetDetailsCallback])

    return (
        <GenericRow
            header={
                <small className='flex items-center text-sm leading-none'>
                    <Pencil size={16} />
                    <input
                        className={cn(
                            "ml-1.5 truncate bg-transparent px-1.5 py-1 font-semibold outline-none",
                            "rounded ring-1 ring-transparent",
                            "hover:ring-border/50 focus:ring-2 focus:ring-border"
                        )}
                        placeholder='New prompt*'
                        ref={inputRef}
                    />
                </small>
            }
            isPreviewOpen={isPreviewOpen}
            setIsPreviewOpen={setIsPreviewOpen}
            onRemove={onRemove}
            onUpdate={onUpdate}
            {...modelOpts}
        >
            <div className={cn(!isPreviewOpen && "max-h-0 overflow-hidden")}>
                <PromptInput
                    shrink
                    type={"plaintext"}
                    safeOnMount={(editor, monaco) => {
                        setEditorInstance(editor)
                    }}
                    autoResize
                />
            </div>
        </GenericRow>
    )
}
