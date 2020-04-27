import { createStore, applyMiddleware, compose } from "redux"
import {
    mergeAll,
    path,
    pathOr,
    getActionInstanceId,
    noop,
    uniq,
} from "./utils"

import {
    GLOBAL_CONTEXT_ID,
    GLOBAL_UPDATE,
    DEFAULT_INSTANCE_ID,
} from "./constants"

import { makeBridgeMiddleware } from "./middleware"

export const addReducer = () => module => ({
    ...module,
    reducer(state, action) {
        if (state === undefined) {
            return module.iniState
        }
        const globalUpdate = path(["meta", GLOBAL_UPDATE], action)
        if (globalUpdate) {
            return mergeAll([state, globalUpdate])
        }
        const selectedReducer = module.reducers[action.type]
        if (typeof selectedReducer !== "function") {
            return state
        }

        const instanceId = getActionInstanceId(
            action,
            pathOr(
                action.namespace === module.namespace
                    ? module.singleton
                    : false,
                [action.namespace, "singleton"],
                module.dependencies
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

const applyBridgeMiddleware = ({ moduleInstance, globalInstance }) => {
    if (!globalInstance) {
        return false
    }
    if (moduleInstance === globalInstance) {
        return true
    }
    if (
        moduleInstance.trackGlobalNamespaces &&
        moduleInstance.trackGlobalNamespaces.length
    ) {
        return true
    }
    if (typeof moduleInstance.dispatchtoGlobal === "function") {
        return true
    }
    return false
}

const defaultCompose = () => compose

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || defaultCompose // eslint-disable-line no-underscore-dangle

export const addLifecycle = (options = {}) => module => ({
    ...module,
    constructor({ persist = true, moduleInstances, contextId }) {
        if (persist && moduleInstances[contextId]) {
            const bridgeMiddleware = moduleInstances[contextId].bridgeMiddleware
            if (bridgeMiddleware) {
                bridgeMiddleware.bind()
            }

            return moduleInstances[contextId]
        }

        const moduleInstance = moduleInstances[contextId] || { ...module }
        const middleware = Object.values(module.middleware || {})

        const globalInstance = moduleInstances[GLOBAL_CONTEXT_ID]

        if (applyBridgeMiddleware({ moduleInstance, globalInstance })) {
            moduleInstance.bridgeMiddleware = makeBridgeMiddleware({
                moduleInstance,
                globalInstance,
            })
            middleware.push(moduleInstance.bridgeMiddleware)
        }

        moduleInstance.store = createStore(
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

        if (moduleInstance.bridgeMiddleware) {
            moduleInstance.bridgeMiddleware.bind()
        }

        return moduleInstance
    },

    componentWillUnmount({ persist = true, moduleInstances, contextId }) {
        const moduleInstance = moduleInstances[contextId]
        if (moduleInstance.bridgeMiddleware) {
            moduleInstance.bridgeMiddleware.unbind()
        }
        if (persist) {
            return moduleInstance
        } else {
            //eslint-disable-next-line no-unused-vars
            const { lastState, ...moduleInstance } = moduleInstances[contextId]
            return moduleInstance
        }
    },
})

export const merge = left => right => {
    const dependencies = {
        ...left.dependencies,
        ...right.dependencies,
        [left.namespace]: left,
    }

    return {
        ...right,
        dependencies,
        iniState: { ...left.iniState, ...right.iniState },
        reducers: { ...left.reducers, ...right.reducers },
    }
}

const makeDispatchToGlobal = namespaces => {
    const re = new RegExp(`(${namespaces.join("|")})\/`)
    return action => !action.type.test(re)
}

export const addBridge = ({
    trackGlobalNamespaces = [],
    dispatchToGlobal = noop,
}) => module => ({
    trackGlobalNamespaces: Array.isArray(trackGlobalNamespaces)
        ? trackGlobalNamespaces
        : uniq(
              Object.values(module.dependencies).reduce(
                  (trackGlobalNamespaces, module) => [
                      ...trackGlobalNamespaces,
                      ...(module.trackGlobalNamespaces || []),
                  ],
                  module.trackGlobalNamespaces || []
              )
          ),
    dispatchToGlobal:
        typeof dispatchToGlobal === "function"
            ? dispatchToGlobal
            : makeDispatchToGlobal(
                  uniq([
                      ...Object.keys(module.dependencies || {}),
                      module.namespace,
                  ])
              ),
})

export const createModule = compose(
    addLifecycle(),
    addReducer()
)
