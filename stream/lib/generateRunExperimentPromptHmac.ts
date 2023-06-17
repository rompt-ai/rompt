import { createHmac } from "crypto"

const secret = "rtXljxzAlwXuwLepfYJ4qwyW6zmtn"

export const generateRunExperimentPromptHmac = (experimentPromptId: string) =>
    createHmac("sha1", secret).update(experimentPromptId).digest("hex")
