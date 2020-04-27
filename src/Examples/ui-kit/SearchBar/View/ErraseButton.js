import React from "react"
import { connect } from "redux-mvc"

import { actions } from "../model"

const decorate = connect(
    {},
    { onErase: (_, ...params) => actions.setSearch("", ...params) }
)

const EraseButton = ({ onErase }) => (
    <button onClick={() => onErase()}>Erase</button>
)

export default decorate(EraseButton)
