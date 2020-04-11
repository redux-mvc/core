import * as R from "ramda"
import { addCreateStore, addReducer, addEvents } from "redux-mvc"

import model from "./model.js"

const createModule = R.compose(
    addCreateStore(),
    addReducer(),
    addEvents()
)

const module = createModule(model)

export default module

export const moduleCode = `import * as R from "ramda"
import { addCreateStore, addReducer, addEvents } from "redux-mvc"

import model from "./model.js"

const createModule = R.compose(
    addCreateStore(),
    addReducer(),
    addEvents()
)

const module = createModule(model)

export default module
`