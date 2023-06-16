"use client"

import React, { createContext, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Experiment } from "@prisma/client"
import useFetch, { CachePolicies } from "use-http"

import { errorToast } from "@/lib/errorToast"
import { useToast } from "@/hooks/use-toast"

import { ResponseData } from "../api/create-experiment/route"

type ICreateExperiment = ReturnType<typeof CreateExperimentProvider>["typedvalue"]

export const CreateExperimentContext = createContext<ICreateExperiment>({} as ICreateExperiment)

export default function CreateExperimentProvider({
    children,
    project,
}: {
    children: React.ReactNode
    project: {
        id: string
        name: string
        createdAt: string
    }
}) {
    // ++ step 1 - details
    // const [currentStep, setActiveStep] = useState<number>(0)
    const [experimentName, setExperimentName] = useState<string>("")
    const [reportingType, setReportingType] = useState<"approval" | "numeric">("approval")
    const [nVariableVariations, setNVariableVariations] = useState<number>(1)
    const [nResponseVariations, setNResponseVariations] = useState<number>(2)
    // --

    // ++ step 2 - discover
    // const [nMagicVariables, setNMagicVariables] = useState<number | undefined>(2)
    // const [nMagicPrompts, setNMagicPrompts] = useState<number | undefined>()
    // --

    const pathname = usePathname()
    const { toast } = useToast()
    const router = useRouter()

    const { loading: isCreateExperimentLoading, post: createExperiment } = useFetch<ResponseData>(`${pathname}/api/create-experiment`, {
        onError: () => toast(errorToast),
        cachePolicy: CachePolicies.NO_CACHE,
    })

    const sendCreateExperiment = () => {
        createExperiment({
            experimentName,
            reportingType,
            nResponseVariations,
            nVariableVariations,
        }).then((res) => {
            if (isSuccessfulRes(res)) {
                router.push(`/${res.projectId}/experiments/${res.id}`)
            }
        })
    }

    const value = {
        // currentStep,
        // setActiveStep,
        experimentName,
        setExperimentName,
        reportingType,
        setReportingType,
        nResponseVariations,
        setNResponseVariations,
        nVariableVariations,
        setNVariableVariations,
        project,
        // nMagicVariables,
        // setNMagicVariables,
        // nMagicPrompts,
        // setNMagicPrompts,
        sendCreateExperiment,
        isCreateExperimentLoading,
    }

    return {
        ...(<CreateExperimentContext.Provider value={value}>{children}</CreateExperimentContext.Provider>),
        typedvalue: value,
    }
}

function isSuccessfulRes(res: ResponseData): res is Experiment {
    return !!(res as any).id
}
