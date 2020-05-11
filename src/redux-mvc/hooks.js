import { useContext, useMemo, useState, useEffect } from "react"
import { StoreManager } from "./context"

import { path, propOr, noop, diff } from "./utils"

const getStateProps = ({ selectors, instanceId, cache, state, props }) =>
    Object.entries(selectors || {}).reduce((acc, [key, f]) => {
        cache[f.id] = cache[f.id] || {}
        return {
            ...acc,
            [key]: f(
                state,
                {
                    ...(props || {}),
                    instanceId,
                },
                cache
            ),
        }
    }, {})

export const useModel = (selectors, actions, props) => {
    const context = useContext(StoreManager)
    const instanceId = propOr(context.instanceId, "instanceId", props)
    const store = path(["moduleInstances", context.contextId, "store"], context)
    if (!store && process.env.NODE_ENV !== "production") {
        throw Error(
            "No store found for `useModel`. Please use `createContext` in a parent component."
        )
    }
    const [cache] = useState({})
    const [stateProps, setStateProps] = useState(
        getStateProps({
            selectors,
            instanceId,
            cache,
            state: store.getState(),
            props,
        })
    )

    useEffect(() => {
        if (store) {
            let oldStateProps = stateProps
            return store.subscribe(() => {
                const newStateProps = getStateProps({
                    selectors,
                    instanceId,
                    cache,
                    state: store.getState(),
                    props,
                })

                if (diff(oldStateProps, newStateProps)) {
                    oldStateProps = newStateProps
                    setStateProps(newStateProps)
                }
            }, context.renderLevel)
        }
        return noop
    }, [store, props, selectors, instanceId])

    const actionProps = useMemo(
        () =>
            Object.entries(actions || {}).reduce((actions, [key, f]) => {
                if (typeof f !== "function") {
                    throw Error(`${key} is not a function`)
                }

                actions[key] = (payload, props = {}, error = false) =>
                    store.dispatch(
                        f(
                            payload,
                            {
                                ...props,
                                meta: {
                                    instanceId,
                                    ...(props.meta || {}),
                                },
                            },
                            error
                        )
                    )
                return actions
            }, {}),
        [instanceId]
    )

    return useMemo(() => ({ ...stateProps, ...actionProps, instanceId }), [
        stateProps,
        actionProps,
        instanceId,
    ])
}
