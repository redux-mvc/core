import React from "react"
import { createContext, connect } from "redux-mvc"

import counterModule from "ui-kit/Counter"
import { selectors } from "ui-kit/Counter/model"
import Counter from "ui-kit/Counter/View"

import { Row, Column, StateFormatter, CodeViewer } from "./Common"

const State = connect({ state: selectors.module })(StateFormatter)

const layout = `
------------ App/View/SameDefaultInstance.js ------------------------

import { createContext } from "redux-mvc"

import counterModule from "ui-kit/Counter"
import Counter from "ui-kit/Counter/View"

import { Row, Column } from "./Common"

const decorate = createContext({
  module: counterModule,
})


const SameDefaultInstance = () => (
    <Column>
      <Counter />
      <Counter />
      <Counter />
    </Column>
)

export default decorate(SameDefaultInstance)
`
const index = `
------------ App/View/index.js --------------------------------------

const App = () => (
    <Column>
        <SameDefaultInstance />
    </Column>
)
`

const files = [{ name: "layout", code: layout }, { name: "index", code: index }]

const decorate = createContext({
    module: counterModule,
})

const SameDefaultInstance = () => (
    <Column style={{ alignItems: "center" }}>
        <Counter />
        <Counter />
        <Counter />
    </Column>
)

const Layout = () => (
    <Row style={{ flex: 1 }}>
        <Column style={{ flex: 1 }}>
            <SameDefaultInstance />
            <State style={{ flex: 4 }} />
        </Column>
        <CodeViewer files={files} style={{ flex: 1 }} />
    </Row>
)

export default decorate(Layout)
