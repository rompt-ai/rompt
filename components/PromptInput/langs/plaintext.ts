/* eslint-disable no-useless-escape */
import type { Monaco } from "@monaco-editor/react"
import colors from "tailwindcss/colors"

export function theme(monaco: Monaco) {
    monaco.editor.defineTheme("plaintexttheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
            {
                token: "variable",
                foreground: colors.cyan[100].slice(1),
                fontStyle: "bold",
            },
        ],
        colors: {
            "editor.foreground": "#f8f8f2",
            "editor.background": "#00000000",
            "editor.selectionBackground": "#44475a",
            "editor.lineHighlightBackground": "#3b3e4d",
            "editorCursor.foreground": "#f8f8f0",
            "editorWhitespace.foreground": "#3B3A32",
            "editorIndentGuide.activeBackground": "#00000000",
            "editor.selectionHighlightBorder": "#222218",
        },
    })
}

export function registerLanguage(monaco: Monaco) {
    const language = {
        tokenizer: {
            root: [[/\{(\w+)?\}/, "variable"]],
        },
    } satisfies Parameters<typeof monaco.languages.setMonarchTokensProvider>[1]

    // define custom monaco language
    monaco.languages.register({ id: "plaintext" })
    // register language
    monaco.languages.setMonarchTokensProvider("plaintext", language)
}
