import React from "react"
import { createContext, connect } from "redux-mvc"

import counterModule from "./index"
import { getters, modelCode } from "./model"
import Counter, { viewCode } from "./View"

import {
    Row,
    Column,
    StateFormatter,
    CodeViewer,
    codeBoxStyle,
} from "App/View/Common"

const State = connect({ state: getters.module })(StateFormatter)

const files = [
    { name: "model", code: modelCode },
    {
        name: "view",
        code: viewCode,
    },
]

const decorate = createContext({
    module: counterModule,
})

const CounterModule = ({ style }) => (
    <Row
        style={{
            alignItems: "center",
            justifyContent: "center",
            ...codeBoxStyle,
            ...style,
        }}
    >
        <Counter />
    </Row>
)

const Layout = () => (
    <Column style={{ margin: 50 }}>
        <Row>
            <CounterModule style={{ flex: 1, marginRight: 5 }} />
            <State style={{ flex: 1, marginLeft: 5 }} />
        </Row>
        <CodeViewer files={files} style={{ flex: 1 }} />
    </Column>
)

export default decorate(Layout)
