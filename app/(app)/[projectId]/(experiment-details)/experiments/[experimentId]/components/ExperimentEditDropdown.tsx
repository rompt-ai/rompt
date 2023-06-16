"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronDown, Trash, Type } from "lucide-react"
import useFetch, { CachePolicies } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { selectProps } from "@/components/selectProps"

import { ResponseData as DeleteResponseData } from "../api/delete/route"
import { ResponseData as RenameResponseData } from "../api/rename/route"

interface ExperimentEditDropdownProps {
    experimentName: string
}

export function ExperimentEditDropdown({ experimentName }: ExperimentEditDropdownProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [experimentNameInputVal, setExperimentNameInputVal] = useState("")

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
    const [newNameVal, setNewNameVal] = useState("")

    const { projectId, experimentId } = useParams()!

    useEffect(() => {
        if (isDeleteDialogOpen) {
            setExperimentNameInputVal("")
        }
    }, [isDeleteDialogOpen])

    useEffect(() => {
        if (isRenameDialogOpen) {
            setNewNameVal("")
        }
    }, [isRenameDialogOpen])

    const router = useRouter()
    const { toast } = useToast()

    const { post: deleteExperiment, loading: deleteExperimentLoading } = useFetch<DeleteResponseData>(
        `/${projectId}/experiments/${experimentId}/api/delete`,
        {
            onError: () => toast(errorToast),
            cachePolicy: CachePolicies.NO_CACHE,
        }
    )

    const { post: renameExperiment, loading: renameExperimentLoading } = useFetch<RenameResponseData>(
        `/${projectId}/experiments/${experimentId}/api/rename`,
        {
            onError: () => toast(errorToast),
            cachePolicy: CachePolicies.NO_CACHE,
        }
    )

    const disabled = deleteExperimentLoading || renameExperimentLoading
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={disabled}>
                    <Button variant='outline' className='bg-background'>
                        <ChevronDown className='mr-2 h-4 w-4' />
                        Edit
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' {...selectProps()}>
                    <DropdownMenuGroup>
                        <DropdownMenuItem disabled={disabled} onClick={() => setIsRenameDialogOpen(true)}>
                            <Type className='mr-2 h-4 w-4' />
                            <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={disabled} onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash className='mr-2 h-4 w-4' />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDeleteDialogOpen} onOpenChange={!disabled ? setIsDeleteDialogOpen : undefined}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            You are about to delete this experiment, including all of its feedback. This action cannot be undone.
                            <br />
                            <br />
                            To proceed, enter the name of the experiment: <span className='font-semibold'>{experimentName}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder={experimentName}
                        onChange={(e) => setExperimentNameInputVal(e.target.value)}
                        value={experimentNameInputVal}
                    />
                    <DialogFooter>
                        <Button disabled={disabled} variant={"default"} autoFocus onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={disabled || experimentNameInputVal !== experimentName}
                            variant={"destructive"}
                            onClick={() => {
                                deleteExperiment().then(() => {
                                    router.refresh()
                                    setIsDeleteDialogOpen(false)
                                    router.push(`/${projectId}/experiments`)
                                })
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRenameDialogOpen} onOpenChange={!disabled ? setIsRenameDialogOpen : undefined}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Rename this experiment</DialogTitle>
                        <DialogDescription>
                            Please enter a new name for your experiment <span className='font-semibold'>{experimentName}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <Input placeholder={"My Awesome Experiment"} onChange={(e) => setNewNameVal(e.target.value)} value={newNameVal} />
                    <DialogFooter>
                        <Button disabled={disabled} variant={"secondary"} autoFocus onClick={() => setIsRenameDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={disabled || !newNameVal || newNameVal === experimentName}
                            variant={"default"}
                            onClick={() => {
                                renameExperiment({
                                    newName: newNameVal,
                                }).then(() => {
                                    setIsRenameDialogOpen(false)
                                    router.refresh()
                                })
                            }}
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
