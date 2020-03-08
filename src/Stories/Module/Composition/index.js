import * as R from "ramda"
import { merge, addCreateStore, addReducer, addEvents } from "redux-mvc"

import model from "./model.js"
import searchBar from "ui-kit/SearchBar"
import counter from "ui-kit/Counter"

const decorate = R.compose(
    addCreateStore(),
    addReducer(),
    addEvents(),
    merge(searchBar),
    merge(counter)
)

const module = decorate(model)

export default module

export const moduleCode = `import * as R from "ramda"
import { merge, addCreateStore, addReducer, addEvents } from "redux-mvc"

import model from "./model.js"
import searchBar from "ui-kit/SearchBar"
import counter from "ui-kit/Counter"

const decorate = R.compose(
    addCreateStore(),
    addReducer(),
    addEvents(),
    merge(searchBar),
    merge(counter)
)

const module = decorate(model)

export default module

`
