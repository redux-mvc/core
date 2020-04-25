import { createStore, applyMiddleware, compose } from "redux"
import {
    mergeAll,
    path,
    pathOr,
    prop,
    getActionInstanceId,
    noop,
    identity,
    uniq,
} from "./utils"

import { GLOBAL_UPDATE, DEFAULT_INSTANCE_ID } from "./constants"

export const addReducer = () => module => ({
    ...module,
    reducer(state, action) {
        if (action.type === "@@INIT") {
            return mergeAll([state, module.iniState])
        }
        if (path(["meta", GLOBAL_UPDATE], action)) {
            return mergeAll([state, prop(["payload"], action)])
        }
        const selectedReducer = module.reducers[action.type]
        if (!selectedReducer) {
            return state
        }

        const instanceId = getActionInstanceId(
            action,
            pathOr(
                action.namespace === module.namespace
                    ? module.singleton
                    : false,
                [action.namespace, "singleton"],
                module.modules
            )
        )
        const namespace = action.namespace
        const p = [namespace, instanceId]
        const oldState = pathOr(
            path([namespace, DEFAULT_INSTANCE_ID], module.iniState),
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

export const addBridge = ({
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
            ...Object.values(module.middleware || {}),
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

export const merge = left => right => {
    const modules = {
        ...(left.modules || {}),
        ...(right.modules || {}),
        [left.namespace]: left,
        [right.namespace]: right,
    }
    const namespaces = uniq([
        ...(left.namespaces || []),
        ...(right.namespaces || []),
    ])

    return {
        ...left,
        ...right,
        modules,
        iniState: { ...left.iniState, ...right.iniState },
        reducers: { ...left.reducers, ...right.reducers },
        dispatchToGlobal: makeDispatchToGlobal(namespaces),
        observedDomains: uniq([
            ...(left.observedDomains || []),
            ...(right.observedDomains || []),
        ]),
        namespaces,
    }
}

export const addEvents = () => module => {
    let listeners = {}
    return {
        ...module,
        on(event, f) {
            const id = Symbol("newId")
            listeners[event] = { ...(listeners[event] || {}), [id]: f }
            return () => {
                // eslint-disable-next-line no-unused-vars
                const { [id]: remove, ...rest } = listeners[event] || {}
                listeners[event] = rest
            }
        },
        emit(event, ...params) {
            const registry = listeners[event] || {}
            Object.getOwnPropertySymbols(registry).forEach(id =>
                registry[id].call(this, ...params)
            )
        },
    }
}

export const createModule = compose(
    addCreateStore(),
    addReducer(),
    addEvents()
)
