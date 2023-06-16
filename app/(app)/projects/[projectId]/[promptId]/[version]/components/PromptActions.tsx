"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"

import { PromptEditDropdown } from "./PromptEditDropdown"

export default function PromptActions(props: { promptName: string; projectId: string; promptId: string; currentWhereVersion: number }) {
    const pathname = usePathname()
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false)

    return (
        <div className='flex space-x-4'>
            <PromptEditDropdown {...props} />
            {pathname?.split("/").length === 5 && (
                <Button
                    disabled={isSaveButtonDisabled}
                    onClick={() => {
                        const anyWindow = window as any
                        if (anyWindow.promptSaveCallback) {
                            setIsSaveButtonDisabled(anyWindow.promptSaveCallback())
                        }
                    }}
                >
                    <UploadCloud className='mr-2 h-4 w-4' />
                    Save
                </Button>
            )}
        </div>
    )
}
