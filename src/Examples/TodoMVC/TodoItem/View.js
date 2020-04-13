import React from "react"
import { connect } from "redux-mvc"
import cx from "classnames"

import { getTodo } from "./selectors"

import { actions, getters } from "./model"
import { actions as DataActions } from "TodoMVC/Data/model"

import { noop } from "App/utils"

import { ENTER_KEY, ESCAPE_KEY } from "App/constants"

const decorate = connect(
    {
        todo: getTodo,
        editingValue: getters.value,
    },
    {
        enableEditing: actions.enableEditing,
        edit: actions.setValue,
        toggle: actions.toggleCompleted,
        commit: actions.commit,
        cancel: actions.cancel,
        remove: id => DataActions.remove(id), // dispatch to the default instance
    }
)

const TodoItem = ({
    todo = {},
    editingValue = "",
    toggle = noop,
    enableEditing = noop,
    edit = noop,
    remove = noop,
    commit = noop,
    cancel = noop,
}) => (
    <li
        className={cx({
            completed: todo.completed,
            editing: todo.editing,
        })}
    >
        <div className="view">
            <input
                className="toggle"
                type="checkbox"
                checked={todo.completed}
                onClick={toggle}
            />
            <label onDoubleClick={() => enableEditing(todo.text)}>
                {todo.text}
            </label>
            <button className="destroy" onClick={() => remove(todo.id)} />
        </div>
        <input
            className="edit"
            value={editingValue}
            onChange={event => edit(event.target.value)}
            onBlur={commit}
            onKeyDown={event => {
                if (event.which === ESCAPE_KEY) {
                    cancel()
                } else if (event.which === ENTER_KEY) {
                    commit()
                }
            }}
        />
    </li>
)

export default decorate(TodoItem)
