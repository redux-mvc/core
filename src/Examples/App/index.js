import { createModule } from "./utils"

import model from "./model"
import rootSaga from "./sagas"

const module = createModule(rootSaga)(model)

export default module
