import React, { useState } from "react"
import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { getters, actions } from "./model"

const decorate = connect(
    { savedText: getters.text },
    { save: actions.save }
)

const Name = ({ savedText = "", save = noop, style = {} }) => {
    const [text, setText] = useState("")

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                ...style,
            }}
        >
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ margin: 5 }}
            />
            <button
                onClick={() =>
                    save(text, { meta: { prefix: "Name: " } }, false)
                }
            >
                Save Text
            </button>
            <div style={{ margin: 5 }}>{savedText}</div>
        </div>
    )
}

export default decorate(Name)

export const viewCode = `import React from "react"
import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { getters, actions } from "./model"

const decorate = connect(
    { savedText: getters.text },
    { save: actions.save }
)

const Name = ({ savedText = "", save = noop, style = {} }) => {
    const [text, setText] = useState("")

    return (
        <div style={{ display: "flex", flexDirection: "column", ...style }}>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ margin: 5 }}
            />
            <button
                onClick={() =>
                    save(text, { meta: { prefix: "Name: " } }, false)
                }
            >
                Save Text
            </button>
            <div style={{ margin: 5 }}>{savedText}</div>
        </div>
    )
}
`
