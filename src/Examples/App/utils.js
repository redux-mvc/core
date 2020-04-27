import * as R from "ramda"

import { createStore, applyMiddleware } from "redux"
import { addReducer } from "redux-mvc"
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
        const moduleInstance = R.propOr({}, contextId)

        const sagaMiddleware = createSagaMiddleware()

        if (persist && R.prop("store", moduleInstance)) {
            const sagaTasks = R.map(
                saga => sagaMiddleware.run(saga),
                R.prop("sagas", moduleInstances)
            )
            return { ...moduleInstance, sagaTasks }
        }
        const sagas = R.filter(
            R.identity,
            R.append(
                module.saga,
                R.map(R.prop("saga"), Object.values(module.dependencies || {}))
            )
        )

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
            })(applyMiddleware(sagaMiddleware))
        )

        const sagaTasks = R.map(saga => sagaMiddleware.run(saga), sagas)
        return { store, sagaTasks, sagas }
    },
    componentWillUnmount({ persist = true, moduleInstances, contextId }) {
        // eslint-disable-next-line no-unused-vars
        const { store, sagaTasks = [], ...instance } = R.propOr(
            {},
            contextId,
            moduleInstances
        )
        sagaTasks.forEach(task => task.cancel())

        if (persist) {
            return moduleInstances[contextId]
        } else {
            return instance
        }
    },
})

export const createModule = rootSaga =>
    R.compose(
        addLifecycle(),
        addReducer(),
        addSaga(rootSaga)
    )

export const noop = () => {}
