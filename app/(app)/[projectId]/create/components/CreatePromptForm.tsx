"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Prompt } from "@prisma/client"
import { ArrowRight, GitBranchPlus, Plus } from "lucide-react"
import useFetch, { CachePolicies, FetchData } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { generateIdToNameVersionMap } from "@/lib/generateIdToNameVersionMap"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CreateSelect, { SelectLoadingPlaceholder } from "@/components/CreateSelect"
import { PromptInput } from "@/components/PromptInput"

import { ResponseData as FromNewResponseData } from "../api/from-new/route"
import { ResponseData as FromPromptResponseData } from "../api/from-prompt/route"
import { ResponseData as ListPromptsResponseData } from "../api/list-prompts/route"

export function CreatePromptForm({
    projectId,
    projects,
}: {
    projectId: string
    projects: {
        name: string
        id: string
    }[]
}) {
    const [base, setBase] = useState<"new" | "prompt">("new")
    const { toast } = useToast()
    const pathname = usePathname()
    const { post: createPromptFromNew, loading: createPromptFromNewLoading } = useFetch<FromNewResponseData>(`${pathname}/api/from-new`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })
    const { post: createPromptFromMerge, loading: createPromptFromMergeLoading } = useFetch<FromPromptResponseData>(
        `${pathname}/api/from-prompt`,
        {
            onError: () => toast(errorToast),
            cachePolicy: CachePolicies.NO_CACHE,
        }
    )

    return (
        <>
            <div className='mb-8 grid w-full items-center gap-2'>
                <Label>Base</Label>
                <p className='text-sm text-muted-foreground'>Choose whether to create a new prompt or branch from an existing one.</p>
                <div className='grid grid-cols-2 gap-4 rounded-md bg-muted/30 p-4'>
                    {(
                        [
                            {
                                type: "new",
                                label: "New Prompt",
                                description: "Create a new prompt from scratch.",
                                Icon: Plus,
                            },
                            {
                                type: "prompt",
                                label: "Branch from Existing Prompt",
                                description: "Create a new prompt from an existing one.",
                                Icon: GitBranchPlus,
                            },
                        ] as const
                    ).map(({ type, label, description, Icon }) => (
                        <div
                            key={type}
                            className={cn(
                                "cursor-pointer rounded-md border border-border p-4 transition-colors",
                                "flex h-[135px] flex-col justify-between",
                                base === type ? "bg-background shadow-sm" : "bg-muted shadow-lg"
                            )}
                            onClick={() => {
                                if (!createPromptFromNewLoading && !createPromptFromMergeLoading) {
                                    setBase(type)
                                }
                            }}
                        >
                            <div className='flex justify-between'>
                                <small className='text-sm font-medium leading-5'>{label}</small>
                                <Icon size={18} className={cn(base === type ? "text-foreground" : "text-muted-foreground")} />
                            </div>
                            <p className='text-sm text-muted-foreground'>{description}</p>
                        </div>
                    ))}
                </div>
            </div>
            {base === "prompt" ? (
                <FromPrompt
                    projects={projects}
                    loading={createPromptFromMergeLoading}
                    createPrompt={createPromptFromMerge}
                    givenProjectId={projectId}
                />
            ) : (
                <FromNew
                    projects={projects}
                    loading={createPromptFromNewLoading}
                    createPrompt={createPromptFromNew}
                    givenProjectId={projectId}
                />
            )}
        </>
    )
}

function isSuccessfulFromNewRes(res: FromNewResponseData): res is Prompt {
    return !!(res as Prompt).id
}

function isSuccessfulFromPromptResponse(res: FromPromptResponseData): res is Prompt {
    return !!(res as Prompt).id
}

type CreateProps<ResponseData> = {
    loading: boolean
    createPrompt: FetchData<ResponseData>
    projects: {
        name: string
        id: string
    }[]
    givenProjectId: string
}

function FromPrompt({ projects, loading, createPrompt, givenProjectId }: CreateProps<FromPromptResponseData>) {
    const router = useRouter()
    const { toast } = useToast()

    const [selectedProjectId, setSelectedProjectId] = useState<string>(givenProjectId)

    const [sourcePromptId, setSourcePromptId] = useState<string>()
    const [sourceVersion, setSourceVersion] = useState<string>()
    const [targetName, setTargetName] = useState<string>("")

    const [promptsInProject, setPromptsInProject] = useState<ListPromptsResponseData>()

    const { loading: listPromptsInProjectLoading, post: postListPromptsInProject } = useFetch<ListPromptsResponseData>(
        `/${selectedProjectId}/create/api/list-prompts`,
        {
            onError: () => toast(errorToast),
            cachePolicy: CachePolicies.NO_CACHE,
        }
    )

    const idToNameVersionMap = useMemo(() => generateIdToNameVersionMap(promptsInProject), [promptsInProject])

    useEffect(() => {
        postListPromptsInProject().then(setPromptsInProject)
    }, [postListPromptsInProject, selectedProjectId])

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (loading) {
            return
        }
        createPrompt({
            sourcePromptId,
            sourceVersion: Number(sourceVersion),
            targetName,
        }).then((res) => {
            if (isSuccessfulFromPromptResponse(res)) {
                router.refresh()
                router.push(`/${res.projectId}/${res.id}`)
            }
        })
    }

    return (
        <form className='space-y-8 pb-8' onSubmit={handleSubmit}>
            <CreateSelect
                label='Project'
                subtitle='Assign this prompt to a project.'
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                disabled={loading}
                options={projects.map((ele) => ({ label: ele.name, value: ele.id }))}
                placeholder='No project selected'
            />
            <div className='space-y-2'>
                <small className='text-sm font-medium leading-none'>Choose your source prompt:</small>
                <div className={cn("grid grid-cols-2 gap-4 rounded-md bg-muted/30 p-4")}>
                    {!listPromptsInProjectLoading && Array.isArray(promptsInProject) ? (
                        <>
                            <CreateSelect
                                label='Prompt'
                                value={sourcePromptId}
                                onValueChange={setSourcePromptId}
                                options={Object.keys(idToNameVersionMap).map((ele) => ({
                                    label: idToNameVersionMap[ele][0].name,
                                    value: ele,
                                }))}
                                placeholder='No prompt selected'
                                disabled={loading}
                            />
                            <CreateSelect
                                label='Version'
                                value={sourceVersion}
                                onValueChange={setSourceVersion}
                                disabled={loading || !sourcePromptId}
                                options={
                                    sourcePromptId === undefined
                                        ? []
                                        : idToNameVersionMap[sourcePromptId].map((ele) => ({
                                              label: "" + ele.version,
                                              value: "" + ele.version,
                                          }))
                                }
                                placeholder='Select a prompt'
                            />
                        </>
                    ) : (
                        <>
                            <SelectLoadingPlaceholder label='Prompt' placeholder='No prompt selected' />
                            <SelectLoadingPlaceholder label='Version' placeholder='Select a prompt' />
                        </>
                    )}
                </div>
            </div>
            <div className='grid w-full items-center gap-2'>
                <Label htmlFor='name'>Name</Label>
                <p className='text-sm text-muted-foreground'>Give your prompt a name so you can easily identify it.</p>
                <Input
                    type='text'
                    id='name'
                    required
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className='flex justify-end'>
                <Button type='submit' disabled={!targetName || !sourcePromptId || !sourceVersion || loading}>
                    Continue
                    <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
            </div>
        </form>
    )
}

function FromNew({ projects, loading, createPrompt, givenProjectId }: CreateProps<FromNewResponseData>) {
    const router = useRouter()

    const [selectedProjectId, setSelectedProjectId] = useState<string>(givenProjectId)
    const [name, setName] = useState<string>("")
    const [prompt, setPrompt] = useState<string>("")
    const [promptType, setPromptType] = useState<"plaintext" | "LMQL">("plaintext")

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (loading) {
            return
        }
        createPrompt({
            name,
            text: prompt,
            type: promptType,
            selectedProjectId,
        }).then((res) => {
            if (isSuccessfulFromNewRes(res)) {
                router.refresh()
                router.push(`/${res.projectId}/${res.id}/latest`)
            }
        })
    }

    return (
        <form className='space-y-8 pb-8' onSubmit={handleSubmit}>
            <CreateSelect
                label='Project'
                subtitle='Assign this prompt to a project.'
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                disabled={loading}
                options={projects.map((ele) => ({ label: ele.name, value: ele.id }))}
                placeholder='No project selected'
            />
            <div className='grid w-full items-center gap-2'>
                <Label htmlFor='name'>Name</Label>
                <p className='text-sm text-muted-foreground'>Give your prompt a name so you can easily identify it.</p>
                <Input type='text' id='name' required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
            </div>
            {/* <div className="grid gap-4">
                <Label>Type</Label>
                <RadioGroup 
                    value={promptType}
                    onValueChange={val => setPromptType(val as typeof promptType)}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="r1" />
                        <Label htmlFor="r1">
                            Text <span className='italic text-slate-400'>(default)</span>
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="LMQL" id="r2" />
                        <Label htmlFor="r2">LMQL</Label>
                    </div>
                </RadioGroup>
            </div> */}
            <div className='grid w-full items-center gap-2'>
                <Label>Prompt</Label>
                <div className='-mx-2'>
                    <PromptInput
                        type={promptType}
                        readOnly={loading}
                        onChange={(text) => {
                            text !== undefined && setPrompt(text)
                        }}
                        value={prompt}
                        hideMagic
                        autoResize
                    />
                </div>
            </div>
            <div className='flex justify-end'>
                <Button type='submit' disabled={!name || !prompt || !selectedProjectId || loading}>
                    Continue
                    <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
            </div>
        </form>
    )
}
