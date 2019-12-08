import React from "react"
import { createContext, connect } from "redux-mvc"

import textModule from "./index"
import { getters, modelCode } from "./model"
import Text, { viewCode } from "./View"

import {
    Row,
    Column,
    StateFormatter,
    CodeViewer,
    codeBoxStyle,
} from "App/View/Common"

const State = connect({ state: getters.module })(StateFormatter)

const files = [
    {
        name: "view",
        code: viewCode,
    },
    { name: "model", code: modelCode },
]

const decorate = createContext({
    module: textModule,
})

const TextModule = ({ style }) => (
    <Row
        style={{
            alignItems: "center",
            justifyContent: "center",
            ...codeBoxStyle,
            ...style,
        }}
    >
        <Text />
    </Row>
)

const Layout = () => (
    <Column
        style={{
            margin: 20,
            padding: 20,
        }}
    >
        <Row style={{ marginLeft: 10 }}>
            <TextModule style={{ flex: 1, marginRight: 5 }} />
            <State style={{ flex: 1, marginLeft: 5 }} />
        </Row>
        <CodeViewer files={files} style={{ flex: 1 }} />
    </Column>
)

export default decorate(Layout)
