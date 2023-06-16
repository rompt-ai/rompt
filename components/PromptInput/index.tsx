import { useEffect, useRef, useState } from "react"
import Editor, { EditorProps, OnMount } from "@monaco-editor/react"
import type { PromptType } from "@prisma/client"
import type { IDisposable, editor } from "monaco-editor"
import { nanoid } from "nanoid"

import { cn } from "@/lib/utils"

import Spinner from "../Spinner"
import { MagicButton } from "./MagicButton"
import { WrapButton } from "./WrapButton"
import * as lang_LMQL from "./langs/lmql"
import * as lang_plaintext from "./langs/plaintext"
import Placeholder from "./placeholder"

interface PromptInputProps extends Omit<EditorProps, "onMount" | "theme" | "width"> {
    value?: string
    onChange?: (value: string | undefined) => void
    readOnly?: boolean
    safeOnMount?: OnMount
    shrink?: boolean
    autoResize?: boolean
    type: PromptType
    hideMagic?: boolean
    onVariableClick?: (variable: string) => void
}

export function PromptInput({
    value,
    onChange,
    safeOnMount,
    readOnly,
    shrink,
    type,
    hideMagic,
    onVariableClick,
    autoResize,
    ...props
}: PromptInputProps) {
    const promptId = useRef<string>(nanoid())
    const rootElementRef = useRef<HTMLDivElement>(null)
    const [monacoEditor, setMonacoEditor] = useState<editor.IStandaloneCodeEditor>()
    const [didEditorGetFocused, setDidEditorGetFocused] = useState<boolean>(false)
    const [wrapText, setWrapText] = useState<boolean>(false)

    const getMonacoElement = () => rootElementRef.current?.getElementsByClassName("monaco-editor")[0]

    useEffect(() => {
        function handleResize() {
            if (monacoEditor) {
                monacoEditor.layout({ width: 0, height: 0 })
                window.requestAnimationFrame(() => {
                    monacoEditor.layout()
                    const parentElement = getMonacoElement()!.parentElement
                    const rect = parentElement!.getBoundingClientRect()
                    monacoEditor.layout({ width: rect.width, height: rect.height })
                })
            }
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [monacoEditor])

    useEffect(() => {
        let disposable: IDisposable | undefined
        if (monacoEditor) {
            disposable = monacoEditor.onDidFocusEditorText(() => setDidEditorGetFocused(true))
        }

        return () => {
            if (disposable) {
                disposable.dispose()
            }
        }
    }, [monacoEditor])

    useEffect(() => {
        if (autoResize && monacoEditor) {
            monacoEditor.onDidContentSizeChange(() => {
                const parentElement = getMonacoElement()!.parentElement
                if (parentElement) {
                    const contentHeight = Math.max(Math.min(1000, monacoEditor.getContentHeight()), shrink ? 100 : 200)
                    parentElement.style.height = `${contentHeight + 4}px` // 4px prevents a scrollbar
                    const rect = parentElement.getBoundingClientRect()
                    monacoEditor.layout({ height: contentHeight, width: rect.width })
                }
            })
        }
    }, [monacoEditor, autoResize, shrink])

    const onMonacoMount: OnMount = (_editor, _monaco) => {
        _monaco.editor.addKeybindingRules([
            {
                // disable show command center
                keybinding: _monaco.KeyCode.F3,
                command: null,
            },
            {
                // // Disable command palette
                keybinding: _monaco.KeyCode.F1,
                command: null,
            },
            {
                // disable show command center
                keybinding: _monaco.KeyCode.KeyF | _monaco.KeyMod.CtrlCmd,
                command: null,
            },
        ])
        setMonacoEditor(_editor)

        // https://github.com/microsoft/monaco-editor/issues/287
        const messageContribution = _editor.getContribution("editor.contrib.messageController")
        _editor.onDidAttemptReadOnlyEdit(() => {
            messageContribution!.dispose()
        })

        const handleEditorClick = (e: editor.IEditorMouseEvent) => {
            if (e.target.type === _monaco.editor.MouseTargetType.CONTENT_TEXT) {
                const position = _editor.getPosition()
                const model = _editor.getModel()
                if (position && model) {
                    const wordAtPosition = model.getWordAtPosition(position)

                    if (wordAtPosition) {
                        const lineNumber = position.lineNumber

                        const characterBeforeWord = model.getValueInRange({
                            startLineNumber: lineNumber,
                            startColumn: wordAtPosition.startColumn > 1 ? wordAtPosition.startColumn - 1 : wordAtPosition.startColumn,
                            endLineNumber: lineNumber,
                            endColumn: wordAtPosition.startColumn,
                        })
                        const characterAfterWord = model.getValueInRange({
                            startLineNumber: lineNumber,
                            startColumn: wordAtPosition.endColumn,
                            endLineNumber: lineNumber,
                            endColumn: wordAtPosition.endColumn + 1,
                        })

                        if (characterBeforeWord === "{" && characterAfterWord === "}") {
                            onVariableClick?.(wordAtPosition.word)
                        }
                    }
                }
            }
        }

        _editor.onMouseDown(handleEditorClick)
    }

    return (
        <div className='relative w-full' ref={rootElementRef}>
            {!value && !didEditorGetFocused && <Placeholder parentId={promptId.current} />}
            {!readOnly && !!monacoEditor && onChange && !hideMagic && value && <MagicButton text={value} onSetPrompt={onChange} />}
            <WrapButton wrap={wrapText} onChange={setWrapText} />
            <Editor
                {...props}
                {...(type === "LMQL"
                    ? {
                          language: "lmql",
                          theme: "lmqltheme",
                      }
                    : {
                          language: "plaintext",
                          theme: "plaintexttheme",
                      })}
                beforeMount={(monaco) => {
                    if (type === "LMQL") {
                        lang_LMQL.theme(monaco)
                        lang_LMQL.registerLanguage(monaco)
                    } else if (type === "plaintext") {
                        lang_plaintext.theme(monaco)
                        lang_plaintext.registerLanguage(monaco)
                    }
                }}
                loading={
                    <div className={cn("flex h-full items-center justify-center opacity-20", shrink ? "h-[100px]" : "h-[200px]")}>
                        <Spinner />
                    </div>
                }
                value={value}
                onMount={(_editor, _monaco) => {
                    onMonacoMount(_editor, _monaco)
                    safeOnMount && safeOnMount(_editor, _monaco)
                }}
                className={cn(
                    "overflow-hidden rounded-none",
                    "border-b-[0.5px] border-b-border focus-within:border-b-transparent",
                    shrink ? "min-h-[100px]" : "min-h-[200px] focus-within:rounded-md focus-within:ring-2 focus-within:ring-ring",
                    readOnly && "[&_.cursor]:!hidden"
                )}
                onChange={onChange}
                options={{
                    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html#emptySelectionClipboard
                    readOnly,
                    domReadOnly: readOnly,
                    renderLineHighlight: "none",
                    quickSuggestions: false,
                    links: false,
                    renderWhitespace: "none",
                    lightbulb: {
                        enabled: false,
                    },
                    contextmenu: false,
                    lineNumbers: "off",
                    find: {
                        // https://github.com/microsoft/vscode/issues/28390#issuecomment-470797061
                        addExtraSpaceOnTop: false,
                    },
                    scrollBeyondLastLine: false,
                    scrollBeyondLastColumn: 0,
                    minimap: {
                        enabled: false,
                    },
                    roundedSelection: false,
                    cursorStyle: "line-thin",
                    wordBasedSuggestions: false,
                    folding: false,
                    fixedOverflowWidgets: true,
                    acceptSuggestionOnEnter: "on",
                    hover: {
                        delay: 100,
                    },
                    fontSize: 16,
                    lineHeight: 24,
                    fontWeight: "normal",
                    wordWrap: wrapText ? "on" : "off",
                    fontFamily: "var(--font-sans)",
                    wrappingStrategy: "advanced",
                    lineNumbersMinChars: 0,
                    overviewRulerLanes: 0,
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    padding: {
                        top: 12,
                        bottom: 12,
                    },
                    lineDecorationsWidth: 14,
                    scrollbar: {
                        horizontal: "auto",
                        vertical: "auto",
                        useShadows: false,
                        // avoid can not scroll page when hover monaco
                        alwaysConsumeMouseWheel: false,
                        verticalScrollbarSize: 6,
                        horizontalScrollbarSize: 6,
                    },
                    autoClosingBrackets: "languageDefined",
                    matchBrackets: "never",
                    bracketPairColorization: {
                        enabled: false,
                        independentColorPoolPerBracketType: false,
                    },
                    ...props.options,
                }}
            />
        </div>
    )
}
