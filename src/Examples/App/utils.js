import * as R from "ramda"

import { createStore, applyMiddleware } from "redux"
import { addReducer } from "redux-mvc/decorators"
import { applyBridgeMiddleware, ensureAncestorRender } from "redux-mvc/utils"
import { GLOBAL_CONTEXT_ID } from "redux-mvc/constants"
import { makeBridgeMiddleware } from "redux-mvc/middleware"

import createSagaMiddleware from "redux-saga"

/*

  addSaga decorator

*/

export const addSaga = rootSaga => module => ({
    ...module,
    saga: rootSaga,
})

/*

  In order to use the new decorator *addSagaMiddleware* we need to rewrite
  the addLifecycle and createModule decorators also.

*/

const defaultCompose = R.always(R.compose)

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

            moduleInstance.sagas = R.filter(
                R.identity,
                R.append(
                    module.saga,
                    R.map(
                        R.prop("saga"),
                        Object.values(module.dependencies || {})
                    )
                )
            )

            if (moduleInstance.sagas.length) {
                //create saga middleware
                moduleInstance.sagaMiddleware = createSagaMiddleware()
                moduleInstance.middleware.push(moduleInstance.sagaMiddleware)
            }
            let iniState = module.iniState
            if (
                contextId !== GLOBAL_CONTEXT_ID &&
                R.prop("store", globalInstance)
            ) {
                iniState = R.mergeAll([
                    module.iniState,
                    R.pick(
                        module.trackGlobalNamespaces || [],
                        globalInstance.store.getState()
                    ),
                ])
            }
            //create store
            moduleInstance.store = ensureAncestorRender(
                createStore(
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
            )
        }

        //run middleware
        if (moduleInstance.bridgeMiddleware) {
            moduleInstance.bridgeMiddleware.bind()
        }
        if (moduleInstance.sagas.length) {
            moduleInstance.sagaTasks = moduleInstance.sagas.map(saga =>
                moduleInstance.sagaMiddleware.run(saga)
            )
        }

        return moduleInstance
    },

    componentWillUnmount({ moduleInstances, contextId }) {
        const moduleInstance = moduleInstances[contextId]

        //stop middleware
        if (moduleInstance.bridgeMiddleware) {
            moduleInstance.bridgeMiddleware.unbind()
        }
        if (moduleInstance.sagaTasks) {
            moduleInstance.sagaTasks.forEach(task => task.cancel())
        }
        moduleInstance.store.unsubscribe()
        return moduleInstance
    },
})

export const createModule = rootSaga =>
    R.compose(
        addLifecycle(),
        addReducer(),
        addSaga(rootSaga)
    )

export const noop = () => {}
