import { createModule } from "redux-mvc"

import model from "./model.js"

const module = createModule(model)

export default module

export const moduleCode = `import { createModule } from "redux-mvc"

import model from "./model.js"

const module = createModule(model)

export default module
`
