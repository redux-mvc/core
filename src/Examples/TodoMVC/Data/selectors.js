import * as R from "ramda"
import { createSelector } from "redux-mvc"

import { getters } from "./model"

import { EMPTY_TODO } from "./constants"

export const getTodos = createSelector(
    getters.todos,
    R.values
)

export const getTodoById = (state, props) => {
    const todos = getters.todos(state, props)

    return R.propOr(EMPTY_TODO, props.id, todos)
}

export const getAllToggled = createSelector(
    getters.all,
    getters.completed,
    (all, completed) => R.length(all) === R.length(completed)
)
