import * as R from "ramda"
import React from "react"
import { createContext, connect } from "redux-mvc"

import "todomvc-common/base.css"
import "todomvc-app-css/index.css"

import module from "./index"

import { getActiveIds } from "./selectors"
import * as DataSelectors from "TodoMVC/Data/selectors"

import { actions as DataActions } from "TodoMVC/Data/model"

import TodoInput from "TodoMVC/TodoInput/View"
import TodoItem from "TodoMVC/TodoItem/View"
import TodoFilter from "TodoMVC/TodoFilter/View"

import { noop } from "App/utils"

const decorate = R.compose(
    createContext({
        module,
    }),
    connect(
        {
            todoIds: getActiveIds,
            allToggled: DataSelectors.getAllToggled,
        },
        {
            toggleAll: DataActions.toggleAll,
        }
    )
)

const TodoMVC = ({ todoIds = [], allToggled = false, toggleAll = noop }) => (
    <section className="todoapp">
        <TodoInput />
        <section className="main">
            <input
                id="toggle-all"
                className="toggle-all"
                type="checkbox"
                checked={allToggled}
                onClick={toggleAll}
            />
            <label htmlFor="toggle-all" />
            <ul className="todo-list">
                {R.map(
                    id => (
                        <TodoItem id={id} instanceId={id} />
                    ),
                    todoIds
                )}
            </ul>
        </section>
        <TodoFilter />
    </section>
)

export default decorate(TodoMVC)
