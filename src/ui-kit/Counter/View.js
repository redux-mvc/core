import React from "react"
import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { getters, actions } from "ui-kit/Counter/model"

const decorate = connect(
    { count: getters.count },
    { add: actions.add, reset: actions.reset }
)

const Counter = ({
    count = 0,
    add = noop,
    reset = noop,
    instanceId,
    name = "",
    style = {},
    ...props
}) => (
    <div style={{ display: "flex", ...style }} {...props}>
        <div style={{ marginRight: 10 }}>{name || instanceId}:</div>
        <button
            style={{ marginRight: 10 }}
            onClick={() => add()}
            data-test-id="add"
        >
            add
        </button>
        <button style={{ marginRight: 10 }} onClick={() => reset()}>
            reset
        </button>
        <div>{count}</div>
    </div>
)

export default decorate(Counter)

export const viewCode = `import React from "react"
import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { getters, actions } from "ui-kit/Counter/model"

const decorate = connect(
    { count: getters.count },
    { add: actions.add, reset: actions.reset }
)

const Counter = ({
    count = 0,
    add = noop,
    reset = noop,
    instanceId,
    name = "",
    style = {},
    ...props
}) => (
    <div style={{ display: "flex", ...style }} {...props}>
        <div style={{ marginRight: 10 }}>{name || instanceId}:</div>
        <button
            style={{ marginRight: 10 }}
            onClick={() => add()}
            data-test-id="add"
        >
            add
        </button>
        <button style={{ marginRight: 10 }} onClick={() => reset()}>
            reset
        </button>
        <div>{count}</div>
    </div>
)

export default decorate(Counter)

`
