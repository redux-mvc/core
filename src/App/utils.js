import createSagaMiddleware from "redux-saga"

import * as R from "ramda"
import { addCreateStore, addReducer, addEvents } from "redux-mvc"

export const addSagaMiddleware = rootSaga => module => {
    const sagaMiddleware = createSagaMiddleware()

    const newModule = {
        ...module,
        sagas: [...(module.sagas || []), rootSaga],
        middleware: [...(module.middleware || []), sagaMiddleware],
    }

    newModule.on("run", () => {
        newModule.sagas.forEach(saga => sagaMiddleware.run(saga))
    })
    newModule.on("cancel", () => {
        sagaMiddleware.cancel()
    })

    return newModule
}

export const createModule = R.compose(
    addCreateStore(),
    addReducer(),
    addEvents()
)
