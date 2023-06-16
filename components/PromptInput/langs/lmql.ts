/* eslint-disable no-useless-escape */
import type { Monaco } from "@monaco-editor/react"

export function theme(monaco: Monaco) {
    // https://github.com/brijeshb42/monaco-themes/blob/master/themes/GitHub%20Dark.json
    monaco.editor.defineTheme("lmqltheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
            {
                background: "282a36",
                token: "",
            },
            {
                foreground: "6272a4",
                token: "comment",
            },
            {
                foreground: "98c379",
                token: "string",
            },
            {
                foreground: "bd93f9",
                token: "constant.numeric",
            },
            {
                foreground: "bd93f9",
                token: "constant.language",
            },
            {
                foreground: "bd93f9",
                token: "constant.character",
            },
            {
                foreground: "bd93f9",
                token: "constant.other",
            },
            {
                foreground: "ffb86c",
                token: "variable.other.readwrite.instance",
            },
            {
                foreground: "ff79c6",
                token: "constant.character.escaped",
            },
            {
                foreground: "ff79c6",
                token: "constant.character.escape",
            },
            {
                foreground: "ff79c6",
                token: "string source",
            },
            {
                foreground: "ff79c6",
                token: "string source.ruby",
            },
            {
                foreground: "ff79c6",
                fontStyle: "bold",
                token: "keyword",
            },
            {
                foreground: "ff79c6",
                token: "storage",
            },
            {
                foreground: "8be9fd",
                fontStyle: "italic",
                token: "storage.type",
            },
            {
                foreground: "50fa7b",
                fontStyle: "underline",
                token: "entity.name.class",
            },
            {
                foreground: "50fa7b",
                fontStyle: "italic underline",
                token: "entity.other.inherited-class",
            },
            {
                foreground: "50fa7b",
                token: "entity.name.function",
            },
            {
                foreground: "ffb86c",
                fontStyle: "italic",
                token: "variable.parameter",
            },
            {
                foreground: "ff79c6",
                token: "entity.name.tag",
            },
            {
                foreground: "50fa7b",
                token: "entity.other.attribute-name",
            },
            {
                foreground: "8be9fd",
                token: "support.function",
            },
            {
                foreground: "6be5fd",
                token: "support.constant",
            },
            {
                foreground: "66d9ef",
                fontStyle: " italic",
                token: "support.type",
            },
            {
                foreground: "66d9ef",
                fontStyle: " italic",
                token: "support.class",
            },
            {
                foreground: "f8f8f0",
                background: "ff79c6",
                token: "invalid",
            },
            {
                foreground: "f8f8f0",
                background: "bd93f9",
                token: "invalid.deprecated",
            },
            {
                foreground: "cfcfc2",
                token: "meta.structure.dictionary.json string.quoted.double.json",
            },
            {
                foreground: "6272a4",
                token: "meta.diff",
            },
            {
                foreground: "6272a4",
                token: "meta.diff.header",
            },
            {
                foreground: "ff79c6",
                token: "markup.deleted",
            },
            {
                foreground: "50fa7b",
                token: "markup.inserted",
            },
            {
                foreground: "e6db74",
                token: "markup.changed",
            },
            {
                foreground: "bd93f9",
                token: "constant.numeric.line-number.find-in-files - match",
            },
            {
                foreground: "e6db74",
                token: "entity.name.filename",
            },
            {
                foreground: "f83333",
                token: "message.error",
            },
            {
                foreground: "eeeeee",
                token: "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json",
            },
            {
                foreground: "eeeeee",
                token: "punctuation.definition.string.end.json - meta.structure.dictionary.value.json",
            },
            {
                foreground: "8be9fd",
                token: "meta.structure.dictionary.json string.quoted.double.json",
            },
            {
                foreground: "f1fa8c",
                token: "meta.structure.dictionary.value.json string.quoted.double.json",
            },
            {
                foreground: "50fa7b",
                token: "meta meta meta meta meta meta meta.structure.dictionary.value string",
            },
            {
                foreground: "ffb86c",
                token: "meta meta meta meta meta meta.structure.dictionary.value string",
            },
            {
                foreground: "ff79c6",
                token: "meta meta meta meta meta.structure.dictionary.value string",
            },
            {
                foreground: "bd93f9",
                token: "meta meta meta meta.structure.dictionary.value string",
            },
            {
                foreground: "50fa7b",
                token: "meta meta meta.structure.dictionary.value string",
            },
            {
                foreground: "ffb86c",
                token: "meta meta.structure.dictionary.value string",
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
    const conf = {
        comments: {
            lineComment: "#",
            blockComment: ["'''", "'''"],
        },
        brackets: [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"],
        ],
        autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: '"', close: '"', notIn: ["string"] },
            { open: "'", close: "'", notIn: ["string", "comment"] },
        ],
        surroundingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
        ],
        onEnterRules: [
            {
                beforeText: new RegExp("^\\s*(?:def|class|for|if|elif|else|while|try|with|finally|except|async|match|case).*?:\\s*$"),
                action: { indentAction: monaco.languages.IndentAction.Indent },
            },
        ],
        folding: {
            offSide: true,
            markers: {
                start: new RegExp("^\\s*#region\\b"),
                end: new RegExp("^\\s*#endregion\\b"),
            },
        },
    } satisfies Parameters<typeof monaco.languages.setLanguageConfiguration>[1]

    const language = {
        defaultToken: "",
        tokenPostfix: ".python",

        keywords: [
            "BEAM",
            "beam",
            "ARGMAX",
            "argmax",
            "SAMPLE",
            "BEST_K",
            "best_k",
            "BEAM_VAR",
            "beam_var",
            "VAR",
            "var",
            "sample",
            "FROM",
            "from",
            "WHERE",
            "where",
            "DISTRIBUTION",
            "distribution",

            // This section is the result of running
            // `import keyword; for k in sorted(keyword.kwlist + keyword.softkwlist): print("  '" + k + "',")`
            // in a Python REPL,
            // though note that the output from Python 3 is not a strict superset of the
            // output from Python 2.
            "False", // promoted to keyword.kwlist in Python 3
            "None", // promoted to keyword.kwlist in Python 3
            "True", // promoted to keyword.kwlist in Python 3
            "_", // new in Python 3.10
            "and",
            "as",
            "assert",
            "async", // new in Python 3
            "await", // new in Python 3
            "break",
            "case", // new in Python 3.10
            "class",
            "continue",
            "def",
            "del",
            "elif",
            "else",
            "except",
            "exec", // Python 2, but not 3.
            "finally",
            "for",
            "from",
            "global",
            "if",
            "import",
            "in",
            "is",
            "lambda",
            "match", // new in Python 3.10
            "nonlocal", // new in Python 3
            "not",
            "or",
            "pass",
            "print", // Python 2, but not 3.
            "raise",
            "return",
            "try",
            "while",
            "with",
            "yield",

            "int",
            "float",
            "long",
            "complex",
            "hex",

            "abs",
            "all",
            "any",
            "apply",
            "basestring",
            "bin",
            "bool",
            "buffer",
            "bytearray",
            "callable",
            "chr",
            "classmethod",
            "cmp",
            "coerce",
            "compile",
            "complex",
            "delattr",
            "dict",
            "dir",
            "divmod",
            "enumerate",
            "eval",
            "execfile",
            "file",
            "filter",
            "format",
            "frozenset",
            "getattr",
            "globals",
            "hasattr",
            "hash",
            "help",
            "id",
            "input",
            "intern",
            "isinstance",
            "issubclass",
            "iter",
            "len",
            "locals",
            "list",
            "map",
            "max",
            "memoryview",
            "min",
            "next",
            "object",
            "oct",
            "open",
            "ord",
            "pow",
            "print",
            "property",
            "reversed",
            "range",
            "raw_input",
            "reduce",
            "reload",
            "repr",
            "reversed",
            "round",
            "self",
            "set",
            "setattr",
            "slice",
            "sorted",
            "staticmethod",
            "str",
            "sum",
            "super",
            "tuple",
            "type",
            "unichr",
            "unicode",
            "vars",
            "xrange",
            "zip",

            "__dict__",
            "__methods__",
            "__members__",
            "__class__",
            "__bases__",
            "__name__",
            "__mro__",
            "__subclasses__",
            "__init__",
            "__import__",
        ],

        brackets: [
            { open: "{", close: "}", token: "delimiter.curly" },
            { open: "[", close: "]", token: "delimiter.bracket" },
            { open: "(", close: ")", token: "delimiter.parenthesis" },
        ],

        tokenizer: {
            root: [
                { include: "@whitespace" },
                { include: "@numbers" },
                { include: "@strings" },

                [/[,:;]/, "delimiter"],
                [/[{}\[\]()]/, "@brackets"],

                [/@[a-zA-Z_]\w*/, "tag"],
                [
                    /[a-zA-Z_]\w*/,
                    {
                        cases: {
                            "@keywords": "keyword",
                            "@default": "identifier",
                        },
                    },
                ],
            ],

            // Deal with white space, including single and multi-line comments
            whitespace: [
                [/\s+/, "white"],
                [/(^#.*$)/, "comment"],
                [/'''/, "string", "@endDocString"],
                [/"""/, "string", "@endDblDocString"],
            ],
            endDocString: [
                [/[^']+/, "string"],
                [/\\'/, "string"],
                [/'''/, "string", "@popall"],
                [/'/, "string"],
            ],
            endDblDocString: [
                [/[^"]+/, "string"],
                [/\\"/, "string"],
                [/"""/, "string", "@popall"],
                [/"/, "string"],
            ],

            // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
            numbers: [
                [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, "number.hex"],
                [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, "number"],
            ],

            // Recognize strings, including those broken across lines with \ (but not without)
            strings: [
                [/'$/, "string.escape", "@popall"],
                [/'/, "string.escape", "@stringBody"],
                [/"$/, "string.escape", "@popall"],
                [/"/, "string.escape", "@dblStringBody"],
            ],
            stringBody: [
                [/[^\\']+$/, "string", "@popall"],
                [/[^\\']+/, "string"],
                [/\\./, "string"],
                [/'/, "string.escape", "@popall"],
                [/\\$/, "string"],
            ],
            dblStringBody: [
                [/[^\\"]+$/, "string", "@popall"],
                [/[^\\"]+/, "string"],
                [/\\./, "string"],
                [/"/, "string.escape", "@popall"],
                [/\\$/, "string"],
            ],
        },
    } satisfies Parameters<typeof monaco.languages.setMonarchTokensProvider>[1]

    // define custom monaco language
    monaco.languages.register({ id: "lmql" })
    // register language
    monaco.languages.setMonarchTokensProvider("lmql", language)
    // set configuration
    monaco.languages.setLanguageConfiguration("lmql", conf)
}
