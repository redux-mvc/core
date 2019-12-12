import { createStore, applyMiddleware, compose } from "redux"
import {
    mergeAll,
    path,
    pathOr,
    prop,
    getActionInstanceId,
    noop,
    identity,
} from "./utils"

import { REDUX_MVC_GLOBAL_UPDATE } from "./constants"

export const addReducer = () => module => ({
    ...module,
    reducer(state, action) {
        if (action.type === "@@INIT") {
            return mergeAll([state, module.iniState])
        }
        if (path(["meta", REDUX_MVC_GLOBAL_UPDATE], action)) {
            return mergeAll([state, prop(["payload"], action)])
        }
        const selectedReducer = module.reducers[action.type]
        if (!selectedReducer) {
            return state
        }

        const instanceId = getActionInstanceId(action)
        const namespace = action.namespace
        const p = [namespace, instanceId]
        const oldState = pathOr(
            path([namespace, "default"], module.iniState),
            p,
            state
        )
        const newState = selectedReducer(oldState, action)

        if (newState !== oldState) {
            return mergeAll([
                state,
                {
                    [namespace]: mergeAll([
                        state[namespace],
                        {
                            [instanceId]: mergeAll([oldState, newState]),
                        },
                    ]),
                },
            ])
        }
        return state
    },
})

export const addObserveGlobal = ({
    observedDomains = [],
    dispatchToGlobal = noop,
}) => module => ({
    ...module,
    observedDomains: observedDomains.length
        ? observedDomains
        : module.observedDomains,
    dispatchToGlobal:
        dispatchToGlobal === noop ? module.dispatchToGlobal : dispatchToGlobal,
})

const defaultCompose = () => compose

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || defaultCompose // eslint-disable-line no-underscore-dangle

export const addCreateStore = (options = {}) => module => ({
    ...module,
    createStore({ bridgeMiddleware }) {
        const middleware = [
            ...(module.middleware || []),
            bridgeMiddleware,
        ].filter(identity)
        return createStore(
            module.reducer,
            module.iniState,
            composeEnhancers({
                name: module.namespace,
                serialize: {
                    replacer: (key, value) => {
                        if (
                            value &&
                            value.dispatchConfig &&
                            value._targetInst // eslint-disable-line
                        ) {
                            return "[EVENT]"
                        }
                        return value
                    },
                },
                ...options,
            })(applyMiddleware(...middleware))
        )
    },
})

const makeDispatchToGlobal = namespaces => {
    const re = new RegExp(`(${namespaces.join("|")})\/`)
    return action => !action.type.test(re)
}

export const merge = right => left => {
    const modules = {
        ...(left.modules || {}),
        [right.namespace]: right,
    }
    const namespaces = Object.values(modules).map(module => module.namespace)
    const observedDomains = Object.values(modules).reduce(
        (observedDomains, module) => [
            ...observedDomains,
            ...(module.observedDomains || []),
        ],
        []
    )

    return {
        ...left,
        modules,
        iniState: { ...left.iniState, ...right.iniState },
        reducers: { ...left.reducers, ...right.reducers },
        namespaces,
        observedDomains,
        dispatchToGlobal: makeDispatchToGlobal(namespaces),
    }
}

export const addEvents = () => module => {
    let listeners = {}

    const emit = (event, ...params) =>
        (listeners[event] || []).forEach(f => f(...params))
    const on = (event, f) => {
        listeners[event] = [...(listeners[event] || []), f]
        return () => {
            listeners[event] = (listeners[event] || []).filter(g => g !== f)
        }
    }

    return {
        ...module,
        on,
        emit,
    }
}
