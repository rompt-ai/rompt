"use client"

import { Eye, EyeOff, Settings, X } from "lucide-react"

import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/components/IconButton"
import { selectProps } from "@/components/selectProps"

import { ModelSelect } from "./ModelSelect"
import { RowSettings } from "./RowSettings"
import { RowProps } from "./types"

export function GenericRow({
    onRemove,
    onUpdate,
    isPreviewOpen,
    setIsPreviewOpen,
    header,
    children,
    ...modelParams
}: RowProps<{
    header: React.ReactNode
    isPreviewOpen: boolean
    setIsPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>
    children?: React.ReactNode
}>) {
    return (
        <div>
            <div className='flex h-[48px] items-center justify-between px-4'>
                {header}
                <div className='flex items-center gap-x-2'>
                    <ModelSelect value={modelParams.model} onValueChange={(ele) => onUpdate({ model: ele as any })} />
                    <Sheet>
                        <SheetTrigger>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <IconButton as='span'>
                                            <Settings className='h-4 w-4' />
                                        </IconButton>
                                    </TooltipTrigger>
                                    <TooltipContent {...selectProps()}>
                                        <p>Model settings</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </SheetTrigger>
                        <RowSettings modelParams={modelParams} onUpdate={onUpdate} />
                    </Sheet>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <IconButton onClick={() => setIsPreviewOpen((prev) => !prev)} as='span'>
                                    {!isPreviewOpen ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}
                                </IconButton>
                            </TooltipTrigger>
                            <TooltipContent {...selectProps()}>
                                <p>Preview</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <IconButton onClick={onRemove} as='span'>
                                    <X className='h-4 w-4' />
                                </IconButton>
                            </TooltipTrigger>
                            <TooltipContent {...selectProps()}>
                                <p>Remove</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            {children}
        </div>
    )
}
