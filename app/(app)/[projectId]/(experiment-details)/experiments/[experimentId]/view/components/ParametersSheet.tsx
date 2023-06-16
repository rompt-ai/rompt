import { Fragment } from "react"
import { SliderProps } from "@radix-ui/react-slider"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"

interface ParametersSheetProps {
    temperature: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
    maxTokens: number | null
    experimentVariables: { name: string; value: string }[]
}

export function ParametersSheet({
    temperature,
    topP,
    frequencyPenalty,
    presencePenalty,
    maxTokens,
    experimentVariables,
}: ParametersSheetProps) {
    const sliders: {
        label: string
        setting: keyof ParametersSheetProps
        sliderProps: SliderProps
    }[] = [
        {
            label: "Temperature",
            setting: "temperature",
            sliderProps: {
                step: 0.01,
                max: 2,
                min: 0,
                value: [temperature],
                disabled: true,
            },
        },
        {
            label: "Top P",
            setting: "topP",
            sliderProps: {
                step: 0.01,
                max: 1,
                min: 0,
                value: [topP],
                disabled: true,
            },
        },
        {
            label: "Frequency Penalty",
            setting: "frequencyPenalty",
            sliderProps: {
                step: 0.01,
                max: 2,
                min: -2,
                value: [frequencyPenalty],
                disabled: true,
            },
        },
        {
            label: "Presence Penalty",
            setting: "presencePenalty",
            sliderProps: {
                step: 0.01,
                max: 2,
                min: -2,
                value: [presencePenalty],
                disabled: true,
            },
        },
    ]

    return (
        <SheetContent position='right' size='sm' className='overflow-auto'>
            <SheetHeader>
                <SheetTitle>Model parameters</SheetTitle>
            </SheetHeader>
            <div className='space-y-4'>
                <div className='grid gap-5 py-4'>
                    {sliders.map((ele) => (
                        <div className='space-y-2' key={ele.setting}>
                            <div className='flex items-center justify-between'>
                                <Label className='text-right'>{ele.label}</Label>
                                <span className='w-[70px] rounded-md bg-muted px-2 py-0.5 text-right'>{ele.sliderProps.value?.[0]}</span>
                            </div>
                            <Slider defaultValue={ele.sliderProps.value} {...ele.sliderProps} />
                        </div>
                    ))}

                    {maxTokens !== null && (
                        <div className='flex items-center justify-between space-y-2'>
                            <Label>Max Tokens</Label>
                            <Input className='w-[40%] min-w-[110px]' type='number' value={maxTokens} />
                        </div>
                    )}
                </div>

                <div className='grid gap-5 py-4'>
                    {experimentVariables.length > 0 && (
                        <div className='space-y-6 overflow-hidden rounded-md border border-border px-6 py-4'>
                            <span className='text-lg font-semibold text-foreground'>Prompt variables</span>
                            {experimentVariables.map(({ name, value }, i) => (
                                <Fragment key={name}>
                                    <div className='grid grid-cols-1 gap-y-2'>
                                        <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>{name}</h4>
                                        <p className='leading-7'>{value}</p>
                                    </div>
                                    {i !== experimentVariables.length - 1 && <Separator />}
                                </Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SheetContent>
    )
}
