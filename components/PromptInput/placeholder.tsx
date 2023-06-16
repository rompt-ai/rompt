import { Fragment, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const FULL_COMMAND = "Your prompt goes here... Wrap words in {CURLY_BRACKETS} to make a variable."

interface PlaceholderProps {
    parentId: string
}

const alreadyRan = new Set<string>()

export default function Placeholder({ parentId }: PlaceholderProps) {
    const [displayedCommand, setDisplayedCommand] = useState(String.fromCharCode(160))
    const intervalRef = useRef<NodeJS.Timeout>()
    const isFinished = displayedCommand.length === FULL_COMMAND.length

    useEffect(() => {
        if (alreadyRan.has(parentId)) {
            setDisplayedCommand(FULL_COMMAND)
        } else {
            alreadyRan.add(parentId)
            let i = 0
            intervalRef.current = setInterval(() => {
                setDisplayedCommand(FULL_COMMAND.slice(0, i))
                i++
                if (i > FULL_COMMAND.length) {
                    clearInterval(intervalRef.current)
                }
            }, 75)
        }
    }, [])

    const rootSlackAtClassName =
        "text-[rgba(18,100,163,1)] relative after:content-[''] after:absolute after:bg-[rgba(29,155,209,.1)] after:top-[-1px] after:bottom-[-2px] font-bold"

    // min inclusive, max exclusive
    const modifiers = [
        {
            className: cn(rootSlackAtClassName, "ml-0.5 after:left-[-2px] after:right-[0px] after:rounded-l-[3px]"),
            min: 39,
            max: 40,
            onlyApplyAfterWord: true,
        },
        {
            className: cn(rootSlackAtClassName, "after:inset-x-[0px]"),
            min: 40,
            max: 54,
            onlyApplyAfterWord: true,
        },
        {
            className: cn(rootSlackAtClassName, "mr-0.5 after:left-[0px] after:right-[-2px] after:rounded-r-[3px]"),
            min: 54,
            max: 55,
            onlyApplyAfterWord: true,
        },
    ]

    const commandTextToElements = (text: string) => {
        const elements: JSX.Element[] = []
        for (let i = 0; i < text.length; i++) {
            const char = text[i]
            const modifier = modifiers.find((m) => i >= m.min && i < m.max)
            if (modifier) {
                if (modifier.onlyApplyAfterWord) {
                    const indexOfNextSpace = text.indexOf(" ", modifier.min)
                    if (indexOfNextSpace !== -1) {
                        elements.push(
                            <span key={i} className={cn(modifier.className)}>
                                {char}
                            </span>
                        )
                    } else {
                        elements.push(<Fragment key={i}>{char}</Fragment>)
                    }
                } else {
                    elements.push(
                        <span key={i} className={cn(modifier.className)}>
                            {char}
                        </span>
                    )
                }
            } else {
                elements.push(<Fragment key={i}>{char}</Fragment>)
            }
        }
        return elements
    }

    return (
        <span className='pointer-events-none absolute left-3.5 top-3 z-20 select-none overflow-hidden'>
            <span className={cn("text-ellipsis text-base text-slate-500")}>
                <bdo dir='ltr'>{commandTextToElements(displayedCommand)}</bdo>
            </span>
            {!isFinished && <div className={cn("mb-[6px] inline-block h-[20px] w-[1px] bg-slate-400 align-middle")} />}
        </span>
    )
}
