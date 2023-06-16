import { Fragment, useMemo } from "react"
import { BookOpen } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/components/IconButton"
import { selectProps } from "@/components/selectProps"

import { VariableToVariationMap } from "./types"

export function VariableSection({
    generatingVariables,
    nVariableVariations,
    variableToVariationMap,
    setVariableToVariationMap,
}: {
    generatingVariables: Record<string, { name: string; variables: string[] }>
    nVariableVariations: number | null
    variableToVariationMap: VariableToVariationMap
    setVariableToVariationMap: React.Dispatch<React.SetStateAction<VariableToVariationMap>>
}) {
    const { toast } = useToast()
    const variationsToMap = nVariableVariations || 1
    const allVariablesSet = useMemo<string[]>(() => {
        const set = new Set<string>()
        Object.values(generatingVariables).forEach(({ variables }) => variables.forEach((variable) => set.add(variable)))
        return Array.from(set)
    }, [generatingVariables])

    return (
        <ScrollArea className='relative h-80 rounded-md border border-border'>
            <div className='sticky top-0 z-50 flex h-[40px] w-full items-center bg-muted/50 px-4 text-lg font-semibold backdrop-blur-sm'>
                Variables
            </div>
            {Array.from({ length: variationsToMap }).map((_, i) => (
                <Fragment key={`${i}`}>
                    <div className='sticky top-[40px] z-50 flex items-center border-y border-border bg-muted/50 px-4 backdrop-blur-sm'>
                        <span className='py-1.5 text-xs font-semibold leading-none text-muted-foreground'>Variation {i + 1}</span>
                    </div>
                    {allVariablesSet.map((variableName) => (
                        <div className='grid grid-cols-4 px-4 py-1.5'>
                            <div className='col-span-3 inline-flex items-center'>
                                <code className='block truncate rounded bg-muted p-[0.2rem] font-mono text-sm font-semibold'>
                                    {variableName}
                                </code>
                            </div>
                            <div className='flex items-center justify-end gap-x-2'>
                                <Checkbox disabled checked={!!variableToVariationMap[variableName]?.[`${i}`]} />
                                <Dialog>
                                    <DialogTrigger>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <IconButton>
                                                        <BookOpen className='h-4 w-4' />
                                                    </IconButton>
                                                </TooltipTrigger>
                                                <TooltipContent {...selectProps("z-[1000]")}>
                                                    <p>Edit value</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit value</DialogTitle>
                                            <DialogDescription>
                                                <small className='text-sm font-medium leading-none'>Setting the value for variable </small>
                                                <code className='break-all rounded bg-muted p-[0.2rem] font-mono font-semibold'>
                                                    {variableName}
                                                </code>
                                                <small className='text-sm font-medium leading-none'> in variant {i + 1}.</small>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Textarea
                                            rows={5}
                                            placeholder='Enter variable value'
                                            value={variableToVariationMap[variableName]?.[`${i}`] || ""}
                                            onChange={(e) => {
                                                setVariableToVariationMap((prev) => {
                                                    const _prev = { ...prev }
                                                    if (e.target.value) {
                                                        if (!_prev[variableName]) {
                                                            _prev[variableName] = {
                                                                [`${i}`]: e.target.value,
                                                            }
                                                        } else {
                                                            _prev[variableName][`${i}`] = e.target.value
                                                        }
                                                    } else {
                                                        delete _prev[variableName][`${i}`]
                                                    }
                                                    return _prev
                                                })
                                            }}
                                        />
                                        {variationsToMap > 1 && (
                                            <div className='-my-2.5'>
                                                <Button
                                                    className='h-6 px-2 text-xs font-semibold text-muted-foreground'
                                                    variant={"ghost"}
                                                    onClick={() => {
                                                        const currentValue = variableToVariationMap[variableName]?.[`${i}`]
                                                        setVariableToVariationMap((prev) => {
                                                            const _prev = { ...prev }
                                                            const newVariantToValueMap: Record<string, string> = {}
                                                            Array.from({ length: variationsToMap }).forEach((_, j) => {
                                                                newVariantToValueMap[`${j}`] = currentValue
                                                            })
                                                            _prev[variableName] = newVariantToValueMap
                                                            return _prev
                                                        })
                                                        toast({
                                                            variant: "default",
                                                            title: "Applied to all variations",
                                                        })
                                                    }}
                                                >
                                                    Apply to all variations
                                                </Button>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </Fragment>
            ))}
        </ScrollArea>
    )
}
