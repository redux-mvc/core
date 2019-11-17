import React from "react"
import { createContext, connect } from "redux-mvc"

import counterModule from "ui-kit/Counter"
import { getters } from "ui-kit/Counter/model"
import Counter from "ui-kit/Counter/View"

import { Row, Column, StateFormatter, CodeViewer } from "./Common"

const State = connect({ state: getters.module })(StateFormatter)

const layout = `
------------ App/View/PassInstanceToContext.js -----------

import React from "react"
import { createContext } from "redux-mvc"

import counterModule from "ui-kit/Counter"
import Counter from "ui-kit/Counter/View"

import { Row, Column } from "./Common"

const decorate = createContext({
  module: counterModule,
})

const PassInstanceToContext = () => (
    <Column>
      <Counter />
      <Counter />
      <Counter />
    </Column>
)

export default decorate(PassInstanceToContext)
`

const index = `
------------ App/View/index.js ---------------------------

const App = () => (
    <Column>
        <PassInstanceToContext instanceId="instance1" />
    </Column>
)
`

const files = [
    {
        name: "layout",
        code: layout,
    },
    {
        name: "index",
        code: index,
    },
]

const decorate = createContext({
    module: counterModule,
})

const PassInstanceToContext = () => (
    <Column style={{ alignItems: "center" }}>
        <Counter />
        <Counter />
        <Counter />
    </Column>
)

const Layout = () => (
    <Row>
        <Column style={{ flex: 1 }}>
            <PassInstanceToContext />
            <State style={{ flex: 4 }} />
        </Column>
        <CodeViewer files={files} style={{ flex: 1 }} />
    </Row>
)

export default decorate(Layout)
