"use client"

import { useState } from "react"
import type { SliderProps } from "@radix-ui/react-slider"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"

import { ModelOptions } from "../api/launch/route"
import { RowProps } from "./types"

export function RowSettings({ modelParams, onUpdate }: { onUpdate: RowProps<{}>["onUpdate"]; modelParams: ModelOptions }) {
    const [settingsCache, setSettingsCache] = useState<typeof modelParams>(modelParams)

    const sliders: {
        label: string
        setting: keyof Omit<typeof modelParams, "max_tokens" | "model">
        sliderProps: SliderProps
    }[] = [
        {
            label: "Temperature",
            setting: "temperature",
            sliderProps: {
                step: 0.01,
                max: 2,
                min: 0,
            },
        },
        {
            label: "Top P",
            setting: "top_p",
            sliderProps: {
                step: 0.01,
                max: 1,
                min: 0,
            },
        },
        {
            label: "Frequency Penalty",
            setting: "frequency_penalty",
            sliderProps: {
                step: 0.01,
                max: 2,
                min: -2,
            },
        },
        {
            label: "Presence Penalty",
            setting: "presence_penalty",
            sliderProps: {
                step: 0.01,
                max: 2,
                min: -2,
            },
        },
    ]

    return (
        <SheetContent position='right' size='sm'>
            <SheetHeader>
                <SheetTitle>Configure model parameters</SheetTitle>
            </SheetHeader>
            <div className='grid gap-5 py-4'>
                {sliders.map((ele) => (
                    <div className='space-y-2' key={ele.setting}>
                        <div className='flex items-center justify-between'>
                            <Label htmlFor={`${ele.setting}-slider`} className='text-right'>
                                {ele.label}
                            </Label>
                            <span className='w-[70px] rounded-md bg-muted px-2 py-0.5 text-right'>{settingsCache[ele.setting]}</span>
                        </div>
                        <Slider
                            defaultValue={[modelParams[ele.setting]]}
                            id={`${ele.setting}-slider`}
                            onValueChange={([newSetting]) => setSettingsCache({ ...settingsCache, [ele.setting]: newSetting })}
                            onValueCommit={([newSetting]) => onUpdate({ [ele.setting]: newSetting })}
                            {...ele.sliderProps}
                        />
                    </div>
                ))}

                <div className='flex items-center justify-between space-y-2'>
                    <Label htmlFor='max-tokens-setting'>Max Tokens</Label>
                    <Input
                        className='w-[40%] min-w-[110px]'
                        type='number'
                        id='max-tokens-setting'
                        value={modelParams.max_tokens === undefined ? "" : modelParams.max_tokens}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                onUpdate({ max_tokens: undefined })
                                setSettingsCache({ ...settingsCache, max_tokens: undefined })
                            } else {
                                const newSetting = Number(e.target.value)
                                if (newSetting) {
                                    setSettingsCache({ ...settingsCache, max_tokens: newSetting })
                                    onUpdate({ max_tokens: newSetting })
                                }
                            }
                        }}
                        placeholder='Unlimited'
                    />
                </div>
            </div>
        </SheetContent>
    )
}
