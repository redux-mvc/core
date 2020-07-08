import React from "react"
import { connect } from "redux-mvc"
import cx from "classnames"

import {
    getPendingCount,
    getShowClearCompleted,
    getActiveFilter,
} from "./selectors"

import { actions as DataActions } from "TodoMVC/Data/model"

import { FILTERS } from "./constants"
import { noop } from "App/utils"

import Link from "App/View/Link"

const decorate = connect(
    {
        activeFilter: getActiveFilter,
        todoCount: getPendingCount,
        showClearCompleted: getShowClearCompleted,
    },
    {
        clearCompleted: DataActions.clearCompleted,
    }
)

const TodoFilter = ({
    todoCount = 0,
    showClearCompleted = false,
    activeFilter = FILTERS.ALL,
    clearCompleted = noop,
}) => {
    console.log("rendered", activeFilter)
    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{todoCount}</strong>
                {todoCount === 1 ? " item " : " items "}left
            </span>
            <ul className="filters">
                <li>
                    <Link
                        href="/todo-mvc/"
                        className={cx({
                            selected: activeFilter === FILTERS.ALL,
                        })}
                    >
                        All
                    </Link>
                </li>{" "}
                <li>
                    <Link
                        href="/todo-mvc/active"
                        className={cx({
                            selected: activeFilter === FILTERS.PENDING,
                        })}
                    >
                        Active
                    </Link>
                </li>{" "}
                <li>
                    <Link
                        href="/todo-mvc/completed"
                        className={cx({
                            selected: activeFilter === FILTERS.COMPLETED,
                        })}
                    >
                        Completed
                    </Link>
                </li>
            </ul>
            {showClearCompleted > 0 && (
                <button className="clear-completed" onClick={clearCompleted}>
                    Clear completed
                </button>
            )}
        </footer>
    )
}

export default decorate(TodoFilter)
