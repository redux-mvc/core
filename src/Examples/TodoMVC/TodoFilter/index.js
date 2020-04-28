import * as R from "ramda"
import { createModule, addBridge } from "redux-mvc"

import Model from "./model"
import AppModel from "App/model"

const module = R.compose(
    createModule,
    addBridge({ trackGlobalNamespaces: [AppModel.namespace] })
)(Model)

export default module
