import { createModule } from "App/utils"

import model from "./model"
import sagas from "./sagas"

const module = createModule(sagas)(model)

export default module
