import * as R from "ramda"
import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        text: "",
    },
    reducers: {
        commit: R.identity,
    },
    namespace: "UITodoInput",
})

const { getters, actions } = model

export { getters, actions }

export default model
