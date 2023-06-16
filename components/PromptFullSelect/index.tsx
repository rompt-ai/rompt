import { useEffect, useMemo } from "react"
import useFetch, { CachePolicies } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { generateIdToNameVersionMap } from "@/lib/generateIdToNameVersionMap"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ResponseData } from "@/app/(app)/projects/[projectId]/create/api/list-prompts/route"

import CreateSelect, { SelectLoadingPlaceholder } from "../CreateSelect"

interface PromptFullSelectProps {
    className?: string
    projects: {
        id: string
        name: string
    }[]
    disabled?: boolean

    projectId?: string | undefined
    setProjectId: React.Dispatch<React.SetStateAction<string | undefined>>

    promptId?: string | undefined
    setPromptId: React.Dispatch<React.SetStateAction<string | undefined>>

    version?: string | undefined
    setVersion: React.Dispatch<React.SetStateAction<string | undefined>>

    onIdToNameMapGeneration?: (
        newData: Record<
            string,
            {
                id: string
                name: string
                text: string
                version: number
            }[]
        >
    ) => void
}

export function PromptFullSelect({
    className,
    projects,
    disabled,
    projectId,
    setProjectId,
    promptId,
    setPromptId,
    version,
    setVersion,
    onIdToNameMapGeneration,
}: PromptFullSelectProps) {
    const { toast } = useToast()
    const { data: listPromptsInProjectData = [], loading: listPromptsInProjectLoading } = useFetch<ResponseData>(
        `/projects/${projectId}/create/api/list-prompts`,
        {
            onError: () => toast(errorToast),
            cachePolicy: CachePolicies.NO_CACHE,
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        },
        [projectId]
    )

    useEffect(() => {
        if (projectId) {
            setPromptId(undefined)
            setVersion(undefined)
        }
    }, [projectId])

    const idToNameVersionMap = useMemo(() => {
        if (Array.isArray(listPromptsInProjectData)) {
            const _idToNameVersionMap = generateIdToNameVersionMap(listPromptsInProjectData)
            onIdToNameMapGeneration && onIdToNameMapGeneration(_idToNameVersionMap)
            return _idToNameVersionMap
        }
        return {}
    }, [listPromptsInProjectData])

    useEffect(() => {
        if (promptId) {
            const latestVersion = Math.max(...idToNameVersionMap[promptId].map((ele) => ele.version))
            setVersion("" + latestVersion)
        }
    }, [promptId])

    return (
        <div className={cn("grid grid-cols-1 gap-4", className)}>
            <div className='grid w-full grid-cols-2 gap-4'>
                <CreateSelect
                    label='Project'
                    value={projectId}
                    onValueChange={setProjectId}
                    disabled={disabled}
                    options={projects.map((ele) => ({ label: ele.name, value: ele.id }))}
                    placeholder='No project selected'
                />
            </div>
            {/**
             * This conditional rendering is needed
             * to fix a bug where the prompt and version
             * select would not update when the project
             * select was changed. The components need
             * to be fully re-rendered to update the
             * options.
             */}
            {!listPromptsInProjectLoading && Array.isArray(listPromptsInProjectData) ? (
                <div className='grid w-full grid-cols-2 gap-4'>
                    <CreateSelect
                        label='Prompt'
                        value={promptId}
                        onValueChange={setPromptId}
                        disabled={disabled}
                        options={Object.keys(idToNameVersionMap).map((ele) => ({ label: idToNameVersionMap[ele][0].name, value: ele }))}
                        placeholder='No prompt selected'
                    />
                    <CreateSelect
                        label='Version'
                        value={version}
                        onValueChange={setVersion}
                        disabled={disabled || !promptId}
                        options={
                            promptId === undefined
                                ? []
                                : idToNameVersionMap[promptId].map((ele) => ({ label: "" + ele.version, value: "" + ele.version }))
                        }
                        placeholder='Select a prompt'
                    />
                </div>
            ) : (
                <div className='grid w-full grid-cols-2 gap-4'>
                    <SelectLoadingPlaceholder label='Prompt' placeholder='No prompt selected' />
                    <SelectLoadingPlaceholder label='Version' placeholder='Select a prompt' />
                </div>
            )}
        </div>
    )
}
