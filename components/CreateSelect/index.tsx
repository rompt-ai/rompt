import React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { selectProps } from "@/components/selectProps"

import Spinner from "../Spinner"

interface CreateSelectProps {
    options: Array<{ value: string; label: string }>
    value: string | undefined
    onValueChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    label: string
    subtitle?: string
    className?: string
}

const CreateSelect: React.FC<CreateSelectProps> = ({
    options,
    value,
    onValueChange,
    placeholder = "",
    disabled = false,
    subtitle,
    label,
    className,
}) => {
    return (
        <div className={cn("grid w-full items-center gap-2", className)}>
            <Label htmlFor='project'>{label}</Label>
            {subtitle && <p className='text-sm text-muted-foreground'>{subtitle}</p>}
            <Select value={value} onValueChange={onValueChange} required disabled={disabled}>
                <SelectTrigger className={cn(value === undefined && "[&>span]:text-muted-foreground", "overflow-hidden [&>span]:truncate")}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent {...selectProps()}>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value} className='flex items-center'>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

interface SelectLoadingPlaceholderProps {
    label: string
    subtitle?: string
    placeholder: string
}

export const SelectLoadingPlaceholder = ({ label, subtitle, placeholder }: SelectLoadingPlaceholderProps) => (
    <div className='grid w-full items-center gap-2'>
        <Label htmlFor='project'>
            {label}
            <Spinner size='xs' className='ml-1.5 inline-block align-middle' />
        </Label>
        {subtitle && <p className='text-sm text-slate-500 dark:text-slate-400'>{subtitle}</p>}
        <Select disabled>
            <SelectTrigger className={cn("[&>span]:text-slate-400")}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
        </Select>
    </div>
)

export default CreateSelect
