import { createModule } from "App/utils"

import model from "./model"
import rootSaga from "./sagas"

const module = createModule(rootSaga)(model)

export default module
