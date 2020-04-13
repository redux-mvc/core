import * as R from "ramda"
import { createSelector } from "redux-mvc"

import { getters as DataGetters } from "TodoMVC/Data/model"

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
