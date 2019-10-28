import React from "react"
import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { selectors, actions } from "ui-kit/Counter/model"

const decorate = connect(
    { count: selectors.count },
    { add: actions.add, reset: actions.reset }
)

const Counter = ({
    count = 0,
    add = noop,
    reset = noop,
    instanceId,
    ...style
}) => (
    <div style={{ display: "flex", ...style }}>
        <div style={{ marginRight: 10 }}>{instanceId}:</div>
        <button style={{ marginRight: 10 }} onClick={() => add()}>
            add
        </button>
        <button style={{ marginRight: 10 }} onClick={() => reset()}>
            reset
        </button>
        <div>{count}</div>
    </div>
)

export default decorate(Counter)
