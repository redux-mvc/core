import React, { useState } from "react"

import hljs from "highlight.js/lib/highlight"

export const Row = ({ children, style = {} }) => (
    <div style={{ display: "flex", ...style }}>{children}</div>
)
export const Column = ({ children, style = {} }) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            ...style,
        }}
    >
        {children}
    </div>
)

const codeStyle = {
    color: "black",
    background: "#f6f8fa",
    "text-shadow": "",
    fontSize: "85%",
    fontFamily:
        "SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: 1.5,
    tabSize: 4,
    hyphens: "none",
    borderRadius: 5,
    padding: 10,
}

export const codeBoxStyle = {
    borderRadius: 5,
    border: "solid 1px black",
    padding: 10,
    marginBottom: 10,
    minHeight: 250,
}

export const StateFormatter = ({ state, style }) => (
    <Column
        style={{
            alignItems: "center",
            ...codeBoxStyle,
            ...style,
        }}
    >
        <Row>Module State:</Row>
        <div
            style={{ ...codeStyle, background: "transparent" }}
            dangerouslySetInnerHTML={{
                __html: hljs.highlight("json", JSON.stringify(state, null, 2))
                    .value,
            }}
        ></div>
    </Column>
)

export const CodeFormatter = ({ code }) => (
    <Column>
        <div
            style={codeStyle}
            dangerouslySetInnerHTML={{
                __html: hljs.highlight("javascript", code).value,
            }}
        ></div>
    </Column>
)

export const CodeViewer = ({ files, style, view = "tabs" }) => {
    const [tab, setTab] = useState(files[0].name)

    const file = files.find(f => f.name === tab)
    const renderCode =
        view === "tabs" ? (
            <CodeFormatter code={file.code} />
        ) : (
            files.map(f => <CodeFormatter code={f.code} key={f.name} />)
        )
    return (
        <Column style={{ ...style }}>
            <Row
                style={{
                    visibility: view === "tabs" ? "visible" : "hidden",
                    margin: "10px 0px",
                }}
            >
                {files.map(f => (
                    <button
                        onClick={() => setTab(f.name)}
                        disabled={f.name === tab}
                        style={{ marginRight: 2 }}
                        key={f.name}
                    >
                        {f.name}
                    </button>
                ))}
            </Row>
            <Column style={{ overflowY: "auto" }}>{renderCode}</Column>
        </Column>
    )
}
