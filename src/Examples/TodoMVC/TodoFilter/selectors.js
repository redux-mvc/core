import * as R from "ramda"
import { createSelector } from "redux-mvc"

import { getters as DataGetters } from "TodoMVC/Data/model"

export const getPendingCount = createSelector(
    state => DataGetters.all(state),
    state => DataGetters.completed(state),
    (all, completed) => R.length(all) - R.length(completed)
)
