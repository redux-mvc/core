import React, { useState } from "react"

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

export const StateFormatter = ({ state, style }) => (
    <Column style={{ alignItems: "center", ...style }}>
        <Row style={{ marginBottom: 20 }}>State</Row>
        <pre>
            <code>{JSON.stringify(state, null, 2)}</code>
        </pre>
    </Column>
)

export const CodeFormatter = ({ code }) => (
    <Column>
        <pre>
            <code>{code}</code>
        </pre>
    </Column>
)

export const CodeViewer = ({ files, style }) => {
    const [view, setView] = useState("list")
    const [tab, setTab] = useState(files[0].name)

    const file = files.find(f => f.name === tab)
    const renderCode =
        view === "tabs" ? (
            <CodeFormatter code={file.code} />
        ) : (
            files.map(f => <CodeFormatter code={f.code} key={f.name} />)
        )
    const viewOptions = ["list", "tabs"]
    return (
        <Column style={{ ...style }}>
            <Row style={{ marginBottom: 10 }}>
                <select onChange={e => setView(e.target.value)} value={view}>
                    {viewOptions.map(option => (
                        <option value={option} key={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </Row>
            <Row style={{ visibility: view === "tabs" ? "visible" : "hidden" }}>
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
            <Column style={{ overflowY: "auto", maxHeight: "75vh" }}>
                {renderCode}
            </Column>
        </Column>
    )
}
