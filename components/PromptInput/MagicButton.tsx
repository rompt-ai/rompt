import { useState } from "react"
import { Wand2 } from "lucide-react"
import useFetch, { CachePolicies } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ParseResponse, ResponseData } from "@/app/api/magic/route"

import { ScoreBar } from "../ScoreBar"
import Spinner from "../Spinner"
import { buttonVariants } from "../ui/button"

function isSuccessfulRes(res: ResponseData): res is ParseResponse {
    return !!(res as any).prompt
}

export function MagicButton({ text, onSetPrompt }: { text: string; onSetPrompt: (prompt: string) => void }) {
    const [magicResult, setMagicResult] = useState<ParseResponse>()
    const { toast } = useToast()

    const { post: fetchMagic, loading: fetchMagicLoading } = useFetch<ResponseData>(`/api/magic`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    async function enhanceText() {
        const res = await fetchMagic({
            text,
        })

        if (isSuccessfulRes(res)) {
            setMagicResult(res)
        }
    }

    const rootSectionClassNames = "rounded-md border border-border bg-black px-2 py-1.5 text-sm"

    return (
        <Popover onOpenChange={(open) => (open ? enhanceText() : undefined)}>
            <PopoverTrigger asChild>
                <button className='absolute bottom-4 right-9 z-20 overflow-hidden' onClick={(e) => e.stopPropagation()} type='button'>
                    <div className='flex cursor-pointer items-center rounded-md bg-transparent px-2 py-0.5 text-muted-foreground hover:bg-muted'>
                        <Wand2 size={14} />
                        <p className='ml-1 text-xs font-semibold'>AI Enhance</p>
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent className='w-96'>
                {!text ? (
                    <p className='text-sm text-muted-foreground'>Please enter some text to enhance.</p>
                ) : (
                    <div>
                        {fetchMagicLoading ? (
                            <div className='flex justify-center'>
                                <Spinner />
                            </div>
                        ) : (
                            <div>
                                {magicResult && magicResult.prompt ? (
                                    <div className='space-y-2'>
                                        <small className='text-sm font-medium leading-none'>Your prompt</small>
                                        <p className={rootSectionClassNames}>{magicResult.prompt}</p>
                                        <button
                                            className={cn(buttonVariants({ variant: "default", size: "sm" }), "ml-auto flex !h-6")}
                                            onClick={() => onSetPrompt(magicResult.prompt!)}
                                        >
                                            <p className='text-xs font-semibold'>Use this prompt</p>
                                        </button>

                                        <small className='text-sm font-medium leading-none'>Intent</small>
                                        <p className={rootSectionClassNames}>{magicResult.intent}</p>

                                        {magicResult.score !== undefined && (
                                            <>
                                                <div className='pt-2'></div>
                                                <small className='text-sm font-medium leading-none'>Confidence</small>
                                                <ScoreBar
                                                    score={magicResult.score!}
                                                    getScoreClassName={(score: number) => {
                                                        if (score > 80) {
                                                            return "bg-green-600"
                                                        } else if (score > 60) {
                                                            return "bg-blue-600"
                                                        } else if (score > 40) {
                                                            return "bg-yellow-600"
                                                        } else {
                                                            return "bg-red-600"
                                                        }
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <p className='text-sm text-muted-foreground'>No prompt found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
