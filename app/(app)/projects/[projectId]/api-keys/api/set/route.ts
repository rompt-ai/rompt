import { NextResponse } from "next/server"
import { ServiceKeyType } from "@prisma/client"
import { OpenAIApi, Configuration as OpenAIConfiguration } from "openai"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const schema = z.object({
    service: z.nativeEnum(ServiceKeyType),
    key: z.string(),
})

export type ResponseData = { success: true } | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, { params: { projectId } }) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { service, key } = parseResult.data

    if (service === ServiceKeyType.openai) {
        const openaiclient = new OpenAIApi(
            new OpenAIConfiguration({
                apiKey: key,
            })
        )

        try {
            await openaiclient.createChatCompletion({
                model: "gpt-3.5-turbo",
                max_tokens: 25,
                messages: [
                    {
                        content: "Hello, how are you today?",
                        role: "user",
                    },
                ],
            })

            await prisma.serviceKey.upsert({
                where: {
                    service_projectId: {
                        projectId,
                        service,
                    }
                },
                update: {
                    key,
                },
                create: {
                    key,
                    service,
                    projectId,
                },
            })

            return new NextResponse(JSON.stringify({ success: true }), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 200,
            })
        } catch (err) {
            return new NextResponse(JSON.stringify({ error: "Invalid OpenAI API key" }), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 400,
            })
        }
    }
}
