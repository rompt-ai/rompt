import type { ExperimentPromptRating, Prompt } from "@prisma/client"

export type ZippedExperimentPrompts = Record<`${string}-${number}`, { prompt: Prompt; ratings: ExperimentPromptRating[] }>
