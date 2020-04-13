import React from "react"
import { connect } from "redux-mvc"
import cx from "classnames"

import { getPendingCount, getShowClearCompleted } from "./selectors"

import { actions as DataActions } from "TodoMVC/Data/model"
import { actions, getters } from "./model"

import { FILTERS } from "./constants"
import { noop } from "App/utils"

const decorate = connect(
    {
        activeFilter: getters.activeFilter,
        todoCount: getPendingCount,
        showClearCompleted: getShowClearCompleted,
    },
    {
        setActiveFilter: actions.setActiveFilter,
        clearCompleted: DataActions.clearCompleted,
    }
)

const TodoFilter = ({
    todoCount = 0,
    showClearCompleted = false,
    activeFilter = FILTERS.ALL,
    setActiveFilter = noop,
    clearCompleted = noop,
}) => (
    <footer className="footer">
        <span className="todo-count">
            <strong>{todoCount}</strong>
            {todoCount === 1 ? " item " : " items "}left
        </span>
        <ul className="filters">
            <li onClick={() => setActiveFilter(FILTERS.ALL)}>
                <a
                    href="#/"
                    className={cx({ selected: activeFilter === FILTERS.ALL })}
                >
                    All
                </a>
            </li>{" "}
            <li onClick={() => setActiveFilter(FILTERS.PENDING)}>
                <a
                    href="#/active"
                    className={cx({
                        selected: activeFilter === FILTERS.PENDING,
                    })}
                >
                    Active
                </a>
            </li>{" "}
            <li onClick={() => setActiveFilter(FILTERS.COMPLETED)}>
                <a
                    href="#/completed"
                    className={cx({
                        selected: activeFilter === FILTERS.COMPLETED,
                    })}
                >
                    Completed
                </a>
            </li>
        </ul>
        {showClearCompleted > 0 && (
            <button className="clear-completed" onClick={clearCompleted}>
                Clear completed
            </button>
        )}
    </footer>
)

export default decorate(TodoFilter)
