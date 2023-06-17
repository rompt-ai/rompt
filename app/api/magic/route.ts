import { NextResponse } from "next/server"
import { OpenAIApi, Configuration as OpenAIConfiguration } from "openai"
import { z } from "zod"

import { MAX_COMPLETION_TOKENS } from "@/lib/openai/vars"

const schema = z.object({
    text: z.string(),
})

export type ParseResponse = {
    prompt: string | null
    intent: string | null
    score: number | null
}

export type ResponseData = ParseResponse | z.ZodError<z.infer<typeof schema>>

export const POST = async function (req, ctx) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { text } = parseResult.data

    const configuration = new OpenAIConfiguration({
        apiKey: process.env.OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: MAX_COMPLETION_TOKENS,
        messages: [
            {
                role: "system",
                content:
                    "You are an AI assistant that helps me write prompts to give back to you. Your goal is to maximize the usefulness of your own responses by deeply understanding the intent of the prompts I'll give you.",
            },
            {
                role: "user",
                content: `
Here is a draft prompt that I am writing (delimited by """). Words that are wrapped in {CURLY_BRACKETS} are variables that I will replace later:

"""
${text}
"""

Please improve this prompt by creating a new one that will maximize the usefulness of your own response to it. You must try to deeply understand the true context and intent behind this prompt.

Then, after you have created your new prompt, please respond to it with a single sentence that will help me understand the intent of your new prompt.

Then, I would like you to score your new prompt on a scale of 1-100, based on how good you think your new prompt is at maximally useful responses.

Respond in the following order and format (don't include the delimiter or any other text):

New prompt: "{your new prompt}"

Intent: {your response to your new prompt}

Score: {your score for your new prompt}
                `.trim(),
            },
        ],
    })

    if (completion.data.choices[0].message?.content) {
        return new NextResponse(JSON.stringify(parseText(completion.data.choices[0].message.content.replaceAll(`"""`, "").trim())), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        })
    } else {
        console.error("No completion data found", completion.data)
        return new NextResponse(JSON.stringify({ message: "No completion data" }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        })
    }
}

function parseText(text: string): ParseResponse {
    const promptRegex = /New prompt: \"(.*?)\"(.*?)(?:Intent:|$)/s
    const intentRegex = /Intent: (.*?)(?:Score:|$)/s
    const scoreRegex = /Score: (\d+)/

    const promptMatch = text.match(promptRegex)
    const intentMatch = text.match(intentRegex)
    const scoreMatch = text.match(scoreRegex)

    const result = {
        prompt: promptMatch ? promptMatch[1].trim() : null,
        intent: intentMatch ? intentMatch[1].trim() : null,
        score: scoreMatch ? parseInt(scoreMatch[1], 10) : null,
    }

    return result
}
