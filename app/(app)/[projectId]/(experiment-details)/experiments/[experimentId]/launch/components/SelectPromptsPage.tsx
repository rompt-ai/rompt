"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Close as PrimitiveClose } from "@radix-ui/react-popover"
import { AlertTriangle, Import, Loader2, Plus, PlusCircle, Rocket } from "lucide-react"
import { nanoid } from "nanoid"
import { capitalize, split } from "strz"

import { generateIdToNameVersionMap } from "@/lib/generateIdToNameVersionMap"
import { isEqual } from "@/lib/isEqual"
import { cn } from "@/lib/utils"
import { useInterval } from "@/hooks/use-interval"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CreateSelect from "@/components/CreateSelect"
import { selectProps } from "@/components/selectProps"

import { ImportedPromptRow } from "./ImportedPromptRow"
import { NewPromptRow } from "./NewPromptRow"
import { VariableSection } from "./VariablesSection"
import {
    GetDetailsFn,
    ImportedPrompt,
    LaunchExperimentPageProps,
    NewPrompt,
    NewPromptComplete,
    VariableToVariationMap,
    defaultModelOptions,
    isSelectedPromptImported,
} from "./types"

export function SelectPromptsPage({
    experiment,
    prompts,
    servicesWithValidKeys,
    onLaunch,
}: LaunchExperimentPageProps & {
    onLaunch: (selectedPrompts: (ImportedPrompt | NewPromptComplete)[], variableToVariationMap: VariableToVariationMap) => Promise<void>
}) {
    const { toast } = useToast()
    const { projectId } = useParams()
    const idToNameVersionMap = useMemo(() => generateIdToNameVersionMap(prompts), [prompts])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const [isImporting, setIsImporting] = useState(false)
    const [addingPromptId, setAddingPromptId] = useState<string>()
    const [addingVersion, setAddingVersion] = useState<string>()
    const [generatingVariables, setGeneratingVariables] = useState<Record<string, { name: string; variables: string[] }>>({})
    const [variableToVariationMap, setVariableToVariationMap] = useState<VariableToVariationMap>({})

    const generatingVariablesFlatLength = useMemo<number>(
        () =>
            Object.values(generatingVariables)
                .map((ele) => ele.variables)
                .flat().length,
        [generatingVariables]
    )

    const someVariableIsMissing = useMemo<boolean>(() => {
        for (const [_, { variables }] of Object.entries(generatingVariables)) {
            for (const variable of variables) {
                for (let i = 0; i < (experiment.nVariableVariations || 1); i++) {
                    if (!variableToVariationMap?.[variable]?.[i]) {
                        return true
                    }
                }
            }
        }

        return false
    }, [experiment.nVariableVariations, generatingVariables, variableToVariationMap])

    const [selectedPrompts, setSelectedPrompts] = useState<(ImportedPrompt | NewPrompt)[]>([])

    const newPromptToGetDetailsMap = useRef<Record<string, GetDetailsFn>>({})

    const getPromptOfVersion = (promptId: string, version: number) => {
        return idToNameVersionMap[promptId].find((ele) => ele.version === version)
    }

    useInterval(() => {
        const promptVariables: typeof generatingVariables = {}

        const addTotalVariables = (uiId: string, name: string, text: string) => {
            for (const currMatch of text.match(variableRegex) || []) {
                if (!promptVariables[uiId]) {
                    promptVariables[uiId] = { name, variables: [] }
                }
                promptVariables[uiId].variables.push(currMatch)
            }
        }

        const variableRegex = /\{(\w+)?\}/g

        for (const selectedPrompt of selectedPrompts) {
            if (isSelectedPromptImported(selectedPrompt)) {
                const { promptId, promptVersion, uiId } = selectedPrompt
                const { text, name } = getPromptOfVersion(promptId, promptVersion)!
                addTotalVariables(uiId, name, text)
            } else {
                const getDetails = newPromptToGetDetailsMap.current[selectedPrompt.uiId]
                if (getDetails) {
                    const { text, name } = getDetails()
                    addTotalVariables(selectedPrompt.uiId, name || "New prompt*", text)
                }
                // There is a rare case where getDetails will not have been set in the mount function,
                // but will likely be available on next loop
            }
        }

        // Objects will always force a rerender and we want to avoid if the values are the same
        if (!isEqual(generatingVariables, promptVariables)) {
            setGeneratingVariables(promptVariables)
        }
    }, 1000)

    function onSubmit() {
        setIsSubmitting(true)
        const launchPrompts: (ImportedPrompt | NewPromptComplete)[] = []
        for (const selectedPrompt of selectedPrompts) {
            // Check 1
            const [provider] = split(selectedPrompt.model, "/")
            if (!servicesWithValidKeys.includes(provider)) {
                toast({
                    title: `No ${capitalize(provider)} API key found.`,
                    description: (
                        <span className='text-foreground'>
                            Head to{" "}
                            <Link href={`/${projectId}/api-keys`} className='font-semibold underline underline-offset-2'>
                                API Keys
                            </Link>{" "}
                            to add a new key.
                        </span>
                    ),
                    variant: "destructive",
                })
                setIsSubmitting(false)
                return
            }

            if (isSelectedPromptImported(selectedPrompt)) {
                launchPrompts.push(selectedPrompt)
            } else {
                if (!newPromptToGetDetailsMap.current[selectedPrompt.uiId]().text) {
                    toast({
                        title: "Empty prompt found",
                        description: "Please either remove the empty prompt or enter some text before continuing.",
                        variant: "destructive",
                    })
                    setIsSubmitting(false)
                    return
                }

                // Success
                const getDetails = newPromptToGetDetailsMap.current[selectedPrompt.uiId]
                const { text, name } = getDetails()
                launchPrompts.push({
                    ...selectedPrompt,
                    text,
                    name,
                })
            }
        }

        onLaunch(launchPrompts, variableToVariationMap).catch(() => setIsSubmitting(false))
    }

    return (
        <div className={cn("flex gap-6", "flex-col", "lg:flex-row lg:items-start")}>
            <div className='w-full divide-y divide-border overflow-hidden rounded-md border border-border'>
                {selectedPrompts.map((prompt) => {
                    if (isSelectedPromptImported(prompt)) {
                        const { promptVersion, promptId, model, uiId, ...modelOpts } = prompt
                        const { name, text, type } = getPromptOfVersion(promptId, promptVersion)!
                        return (
                            <ImportedPromptRow
                                key={uiId}
                                model={model}
                                name={name}
                                text={text}
                                type={type}
                                promptVersion={promptVersion}
                                onRemove={() => setSelectedPrompts((prev) => prev.filter((ele) => ele.uiId !== uiId))}
                                onUpdate={(settings) => {
                                    setSelectedPrompts((prev) =>
                                        prev.map((ele) => {
                                            if (ele.uiId === uiId) {
                                                return {
                                                    ...ele,
                                                    ...settings,
                                                }
                                            } else {
                                                return ele
                                            }
                                        })
                                    )
                                }}
                                {...modelOpts}
                            />
                        )
                    } else {
                        const { uiId, model, ...modelOpts } = prompt
                        return (
                            <NewPromptRow
                                key={uiId}
                                model={model}
                                onRemove={() => setSelectedPrompts((prev) => prev.filter((ele) => ele.uiId !== uiId))}
                                onGetDetailsCallback={(fn) => {
                                    newPromptToGetDetailsMap.current[uiId] = fn
                                }}
                                onUpdate={(settings) => {
                                    setSelectedPrompts((prev) =>
                                        prev.map((ele) => {
                                            if (ele.uiId === uiId) {
                                                return {
                                                    ...ele,
                                                    ...settings,
                                                }
                                            } else {
                                                return ele
                                            }
                                        })
                                    )
                                }}
                                {...modelOpts}
                            />
                        )
                    }
                })}
                <Popover
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsImporting(false)
                            setAddingPromptId(undefined)
                            setAddingVersion(undefined)
                        }
                    }}
                >
                    <PopoverTrigger asChild>
                        <div className='flex h-[48px] cursor-pointer items-center justify-center gap-x-1.5 text-muted-foreground transition-colors hover:bg-muted'>
                            <PlusCircle size={14} />
                            <span className='text-sm'>Add prompt</span>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent {...selectProps("!w-[420px] bg-muted")}>
                        {isImporting ? (
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <CreateSelect
                                        label='Prompt'
                                        value={addingPromptId}
                                        onValueChange={setAddingPromptId}
                                        options={Object.keys(idToNameVersionMap).map((ele) => ({
                                            label: idToNameVersionMap[ele][0].name,
                                            value: ele,
                                        }))}
                                        placeholder='No prompt selected'
                                    />
                                    <CreateSelect
                                        label='Version'
                                        value={addingVersion}
                                        onValueChange={setAddingVersion}
                                        disabled={!addingPromptId}
                                        options={
                                            addingPromptId === undefined
                                                ? []
                                                : idToNameVersionMap[addingPromptId].map((ele) => ({
                                                      label: "" + ele.version,
                                                      value: "" + ele.version,
                                                  }))
                                        }
                                        placeholder='Select a prompt'
                                    />
                                </div>
                                <PrimitiveClose
                                    className={cn("w-full", !addingVersion && "pointer-events-none opacity-50")}
                                    disabled={!addingVersion}
                                >
                                    <div
                                        className={cn(buttonVariants({ size: "sm", variant: "default" }), "w-full")}
                                        onClick={() => {
                                            if (
                                                selectedPrompts.some(
                                                    (ele) =>
                                                        isSelectedPromptImported(ele) &&
                                                        ele.promptId === addingPromptId &&
                                                        ele.promptVersion === parseInt(addingVersion!)
                                                )
                                            ) {
                                                toast({
                                                    title: "Adding duplicate prompt",
                                                    description:
                                                        "This prompt has already been added. A duplicate version will now be added.",
                                                })
                                            }

                                            setSelectedPrompts((prev) => [
                                                ...prev,
                                                {
                                                    promptId: addingPromptId!,
                                                    promptVersion: parseInt(addingVersion!),
                                                    uiId: nanoid(),
                                                    ...defaultModelOptions,
                                                },
                                            ])
                                        }}
                                    >
                                        <Plus className={"mr-2 h-4 w-4"} />
                                        Add
                                    </div>
                                </PrimitiveClose>
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 gap-4'>
                                <Button variant={"outline"} size={"sm"} className={cn("w-full")} onClick={() => setIsImporting(true)}>
                                    <Import className={"mr-2 h-4 w-4"} />
                                    Import from Project
                                </Button>
                                <PrimitiveClose>
                                    <div
                                        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full")}
                                        onClick={() => {
                                            setSelectedPrompts((prev) => [
                                                ...prev,
                                                {
                                                    type: "new",
                                                    uiId: nanoid(),
                                                    ...defaultModelOptions,
                                                },
                                            ])
                                        }}
                                    >
                                        <Plus className={"mr-2 h-4 w-4"} />
                                        Create New
                                    </div>
                                </PrimitiveClose>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
            <div className='min-w-[250px] max-w-[350px] basis-1/3 space-y-5'>
                <div className='space-y-5 overflow-hidden rounded-md border border-border px-4 py-6'>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm leading-none text-muted-foreground'>Prompts selected</span>
                        <span className='text-sm font-semibold leading-none'>{selectedPrompts.length}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm leading-none text-muted-foreground'>Responses to generate</span>
                        <span className='text-sm font-semibold leading-none'>
                            {selectedPrompts.length * experiment.nVariableVariations * experiment.nResponseVariations}
                        </span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm leading-none text-muted-foreground'>Variables selected</span>
                        <span className='text-sm font-semibold leading-none'>{generatingVariablesFlatLength}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm leading-none text-muted-foreground'>Generated variables</span>
                        <span className='text-sm font-semibold leading-none'>
                            {generatingVariablesFlatLength * experiment.nVariableVariations}
                        </span>
                    </div>
                </div>
                {isSubmitting ? (
                    <Button className='w-full' disabled>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please wait
                    </Button>
                ) : (
                    <Button className='w-full' disabled={selectedPrompts.length === 0} onClick={onSubmit}>
                        <Rocket className='mr-2 h-4 w-4' /> Launch
                    </Button>
                )}
                {generatingVariablesFlatLength > 0 && (
                    <VariableSection
                        generatingVariables={generatingVariables}
                        nVariableVariations={experiment.nVariableVariations}
                        variableToVariationMap={variableToVariationMap}
                        setVariableToVariationMap={setVariableToVariationMap}
                    />
                )}
                {someVariableIsMissing && (
                    <Alert className='bg-secondary'>
                        <AlertTriangle className='h-4 w-4' />
                        <AlertTitle>Undefined variables</AlertTitle>
                        <AlertDescription>
                            Some variables above are missing values. Unset variables will remain in the prompt as plain text.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}
