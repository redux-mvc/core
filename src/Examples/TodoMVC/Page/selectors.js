import * as R from "ramda"
import { createSelector } from "redux-mvc"

import { getters as DataGetters } from "TodoMVC/Data/model"
import { getters as FilterGetters } from "TodoMVC/TodoFilter/model"

import { FILTERS } from "TodoMVC/TodoFilter/constants"

export const getActiveIds = createSelector(
    state => DataGetters.all(state),
    state => DataGetters.completed(state),
    state => FilterGetters.activeFilter(state),
    (all, completed, activeFilter) =>
        R.prop(activeFilter, {
            [FILTERS.ALL]: R.always(all),
            [FILTERS.COMPLETED]: R.always(completed),
            [FILTERS.PENDING]: () => R.without(completed, all),
        })()
)
