import * as R from "ramda"
import { merge, addCreateStore, addReducer, addEvents } from "redux-mvc"

import { addSagaMiddleware } from "App/utils"

import model from "./model.js"
import searchBar from "ui-kit/SearchBar"
import counter from "ui-kit/Counter"

import rootSaga from "./sagas"

const decorate = R.compose(
    addCreateStore(),
    addSagaMiddleware(rootSaga),
    addReducer(),
    addEvents(),
    merge(searchBar),
    merge(counter)
)

const module = decorate(model)

export default module
