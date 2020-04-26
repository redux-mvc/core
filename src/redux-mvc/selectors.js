import { pathOr } from "./utils"

import { EMPTY, DEFAULT_INSTANCE_ID } from "./constants"

export const createSelector = (...args) => {
    const id = Symbol("selectorId")
    const dependencies = args.slice(0, -1)
    const resultFn = args[args.length - 1]

    const ownCache = { [id]: {} }

    const selector = (state, props, cache) => {
        const instanceId = props.instanceId || DEFAULT_INSTANCE_ID
        const selectedCache = cache || ownCache
        const newDeps = dependencies.map(dep =>
            dep(state, props, selectedCache)
        )

        const lastValue = pathOr(
            EMPTY,
            [id, instanceId, "lastValue"],
            selectedCache
        )
        if (lastValue !== EMPTY) {
            const lastDeps = pathOr([], [id, instanceId, "deps"], selectedCache)

            if (newDeps.every((val, i) => val === lastDeps[i])) {
                return lastValue
            }
        }

        const newValue = resultFn(...newDeps)

        selectedCache[id] = {
            ...(selectedCache[id] || {}),
            [instanceId]: { deps: newDeps, lastValue: newValue },
        }

        return newValue
    }

    selector.id = id
    selector.dependencies = dependencies
    selector.resultFn = resultFn

    return selector
}
