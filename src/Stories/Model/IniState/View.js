import React from "react"
import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { getters, actions } from "./model"

const decorate = connect(
    { count: getters.count },
    {
        setCount: e => actions.setCount(Number(e.target.value)),
    }
)

const Counter = ({ count = 0, setCount = noop, style = {} }) => (
    <div style={{ display: "flex", ...style }}>
        Count:{" "}
        <input
            onChange={setCount}
            value={count}
            type="number"
            style={{ marginLeft: 5 }}
        />
    </div>
)

export default decorate(Counter)

export const viewCode = `import React from "react"
import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { getters, actions } from "./model"

const decorate = connect(
    { count: getters.count },
    {
        setCount: e => actions.setCount(Number(e.target.value)),
    }
)

const Counter = ({ count = 0, setCount = noop, style = {} }) => (
    <div style={{ display: "flex", ...style }} {...props}>
        Count: <input onChange={setCount} value={count} />
    </div>
)

export default decorate(Counter)
`
