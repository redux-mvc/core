import { createModule } from "redux-mvc"

import model from "./model.js"

const module = createModule(model)

export default module

export const moduleCode = `
import * as R from "ramda"
import { createModule } from "redux-mvc"

import model from "./model.js"

const module = createModule(model)

export default module
`
