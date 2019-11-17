import React from "react"
import { createContext, connect } from "redux-mvc"

import counterModule from "ui-kit/Counter"
import { getters } from "ui-kit/Counter/model"
import Counter from "ui-kit/Counter/View"

import { Row, Column, StateFormatter, CodeViewer } from "./Common"

const State = connect({ state: getters.module })(StateFormatter)

const model = `
------------ ui-kit/Counter/model.js -------------------------

import * as R from "ramda"
import { createModel } from "redux-mvc"

const iniState = {
    count: 0,
}

const model = createModel({
    iniState,
    reducers: {
        add: ({ count }) => ({ count: count + 1 }),
        reset: R.always(iniState),
    },
    namespace: "Counter",
})

const { actions, getters } = model

export { actions, getters }

export default model
`
const module = `
------------ ui-kit/Counter/index.js -------------------------

import * as R from "ramda"
import { addCreateStore, addReducer, addEvents } from "redux-mvc"

import model from "./model.js"

const decorate = R.compose(
    addCreateStore(),
    addReducer(),
    addEvents()
)

const module = decorate(model)

export default module

`
const view = `
------------ ui-kit/Counter/View.js --------------------------

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

`
const layout = `
------------ App/View/CounterModule.js ------------------------

import React from "react"
import { createContext, connect } from "redux-mvc"

import counterModule from "ui-kit/Counter"
import Counter from "ui-kit/Counter/View"


const decorate = createContext({
    module: counterModule,
})

const CounterModule = () =>
    <Column style={{ alignItems: "center" }}>
        <Counter />
    </Column>

export default decorate(CounterModule)
`

const files = [
    { name: "model", code: model },
    {
        name: "module",
        code: module,
    },
    {
        name: "view",
        code: view,
    },
    {
        name: "layout",
        code: layout,
    },
]

const decorate = createContext({
    module: counterModule,
})

const CounterModule = ({ style }) => (
    <Row style={{ alignItems: "center", justifyContent: "center", ...style }}>
        <Counter />
    </Row>
)

const Layout = () => (
    <Row style={{ flex: 1 }}>
        <Column style={{ flex: 1 }}>
            <CounterModule style={{ flex: 1 }} />
            <State style={{ flex: 4 }} />
        </Column>
        <CodeViewer files={files} style={{ flex: 1 }} />
    </Row>
)

export default decorate(Layout)
