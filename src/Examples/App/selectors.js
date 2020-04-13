import { createSelector } from "redux-mvc"

import { getters } from "./model"

export const getRenderRoute = createSelector(
    getters.locationStr,
    (_, { path }) => path,
    (current, path) =>
        path instanceof RegExp
            ? path.test(current)
            : new RegExp(path).test(current)
)
