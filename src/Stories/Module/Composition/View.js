import React from "react"
import { connect } from "redux-mvc"

import Counter from "ui-kit/Counter/View"
import Searchbar from "ui-kit/SearchBar/View"

import { getters as SearchBarGetters } from "ui-kit/SearchBar/model"

const decorate = connect({ name: SearchBarGetters.search })

const CounterAndSearchbar = ({ style = {}, name }) => (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
        <Searchbar style={{ display: "flex", marginBottom: 10 }} />
        <Counter name={name} />
    </div>
)

export default decorate(CounterAndSearchbar)

export const viewCode = `import React from "react"
import { connect } from "redux-mvc"

import Counter from "ui-kit/Counter/View"
import Searchbar from "ui-kit/SearchBar/View"

import { getters as SearchBarGetters } from "ui-kit/SearchBar/model"

const decorate = connect({ name: SearchBarGetters.search })

const CounterAndSearchbar = ({ style = {}, name }) => (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
        <Searchbar style={{ display: "flex", marginBottom: 10 }} />
        <Counter name={name} />
    </div>
)
`
