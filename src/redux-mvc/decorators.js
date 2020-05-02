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
                // if the action is not in dependencies then must be an action from the root module
                module.singleton,
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

const defaultCompose = () => compose

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || defaultCompose // eslint-disable-line no-underscore-dangle

export const addLifecycle = (options = {}) => module => ({
    ...module,
    constructor({ persist = true, moduleInstances, contextId }) {
        let moduleInstance = moduleInstances[contextId]

        if (!moduleInstance || !persist) {
            moduleInstance = { ...module }

            moduleInstance.middleware = Object.values(module.middleware || {})
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
                moduleInstance.middleware.push(moduleInstance.bridgeMiddleware)
            }

            let iniState = module.iniState
            if (
                contextId !== GLOBAL_CONTEXT_ID &&
                prop("store", globalInstance)
            ) {
                iniState = mergeAll([
                    module.iniState,
                    pick(
                        module.trackGlobalNamespaces || [],
                        globalInstance.store.getState()
                    ),
                ])
            }
            //create store
            moduleInstance.store = createStore(
                module.reducer,
                iniState,
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
                })(applyMiddleware(...moduleInstance.middleware))
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
        iniState: { ...left.iniState, ...right.iniState },
        reducers: { ...left.reducers, ...right.reducers },
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
