import { addReducer } from "redux-mvc"

import model from "./model.js"

const decorate = addReducer()

const module = decorate(model)

export default module
