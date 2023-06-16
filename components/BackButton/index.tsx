import { ArrowLeft } from "lucide-react"

export default function BackButton() {
    return (
        <div className='flex'>
            <div className='-ml-1 flex cursor-pointer items-center rounded-md bg-transparent py-0.5 pl-1 pr-2 text-muted-foreground hover:bg-accent'>
                <ArrowLeft size={14} />
                <p className='ml-1 text-xs font-semibold'>Back</p>
            </div>
        </div>
    )
}
