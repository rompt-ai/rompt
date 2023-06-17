import cors from "@fastify/cors"
import { config } from "dotenv"

import fastify from "fastify"

import { createRunPlaintextExperimentPromptRoute } from "./routes/createRunPlaintextExperimentPromptRoute"

config()

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
            port: parseInt(process.env.PORT || "3000"),
        })
        console.log(`server listening on ${address}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

main()
