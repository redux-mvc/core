import React from "react"
import { connect } from "redux-mvc"

import { actions, selectors } from "../model"

import EraseButton from "./ErraseButton"

const decorate = connect(
    { search: selectors.search },
    { onChange: actions.setSearch }
)

const SearchBar = ({ search, onChange }) => (
    <>
        <input value={search} onChange={e => onChange(e.target.value)} />
        <EraseButton />
    </>
)

export default decorate(SearchBar)
