import * as R from "ramda"

import {
    addCreateStore,
    addReducer,
    addEvents,
    merge as MVCmerge,
} from "redux-mvc"
import createSagaMiddleware from "redux-saga"

/*

  addSagaMiddleware decorator

*/

export const addSagaMiddleware = rootSaga => module => {
    const sagaMiddleware = createSagaMiddleware()

    const newModule = {
        ...module,
        sagas: rootSaga
            ? { ...(module.sagas || {}), [module.namespace]: rootSaga }
            : module.sagas || {},
        middleware: {
            ...(module.middleware || {}),
            sagaMiddleware: sagaMiddleware,
        },
    }

    newModule.on("start", cache => {
        cache.sagaTasks = Object.values(newModule.sagas).forEach(saga =>
            sagaMiddleware.run(saga)
        )
    })
    newModule.on("stop", cache => {
        cache.sagaTasks.forEach(task => task.cancel())
    })

    return newModule
}

/*

  In order to use the new decorator *addSagaMiddleware* we need to rewrite
  the merge and createModule decorators also.

*/

export const merge = right => left => {
    const newModule = MVCmerge(right)(left)

    newModule.sagas = {
        ...(left.sagas || {}),
        ...(right.sagas || {}),
    }
    return newModule
}

export const createModule = rootSaga =>
    R.compose(
        addCreateStore(),
        addReducer(),
        addSagaMiddleware(rootSaga),
        addEvents()
    )

export const noop = () => {}
