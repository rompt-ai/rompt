const MAX_PROMPT_AND_COMPLETION_TOKENS = 4097 // Hard limit from OpenAI: 4097
export const MAX_REQUESTS_TOKENS = 3000 // Hard limit from OpenAI: 4000
export const MAX_COMPLETION_TOKENS = MAX_PROMPT_AND_COMPLETION_TOKENS - MAX_REQUESTS_TOKENS // Hard limit from OpenAI: 4096
