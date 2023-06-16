import { NextResponse } from "next/server"
import { OutputGenerationStatus } from "@prisma/client"
import { z } from "zod"

import { makeRepeated } from "@/lib/makeRepeated"
import { availableModels } from "@/lib/openai/availableModels"
import { prisma } from "@/lib/prisma"

const ModelOptionsSchema = z.object({
    max_tokens: z.number().gte(50).optional(),
    temperature: z.number().gte(0).lt(2).default(1),
    top_p: z.number().gt(0).lte(1).default(1),
    frequency_penalty: z.number().gt(-2).lt(2).default(0),
    presence_penalty: z.number().gt(-2).lt(2).default(0),
    model: z.enum(availableModels),
})

export type ModelOptions = z.TypeOf<typeof ModelOptionsSchema>

const schema = z.object({
    experimentPrompts: z.array(
        ModelOptionsSchema.extend({
            uiId: z.string(),
            promptId: z.string(),
            promptVersion: z.number(),
        })
    ),
    variableToVariationMap: z.record(z.record(z.string())),
})

export type ResponseData = { success: true } | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, { params: { projectId, experimentId } }) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { experimentPrompts, variableToVariationMap } = parseResult.data

    const { nResponseVariations, nVariableVariations } = await prisma.experiment.update({
        where: {
            id: experimentId,
        },
        data: {
            didLaunch: true,
        },
        select: {
            nResponseVariations: true,
            nVariableVariations: true,
        },
    })

    // Later: If magic prompts is on, we need to create a new prompt for each variation
    const repeatedResponseVariations = makeRepeated(experimentPrompts, nResponseVariations, false)
    const repeatedResponseAndVariableVariations = makeRepeated(repeatedResponseVariations, nVariableVariations, true)

    const experimentVariableCreateDataArr: NonNullable<Parameters<typeof prisma.experimentVariable.createMany>[0]>["data"] = []

    for (const [variableName, variationToValueMap] of Object.entries(variableToVariationMap)) {
        for (const [variation, variationValue] of Object.entries(variationToValueMap)) {
            experimentVariableCreateDataArr.push({
                experimentId,
                name: variableName,
                value: variationValue,
                variation: parseInt(variation),
            })
        }
    }

    await prisma.$transaction([
        prisma.experimentVariable.createMany({
            data: experimentVariableCreateDataArr,
        }),
        prisma.experimentPrompt.createMany({
            data: repeatedResponseAndVariableVariations.map((prompt) => ({
                experimentId,
                frequencyPenalty: prompt.frequency_penalty,
                model: prompt.model,
                presencePenalty: prompt.presence_penalty,
                promptId: prompt.promptId,
                promptVersion: prompt.promptVersion,
                temperature: prompt.temperature,
                topP: prompt.top_p,
                maxTokens: prompt.max_tokens,
                outputGenerationStatus: OutputGenerationStatus.ready,
                variableVariation: prompt.index,
            })),
        }),
    ])

    return new NextResponse(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
