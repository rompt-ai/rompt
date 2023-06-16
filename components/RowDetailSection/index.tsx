import { CodeBlock } from "../CodeBlock"

interface RowDetailSectionProps {
    title: string
    content: string
}

export function RowDetailSection({ title, content }: RowDetailSectionProps) {
    return (
        <>
            <small className='ml-6 text-sm font-medium leading-none'>{title}</small>
            <CodeBlock className='mb-8 mt-2'>{content}</CodeBlock>
        </>
    )
}
