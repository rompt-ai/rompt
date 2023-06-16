interface StickyRowContainerProps {
    children: React.ReactNode
}

export function StickyRowContainer({ children }: StickyRowContainerProps) {
    return <div className='sticky top-4 flex h-[114px] items-center justify-center'>{children}</div>
}
