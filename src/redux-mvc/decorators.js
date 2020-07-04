import { createStore, applyMiddleware, compose } from "redux"
import {
    mergeAll,
    prop,
    path,
    pathOr,
    getActionInstanceId,
    uniq,
    applyBridgeMiddleware,
    pick,
    ensureAncestorRender,
} from "./utils"

import {
    GLOBAL_CONTEXT_ID,
    GLOBAL_UPDATE,
    DEFAULT_INSTANCE_ID,
} from "./constants"

import { makeBridgeMiddleware } from "./middleware"

export const addReducer = () => module => {
    const dependencies = Object.values(module.dependencies || {})
    const iniState = mergeAll([
        module.iniState,
        ...dependencies.map(dep => dep.iniState || {}),
    ])

    const reducers = mergeAll([
        module.reducers,
        ...dependencies.map(dep => dep.reducers || {}),
    ])

    return {
        ...module,
        iniState,
        reducers,
        reducer(state, action) {
            if (state === undefined) {
                return iniState
            }
            const globalUpdate = path(["meta", GLOBAL_UPDATE], action)
            if (globalUpdate) {
                return mergeAll([state, globalUpdate])
            }
            const selectedReducer = reducers[action.type]
            if (typeof selectedReducer !== "function") {
                return state
            }

            const instanceId = getActionInstanceId(
                action,
                pathOr(
                    // if the action is not in dependencies then must be an action from the root module
                    module.singleton,
                    [action.namespace, "singleton"],
                    module.dependencies
                )
            )

            const namespace = action.namespace
            const p = [namespace, instanceId]
            const oldState = pathOr(
                path([namespace, DEFAULT_INSTANCE_ID], iniState),
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
    }
}

const defaultCompose = () => compose

const composeEnhancers =
    (process.env.NODE_ENV !== "production" &&
        window &&
        // eslint-disable-next-line no-underscore-dangle
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    defaultCompose

const created = Symbol("created")

export const addLifecycle = (options = {}) => module => ({
    ...module,
    constructor({ persist = true, moduleInstances, contextId }) {
        let moduleInstance = moduleInstances[contextId]

        if (!moduleInstance[created] || !persist) {
            moduleInstance[created] = true

            let middleware = Object.values(moduleInstance.middleware || {})
            const globalInstance =
                contextId === GLOBAL_CONTEXT_ID
                    ? moduleInstance
                    : moduleInstances[GLOBAL_CONTEXT_ID]

            if (
                applyBridgeMiddleware({
                    moduleInstance,
                    globalInstance,
                })
            ) {
                //create bridge middleware
                moduleInstance.bridgeMiddleware = makeBridgeMiddleware({
                    moduleInstance,
                    globalInstance,
                })
                middleware.push(moduleInstance.bridgeMiddleware)
            }

            let iniState = moduleInstance.iniState
            if (
                contextId !== GLOBAL_CONTEXT_ID &&
                prop("store", globalInstance)
            ) {
                iniState = mergeAll([
                    moduleInstance.iniState,
                    pick(
                        moduleInstance.trackGlobalNamespaces || [],
                        globalInstance.store.getState()
                    ),
                ])
            }
            //create store
            moduleInstance.store = ensureAncestorRender(
                createStore(
                    moduleInstance.reducer,
                    iniState,
                    composeEnhancers({
                        name: moduleInstance.namespace,
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
                    })(
                        applyMiddleware(...middleware),
                        ...(moduleInstance.enhancers || [])
                    )
                )
            )
        }

        if (moduleInstance.bridgeMiddleware) {
            moduleInstance.bridgeMiddleware.bind()
        }

        return moduleInstance
    },

    componentWillUnmount({ moduleInstances, contextId }) {
        const moduleInstance = moduleInstances[contextId]

        //stop middleware
        if (moduleInstance.bridgeMiddleware) {
            moduleInstance.bridgeMiddleware.unbind()
        }
        moduleInstance.store.unsubscribe()
        return moduleInstance
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
    }
}

const makeDispatchToGlobal = namespaces => {
    const re = new RegExp(`(${namespaces.join("|")})\/`)
    return action => !re.test(action.type)
}

export const addBridge = ({
    trackGlobalNamespaces,
    dispatchToGlobal,
} = {}) => module => ({
    ...module,
    trackGlobalNamespaces: uniq(
        Object.values(module.dependencies || {}).reduce(
            (trackGlobalNamespaces, module) => [
                ...trackGlobalNamespaces,
                ...(module.trackGlobalNamespaces || []),
            ],
            Array.isArray(trackGlobalNamespaces) ? trackGlobalNamespaces : []
        )
    ),
    dispatchToGlobal:
        typeof dispatchToGlobal === "function"
            ? dispatchToGlobal
            : makeDispatchToGlobal(
                  uniq([
                      ...Object.values(module.dependencies || {}).map(
                          val => val.namespace
                      ),
                      module.namespace,
                  ])
              ),
})

export const createModule = compose(
    addLifecycle(),
    addReducer()
)
