import * as R from "ramda"
import { createModule, merge } from "App/utils"

import model from "./model"

import data from "TodoMVC/Data"
import todoInput from "TodoMVC/TodoInput"
import todoItem from "TodoMVC/TodoItem"
import todoFilter from "TodoMVC/TodoFilter"

const decorate = R.compose(
    createModule(),
    merge(todoFilter),
    merge(todoInput),
    merge(todoItem),
    merge(data)
)

export default decorate(model)
