"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

interface ProjectEditDropdownProps {
    projectName: string
    projectId: string
}

export function ProjectEditDropdown({ projectName, projectId }: ProjectEditDropdownProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [projectNameInputVal, setProjectNameInputVal] = useState("")

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
    const [newNameVal, setNewNameVal] = useState("")

    useEffect(() => {
        if (isDeleteDialogOpen) {
            setProjectNameInputVal("")
        }
    }, [isDeleteDialogOpen])

    useEffect(() => {
        if (isRenameDialogOpen) {
            setNewNameVal("")
        }
    }, [isRenameDialogOpen])

    const router = useRouter()
    const { toast } = useToast()

    const { post: deleteProject, loading: deleteProjectLoading } = useFetch<DeleteResponseData>(`/projects/${projectId}/api/delete`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    const { post: renameProject, loading: renameProjectLoading } = useFetch<RenameResponseData>(`/projects/${projectId}/api/rename`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    const disabled = deleteProjectLoading || renameProjectLoading
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
                            You are about to delete this project, including all of its prompts. This action cannot be undone.
                            <br />
                            <br />
                            To proceed, enter the name of the project: <span className='font-semibold'>{projectName}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <Input placeholder={projectName} onChange={(e) => setProjectNameInputVal(e.target.value)} value={projectNameInputVal} />
                    <DialogFooter>
                        <Button disabled={disabled} variant={"default"} autoFocus onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={disabled || projectNameInputVal !== projectName}
                            variant={"destructive"}
                            onClick={() => {
                                deleteProject().then(() => {
                                    router.refresh()
                                    setIsDeleteDialogOpen(false)
                                    router.push("/projects")
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
                        <DialogTitle>Rename this project</DialogTitle>
                        <DialogDescription>
                            Please enter a new name for your project <span className='font-semibold'>{projectName}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <Input placeholder={"My Awesome Project"} onChange={(e) => setNewNameVal(e.target.value)} value={newNameVal} />
                    <DialogFooter>
                        <Button disabled={disabled} variant={"secondary"} autoFocus onClick={() => setIsRenameDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={disabled || !newNameVal || newNameVal === projectName}
                            variant={"default"}
                            onClick={() => {
                                renameProject({
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
