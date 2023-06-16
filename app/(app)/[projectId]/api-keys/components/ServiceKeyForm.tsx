"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconButton } from "@/components/IconButton"

export function ServiceKeyForm({
    userKeys,
}: {
    userKeys: {
        openai: string | undefined
    }
}) {
    const [activeOpenaiKey, setActiveOpenaiKey] = useState(userKeys.openai)
    const [openaiKeyInputVal, setOpenaiKeyInputVal] = useState<string>(userKeys.openai || "")
    const [isOpenaiKeyVisible, setIsOpenaiKeyVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter()
    const pathname = usePathname()!
    const { toast } = useToast()

    const tryAndSetKey = () => {
        setIsLoading(true)
        fetch(`${pathname}/api/set`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: openaiKeyInputVal, service: "openai" }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not validate key.")
                }
                toast({
                    title: "Success! Your key has been saved.",
                    description: "You can now use OpenAI models in your experiments.",
                    variant: "default",
                })
                router.refresh()
                setActiveOpenaiKey(openaiKeyInputVal)
            })
            .catch(() => {
                toast({
                    title: "Error. Could not validate key.",
                    description: "This is likely due to an invalid key. Please try again.",
                    variant: "destructive",
                })
                setOpenaiKeyInputVal(activeOpenaiKey || "")
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const deleteKey = () => {
        setIsLoading(true)
        fetch(`${pathname}/api/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ service: "openai" }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not delete key.")
                }
                toast({
                    title: "Success! Your key has been successfully deleted.",
                    variant: "default",
                })
                router.refresh()
                setOpenaiKeyInputVal("")
                setActiveOpenaiKey("")
            })
            .catch(() => {
                toast({
                    title: "Error. Could not delete key.",
                    description: "Please try again.",
                    variant: "destructive",
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const OpenAiEye = isOpenaiKeyVisible ? EyeOff : Eye

    return (
        <div className='space-y-6'>
            <div className='grid w-full max-w-sm items-center gap-1.5'>
                <Label htmlFor='openai-key-input'>OpenAI key</Label>
                <div className='flex w-full max-w-sm items-center space-x-2'>
                    <div className='relative'>
                        <Input
                            id='openai-key-input'
                            type={isOpenaiKeyVisible ? "text" : "password"}
                            value={openaiKeyInputVal}
                            onChange={(e) => setOpenaiKeyInputVal(e.target.value)}
                            placeholder={`sk-••••`}
                            className={cn("pr-10", isOpenaiKeyVisible && "truncate")}
                        />
                        <div className='absolute inset-y-0 right-2 flex items-center'>
                            <IconButton onClick={() => setIsOpenaiKeyVisible((prev) => !prev)}>
                                <OpenAiEye size={16} className='opacity-75' />
                            </IconButton>
                        </div>
                    </div>
                    <Button disabled={!openaiKeyInputVal || openaiKeyInputVal === activeOpenaiKey || isLoading} onClick={tryAndSetKey}>
                        Save
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={!activeOpenaiKey} variant={"outline"}>
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently purge your OpenAI key from Rompt.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteKey}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    )
}
