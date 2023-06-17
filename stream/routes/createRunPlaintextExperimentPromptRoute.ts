import { OpenAIChunkTransformer } from "../lib/OpenAIChunkTransformer"
import { generateRunExperimentPromptHmac } from "../lib/generateRunExperimentPromptHmac"
import { prisma } from "@/lib/prisma"
import { OutputGenerationStatus } from "@prisma/client"
import { FastifyInstance } from "fastify"
import opanaistreams from "openai-streams/node"
import z from "zod"

const { OpenAI } = opanaistreams

const schema = z.object({
    experimentPromptId: z.string(),
    runExperimentHmac: z.string(),
})

export async function createRunPlaintextExperimentPromptRoute(server: FastifyInstance) {
    server.post<{ Body: z.infer<typeof schema> }>("/run-plaintext-experiment-prompt", async (request, reply) => {
        const parseResult = schema.safeParse(request.body)

        if (!parseResult.success) {
            reply.status(400).send(parseResult.error)
            return
        }
        const { experimentPromptId, runExperimentHmac } = parseResult.data

        const localRunExperimentHmac = generateRunExperimentPromptHmac(experimentPromptId)

        if (localRunExperimentHmac !== runExperimentHmac) {
            reply.status(400).send("Invalid HMAC")
            return
        }

        const {
            outputGenerationStatus: existingOutputGenerationStatus,
            experiment: { experimentVariables },
        } = await prisma.experimentPrompt.findUniqueOrThrow({
            where: {
                id: experimentPromptId,
            },
            select: {
                outputGenerationStatus: true,
                experiment: {
                    select: {
                        experimentVariables: true,
                    },
                },
            },
        })

        if (existingOutputGenerationStatus !== OutputGenerationStatus.ready) {
            reply.status(200).send({ notice: "Experiment prompt not ready" })
            return
        }

        const [
            {
                model,
                variableVariation,
                prompt: { text },
                ...modelParams
            },
        ] = await prisma.$transaction([
            prisma.experimentPrompt.update({
                where: {
                    id: experimentPromptId,
                },
                data: {
                    outputGenerationStatus: OutputGenerationStatus.inProgress,
                },
                select: {
                    frequencyPenalty: true,
                    presencePenalty: true,
                    temperature: true,
                    topP: true,
                    model: true,
                    maxTokens: true,
                    variableVariation: true,
                    prompt: {
                        select: {
                            text: true,
                        },
                    },
                },
            }),
        ])

        const variableRegex = /\{(\w+)?\}/g

        const variableReplacedText = text.replace(variableRegex, (match, variableName) => {
            const experimentVariable = experimentVariables.find((ele) => ele.name === match && ele.variation === variableVariation)
            if (experimentVariable === undefined) {
                return match // Includes the curly braces
            }
            return experimentVariable.value
        })

        const [provider, providerModel] = model.split("/")

        const openaiParameters = {
            frequency_penalty: modelParams.frequencyPenalty,
            presence_penalty: modelParams.presencePenalty,
            temperature: modelParams.temperature,
            top_p: modelParams.topP,
            max_tokens: modelParams.maxTokens || undefined,
        } as const

        try {
            const completion = await (OpenAIChunkTransformer.isOpenAIModelChat(providerModel)
                ? OpenAI(
                      "chat",
                      {
                          model: providerModel,
                          messages: [{ role: "user", content: variableReplacedText }],
                          ...openaiParameters,
                      },
                      {
                          apiKey: process.env.OPENAI_API_KEY,
                          mode: "raw",
                      }
                  )
                : OpenAI(
                      "completions",
                      {
                          model: providerModel,
                          prompt: variableReplacedText,
                          ...openaiParameters,
                      },
                      {
                          apiKey: process.env.OPENAI_API_KEY,
                          mode: "raw",
                      }
                  ))

            const onFinishGenerationCallback = (output: string) => {
                prisma.experimentPrompt
                    .update({
                        where: {
                            id: experimentPromptId,
                        },
                        data: {
                            output,
                            outputGenerationStatus: OutputGenerationStatus.complete,
                        },
                    })
                    .then(() => {
                        console.log("Finished updating experiment prompt in callback")
                    })
            }

            const transformer = new OpenAIChunkTransformer(providerModel, onFinishGenerationCallback)
            completion.pipe(transformer)
            reply.raw.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "text/event-stream;charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
            })
            reply.send(transformer)
        } catch (error) {
            await prisma.experimentPrompt.update({
                where: {
                    id: experimentPromptId,
                },
                data: {
                    outputGenerationStatus: OutputGenerationStatus.failed,
                },
            })
            console.error(error)
            reply.status(400).send(error)
        }
    })
}
