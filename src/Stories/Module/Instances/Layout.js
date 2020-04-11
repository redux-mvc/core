import React from "react"
import { createContext, connect } from "redux-mvc"

import counterModule, { moduleCode } from "ui-kit/Counter"
import { getters, modelCode } from "ui-kit/Counter/model"
import View, { viewCode } from "./View"

import {
    Row,
    Column,
    StateFormatter,
    CodeViewer,
    codeBoxStyle,
} from "Stories/Common"

const State = connect({ state: getters.module })(StateFormatter)

const files = [
    { name: "index", code: moduleCode },
    { name: "model", code: modelCode },
    {
        name: "view",
        code: viewCode,
    },
]

const decorate = createContext({
    module: counterModule,
})

const Module = ({ style }) => (
    <Row
        style={{
            alignItems: "center",
            justifyContent: "center",
            ...codeBoxStyle,
            ...style,
        }}
    >
        <View />
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
            <Module style={{ flex: 1, marginRight: 5 }} />
            <State style={{ flex: 1, marginLeft: 5 }} />
        </Row>
        <CodeViewer files={files} style={{ flex: 1 }} />
    </Column>
)

export default decorate(Layout)
