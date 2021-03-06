import React from "react"
import { connect } from "redux-mvc"

import { actions, getters } from "../model"

import EraseButton from "./ErraseButton"

const decorate = connect(
    { search: getters.search },
    { onChange: actions.setSearch }
)

const SearchBar = ({ label = "", search, onChange, style }) => (
    <div style={style}>
        {label && <div>{label}</div>}
        <input value={search} onChange={e => onChange(e.target.value)} />
        <EraseButton />
    </div>
)

export default decorate(SearchBar)
