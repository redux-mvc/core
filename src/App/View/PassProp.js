import React, { useState } from "react"
import { createContext, connect } from "redux-mvc"

import searchBarModule from "ui-kit/SearchBar"
import { getters } from "ui-kit/SearchBar/model"
import SearchBar from "ui-kit/SearchBar/View"

import { Row, Column, StateFormatter, CodeViewer } from "./Common"

const State = connect({ state: getters.module })(StateFormatter)

const layout = `
------------ App/View/PassProp.js -----------

import React, { useState } from "react"
import { createContext, connect } from "redux-mvc"

import searchBarModule from "ui-kit/SearchBar"
import { getters } from "ui-kit/SearchBar/model"
import SearchBar from "ui-kit/SearchBar/View"


const decorate = createContext({
    module: searchBarModule,
})

const PassProp = () => {
    const [name, setName] = useState("gonzalo")
    return (
        <Column style={{ alignItems: "center" }}>
            <input value={name} onChange={e => setName(e.target.value)} />
            <SearchBar label="name" />
        </Column>
    )
}
export default decorate(PassInstanceToContext)
`

const index = `
------------ App/View/index.js ---------------------------

const App = () => (
    <Column>
        <PassProp />
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
    module: searchBarModule,
})

const PassProp = () => {
    const [name, setName] = useState("gonzalo")
    return (
        <Column style={{ alignItems: "center" }}>
            <input value={name} onChange={e => setName(e.target.value)} />
            <SearchBar label={name} />
        </Column>
    )
}

const Layout = () => (
    <Row>
        <Column style={{ flex: 1 }}>
            <PassProp />
            <State style={{ flex: 4 }} />
        </Column>
        <CodeViewer files={files} style={{ flex: 1 }} />
    </Row>
)

export default decorate(Layout)
