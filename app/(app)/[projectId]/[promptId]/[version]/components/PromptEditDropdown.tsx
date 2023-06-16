"use client"

import { useContext, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, SplitSquareHorizontal, Trash, Type } from "lucide-react"
import useFetch, { CachePolicies } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { selectProps } from "@/components/selectProps"

import { ResponseData as DeleteResponseData } from "../api/delete/route"
import { ResponseData as RenameResponseData } from "../api/rename/route"

export function PromptEditDropdown({
    promptName,
    projectId,
    promptId,
    currentWhereVersion,
}: {
    promptName: string
    projectId: string
    promptId: string
    currentWhereVersion: number
}) {
    const { toast } = useToast()
    const router = useRouter()

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleteAllVersions, setIsDeleteAllVersions] = useState(false)
    const [promptNameInputVal, setPromptNameInputVal] = useState("")

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
    const [newNameVal, setNewNameVal] = useState("")

    const pathname = usePathname()

    const { post: deletePrompt, loading: deletePromptLoading } = useFetch<DeleteResponseData>(`${pathname}/api/delete`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    const { post: renamePrompt, loading: renamePromptLoading } = useFetch<RenameResponseData>(`${pathname}/api/rename`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    const disabled = deletePromptLoading || renamePromptLoading

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
                        <DropdownMenuItem
                            disabled={disabled}
                            onClick={() => router.push(`/${projectId}/compare?src-prompt=${promptId}&src-version=${currentWhereVersion}`)}
                        >
                            <SplitSquareHorizontal className='mr-2 h-4 w-4' />
                            <span>Compare</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={disabled} onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash className='mr-2 h-4 w-4' />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    if (!disabled) {
                        setIsDeleteDialogOpen(open)
                        setIsDeleteAllVersions(false)
                        setPromptNameInputVal("")
                    }
                }}
            >
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            You are about to delete{" "}
                            <span className='font-bold'>{isDeleteAllVersions ? "all versions" : `version ${currentWhereVersion}`}</span> of
                            this prompt. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='mb-4 flex items-center space-x-2'>
                        <Switch id='delete-all' checked={isDeleteAllVersions} onCheckedChange={setIsDeleteAllVersions} />
                        <Label htmlFor='delete-all'>Delete all versions of this prompt</Label>
                    </div>
                    {isDeleteAllVersions && (
                        <>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>
                                To proceed, enter the name of this prompt: <span className='font-semibold'>{promptName}</span>
                            </p>
                            <Input
                                placeholder={promptName}
                                onChange={(e) => setPromptNameInputVal(e.target.value)}
                                value={promptNameInputVal}
                            />
                        </>
                    )}
                    <DialogFooter>
                        <Button disabled={disabled} variant={"default"} autoFocus onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={disabled || (isDeleteAllVersions && promptNameInputVal !== promptName)}
                            variant={"destructive"}
                            onClick={() => {
                                deletePrompt({
                                    deleteAll: isDeleteAllVersions,
                                    version: currentWhereVersion,
                                }).then(() => {
                                    router.refresh()
                                    setIsDeleteDialogOpen(false)
                                    router.push(`/${projectId}`)
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
                        <DialogTitle>Rename this prompt</DialogTitle>
                        <DialogDescription>
                            Please enter a new name for your prompt <span className='font-semibold'>{promptName}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <Input placeholder={"My Newer Prompt"} onChange={(e) => setNewNameVal(e.target.value)} value={newNameVal} />
                    <DialogFooter>
                        <Button disabled={disabled} variant={"secondary"} autoFocus onClick={() => setIsRenameDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={disabled || !newNameVal || newNameVal === promptName}
                            variant={"default"}
                            onClick={() => {
                                renamePrompt({
                                    newName: newNameVal,
                                    version: currentWhereVersion,
                                }).then(() => {
                                    router.refresh()
                                    setIsRenameDialogOpen(false)
                                    setNewNameVal("")
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
