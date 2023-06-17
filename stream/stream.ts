/**
 * This file cannot be called index.ts, otherwise the next 
 * builder will try to include it and fail.
 */

import cors from "@fastify/cors"
import { config } from "dotenv"
import { join } from "path"
import { fileURLToPath } from "url"

import fastify from "fastify"

import { createRunPlaintextExperimentPromptRoute } from "./routes/createRunPlaintextExperimentPromptRoute"

const __dirname = fileURLToPath(new URL('.', import.meta.url));

config({
    path: join(__dirname, "../", ".env"),
})

const server = fastify({
    trustProxy: true,
})

async function main() {
    await server.register(cors)

    try {
        server.get("/healthz", async (req, res) => {
            res.send({ status: "ok" })
        })
        server.register(createRunPlaintextExperimentPromptRoute)

        const address = await server.listen({
            port: parseInt(process.env.NEXT_PUBLIC_STREAM_PORT || "3000"),
        })
        console.log(`server listening on ${address}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

main()
