import React from "react"
import { createContext, connect } from "redux-mvc"

import counterModule from "ui-kit/Counter"
import { selectors } from "ui-kit/Counter/model"
import Counter from "ui-kit/Counter/View"

import { Row, Column, StateFormatter, CodeViewer } from "./Common"

const State = connect({ state: selectors.module })(StateFormatter)

const layout = `
------------ App/View/InstanceAsPropAndContext.js -----------

import React from "react"
import { createContext } from "redux-mvc"

import counterModule from "ui-kit/Counter"
import Counter from "ui-kit/Counter/View"

import { Row, Column } from "./Common"

const decorate = createContext({
  module: counterModule,
})

const InstanceAsPropAndContext = () => (
    <Column>
      <Counter />
      <Counter instanceId="instance2"/>
      <Counter instanceId="instance3"/>
    </Column>
)

export default decorate(InstanceAsPropAndContext)
`

const index = `
------------ App/View/index.js ---------------------------

const App = () => (
    <Column>
        <PassInstanceToContext instanceId="instance1" />
    </Column>
)

`

const files = [{ name: "layout", code: layout }, { name: "index", code: index }]

const decorate = createContext({
    module: counterModule,
})

const InstanceAsProps = () => (
    <Column style={{ alignItems: "center" }}>
        <Counter />
        <Counter instanceId="instance2" />
        <Counter instanceId="instance3" />
    </Column>
)

const Layout = () => (
    <Row>
        <Column style={{ flex: 1 }}>
            <InstanceAsProps />
            <State style={{ flex: 4 }} />
        </Column>
        <CodeViewer files={files} />
    </Row>
)

export default decorate(Layout)
