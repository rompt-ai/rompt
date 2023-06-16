"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Project } from "@prisma/client"
import { Plus } from "lucide-react"
import { CachePolicies, useFetch } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { useToast } from "@/hooks/use-toast"
import { Button, ButtonProps } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ResponseData } from "../api/create/route"

function isSuccessfulRes(res: ResponseData): res is Project {
    return !!(res as Project).id
}

export function CreateProjectDialog({ variant }: { variant?: ButtonProps["variant"] }) {
    const [newProjectName, setNewProjectName] = useState<string>("")
    const router = useRouter()
    const { toast } = useToast()
    const { post: createProject, loading: createProjectLoading } = useFetch<ResponseData>(`/projects/api/create`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    return (
        <Dialog
            onOpenChange={(open) => {
                if (!open) {
                    setNewProjectName("")
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className='px-4' variant={variant}>
                    <Plus className='mr-2 h-4 w-4' />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Create project</DialogTitle>
                    <DialogDescription>Please enter details for this new project to proceed.</DialogDescription>
                </DialogHeader>
                <div className='mt-2 grid w-full max-w-sm items-center gap-2'>
                    <Label htmlFor='project-name'>Project name</Label>
                    <Input
                        id='project-name'
                        autoFocus
                        disabled={createProjectLoading}
                        placeholder='My awesome project'
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className='col-span-4'
                    />
                </div>
                <DialogFooter>
                    <Button
                        disabled={!newProjectName || createProjectLoading}
                        onClick={() => {
                            createProject({
                                name: newProjectName,
                            }).then((res) => {
                                if (isSuccessfulRes(res)) {
                                    router.refresh()
                                    router.push(`/projects/${res.id}`)
                                }
                            })
                        }}
                    >
                        Launch
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
