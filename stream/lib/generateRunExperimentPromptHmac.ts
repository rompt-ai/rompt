import { createHmac } from "crypto"

export const generateRunExperimentPromptHmac = (experimentPromptId: string) => {
    const secret = process.env.HMAC_SECRET || "secret"
    return createHmac("sha1", secret).update(experimentPromptId).digest("hex")
}
