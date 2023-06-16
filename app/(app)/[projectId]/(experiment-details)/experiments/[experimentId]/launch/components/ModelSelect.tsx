import { ReactComponent as OpenaiSvg } from "@/assets/icons/openai.svg"
import type { SelectProps } from "@radix-ui/react-select"

import { availableModels } from "@/lib/openai/availableModels"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { selectProps } from "@/components/selectProps"

export function ModelSelect(props: SelectProps) {
    return (
        <Select {...props}>
            <SelectTrigger className='h-[30px] w-[220px] border-muted px-2' id='experiment-model'>
                <SelectValue placeholder='Select a fruit' />
            </SelectTrigger>
            <SelectContent {...selectProps()}>
                <SelectGroup>
                    <SelectLabel>OpenAI</SelectLabel>
                    {availableModels.map((ele) => (
                        <SelectItem value={ele} key={ele}>
                            <div className='flex items-center gap-x-2'>
                                <OpenaiSvg />
                                {ele.split("/").pop()}
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
