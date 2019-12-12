import createSagaMiddleware from "redux-saga"

import * as R from "ramda"
import { addCreateStore, addReducer, addEvents } from "redux-mvc"

const isSagaMiddleware = Symbol("isSagaMiddleware")

export const addSagaMiddleware = rootSaga => module => {
    const middleware = module.middleware || []

    const index = middleware.findIndex(
        middleware => middleware[isSagaMiddleware]
    )

    const sagaMiddleware = createSagaMiddleware()

    sagaMiddleware[isSagaMiddleware] = true

    const newModule = {
        ...module,
        sagas: [...(module.sagas || []), rootSaga],
        middleware:
            typeof index === "undefined"
                ? [...middleware, sagaMiddleware]
                : [
                      ...middleware.slice(0, index),
                      sagaMiddleware,
                      ...middleware.slice(index + 1),
                  ],
    }

    newModule.on("start", () => {
        newModule.sagas.forEach(saga => sagaMiddleware.run(saga))
    })
    newModule.on("stop", () => {
        sagaMiddleware.cancel()
    })

    return newModule
}

export const createModule = R.compose(
    addCreateStore(),
    addReducer(),
    addEvents()
)
