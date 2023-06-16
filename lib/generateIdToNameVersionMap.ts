import type { Prompt } from "@prisma/client"

function isPromptArray(res: any): res is Prompt[] {
    return Array.isArray(res)
}

export function generateIdToNameVersionMap<T extends { id: string }>(promptsList?: T[]) {
    const _idToNameVersionMap: Record<string, T[]> = {}
    if (promptsList && isPromptArray(promptsList)) {
        for (const prompt of promptsList) {
            if (_idToNameVersionMap[prompt.id]) {
                _idToNameVersionMap[prompt.id].push(prompt)
            } else {
                _idToNameVersionMap[prompt.id] = [prompt]
            }
        }
    }
    return _idToNameVersionMap
}
