import { createStore, applyMiddleware, compose } from "redux"
import {
    mergeAll,
    path,
    pathOr,
    prop,
    propOr,
    getActionInstanceId,
    noop,
    uniq,
} from "./utils"

import { GLOBAL_UPDATE, DEFAULT_INSTANCE_ID } from "./constants"

export const addReducer = () => module => ({
    ...module,
    reducer(state, action) {
        if (state === undefined) {
            return module.iniState
        }
        if (action.type === GLOBAL_UPDATE) {
            return mergeAll([state, prop("payload", action)])
        }
        const selectedReducer = module.reducers[action.type]
        if (typeof selectedReducer !== "function") {
            return state
        }

        const instanceId = getActionInstanceId(
            action,
            pathOr(false, [action.namespace, "singleton"], module.dependencies)
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
        if (persist && path([contextId, "store"], moduleInstances)) {
            return moduleInstances[contextId]
        }
        const middleware = module.middleware || []

        const store = createStore(
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
        return { store }
    },
    componentWillUnmount({ persist = true, moduleInstances, contextId }) {
        if (persist) {
            return moduleInstances[contextId]
        } else {
            //eslint-disable-next-line no-unused-vars
            const { store, ...instance } = propOr(
                {},
                contextId,
                moduleInstances
            )
            return instance
        }
    },
})

export const merge = left => right => {
    const dependencies = {
        ...left.dependencies,
        ...right.dependencies,
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
    observedDomains = [],
    dispatchToGlobal = noop,
}) => module => ({
    observedDomains:
        observedDomains && observedDomains.length
            ? observedDomains
            : uniq(
                  Object.values(module.dependencies).reduce(
                      (observedDomains, module) => [
                          ...observedDomains,
                          ...(module.observedDomains || []),
                      ]
                  )
              ),
    dispatchToGlobal:
        typeof dispatchToGlobal === "function"
            ? dispatchToGlobal
            : makeDispatchToGlobal(Object.keys(module.dependencies)),
})

export const createModule = compose(
    addLifecycle(),
    addReducer()
)
