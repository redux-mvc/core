import { useContext, useMemo, useState, useEffect, useRef } from "react"
import { StoreManager } from "./context"

import { path, propOr, diff } from "./utils"

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

export const useModel = (selectors, actions, { children, ...props } = {}) => {
    const context = useContext(StoreManager)
    const instanceId = propOr(context.instanceId, "instanceId", props)
    const store = path(["moduleInstances", context.contextId, "store"], context)
    if (!store && process.env.NODE_ENV !== "production") {
        throw Error(
            "No store found for `useModel`. Please use `createContext` in a parent component."
        )
    }
    const [cache] = useState({})
    const stateRef = useRef()
    stateRef.current = { props, instanceId }
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
        return store.subscribe(() => {
            const newStateProps = getStateProps({
                selectors,
                instanceId: stateRef.current.instanceId,
                cache,
                state: store.getState(),
                props: stateRef.current.props,
            })

            if (diff(stateProps, newStateProps)) {
                setStateProps(newStateProps)
            }
        }, context.renderLevel)
    }, [store])

    useEffect(() => {
        const newStateProps = getStateProps({
            selectors,
            instanceId,
            cache,
            state: store.getState(),
            props: props,
        })

        if (diff(stateProps, newStateProps)) {
            setStateProps(newStateProps)
        }
    }, [props, instanceId])

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

    return { ...stateProps, ...actionProps, instanceId }
}
