import * as R from "ramda"

import { createSelector } from "redux-mvc"
import pathMatch from "path-match"

import { getters } from "./model"

const route = pathMatch()

export const getRoute = createSelector(
    (_, { path }) => path,
    route
)

export const getRenderRoute = createSelector(
    getters.href,
    getRoute,
    (href, match) => match(href)
)

export const getHashedBase = createSelector(
    getters.base,
    // eslint-disable-next-line no-underscore-dangle
    R.concat(R.__, "#")
)

export const getFullPath = createSelector(
    getHashedBase,
    getters.href,
    R.concat
)
