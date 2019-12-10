import createSagaMiddleware from "redux-saga"

import * as R from "ramda"
import { addCreateStore, addReducer, addEvents } from "redux-mvc"

export const addSagaMiddleware = rootSaga => module => {
    const sagaMiddleware = createSagaMiddleware()

    const newModule = {
        ...module,
        sagas: [...(module.sagas || []), rootSaga],
        sagaMiddleware,
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
