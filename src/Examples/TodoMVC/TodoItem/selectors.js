import * as R from "ramda"
import { createSelector } from "redux-mvc"

import { getTodoById } from "TodoMVC/Data/selectors"

import { getters } from "./model"
import { getters as DataGetters } from "TodoMVC/Data/model"

export const getTodo = createSelector(
    getTodoById,
    getters.editing,
    state => DataGetters.completed(state),
    (todo, editing, completed) => ({
        ...todo,
        editing,
        completed: R.contains(todo.id, completed),
    })
)
