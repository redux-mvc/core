import { DEFAULT_INSTANCE_ID } from "./constants"

import {
    identity,
    prop,
    propOr,
    pathOr,
    mergeAll,
    getSelectorInstanceId,
    capitalizeFirst,
} from "./utils"

export const createModel = ({
    iniState = {},
    reducers = {},
    namespace = "",
    singleton = false,
    ...props
}) => {
    const setActions = Object.keys(iniState).reduce((acc, key) => {
        const setKey = `set${capitalizeFirst(key)}`
        const type = `${namespace + "/"}${setKey}`

        const action = (payload, props = {}, error = false) => ({
            payload,
            ...props,
            error,
            type,
            namespace,
        })

        action.type = type
        action.key = key

        return {
            ...acc,
            [setKey]: action,
        }
    }, {})

    const customActions = Object.keys(reducers).reduce((acc, key) => {
        const type = `${namespace + "/"}${key}`

        const action = (payload, props = {}, error = false) => ({
            ...props,
            payload,
            error,
            type,
            namespace,
        })

        action.type = type
        action.key = key

        return {
            ...acc,
            [key]: action,
        }
    }, {})

    const setReducers = Object.values(setActions).reduce(
        (acc, action) => ({
            ...acc,
            [action.type]: (state, { payload }) => ({ [action.key]: payload }),
        }),
        {}
    )

    const customReducers = Object.values(customActions).reduce(
        (acc, action) => ({
            ...acc,
            [action.type]: reducers[action.key],
        }),
        {}
    )

    const actions = mergeAll([setActions, customActions])
    const getters = Object.keys(iniState).reduce(
        (acc, key) => ({
            ...acc,
            [key]: (state, props = {}) => {
                const instanceId = getSelectorInstanceId(props, singleton)
                return pathOr(
                    prop(key, iniState),
                    [namespace, instanceId, key],
                    state
                )
            },
        }),
        {
            instance: (state, props) => {
                const instanceId = getSelectorInstanceId(props, singleton)
                return pathOr(iniState, [namespace, instanceId], state)
            },
            namespace: state => propOr(iniState, namespace, state),
            module: s => s,
        }
    )
    const handlers = mergeAll([setReducers, customReducers]) // reducers

    return {
        namespace,
        iniState: { [namespace]: { [DEFAULT_INSTANCE_ID]: iniState } },
        reducers: handlers,
        actions,
        getters,
        singleton,
        ...props,
    }
}
