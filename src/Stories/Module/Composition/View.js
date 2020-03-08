import React from "react"

import Counter from "ui-kit/Counter/View"
import Searchbar from "ui-kit/SearchBar/View"

const CounterAndSearchbar = ({ style = {} }) => (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
        <Searchbar style={{ display: "flex", marginBottom: 10 }} />
        <Counter />
    </div>
)

export default CounterAndSearchbar

export const viewCode = `
import React from "react"

import Counter from "ui-kit/Counter/View"
import Searchbar from "ui-kit/Searchbar/View"

const CounterAndSearchbar = ({ style = {} }) => (
    <div style={{ display: "flex", ...style }}>
        <Searchbar />
        <Counter />
    </div>
)

`
