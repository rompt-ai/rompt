import React from "react"

import { cn } from "@/lib/utils"

interface VerticalStepperProps {
    steps: { title: React.ReactNode; description?: string }[]
    currentStep: number
    onChangeStep: (step: number) => void
}

export const VerticalStepper: React.FC<VerticalStepperProps> = ({ steps, currentStep, onChangeStep }) => {
    return (
        <ol className={cn("relative border-l border-slate-700")}>
            {steps.map(({ title, description }, index) => (
                <li
                    key={index}
                    className={cn(
                        "mb-10 ml-4",
                        index === currentStep && "cursor-pointer text-slate-200",
                        index > currentStep && "text-slate-500",
                        index < currentStep && "cursor-pointer text-green-500"
                    )}
                    onClick={() => index < currentStep && onChangeStep(index)}
                >
                    <span
                        className={cn(
                            "absolute left-[-10px] flex h-[18px] w-[18px] items-center justify-center rounded-full ring-8 ring-background",
                            index < currentStep ? "bg-green-900" : "bg-slate-900"
                        )}
                    >
                        <svg
                            aria-hidden='true'
                            className={cn("p-0.5", index < currentStep ? "text-green-400" : "text-inherit")}
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                            ></path>
                        </svg>
                    </span>
                    <h3 className='font-medium leading-none'>{title}</h3>
                    {description && <p className='mt-1 text-sm'>{description}</p>}
                </li>
            ))}
        </ol>
    )
}
