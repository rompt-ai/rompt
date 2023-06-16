import { WrapText } from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

export function WrapButton({ wrap, onChange }: { wrap: boolean; onChange: (wrap: boolean) => void }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className='absolute bottom-4 right-2 z-20 overflow-hidden'
                        onClick={(e) => {
                            e.stopPropagation()
                            onChange(!wrap)
                        }}
                        type='button'
                    >
                        <div className='flex cursor-pointer items-center rounded-md bg-transparent py-0.5 text-muted-foreground hover:bg-muted'>
                            <p className='ml-1 text-xs font-semibold'>&nbsp;</p>
                            <WrapText size={14} />
                            <p className='ml-1 text-xs font-semibold'>&nbsp;</p>
                        </div>
                    </button>
                </TooltipTrigger>
                <TooltipContent>Toggle text wrapping</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
