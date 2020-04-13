import React from "react"
import { connect } from "redux-mvc"

import { ENTER_KEY } from "App/constants"
import { getters, actions } from "./model"

import { noop } from "App/utils"

const decorate = connect(
    {
        value: getters.text,
    },
    {
        onChange: actions.setText,
        commit: actions.commit,
    }
)

const CreateTodo = ({ value = "", onChange = noop, commit = noop }) => (
    <header className="header">
        <h1>todos</h1>
        <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus={true}
            value={value}
            onKeyDown={event => {
                if (event.keyCode === ENTER_KEY) {
                    event.preventDefault()
                    commit()
                }
            }}
            onChange={event => onChange(event.target.value)}
        />
    </header>
)

export default decorate(CreateTodo)
