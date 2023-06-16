"use client"

import { useContext } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { CreateExperimentContext } from "../context/CreateExperimentContext"

export function Details() {
    const {
        experimentName,
        setExperimentName,
        reportingType,
        setReportingType,
        // setActiveStep,
        nResponseVariations,
        setNResponseVariations,
        nVariableVariations,
        setNVariableVariations,
        sendCreateExperiment,
        isCreateExperimentLoading,
    } = useContext(CreateExperimentContext)

    return (
        <div className='inline-block w-full max-w-[410px] space-y-8'>
            <div className='grid items-center gap-2'>
                <Label htmlFor='experiment-name'>Experiment name</Label>
                <Input
                    required
                    type='text'
                    id='experiment-name'
                    placeholder='My experiment'
                    value={experimentName}
                    onChange={(e) => setExperimentName(e.target.value)}
                />
                <p className='text-sm text-slate-500'>
                    This is the name of your experiment. It will be used to identify it in the dashboard.
                </p>
            </div>
            <div className='grid gap-2'>
                <Label htmlFor='reporting-type'>Reporting type</Label>
                <RadioGroup
                    value={reportingType}
                    onValueChange={(val) => setReportingType(val as typeof reportingType)}
                    id='reporting-type'
                >
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='approval' id='reporting-type-approval' />
                        <Label htmlFor='reporting-type-approval'>
                            Approval <span className='italic text-slate-400'>(default)</span>
                        </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='numeric' id='reporting-type-numeric' />
                        <Label htmlFor='reporting-type-numeric'>Numeric</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className={"grid gap-2"}>
                <Label htmlFor='experiment-variable-variations'># of variable variations</Label>
                <Input
                    required
                    type='number'
                    id='experiment-variable-variations'
                    value={"" + nVariableVariations}
                    onChange={(e) => setNVariableVariations(Number(e.target.value))}
                />
                <p className='text-sm text-slate-500'>
                    The number of possible values you will set for each variable.{" "}
                    <span className='font-semibold italic text-slate-500'>Only applicable if you have variables in your prompt</span>.
                </p>
            </div>
            <div className='grid gap-2'>
                <Label htmlFor='experiment-response-variations'># of response variations</Label>
                <Input
                    required
                    type='number'
                    id='experiment-response-variations'
                    value={"" + nResponseVariations}
                    onChange={(e) => setNResponseVariations(Math.max(1, Number(e.target.value)))}
                />
                <p className='text-sm text-slate-500'>
                    Sets the amount of responses that will generated for a single prompt. More variations means more accurate results.
                </p>
            </div>
            {/* <Button className='w-full' disabled={experimentName.length === 0} onClick={() => setActiveStep((prev) => prev + 1)}>
                Next
                <ArrowRight className='ml-2 h-4 w-4' />
            </Button> */}
            <Button className='w-full' disabled={isCreateExperimentLoading} onClick={sendCreateExperiment}>
                Submit
                <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
        </div>
    )
}
