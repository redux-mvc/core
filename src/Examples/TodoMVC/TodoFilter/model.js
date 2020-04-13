import { createModel } from "redux-mvc"

import { FILTERS } from "./constants"

const model = createModel({
    iniState: {
        activeFilter: FILTERS.ALL,
    },
    namespace: "UITodoFilter",
})

const { getters, actions } = model

export { getters, actions }

export default model
