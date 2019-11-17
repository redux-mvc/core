import * as R from "ramda"
import createSagaMiddleware from "redux-saga"
import { createStore, applyMiddleware, compose } from "redux"
import {
    mergeAll,
    path,
    pathOr,
    prop,
    getActionInstanceId,
    noop,
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
    observedDomains: R.length(observedDomains)
        ? observedDomains
        : module.observedDomains,
    dispatchToGlobal:
        dispatchToGlobal !== noop ? dispatchToGlobal : module.dispatchToGlobal,
})

export const addSagaMiddleware = rootSaga => module => {
    const sagaMiddleware = createSagaMiddleware()

    const newModule = {
        ...module,
        sagas: [...(module.sagas || []), rootSaga],
        middleware: R.append(sagaMiddleware, module.middleware || []),
    }

    newModule.on("run", () => {
        newModule.sagas.forEach(saga => sagaMiddleware.run(saga))
    })
    newModule.on("cancel", () => {
        sagaMiddleware.cancel()
    })

    return newModule
}

const defaultCompose = () => compose

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || defaultCompose // eslint-disable-line no-underscore-dangle

export const addCreateStore = options => module => ({
    ...module,
    createStore({ bridgeMiddleware }) {
        const middleware = [
            ...(module.middleware || []),
            bridgeMiddleware,
        ].filter(x => x)
        return createStore(
            module.reducer,
            module.iniState,
            composeEnhancers({
                name: module.namespace,
                ...options,
            })(applyMiddleware(...middleware))
        )
    },
})

const makeDispatchToGlobal = namespaces =>
    R.compose(
        R.not,
        R.test(new RegExp(R.join("|", namespaces))),
        R.prop("type")
    )

export const merge = right => left => ({
    ...left,
    iniState: { ...right.iniState, ...left.iniState },
    reducers: { ...right.reducers, ...left.reducers },
    sagas: [...(right.sagas || []), ...(left.sagas || [])],
    namespaces: [...(right.namespaces || []), ...(left.namespaces || [])],
    observedDomains: [
        ...(right.observedDomains || []),
        ...(left.observedDomains || []),
    ],
    dispatchToGlobal: makeDispatchToGlobal([
        ...(right.namespaces || []),
        ...(left.namespaces || []),
    ]),
})

export const addEvents = () => module => {
    let listeners = {}

    const dispatch = event => (listeners[event] || []).forEach(f => f())
    const on = (event, f) => {
        listeners[event] = [...(listeners[event] || []), f]
        return () => {
            listeners[event] = (listeners[event] || []).filter(g => g !== f)
        }
    }

    return {
        ...module,
        on,
        dispatch,
    }
}
