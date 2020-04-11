import { useContext, useMemo, useState, useEffect } from "react"
import { StoreManager } from "./context"

import { propOr, noop } from "./utils"

export const useModel = (selectors, actions, props) => {
    const context = useContext(StoreManager)
    const instanceId = propOr(context.instanceId, "instanceId", props)
    const store = context.moduleInstances[context.contextId]
    if (!store && process.env.NODE_ENV !== "production") {
        throw Error("No context for useModel")
    }
    const [state, setState] = useState((store && store.getState()) || {})
    const [cache] = useState({})

    useEffect(() => {
        if (store) {
            return store.subscribe(() => setState(store.getState()))
        }
        return noop
    }, [store])

    const computedProps = useMemo(
        () =>
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
            }, {}),
        [props, state, instanceId]
    )

    const computedActions = useMemo(
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

    return useMemo(
        () => ({ ...computedProps, ...computedActions, instanceId }),
        [computedProps, computedActions, instanceId]
    )
}
