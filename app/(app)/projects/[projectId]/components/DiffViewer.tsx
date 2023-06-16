import React, { Fragment, useMemo } from "react"
import { Change } from "diff"

import { cn } from "@/lib/utils"

interface DiffViewProps {
    diff: Change[]
}

const DiffViewer: React.FC<DiffViewProps> = ({ diff }) => {
    const nodes = useMemo(() => {
        const left: JSX.Element[] = []
        const right: JSX.Element[] = []

        for (const change of diff) {
            const { added, removed, value } = change
            if (added) {
                left.push(<span className={"bg-[#09b43a26]"}>{value}</span>)
                right.push(<></>)
            } else if (removed) {
                left.push(<></>)
                right.push(<span className={"bg-[#ff6a6926]"}>{value}</span>)
            } else {
                const defaultNode = <span>{value}</span>
                left.push(defaultNode)
                right.push(defaultNode)
            }
        }

        return { left, right }
    }, [diff])

    const sideRootClassName = "whitespace-pre p-4 font-mono text-sm"

    return (
        <div className='mt-10 grid grid-cols-2 divide-x overflow-hidden rounded-md border-[0.5px] border-border'>
            <div className={cn(sideRootClassName)}>
                <div className='inline'>
                    {nodes.left.map((node, i) => (
                        <Fragment key={i}>{node}</Fragment>
                    ))}
                </div>
            </div>

            <div className={cn(sideRootClassName)}>
                <div className='inline'>
                    {nodes.right.map((node, i) => (
                        <Fragment key={i}>{node}</Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { DiffViewer }
