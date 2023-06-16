import Link from "next/link"
import dayjs from "dayjs"
import { ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import Footer from "@/components/Footer"

export function VersionsPage({
    versions,
    projectId,
}: {
    versions: {
        version: number
        id: string
        createdAt: string
        updatedAt: string
    }[]
    projectId: string
}) {
    return (
        <>
            <div className='min-h-[calc(100vh-480px)]'>
                <div className='overflow-hidden rounded-md border-[0.5px] border-border'>
                    <table className='w-full min-w-full table-fixed divide-y divide-border'>
                        <colgroup>
                            <col className='w-[20%]' />
                            <col className='w-[35%]' />
                            <col className='w-[35%]' />
                            <col className='w-[10%]' />
                        </colgroup>
                        <thead className='!border-t-transparent bg-muted/30'>
                            <tr>
                                <th scope='col' className='px-6 py-3 text-left text-sm font-medium uppercase leading-none'>
                                    Name
                                </th>
                                <th scope='col' className='px-6 py-3 text-center text-sm font-medium uppercase leading-none'>
                                    Created at
                                </th>
                                <th scope='col' className='px-6 py-3 text-center text-sm font-medium uppercase leading-none'>
                                    Updated at
                                </th>
                                <th scope='col' />
                            </tr>
                        </thead>
                        <tbody className='bg-slate divide-y divide-border'>
                            {versions.map((row) => (
                                <AbsoluteTr
                                    key={`${row.version}`}
                                    className='cursor-pointer hover:bg-muted/30'
                                    href={`/projects/${projectId}/${row.id}/${row.version}`}
                                >
                                    <td className='truncate px-6 py-4 text-sm'>Version {row.version}</td>
                                    <td className='truncate px-6 py-4 text-center text-sm'>
                                        {dayjs(row.createdAt).format("MMMM D, YYYY")}
                                    </td>
                                    <td className='truncate px-6 py-4 text-center text-sm'>
                                        {dayjs(row.updatedAt).format("MMMM D, YYYY")}
                                    </td>
                                    <td className='truncate px-6 py-4 text-right'>
                                        <ExternalLink size={16} className='ml-auto text-muted-foreground' />
                                    </td>
                                </AbsoluteTr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer className='mt-20' />
        </>
    )
}

function AbsoluteTr({
    children,
    href,
    ...props
}: {
    children: React.ReactNode
    href: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>) {
    return (
        <tr {...props} className={cn(props.className, "relative")}>
            {children}
            <Link href={href} className='absolute inset-0' />
        </tr>
    )
}
