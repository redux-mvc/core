import { createModel } from "redux-mvc"

const model = createModel({
    namespace: "TodoMVC",
})

const { getters, actions } = model

export { getters, actions }

export default model
