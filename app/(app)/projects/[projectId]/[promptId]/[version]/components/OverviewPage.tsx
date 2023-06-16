"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Prompt } from "@prisma/client"
import { HelpCircle, Smile } from "lucide-react"
import type Scrollbars from "react-custom-scrollbars-2"
import useFetch, { CachePolicies } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { isEqual } from "@/lib/isEqual"
import { SafeSerializeCast } from "@/lib/safeSerialize"
import { cn } from "@/lib/utils"
import { useBeforeUnload } from "@/hooks/use-before-unload"
import { useDebounce } from "@/hooks/use-debouce"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Footer from "@/components/Footer"
import { PromptInput } from "@/components/PromptInput"
import { ScrollBars } from "@/components/ScrollBars"
import { selectProps } from "@/components/selectProps"

import { ResponseData } from "../api/update/route"

function isSuccessfulUpdateResponse(res: ResponseData): res is { version: number } {
    return (res as any).version !== undefined
}
export function OverviewPage({
    prompt: { type, text: defaultPromptVal, projectId, id: promptId },
    promptVariableDescriptionsMap: _promptVariableDescriptionsMap,
}: {
    prompt: SafeSerializeCast<Prompt>
    promptVariableDescriptionsMap: Record<string, string>
}) {
    const { toast } = useToast()
    const pathname = usePathname()
    const router = useRouter()
    const scrollBarRef = useRef<Scrollbars>(null)

    const [promptVariableDescriptionsMap, setPromptVariableDescriptionsMap] =
        useState<Record<string, string>>(_promptVariableDescriptionsMap)
    const [promptVal, setPromptVal] = useState<string>(defaultPromptVal)
    const debouncedPromptVal = useDebounce(promptVal, 500)
    const [expandedVariables, setExpandedVariables] = useState<string[]>([])
    const displayedVariables = useMemo<string[]>(() => {
        const variableRegex = /\{(\w+)?\}/g

        const variables = new Set<string>()

        let match: RegExpExecArray | null
        while ((match = variableRegex.exec(debouncedPromptVal)) !== null) {
            variables.add(match[1])
        }

        return Array.from(variables)
    }, [debouncedPromptVal])

    const { post: updatePrompt, loading: updatePromptLoading } = useFetch<ResponseData>(`${pathname}/api/update`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    useBeforeUnload(promptVal !== defaultPromptVal, "You have unsaved changes, are you sure?")

    useEffect(() => {
        const anyWindow = window as any
        anyWindow.promptSaveCallback = (): boolean => {
            if (promptVal === defaultPromptVal && isEqual(promptVariableDescriptionsMap, _promptVariableDescriptionsMap)) {
                toast({
                    title: "No changes made.",
                    description: "The prompt text or variable descriptions have not changed.",
                    variant: "default",
                })
                return false
            } else {
                updatePrompt({
                    text: promptVal,
                    promptVariableDescriptionsMap,
                }).then((res) => {
                    if (isSuccessfulUpdateResponse(res)) {
                        router.push(`/projects/${projectId}/${promptId}/${res.version}`)
                    }
                })
                return true
            }
        }
        return () => {
            delete anyWindow.promptSaveCallback
        }
    }, [
        projectId,
        promptId,
        promptVal,
        router,
        defaultPromptVal,
        toast,
        updatePrompt,
        promptVariableDescriptionsMap,
        _promptVariableDescriptionsMap,
    ])

    return (
        <>
            <div className='min-h-[calc(100vh-400px)]'>
                <div className={cn("flex gap-8", "flex-col", "lg:flex-row")}>
                    <div className='flex basis-4/6'>
                        <PromptInput
                            type={type}
                            onChange={(text) => {
                                text !== undefined && setPromptVal(text)
                            }}
                            autoResize
                            onVariableClick={(variable) => {
                                setExpandedVariables((prev) => {
                                    const _prev = [...prev]
                                    if (_prev.includes(variable)) {
                                        // Ignore closing the accordion
                                        return prev
                                    } else {
                                        setTimeout(
                                            () =>
                                                requestAnimationFrame(() =>
                                                    scrollBarRef.current?.forceUpdate(() => {
                                                        if (scrollBarRef.current) {
                                                            const lastClickedVariableDescription = document.getElementById(
                                                                `${variable}-description`
                                                            )
                                                            if (lastClickedVariableDescription) {
                                                                lastClickedVariableDescription.focus()
                                                            } else {
                                                                console.warn(`Could not find description for variable ${variable}`)
                                                            }
                                                        }
                                                    })
                                                ),
                                            300
                                        )
                                        _prev.push(variable)
                                        return _prev
                                    }
                                })
                            }}
                            value={promptVal}
                            readOnly={updatePromptLoading}
                        />
                    </div>
                    <div className={cn("flex min-w-[300px] basis-2/6 flex-col rounded-md border-[0.5px] border-border", "max-h-[400px]")}>
                        {!!displayedVariables.length && (
                            <div className='flex items-center justify-between border-b-[0.5px] border-b-border bg-muted/50 px-4 py-2'>
                                <span className='text-lg font-semibold'>Prompt variables</span>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <HelpCircle size={16} className='text-muted-foreground' />
                                        </TooltipTrigger>
                                        <TooltipContent {...selectProps("max-w-xs")}>
                                            <p>
                                                These are variables that have been found in your prompt.
                                                <br />
                                                <br />
                                                Adding a description will help us understand the context of the variable and the deeper
                                                intent of your prompt. to generate better suggestions and examples.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}
                        <ScrollBars className={"relative min-h-[200px] lg:min-h-0"} ref={scrollBarRef}>
                            {!!displayedVariables.length ? (
                                <Accordion type='multiple' value={expandedVariables} onValueChange={setExpandedVariables}>
                                    {displayedVariables.map((variable) => (
                                        <AccordionItem value={variable} key={variable} className='px-4'>
                                            <AccordionTrigger className='h-[45px] !no-underline'>
                                                <code className='rounded bg-muted p-[0.2rem] font-mono text-sm font-semibold'>
                                                    {variable}
                                                </code>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <Textarea
                                                    placeholder='Add a description...'
                                                    id={`${variable}-description`}
                                                    className={cn("cursor-pointer shadow-lg !ring-transparent focus:!border-cyan-600")}
                                                    value={promptVariableDescriptionsMap[variable] || ""}
                                                    onChange={(e) => {
                                                        if (!e.target.value) {
                                                            setPromptVariableDescriptionsMap((prev) => {
                                                                const _prev = { ...prev }
                                                                delete _prev[variable]
                                                                return _prev
                                                            })
                                                        } else {
                                                            setPromptVariableDescriptionsMap((prev) => ({
                                                                ...prev,
                                                                [variable]: e.target.value,
                                                            }))
                                                        }
                                                    }}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className='flex h-full w-full flex-col items-center justify-center'>
                                    <p className='px-4 text-center text-sm text-muted-foreground'>
                                        The variables in your prompt will appear here.
                                    </p>
                                    <Smile className='mt-4 text-muted-foreground' size={24} />
                                </div>
                            )}
                        </ScrollBars>
                    </div>
                </div>
            </div>
            {/* Builder goes here */}
            <Footer className='mt-20' />
        </>
    )
}
