import * as R from "ramda"
import { createSelector } from "redux-mvc"

import { getters as DataGetters } from "TodoMVC/Data/model"
import { getters as AppGetters } from "App/model"

import { FILTERS } from "./constants"

export const getPendingCount = createSelector(
    DataGetters.all,
    DataGetters.completed,
    (all, completed) => R.length(all) - R.length(completed)
)

export const getShowClearCompleted = createSelector(
    DataGetters.completed,
    R.compose(
        R.lt(0),
        R.length
    )
)

export const getActiveFilter = createSelector(
    AppGetters.href,
    // eslint-disable-next-line no-underscore-dangle
    href => {
        console.log("selector", href)

        return R.propOr(FILTERS.ALL, href, {
            "/todo-mvc/active": FILTERS.PENDING,
            "/todo-mvc/completed": FILTERS.COMPLETED,
        })
    }
)
