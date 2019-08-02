import * as R from "ramda"
import {
    merge,
    addCreateStore,
    addSagaMiddleware,
    addReducer,
    addEvents,
} from "redux-mvc"

import model from "./model.js"
import searchBar from "ui-kit/SearchBar"

import rootSaga from "./sagas"

const decorate = R.compose(
    addCreateStore(),
    addSagaMiddleware(rootSaga),
    merge(searchBar),
    addReducer(),
    addEvents()
)

const module = decorate(model)

export default module
