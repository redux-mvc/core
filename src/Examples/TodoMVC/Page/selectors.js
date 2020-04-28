import * as R from "ramda"
import { createSelector } from "redux-mvc"

import { getters as DataGetters } from "TodoMVC/Data/model"
import * as FilterSelectors from "TodoMVC/TodoFilter/selectors"

import { FILTERS } from "TodoMVC/TodoFilter/constants"

export const getActiveIds = createSelector(
    DataGetters.all,
    DataGetters.completed,
    FilterSelectors.getActiveFilter,
    (all, completed, activeFilter) =>
        R.prop(activeFilter, {
            [FILTERS.ALL]: R.always(all),
            [FILTERS.COMPLETED]: R.always(completed),
            [FILTERS.PENDING]: () => R.without(completed, all),
        })()
)

export const getShowTodos = createSelector(
    DataGetters.all,
    R.compose(
        R.lt(0),
        R.length
    )
)
